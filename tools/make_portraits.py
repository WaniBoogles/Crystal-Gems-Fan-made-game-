#!/usr/bin/env python3
"""
Crystal Gems! — build HD super-move portraits from official reference renders.

Features:
- Robust alpha background extraction (handles transparent WebP, solid white, and solid black backdrops)
- Adaptive framing preserving expressive character faces, gems, hair, and weapons
- Multi-layer energetic aura/bloom in each gem's signature canonical color
- Sharp Lanczos downsampling with subtle unsharp-mask pass for crisp fighting-game cut-ins
- Outputs assets/portraits/<id>.png and src/portraits-data.js (base64 WebP map)
"""
from __future__ import annotations

import base64
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "Character reference"
OUT_DIR = ROOT / "assets" / "portraits"
SPRITE_DIR = ROOT / "assets" / "sprites"
JS_OUT = ROOT / "src" / "portraits-data.js"
SIZE = 640

# Flip map so every full-body 2D sprite faces RIGHT (+X) in PlayerHero local space
SPRITE_FLIP_X = {
    "amethyst": True,
    "pearl": True,
    "lapis": True,
    "stevonnie": True,
    "rainbow2": True,
    "sardonyx": True,
    "opal": True,
    "rainbowClassic": True,
}

# Exact enclosed background pocket seeds (x, y) in original pre-flip image pixels
EXTRA_BG_SEEDS = {
    "bismuth": [(94, 284), (298, 284)],
    "amethyst": [(236, 419), (274, 471)],
    "connie": [(302, 88)],
    "pearl": [(197, 339), (258, 515), (215, 220), (228, 511), (260, 486)],
    "smoky": [(75, 219), (299, 83), (206, 83)],
    "sugilite": [(313, 208), (343, 144), (357, 190)],
    "sardonyx": [(223, 189), (229, 225)],
    "opal": [(557, 484), (538, 702)],
}

# Custom zoomed bust framing ratios (x0, y0, x1, y1) inside alpha bbox
# Focuses closely on face, hair/gem, and upper chest for crisp roster & dialogue portraits
FRAMING = {
    'steven': (0.14, 0.00, 0.64, 0.62),
    'garnet': (0.19, 0.00, 0.79, 0.45),
    'amethyst': (0.26, 0.00, 0.85, 0.50),
    'pearl': (0.42, 0.00, 0.96, 0.46),
    'bismuth': (0.20, 0.00, 0.80, 0.52),
    'peridot': (0.21, 0.00, 0.75, 0.55),
    'lapis': (0.31, 0.04, 0.65, 0.43),
    'rose': (0.22, 0.00, 0.72, 0.58),
    'connie': (0.34, 0.00, 0.85, 0.46),
    'jasper': (0.20, 0.00, 0.80, 0.44),
    'stevonnie': (0.31, 0.08, 0.80, 0.55),
    'smoky': (0.14, 0.14, 0.56, 0.56),
    'rainbow2': (0.24, 0.00, 0.74, 0.48),
    'sunstone': (0.24, 0.04, 0.76, 0.56),
    'sugilite': (0.18, 0.06, 0.72, 0.49),
    'sardonyx': (0.24, 0.22, 0.54, 0.53),
    'opal': (0.28, 0.16, 0.64, 0.52),
    'malachite': (0.18, 0.03, 0.68, 0.50),
    'rainbowClassic': (0.20, 0.02, 0.70, 0.48),
}

THEME_COLORS = {
    'steven': (255, 77, 136),
    'garnet': (239, 68, 68),
    'amethyst': (168, 85, 247),
    'pearl': (34, 211, 238),
    'bismuth': (249, 115, 22),
    'peridot': (34, 197, 94),
    'lapis': (14, 165, 233),
    'rose': (244, 63, 94),
    'connie': (236, 72, 153),
    'jasper': (234, 88, 12),
    'stevonnie': (244, 114, 182),
    'smoky': (192, 132, 252),
    'rainbow2': (56, 189, 248),
    'sunstone': (249, 115, 22),
    'sugilite': (126, 34, 206),
    'sardonyx': (251, 113, 133),
    'opal': (129, 140, 248),
    'malachite': (45, 212, 191),
    'rainbowClassic': (244, 63, 94),
}

FILES = {
    "steven": "Steven.png",
    "garnet": "Garnet.webp",
    "amethyst": "Amethyst.jpeg",
    "pearl": "Pearl.jpeg",
    "bismuth": "Bismuth.png",
    "peridot": "Peridot.jpeg",
    "lapis": "Lapis.png",
    "rose": "Rose.jpeg",
    "connie": "Connie.jpeg",
    "jasper": "Jasper.webp",
    "stevonnie": "Stevonnie.png",
    "smoky": "Smoky Quartz.png",
    "rainbow2": "Rainbow Quartz 2.0.png",
    "sunstone": "Sunstone.webp",
    "sugilite": "Sugilite.jpeg",
    "sardonyx": "Sardonyx.png",
    "opal": "Opal.webp",
    "malachite": "Malachite.png",
    "rainbowClassic": "Rainbow Quartz.webp",
}


def remove_background(im: Image.Image, cid: str = "") -> Image.Image:
    """Extract character with clean alpha, handling existing transparency, white, and black backdrops."""
    rgba = im.convert('RGBA')
    alpha = rgba.getchannel('A')
    if alpha.getextrema()[0] < 100:
        if cid in EXTRA_BG_SEEDS:
            rgb = rgba.convert('RGB')
            work = rgb.copy()
            key = (0, 255, 0)
            for sx, sy in EXTRA_BG_SEEDS[cid]:
                if 0 <= sx < rgba.width and 0 <= sy < rgba.height:
                    try:
                        ImageDraw.floodfill(work, (sx, sy), key, thresh=34)
                    except Exception:
                        pass
            wpx = work.load()
            opx = rgba.load()
            for y in range(rgba.height):
                for x in range(rgba.width):
                    if wpx[x, y] == key:
                        opx[x, y] = (0, 0, 0, 0)
        return rgba

    rgb = rgba.convert('RGB')
    w, h = rgb.size
    corners = [rgb.getpixel((0, 0)), rgb.getpixel((w - 1, 0)), rgb.getpixel((0, h - 1)), rgb.getpixel((w - 1, h - 1))]
    bg_color = max(set(corners), key=corners.count)
    is_white = sum(bg_color) > 600
    is_black = sum(bg_color) < 60

    work = rgb.copy()
    key = (255, 0, 255) if not is_white and not is_black else ((0, 255, 0) if is_white else (255, 0, 255))
    thresh = 34 if (is_white or is_black) else 42
    seeds = [(x, 0) for x in range(0, w, 2)] + [(x, h - 1) for x in range(0, w, 2)]
    seeds += [(0, y) for y in range(0, h, 2)] + [(w - 1, y) for y in range(0, h, 2)]
    for sx, sy in EXTRA_BG_SEEDS.get(cid, []):
        if 0 <= sx < w and 0 <= sy < h:
            seeds.append((sx, sy))

    for s in seeds:
        if work.getpixel(s) == key:
            continue
        try:
            ImageDraw.floodfill(work, s, key, thresh=thresh)
        except Exception:
            pass

    px = work.load()
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    opx = out.load()
    rpx = rgb.load()

    for y in range(h):
        for x in range(w):
            if px[x, y] != key:
                opx[x, y] = (rpx[x, y][0], rpx[x, y][1], rpx[x, y][2], 255)

    # De-fringe 1px outer border halo so dark outlines have zero white/black edge fringe
    a_chan = out.getchannel('A')
    eroded = a_chan.filter(ImageFilter.MinFilter(3))
    epx = eroded.load()
    apx = a_chan.load()
    for y in range(h):
        for x in range(w):
            if apx[x, y] > 0 and epx[x, y] == 0:
                r, g, b, _ = opx[x, y]
                if (is_white and r > 210 and g > 210 and b > 210) or (is_black and r < 38 and g < 38 and b < 38):
                    opx[x, y] = (r, g, b, 0)
                else:
                    opx[x, y] = (r, g, b, 190)
    return out


def build_full_sprite(cid: str, src_path: Path) -> Image.Image:
    """Build clean full-body 2D character sprite oriented toward +X (right)."""
    raw = Image.open(src_path)
    im = remove_background(raw, cid)
    bbox = im.getchannel('A').getbbox()
    if bbox:
        im = im.crop(bbox)
    if SPRITE_FLIP_X.get(cid, False):
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    cw, ch = im.size
    target_h = 280
    scale = min(target_h / max(1, ch), 300 / max(1, cw))
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    return im


def build_pink_connie_sprite(connie_sp: Image.Image) -> Image.Image:
    """Create Pink Revived Connie (Lars/Lion cotton-candy pink hair & rose-tinted skin) from Connie's 2D sprite."""
    sp = connie_sp.copy().convert('RGBA')
    px = sp.load()
    w, h = sp.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 15:
                continue
            # Keep true black ink outlines dark
            if r < 24 and g < 20 and b < 22:
                continue
            # Dark brown hair -> cotton-candy pink (#f472b6 / #ec4899)
            if r < 72 and g < 44 and b < 44:
                px[x, y] = (244, 114, 182, a)
            # Warm brown skin -> soft rose-pink revival skin (#f9a8d4)
            elif r > 105 and g > 42 and g < 135 and b < 95 and r > g > b:
                px[x, y] = (249, 168, 212, a)
    return sp


def build_portrait(cid: str, src_path: Path) -> Image.Image:
    raw = Image.open(src_path)
    im = remove_background(raw, cid)

    bbox = im.getchannel('A').getbbox()
    if not bbox:
        bbox = (0, 0, im.width, im.height)

    bx0, by0, bx1, by1 = bbox
    bw = bx1 - bx0
    bh = by1 - by0

    # Custom tight head-to-upper-body bust framing
    if cid in FRAMING:
        box = FRAMING[cid]
        if len(box) == 4:
            fx0, fy0, fx1, fy1 = box
            left = bx0 + int(bw * fx0)
            top = by0 + int(bh * fy0)
            right = bx0 + int(bw * fx1)
            bottom = by0 + int(bh * fy1)
            im_crop = im.crop((left, top, right, bottom))
        else:
            t0, t1 = box
            top = by0 + int(bh * t0)
            bottom = by0 + int(bh * t1)
            im_crop = im.crop((bx0, top, bx1, bottom))
    else:
        im_crop = im.crop((bx0, by0, bx1, by1))

    # Re-trim transparent outer padding inside the chosen crop so faces fill the frame
    sub_alpha = im_crop.getchannel('A').point(lambda a: 255 if a > 24 else 0)
    sub_bbox = sub_alpha.getbbox()
    if sub_bbox:
        im_crop = im_crop.crop(sub_bbox)

    cw, ch = im_crop.size

    # Enhance vibrance and contrast slightly for bold fighting-game pop
    im_crop = ImageEnhance.Color(im_crop).enhance(1.10)
    im_crop = ImageEnhance.Contrast(im_crop).enhance(1.06)
    im_crop = im_crop.filter(ImageFilter.UnsharpMask(radius=1.2, percent=115, threshold=2))

    max_target = int(SIZE * 0.94)
    scale = min(max_target / max(1, cw), max_target / max(1, ch))
    nw = max(1, int(cw * scale))
    nh = max(1, int(ch * scale))
    im_scaled = im_crop.resize((nw, nh), Image.LANCZOS)

    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    pos_x = (SIZE - nw) // 2
    pos_y = max(int(SIZE * 0.02), (SIZE - nh) // 2 + int(SIZE * 0.02))

    # Radiant energy aura in signature gem color
    theme = THEME_COLORS.get(cid, (255, 114, 182))
    aura = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    aura_mask = Image.new('L', (SIZE, SIZE), 0)
    aura_mask.paste(im_scaled.getchannel('A'), (pos_x, pos_y))

    bloom = aura_mask.filter(ImageFilter.GaussianBlur(18))
    bloom_img = Image.new('RGBA', (SIZE, SIZE), (theme[0], theme[1], theme[2], 140))
    aura.paste(bloom_img, (0, 0), bloom)

    rim = aura_mask.filter(ImageFilter.GaussianBlur(6))
    rim_img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 180))
    aura.paste(rim_img, (0, 0), rim)

    canvas = Image.alpha_composite(aura, canvas)
    canvas.paste(im_scaled, (pos_x, pos_y), im_scaled)
    return canvas


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    SPRITE_DIR.mkdir(parents=True, exist_ok=True)
    data = {}
    sprite_data = {}
    missing = []
    for cid, filename in FILES.items():
        src = REF / filename
        if not src.exists():
            missing.append(filename)
            continue
        portrait = build_portrait(cid, src)
        path = OUT_DIR / f"{cid}.png"
        portrait.save(path, "PNG", optimize=True)
        webp = OUT_DIR / f"{cid}.webp"
        portrait.save(webp, "WEBP", quality=94, method=6)
        data[cid] = "data:image/webp;base64," + base64.b64encode(webp.read_bytes()).decode("ascii")

        sp = build_full_sprite(cid, src)
        sp_png = SPRITE_DIR / f"{cid}.png"
        sp_webp = SPRITE_DIR / f"{cid}.webp"
        sp.save(sp_png, "PNG", optimize=True)
        sp.save(sp_webp, "WEBP", quality=92, method=6)
        sprite_data[cid] = "data:image/webp;base64," + base64.b64encode(sp_webp.read_bytes()).decode("ascii")

        if cid == "connie":
            p_sp = build_pink_connie_sprite(sp)
            p_png = SPRITE_DIR / "connie_pink.png"
            p_webp = SPRITE_DIR / "connie_pink.webp"
            p_sp.save(p_png, "PNG", optimize=True)
            p_sp.save(p_webp, "WEBP", quality=92, method=6)
            sprite_data["connie_pink"] = "data:image/webp;base64," + base64.b64encode(p_webp.read_bytes()).decode("ascii")

        print(f"  {cid:15s} ← {filename} (portrait + 2D sprite)")

    payload = "// Generated by tools/make_portraits.py — do not edit by hand.\n"
    payload += "const PORTRAIT_IMAGES = " + json.dumps(data, separators=(",", ":")) + ";\n"
    payload += "const SPRITE_IMAGES = " + json.dumps(sprite_data, separators=(",", ":")) + ";\n"
    JS_OUT.write_text(payload, encoding="utf-8")

    size_kb = JS_OUT.stat().st_size / 1024
    print(f"\n{len(data)} HD portraits + {len(sprite_data)} 2D sprites written · {JS_OUT.relative_to(ROOT)} ({size_kb:.0f} KB)")
    if missing:
        print("missing references:", ", ".join(missing))
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
