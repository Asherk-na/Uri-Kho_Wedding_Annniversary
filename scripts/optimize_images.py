#!/usr/bin/env python3
"""Resize and optimize images for the site using Pillow.

Default behavior creates three folders under assets/images:
 - large   (max width 1600)
 - gallery (max width 800)
 - thumbs  (max width 400)

This script also supports an optional alternate size set (e.g. 1200/600) and a configurable JPEG quality.
Run with --help to see options.
"""
from PIL import Image, ImageOps
from pathlib import Path
import sys
import argparse

SRC_DIR = Path('assets/images')
OUT_LARGE = SRC_DIR / 'large'
OUT_GALLERY = SRC_DIR / 'gallery'
OUT_THUMBS = SRC_DIR / 'thumbs'
OUT_ALT = SRC_DIR / 'alternate'

DEFAULT_SIZES = {
    'large': 1600,
    'gallery': 800,
    'thumbs': 400,
}

formats = ('.jpg', '.jpeg', '.png')

parser = argparse.ArgumentParser(description='Optimize images into multiple sizes (Pillow)')
parser.add_argument('--quality', type=int, default=80, help='JPEG quality for output images (default: 80)')
parser.add_argument('--alt-sizes', type=str, help='Comma-separated alternate sizes to generate (e.g. "1200,600")')
parser.add_argument('--prune-originals', action='store_true', help='Remove original images after processing (use with care)')
parser.add_argument('--dry-run', action='store_true', help='Show what would be done without writing files')
args = parser.parse_args()

for d in (OUT_LARGE, OUT_GALLERY, OUT_THUMBS, OUT_ALT):
    d.mkdir(parents=True, exist_ok=True)

files = [p for p in SRC_DIR.iterdir() if p.is_file() and p.suffix.lower() in formats]
if not files:
    print('No images found in assets/images/')
    sys.exit(0)

alt_sizes = []
if args.alt_sizes:
    try:
        alt_sizes = [int(x.strip()) for x in args.alt_sizes.split(',') if x.strip()]
    except Exception:
        print('Invalid --alt-sizes format. Use comma-separated integers like 1200,600')
        sys.exit(1)

print(f'Found {len(files)} image(s) to process')

for p in files:
    base = p.stem
    try:
        with Image.open(p) as im:
            im = ImageOps.exif_transpose(im)
            im = im.convert('RGB')

            def save_resized(max_w, out_dir, suffix, quality):
                img = im.copy()
                w, h = img.size
                if w > max_w:
                    ratio = max_w / float(w)
                    new_h = int(h * ratio)
                    img = img.resize((max_w, new_h), Image.LANCZOS)
                out_path = out_dir / f'{base}-{suffix}.jpg'
                if args.dry_run:
                    print('[DRY] Would write', out_path)
                else:
                    img.save(out_path, 'JPEG', quality=quality, optimize=True, progressive=True)
                    print('Wrote', out_path)

            save_resized(DEFAULT_SIZES['large'], OUT_LARGE, '1600', args.quality)
            save_resized(DEFAULT_SIZES['gallery'], OUT_GALLERY, '800', args.quality)
            save_resized(DEFAULT_SIZES['thumbs'], OUT_THUMBS, '400', args.quality)

            # optional alternate sizes
            for s in alt_sizes:
                save_resized(s, OUT_ALT, str(s), args.quality)

            if args.prune_originals and not args.dry_run:
                try:
                    p.unlink()
                    print('Removed original', p)
                except Exception as e:
                    print('Could not remove', p, e)

    except Exception as e:
        print('Error processing', p, e)

print('Done')
