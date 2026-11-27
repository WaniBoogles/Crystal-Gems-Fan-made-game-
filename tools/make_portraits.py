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
from collections import deque
import json
from pathlib import Path
import numpy as np
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

# Dedicated Action / Fighting-Style Overdrive Cut-In Art (*2.* in Character reference/)
OVERDRIVE_FILES = {
    "steven": "Steven2.jpg",
    "garnet": "Garnet2.jpeg",
    "amethyst": "Amethyst2.webp",
    "pearl": "Pearl2.jpg",
    "bismuth": "Bismuth2.webp",
    "peridot": "Peridot2.png",
    "lapis": "Lapis2.jpeg",
    "rose": "RoseQuartz2.jpg",
    "connie": "Connie2.webp",
    "jasper": "Jasper2.png",
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


def _bfs_bg(bg_cand: np.ndarray, extra_seeds=None, skip_bottom_x=None) -> np.ndarray:
    h, w = bg_cand.shape
    vis = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        if bg_cand[0, x] and not vis[0, x]:
            vis[0, x] = True; q.append((0, x))
        if not (skip_bottom_x and skip_bottom_x[0] <= x <= skip_bottom_x[1]):
            if bg_cand[h - 1, x] and not vis[h - 1, x]:
                vis[h - 1, x] = True; q.append((h - 1, x))
    for y in range(h):
        if bg_cand[y, 0] and not vis[y, 0]:
            vis[y, 0] = True; q.append((y, 0))
        if bg_cand[y, w - 1] and not vis[y, w - 1]:
            vis[y, w - 1] = True; q.append((y, w - 1))
    if extra_seeds:
        for sx, sy in extra_seeds:
            if 0 <= sy < h and 0 <= sx < w and bg_cand[sy, sx] and not vis[sy, sx]:
                vis[sy, sx] = True; q.append((sy, sx))
    while q:
        y, x = q.popleft()
        if y > 0 and bg_cand[y - 1, x] and not vis[y - 1, x]:
            vis[y - 1, x] = True; q.append((y - 1, x))
        if y + 1 < h and bg_cand[y + 1, x] and not vis[y + 1, x]:
            vis[y + 1, x] = True; q.append((y + 1, x))
        if x > 0 and bg_cand[y, x - 1] and not vis[y, x - 1]:
            vis[y, x - 1] = True; q.append((y, x - 1))
        if x + 1 < w and bg_cand[y, x + 1] and not vis[y, x + 1]:
            vis[y, x + 1] = True; q.append((y, x + 1))
    return vis


def _keep_largest_components(fg_mask: np.ndarray, min_ratio: float = 0.08) -> np.ndarray:
    h, w = fg_mask.shape
    vis = np.zeros((h, w), dtype=bool)
    comps = []
    for y0 in range(0, h, 2):
        for x0 in range(0, w, 2):
            if fg_mask[y0, x0] and not vis[y0, x0]:
                q = deque([(y0, x0)])
                vis[y0, x0] = True
                pts = []
                while q:
                    y, x = q.popleft()
                    pts.append((y, x))
                    if y > 0 and fg_mask[y - 1, x] and not vis[y - 1, x]:
                        vis[y - 1, x] = True; q.append((y - 1, x))
                    if y + 1 < h and fg_mask[y + 1, x] and not vis[y + 1, x]:
                        vis[y + 1, x] = True; q.append((y + 1, x))
                    if x > 0 and fg_mask[y, x - 1] and not vis[y, x - 1]:
                        vis[y, x - 1] = True; q.append((y, x - 1))
                    if x + 1 < w and fg_mask[y, x + 1] and not vis[y, x + 1]:
                        vis[y, x + 1] = True; q.append((y, x + 1))
                comps.append(pts)
    if not comps:
        return fg_mask
    comps.sort(key=len, reverse=True)
    thresh = max(150, int(len(comps[0]) * min_ratio))
    out = np.zeros((h, w), dtype=bool)
    for c in comps:
        if len(c) >= thresh:
            ys, xs = zip(*c)
            out[ys, xs] = True
    return out


def _dilate_mask(mask: np.ndarray, size: int = 3) -> np.ndarray:
    im = Image.fromarray((mask.astype(np.uint8) * 255), mode='L').filter(ImageFilter.MaxFilter(size))
    return np.array(im) > 128


def _feather_cutout(rgba: np.ndarray, bg_mask: np.ndarray) -> Image.Image:
    out = rgba.copy()
    alpha = np.where(bg_mask, 0, rgba[:, :, 3]).astype(np.uint8)
    a_img = Image.fromarray(alpha, mode='L')
    eroded = a_img.filter(ImageFilter.MinFilter(3))
    a_arr = np.array(a_img, dtype=np.float32)
    e_arr = np.array(eroded, dtype=np.float32)
    edge = (a_arr > 0) & (e_arr == 0)
    a_arr[edge] = a_arr[edge] * 0.55
    out[:, :, 3] = np.clip(a_arr, 0, 255).astype(np.uint8)
    return Image.fromarray(out, mode='RGBA')


def extract_overdrive_cutout(cid: str, src_path: Path) -> Image.Image:
    """Extract HD background-free fighting-pose character cutout from *2.* reference art."""
    raw = Image.open(src_path).convert("RGBA")
    # Upscale low-resolution source images (e.g. Lapis2 495x620) with crisp HD sharpening
    if max(raw.size) < 960:
        scale = 1024 / max(raw.size)
        raw = raw.resize((int(raw.width * scale), int(raw.height * scale)), Image.LANCZOS)
        raw = raw.filter(ImageFilter.UnsharpMask(radius=1.5, percent=155, threshold=2))
    elif max(raw.size) > 960:
        scale = 960 / max(raw.size)
        raw = raw.resize((int(raw.width * scale), int(raw.height * scale)), Image.LANCZOS)

    arr = np.array(raw)
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    a = arr[:, :, 3]
    h, w = r.shape

    # Native transparent renders (Amethyst2, Jasper2)
    if a.min() < 20:
        return raw

    chroma = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    yy, xx = np.ogrid[:h, :w]

    if cid == "garnet":
        bg_cand = (chroma < 24) & (np.minimum(np.minimum(r, g), b) > 190)
        bg = _bfs_bg(bg_cand, [(int(w * 0.45), int(h * 0.72)), (int(w * 0.50), int(h * 0.85))])
        return _feather_cutout(arr, bg)

    if cid == "peridot":
        is_white = (r > 230) & (g > 230) & (b > 230)
        is_yellow = (r > 215) & (g > 215) & (b < 45)
        is_cyan = (r < 45) & (g > 215) & (b > 215)
        is_pure_green = (r < 45) & (g > 215) & (b < 45)
        is_magenta = (r > 215) & (g < 45) & (b > 195)
        is_blue_bar = (r < 45) & (g < 55) & (b > 200)
        is_red_bar = (r > 210) & (g < 45) & (b < 45)
        is_bot_dark = (yy > int(h * 0.86)) & (luma < 60)
        dark_ink = (luma < 45) & (yy <= int(h * 0.87))
        bg_cand = _dilate_mask(is_white | is_yellow | is_cyan | is_pure_green | is_magenta | is_blue_bar | is_red_bar | is_bot_dark, 3) & (~dark_ink)
        bg = _bfs_bg(bg_cand, [(int(w * 0.25), int(h * 0.10)), (int(w * 0.65), int(h * 0.10)), (int(w * 0.10), int(h * 0.85))])
        fg = _keep_largest_components(~bg, min_ratio=0.15)
        return _feather_cutout(arr, ~fg)

    if cid == "connie":
        is_dark_forest = (g >= r - 4) & (g >= b - 4) & (r < 125) & (g < 155) & (b < 120) & (luma < 130)
        bg = _bfs_bg(is_dark_forest, [(int(w * 0.10), int(h * 0.15)), (int(w * 0.88), int(h * 0.15)), (int(w * 0.15), int(h * 0.85)), (int(w * 0.88), int(h * 0.85))])
        fg = _keep_largest_components(~bg, min_ratio=0.10)
        return _feather_cutout(arr, ~fg)

    if cid == "steven":
        is_steven_magenta = (b - g >= 34) & (r >= 135)
        in_shield_box = (xx > int(w * 0.10)) & (xx < int(w * 0.62)) & (yy < int(h * 0.42))
        is_shield_rim = in_shield_box & (b - g >= 24) & (r >= 175)
        fg_raw = _dilate_mask(is_steven_magenta | is_shield_rim, 5)
        fg = _keep_largest_components(fg_raw, min_ratio=0.18)
        fg = ~_bfs_bg(~fg)
        fg = np.array(Image.fromarray((fg * 255).astype(np.uint8), 'L').filter(ImageFilter.MinFilter(3))) > 128
        return _feather_cutout(arr, ~fg)

    if cid == "bismuth":
        # Protect dark navy apron (g < 72); remove green/teal painted sky & grass + bottom-left teal diagonal
        is_green_sky = (g > r + 10) & (g >= b - 4) & (g > 72) & (r < 165)
        is_mint_spark = (g > r + 14) & (g > 170) & (r > 120) & (b > 165)
        is_bl_teal = (xx < int(w * 0.28)) & (yy > int(h * 0.62)) & (g > r + 16) & (g > 72) & (r < 115)
        bg_cand = is_green_sky | is_mint_spark | is_bl_teal
        seeds = [(5, 5), (w - 5, 5), (5, h - 5), (w - 5, h - 5), (int(w * 0.16), int(h * 0.90)), (int(w * 0.72), int(h * 0.72))]
        bg = _bfs_bg(bg_cand, seeds, skip_bottom_x=(int(w * 0.28), int(w * 0.72)))
        fg = _keep_largest_components(~bg, min_ratio=0.12)
        return _feather_cutout(arr, ~fg)

    if cid == "pearl":
        true_ink = (luma < 56) & (b - r < 14) & (g - r < 14)
        in_spear = (g > 175) & (b > 160) & (r < 210) & (yy > int(h * 0.34)) & (yy < int(h * 0.68)) & (xx > int(w * 0.14)) & (xx < int(w * 0.78))
        in_body_guard = (xx > int(w * 0.43)) & (xx < int(w * 0.85)) & (yy > int(h * 0.50)) & (yy < int(h * 0.98)) & ~((b > r + 16) & (r < 95))
        barrier = _dilate_mask(true_ink, 3) | in_spear | in_body_guard
        bg = _bfs_bg(~barrier, [(5, 5), (w - 5, 5), (5, h - 5), (w - 5, h - 5), (int(w * 0.50), int(h * 0.08)), (int(w * 0.14), int(h * 0.86)), (int(w * 0.92), int(h * 0.86))], skip_bottom_x=(int(w * 0.38), int(w * 0.76)))
        fg = _keep_largest_components(~bg, min_ratio=0.15)
        fg = ~_bfs_bg(~fg)
        out = _feather_cutout(arr, ~fg)
        oarr = np.array(out)
        fade_start = int(h * 0.91)
        for y in range(fade_start, h):
            fac = max(0.0, 1.0 - (y - fade_start) / max(1, h - fade_start))
            oarr[y, :, 3] = (oarr[y, :, 3] * fac).astype(np.uint8)
        return Image.fromarray(oarr, mode='RGBA')

    if cid == "lapis":
        # Remove dark starfield night sky (r<40, g<44, b<88) cleanly even around Lapis's wings & waist;
        # Lapis's royal-blue hair & dress are much brighter/bluer (b >= 92 or luma >= 75)!
        is_dark_sky = (r < 40) & (g < 46) & (b < 88) & (b >= r)
        sky_closed = np.array(Image.fromarray((is_dark_sky * 255).astype(np.uint8), 'L').filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))) > 128
        seeds = [(5, 5), (w - 5, 5), (5, int(h * 0.45)), (w - 5, int(h * 0.45)), (int(w * 0.56), int(h * 0.62)), (int(w * 0.28), int(h * 0.41))]
        bg = _bfs_bg(sky_closed, seeds, skip_bottom_x=(0, w))
        fg = _keep_largest_components(~bg, min_ratio=0.10)
        out = _feather_cutout(arr, ~fg)
        oarr = np.array(out)
        fade_start = int(h * 0.87)
        for y in range(fade_start, h):
            fac = max(0.0, 1.0 - (y - fade_start) / max(1, h - fade_start))
            oarr[y, :, 3] = (oarr[y, :, 3] * fac).astype(np.uint8)
        return Image.fromarray(oarr, mode='RGBA')

    if cid == "rose":
        outer_card = (xx < int(w * 0.14)) | (xx > int(w * 0.86)) | (yy < int(h * 0.15)) | (yy > int(h * 0.965))
        # Only darker/mid sepia tan (luma < 218) so Rose's bright ivory-white dress (luma >= 220) stays 100% intact!
        is_beige_bg = (g > b + 7) & (r > b + 14) & (chroma < 62) & (luma < 218)
        is_top_halo = (yy < int(h * 0.36)) & (g >= b + 2) & (r > 185) & (g > 180)
        is_side_arch = ((xx < int(w * 0.25)) | (xx > int(w * 0.75))) & (luma < 155)
        is_low_brown_bg = (yy > int(h * 0.72)) & ((xx < int(w * 0.28)) | (xx > int(w * 0.72))) & (luma < 175)
        bg_cand = outer_card | is_beige_bg | is_top_halo | is_side_arch | is_low_brown_bg
        seeds = [(5, 5), (w - 5, 5), (5, h - 5), (w - 5, h - 5), (int(w * 0.50), int(h * 0.19)), (int(w * 0.20), int(h * 0.65)), (int(w * 0.80), int(h * 0.65))]
        bg = _bfs_bg(bg_cand, seeds, skip_bottom_x=(int(w * 0.26), int(w * 0.74)))
        fg = _keep_largest_components(~bg, min_ratio=0.15)
        fg = ~_bfs_bg(~fg)
        out = _feather_cutout(arr, ~fg)
        # Soft fade at very bottom hem of dress
        oarr = np.array(out)
        fade_start = int(h * 0.91)
        for y in range(fade_start, h):
            fac = max(0.0, 1.0 - (y - fade_start) / max(1, h - fade_start))
            oarr[y, :, 3] = (oarr[y, :, 3] * fac).astype(np.uint8)
        return Image.fromarray(oarr, mode='RGBA')

    return raw


def build_overdrive_portrait(cid: str, src_path: Path) -> Image.Image:
    """Build HD 640x640 transparent Overdrive cut-in portrait with signature gem aura & crisp sharpening."""
    im = extract_overdrive_cutout(cid, src_path)
    alpha = im.getchannel('A').point(lambda v: 255 if v > 20 else 0)
    bbox = alpha.getbbox()
    if bbox:
        im = im.crop(bbox)

    # HD enhancement: crisp contrast, vibrant color pop, clean unsharp pass
    im = ImageEnhance.Color(im).enhance(1.12)
    im = ImageEnhance.Contrast(im).enhance(1.07)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.3, percent=135, threshold=2))

    cw, ch = im.size
    max_target = int(SIZE * 0.94)
    scale = min(max_target / max(1, cw), max_target / max(1, ch))
    nw = max(1, int(cw * scale))
    nh = max(1, int(ch * scale))
    im_scaled = im.resize((nw, nh), Image.LANCZOS)

    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    pos_x = (SIZE - nw) // 2
    pos_y = (SIZE - nh) // 2

    theme = THEME_COLORS.get(cid, (255, 114, 182))
    aura = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    aura_mask = Image.new('L', (SIZE, SIZE), 0)
    aura_mask.paste(im_scaled.getchannel('A'), (pos_x, pos_y))

    bloom = aura_mask.filter(ImageFilter.GaussianBlur(20))
    bloom_img = Image.new('RGBA', (SIZE, SIZE), (theme[0], theme[1], theme[2], 165))
    aura.paste(bloom_img, (0, 0), bloom)

    rim = aura_mask.filter(ImageFilter.GaussianBlur(6))
    rim_img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 195))
    aura.paste(rim_img, (0, 0), rim)

    canvas = Image.alpha_composite(aura, canvas)
    canvas.paste(im_scaled, (pos_x, pos_y), im_scaled)
    return canvas


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    SPRITE_DIR.mkdir(parents=True, exist_ok=True)
    data = {}
    overdrive_data = {}
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

    for cid, filename in OVERDRIVE_FILES.items():
        src = REF / filename
        if not src.exists():
            missing.append(filename)
            continue
        od = build_overdrive_portrait(cid, src)
        od_png = OUT_DIR / f"{cid}_overdrive.png"
        od_webp = OUT_DIR / f"{cid}_overdrive.webp"
        od.save(od_png, "PNG", optimize=True)
        od.save(od_webp, "WEBP", quality=92, method=6)
        overdrive_data[cid] = "data:image/webp;base64," + base64.b64encode(od_webp.read_bytes()).decode("ascii")
        print(f"  {cid:15s} ← {filename} (HD Overdrive cut-in)")

    payload = "// Generated by tools/make_portraits.py — do not edit by hand.\n"
    payload += "const PORTRAIT_IMAGES = " + json.dumps(data, separators=(",", ":")) + ";\n"
    payload += "const OVERDRIVE_PORTRAIT_IMAGES = " + json.dumps(overdrive_data, separators=(",", ":")) + ";\n"
    payload += "const SPRITE_IMAGES = " + json.dumps(sprite_data, separators=(",", ":")) + ";\n"
    JS_OUT.write_text(payload, encoding="utf-8")

    size_kb = JS_OUT.stat().st_size / 1024
    print(f"\n{len(data)} HD portraits + {len(overdrive_data)} Overdrive cut-ins + {len(sprite_data)} 2D sprites written · {JS_OUT.relative_to(ROOT)} ({size_kb:.0f} KB)")
    if missing:
        print("missing references:", ", ".join(missing))
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
