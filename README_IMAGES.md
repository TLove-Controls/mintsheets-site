Image optimization
==================

This project includes two ways to generate WebP/AVIF image variants:

- Bash (Linux / macOS / WSL): `scripts/optimize-assets.sh` (uses `cwebp` and `avifenc`)
- Node.js (cross-platform): `scripts/optimize-images.js` (uses `sharp`)

Node.js (Windows / cross-platform) steps
----------------------------------------

1. Install Node.js (>=16) and npm if you don't have them.
2. From the project root run:

```powershell
npm install
npm run optimize-images
```

3. The script will write `.webp` and `.avif` files next to each original image in `shared/images` and `brand`.

Notes
-----
- If you prefer native binaries, use `scripts/optimize-assets.sh` in WSL or macOS after installing `cwebp` and `avifenc`.
- After generating variants, ensure your HTML uses `<picture>`/`srcset` (several pages were updated already).
