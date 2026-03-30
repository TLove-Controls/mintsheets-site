#!/bin/bash
# Usage: ./scripts/optimize-assets.sh
# Requires cwebp and avifenc (libavif) installed.

set -e

SOURCE_DIR="shared/images"

for img in "$SOURCE_DIR"/*.{png,jpg,jpeg}; do
  [ -e "$img" ] || continue
  name="$(basename "$img")"
  base="${name%.*}"
  cwebp -q 80 "$img" -o "$SOURCE_DIR/${base}.webp"
  avifenc --min 24 "$img" "$SOURCE_DIR/${base}.avif"
  echo "Optimized $img -> ${base}.webp, ${base}.avif"

done

# To update HTML, use the <picture> tag. Example:
# <picture>
#   <source type="image/avif" srcset="shared/images/hvac-troubleshooting-preview.avif">
#   <source type="image/webp" srcset="shared/images/hvac-troubleshooting-preview.webp">
#   <img loading="lazy" src="shared/images/hvac-troubleshooting-preview.png" alt="Troubleshooting Checklist Preview">
# </picture>
