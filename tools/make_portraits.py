#!/usr/bin/env python3
"""
Crystal Gems! — build super-move portraits from the official reference renders.

Reads Character reference/<Name>.(png|jpeg|webp), keys out the white backdrop,
crops a head-and-shoulders bust, scales it onto a 512x512 transparent canvas with
a soft coloured glow, and writes:

    assets/portraits/<id>.png      (for inspection / reuse)
    src/portraits-data.js          (base64 map consumed by the game)

    python3 tools/make_portraits.py
"""
from __future__ import annotations

import base64
import json
from collections import Counter
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "Character reference"
OUT_DIR = ROOT / "assets" / "portraits"
JS_OUT = ROOT / "src" / "portraits-data.js"
SIZE = 640

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


def load_rgba(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    # Keep big sources manageable
    if max(im.size) > 1400:
        ratio = 1400 / max(im.size)
        im = im.resize((int(im.width * ratio), int(im.height * ratio)), Image.LANCZOS)
    return im


def key_out_background(im: Image.Image) -> Image.Image:
    """Flood-fill the backdrop from all four corners (works for white JPEGs too)."""
    key = (255, 0, 255)
    work = im.convert("RGB").copy()
    w, h = work.size
    # Seed from every border pixel so gradients and off-white JPEG backdrops go too
    seeds = [(x, 0) for x in range(0, w, 6)] + [(x, h - 1) for x in range(0, w, 6)]
    seeds += [(0, y) for y in range(0, h, 6)] + [(w - 1, y) for y in range(0, h, 6)]
    for seed in seeds:
        if work.getpixel(seed) == key:
            continue
        try:
            ImageDraw.floodfill(work, seed, key, thresh=64)
        except Exception:
            pass

    px = work.load()
    out = im.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if px[x, y] == key:
                opx[x, y] = (0, 0, 0, 0)

    # Kill the soft white fringe the flood fill leaves on antialiased edges.
    alpha = out.getchannel("A").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    out.putalpha(alpha)
    return out


def bust_crop(im: Image.Image) -> Image.Image:
    bbox = im.getchannel("A").getbbox()
    if not bbox:
        return im
    left, top, right, bottom = bbox
    bw, bh = right - left, bottom - top

    # Head-and-shoulders square, with headroom and room for the shoulders.
    side = int(max(bh * 0.52, bw * 0.55))
    side = max(side, 160)

    # Centre horizontally on the head mass (widest part of the top fifth).
    top_strip = im.crop((left, top, right, top + max(20, int(bh * 0.20))))
    sb = top_strip.getchannel("A").getbbox()
    cx = left + ((sb[0] + sb[2]) // 2 if sb else bw // 2)

    x0 = cx - side // 2
    y0 = top - int(side * 0.10)

    # Crop through a transparent canvas so nothing is clamped or cut off.
    out = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    src_box = (max(0, x0), max(0, y0), min(im.width, x0 + side), min(im.height, y0 + side))
    piece = im.crop(src_box)
    out.alpha_composite(piece, (max(0, -x0), max(0, -y0)))
    return out


def accent_colour(im: Image.Image) -> tuple[int, int, int]:
    small = im.resize((48, 48))
    counts: Counter = Counter()
    for r, g, b, a in small.getdata():
        if a < 200:
            continue
        if r > 235 and g > 235 and b > 235:
            continue
        if r < 30 and g < 30 and b < 30:
            continue
        counts[(r // 24 * 24, g // 24 * 24, b // 24 * 24)] += 1
    if not counts:
        return (255, 96, 151)
    return counts.most_common(1)[0][0]


def build_portrait(src: Path) -> Image.Image:
    im = load_rgba(src)
    im = key_out_background(im)
    im = bust_crop(im)

    # Square it on a transparent canvas
    side = max(im.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)

    # Boost colour a touch so the cut-out reads on the dark cut-in backdrop
    canvas = ImageEnhance.Color(canvas).enhance(1.08)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.06)
    canvas = canvas.filter(ImageFilter.UnsharpMask(radius=1.4, percent=110, threshold=2))

    # Soft coloured glow behind the bust
    glow = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    r, g, b = accent_colour(canvas)
    mask = canvas.getchannel("A").filter(ImageFilter.GaussianBlur(side * 0.05))
    halo = Image.new("RGBA", (side, side), (r, g, b, 150))
    glow.paste(halo, (0, 0), mask)
    glow = glow.filter(ImageFilter.GaussianBlur(side * 0.06))

    composed = Image.alpha_composite(glow, canvas)

    # Fit into 512 with a little breathing room at the bottom
    target = int(SIZE * 0.97)
    composed = composed.resize((target, target), Image.LANCZOS)
    out = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    out.alpha_composite(composed, ((SIZE - target) // 2, SIZE - target))
    return out


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = {}
    missing = []
    for cid, filename in FILES.items():
        src = REF / filename
        if not src.exists():
            missing.append(filename)
            continue
        portrait = build_portrait(src)
        path = OUT_DIR / f"{cid}.png"
        portrait.save(path, "PNG", optimize=True)
        webp = OUT_DIR / f"{cid}.webp"
        portrait.save(webp, "WEBP", quality=92, method=6)
        data[cid] = "data:image/webp;base64," + base64.b64encode(webp.read_bytes()).decode("ascii")
        print(f"  {cid:15s} ← {filename}")

    payload = "// Generated by tools/make_portraits.py — do not edit by hand.\n"
    payload += "const PORTRAIT_IMAGES = " + json.dumps(data, separators=(",", ":")) + ";\n"
    JS_OUT.write_text(payload, encoding="utf-8")

    size_kb = JS_OUT.stat().st_size / 1024
    print(f"\n{len(data)} portraits written · {JS_OUT.relative_to(ROOT)} ({size_kb:.0f} KB)")
    if missing:
        print("missing references:", ", ".join(missing))
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
