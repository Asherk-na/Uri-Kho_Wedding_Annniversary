#!/usr/bin/env python3
"""Create a simple gallery preview image (contact sheet) from generated thumbnails.
Writes artifacts/gallery-preview.png
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

THUMBS_DIR = Path('assets/images/thumbs')
OUT_DIR = Path('artifacts')
OUT_DIR.mkdir(exist_ok=True)

# The gallery images (matching gallery.html order)
basenames = [
    'bride-portrait', 'husband-1', 'couple-2', 'couple-3', 'wife-traditional-1',
    'husband-2', 'family-1', 'family-3', '2025-sisterly-love', 'couple-4'
]

thumbs = [THUMBS_DIR / f'{b}-400.jpg' for b in basenames]
# fall back to gallery size if thumb missing
for i, p in enumerate(thumbs):
    if not p.exists():
        fallback = Path('assets/images/gallery') / f'{basenames[i]}-800.jpg'
        if fallback.exists():
            thumbs[i] = fallback

# parameters
cols = 5
thumb_w = 380
thumb_h = 280
padding = 20
title_h = 100
bg = (250,250,250)
text_color = (50,50,50)

rows = (len(thumbs) + cols - 1) // cols
W = cols * thumb_w + (cols + 1) * padding
H = title_h + rows * thumb_h + (rows + 1) * padding

out = Image.new('RGB', (W, H), bg)

d = ImageDraw.Draw(out)
# Try to load a truetype font, fallback to default
try:
    font = ImageFont.truetype('DejaVuSans-Bold.ttf', 28)
    small = ImageFont.truetype('DejaVuSans.ttf', 18)
except Exception:
    font = ImageFont.load_default()
    small = ImageFont.load_default()

# Title
title = 'Gallery preview — Lanides & Mercy'
w_t, h_t = d.textsize(title, font=font)
d.text(((W-w_t)//2, 30), title, fill=text_color, font=font)

y = title_h
for idx, p in enumerate(thumbs):
    col = idx % cols
    row = idx // cols
    x = padding + col * (thumb_w + padding)
    y = title_h + padding + row * (thumb_h + padding)
    try:
        im = Image.open(p)
        im = im.convert('RGB')
        im.thumbnail((thumb_w, thumb_h), Image.LANCZOS)
        # center inside box
        box_x = x + (thumb_w - im.width) // 2
        box_y = y + (thumb_h - im.height) // 2
        out.paste(im, (box_x, box_y))
        # draw small caption
        caption = basenames[idx].replace('-', ' ').title()
        tw, th = d.textsize(caption, font=small)
        d.text((x + (thumb_w - tw)//2, y + thumb_h - th - 6), caption, fill=text_color, font=small)
    except Exception as e:
        d.rectangle([x, y, x+thumb_w, y+thumb_h], outline=(200,200,200))
        d.text((x+10, y+10), 'missing', fill=(150,0,0), font=small)

out_path = OUT_DIR / 'gallery-preview.png'
out.save(out_path)
print('Wrote', out_path)
