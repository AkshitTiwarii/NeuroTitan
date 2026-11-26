"""Generate the site's raster images: favicon.ico, apple-touch-icon.png, og-default.png,
and og-cost.png (the share card for /cost, drawn from src/data/language-index.json).

The vector mark lives in public/favicon.svg and src/components/Mark.astro; this
script draws the same geometry with Pillow so the PNG/ICO versions match it.

Run from site/:  python scripts/make_images.py
Needs Pillow. Uses Georgia and Consolas from C:\\Windows\\Fonts for the OG card;
pass other TTF paths with --serif and --mono on another OS.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

PAPER = (245, 243, 239)
INK = (21, 21, 21)
GREY = (100, 100, 100)
RED = (163, 33, 27)
MARK_RED = (210, 70, 62)
RULE = (212, 208, 200)

PUBLIC = Path(__file__).resolve().parent.parent / "public"


def draw_mark(size: int) -> Image.Image:
    """The N mark on a 32-unit grid, scaled to `size` px, drawn 4x and downsampled for smooth edges."""
    s = size * 4
    u = s / 32
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=round(3 * u), fill=INK)
    w = round(3 * u)
    pts = [(9 * u, 24 * u), (9 * u, 8 * u), (23 * u, 24 * u), (23 * u, 8 * u)]
    d.line(pts, fill=PAPER, width=w, joint="curve")
    # square caps at both ends
    for x, y in (pts[0], pts[-1]):
        d.rectangle([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=PAPER)
    d.rectangle([21 * u, 5.5 * u, 26 * u, 10.5 * u], fill=MARK_RED)
    return img.resize((size, size), Image.LANCZOS)


def og_card(serif: str, mono: str) -> Image.Image:
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    pad = 80
    img.paste(draw_mark(64), (pad, pad), draw_mark(64))
    f_mono = ImageFont.truetype(mono, 26)
    d.text((pad + 88, pad + 18), "NEUROTITAN LABS", font=f_mono, fill=INK)
    f_head = ImageFont.truetype(serif, 92)
    d.text((pad, 250), "Research you can rerun.", font=f_head, fill=INK)
    f_sub = ImageFont.truetype(mono, 28)
    d.text((pad, 400), "Machine learning  /  Semiconductors  /  Quantum computing", font=f_sub, fill=GREY)
    d.line([(pad, H - 110), (W - pad, H - 110)], fill=RULE, width=2)
    d.rectangle([pad, H - 112, pad + 140, H - 108], fill=RED)
    d.text((pad, H - 85), "neurotitan.in", font=f_mono, fill=INK)
    return img


DARK = (15, 15, 15)
DARK_INK = (236, 232, 225)
DARK_GREY = (147, 143, 136)
DARK_RED = (229, 87, 78)
DARK_TRACK = (44, 43, 41)


def og_cost(serif: str, mono: str) -> Image.Image:
    """Share card for /cost. Every number is read from the Index data, never typed."""
    data = json.loads((PUBLIC.parent / "src" / "data" / "language-index.json").read_text(encoding="utf-8"))
    ids = [t["id"] for t in data["tokenizers"]]
    hindi = next(l for l in data["languages"] if l["c"] == "hin_Deva")
    bars = [("English", "any tokenizer", 1.0)] + [
        ("Hindi", label, hindi["r"][ids.index(tid)][0])
        for tid, label in (("o200k", "GPT-4o"), ("mistral-nemo", "Mistral"), ("deepseek-v3", "DeepSeek-V3"), ("qwen3", "Qwen3"))
    ]
    top = max(b[2] for b in bars)

    W, H = 1200, 630
    img = Image.new("RGB", (W, H), DARK)
    d = ImageDraw.Draw(img)
    pad = 72
    f_mono = ImageFont.truetype(mono, 24)
    f_small = ImageFont.truetype(mono, 22)
    d.text((pad, pad - 6), "YAPTAX INDEX  /  FREE", font=f_mono, fill=DARK_RED)
    f_head = ImageFont.truetype(serif, 64)
    d.text((pad, pad + 40), f"Hindi costs up to {top:.1f}00d7", font=f_head, fill=DARK_INK)
    d.text((pad, pad + 116), "English's tokens.", font=f_head, fill=DARK_INK)

    y0, bar_h, gap = 300, 34, 18
    label_w, x0 = 330, pad + 330
    bar_max = W - pad - x0 - 110
    for i, (lang, tok, r) in enumerate(bars):
        y = y0 + i * (bar_h + gap)
        d.text((pad, y + 4), f"{lang}, {tok}", font=f_small, fill=DARK_GREY if lang == "English" else DARK_INK)
        d.rectangle([x0, y, x0 + bar_max, y + bar_h], fill=DARK_TRACK)
        w = round(bar_max * r / top)
        d.rectangle([x0, y, x0 + w, y + bar_h], fill=DARK_GREY if lang == "English" else DARK_RED)
        d.text((x0 + w + 14, y + 4), f"{r:.2f}00d7", font=f_small, fill=DARK_INK)

    d.text((pad, H - 62), "Same meaning, 204 languages, 8 tokenizers  /  neurotitan.in/cost", font=f_small, fill=DARK_GREY)
    return img


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--serif", default=r"C:\Windows\Fonts\georgia.ttf")
    ap.add_argument("--mono", default=r"C:\Windows\Fonts\consola.ttf")
    ap.add_argument("--only-cost", action="store_true", help="only rebuild og-cost.png")
    args = ap.parse_args()

    og_cost(args.serif, args.mono).save(PUBLIC / "og-cost.png", optimize=True)
    print("og-cost.png", (PUBLIC / "og-cost.png").stat().st_size, "bytes")
    if args.only_cost:
        return

    draw_mark(256).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    touch = Image.new("RGB", (180, 180), INK)
    mark = draw_mark(180)
    touch.paste(mark, (0, 0), mark)
    touch.save(PUBLIC / "apple-touch-icon.png", optimize=True)
    og_card(args.serif, args.mono).save(PUBLIC / "og-default.png", optimize=True)
    for name in ("favicon.ico", "apple-touch-icon.png", "og-default.png"):
        print(name, (PUBLIC / name).stat().st_size, "bytes")


if __name__ == "__main__":
    main()
