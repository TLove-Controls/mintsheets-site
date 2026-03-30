#!/bin/bash
# Usage: ./scripts/optimize-assets.sh
# Requires cwebp and avifenc (libavif) installed.
#
# NOTE: For Windows users or when `cwebp`/`avifenc` are not available,
# use the Node.js alternative: `npm install` then `npm run optimize-images`.

set -e

SOURCE_DIRS=("shared/images" "brand")

for dir in "${SOURCE_DIRS[@]}"; do
  [ -d "$dir" ] || continue
  for img in "$dir"/*.{png,jpg,jpeg}; do
    [ -e "$img" ] || continue
    name="$(basename "$img")"
    base="${name%.*}"
    cwebp -q 80 "$img" -o "$dir/${base}.webp"
    avifenc --min 24 "$img" "$dir/${base}.avif"
    echo "Optimized $img -> ${base}.webp, ${base}.avif"
  done
done

# To update HTML, use the <picture> tag. Example:
# <picture>
#   <source type="image/avif" srcset="shared/images/hvac-troubleshooting-preview.avif">
#   <source type="image/webp" srcset="shared/images/hvac-troubleshooting-preview.webp">
#   <img loading="lazy" src="shared/images/hvac-troubleshooting-preview.png" alt="Troubleshooting Checklist Preview">
# </picture>
