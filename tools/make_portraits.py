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
JS_OUT = ROOT / "src" / "portraits-data.js"
SIZE = 640

# Custom upper-body framing ratios for full-body renders
FRAMING = {
    'connie': (0.0, 0.72),
    'amethyst': (0.0, 0.74),
    'pearl': (0.0, 0.65),
    'garnet': (0.0, 0.55),
    'jasper': (0.0, 0.56),
    'opal': (0.0, 0.55),
    'stevonnie': (0.0, 0.70),
    'rose': (0.0, 0.75),
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


def remove_background(im: Image.Image) -> Image.Image:
    """Extract character with clean alpha, handling existing transparency, white, and black backdrops."""
    if 'A' in im.getbands():
        alpha = im.getchannel('A')
        if alpha.getextrema()[0] < 200:
            return im.convert('RGBA')

    rgb = im.convert('RGB')
    w, h = rgb.size
    corners = [rgb.getpixel((0, 0)), rgb.getpixel((w - 1, 0)), rgb.getpixel((0, h - 1)), rgb.getpixel((w - 1, h - 1))]
    bg_color = max(set(corners), key=corners.count)
    is_white = sum(bg_color) > 600
    is_black = sum(bg_color) < 60

    work = rgb.copy()
    key = (255, 0, 255) if not is_white and not is_black else ((0, 255, 0) if is_white else (255, 0, 255))
    thresh = 36 if (is_white or is_black) else 45
    seeds = [(x, 0) for x in range(0, w, 4)] + [(x, h - 1) for x in range(0, w, 4)]
    seeds += [(0, y) for y in range(0, h, 4)] + [(w - 1, y) for y in range(0, h, 4)]

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

    alpha = out.getchannel('A')
    alpha = alpha.filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.5))
    out.putalpha(alpha)
    return out


def build_portrait(cid: str, src_path: Path) -> Image.Image:
    raw = Image.open(src_path)
    im = remove_background(raw)

    bbox = im.getchannel('A').getbbox()
    if not bbox:
        bbox = (0, 0, im.width, im.height)

    bx0, by0, bx1, by1 = bbox
    bw = bx1 - bx0
    bh = by1 - by0

    # Custom upper-body framing
    if cid in FRAMING:
        t0, t1 = FRAMING[cid]
        top = by0 + int(bh * t0)
        bottom = by0 + int(bh * t1)
        im_crop = im.crop((bx0, top, bx1, bottom))
    else:
        im_crop = im.crop((bx0, by0, bx1, by1))

    cw, ch = im_crop.size

    # Enhance vibrance and contrast slightly for bold fighting-game pop
    im_crop = ImageEnhance.Color(im_crop).enhance(1.10)
    im_crop = ImageEnhance.Contrast(im_crop).enhance(1.06)
    im_crop = im_crop.filter(ImageFilter.UnsharpMask(radius=1.2, percent=115, threshold=2))

    max_target = int(SIZE * 0.88)
    scale = min(max_target / cw, max_target / ch)
    nw = int(cw * scale)
    nh = int(ch * scale)
    im_scaled = im_crop.resize((nw, nh), Image.LANCZOS)

    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    pos_x = (SIZE - nw) // 2
    pos_y = SIZE - nh - int(SIZE * 0.04)

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
    data = {}
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
        print(f"  {cid:15s} ← {filename}")

    payload = "// Generated by tools/make_portraits.py — do not edit by hand.\n"
    payload += "const PORTRAIT_IMAGES = " + json.dumps(data, separators=(",", ":")) + ";\n"
    JS_OUT.write_text(payload, encoding="utf-8")

    size_kb = JS_OUT.stat().st_size / 1024
    print(f"\n{len(data)} HD portraits written · {JS_OUT.relative_to(ROOT)} ({size_kb:.0f} KB)")
    if missing:
        print("missing references:", ", ".join(missing))
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
