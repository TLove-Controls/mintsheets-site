#!/usr/bin/env node
const sharp = require('sharp');
const glob = require('glob');
const path = require('path');

const DIRS = ['shared/images', 'brand'];

async function convert(file) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const dir = path.dirname(file);
  const webpOut = path.join(dir, base + '.webp');
  const avifOut = path.join(dir, base + '.avif');
  try {
    await sharp(file).webp({ quality: 80 }).toFile(webpOut);
    await sharp(file).avif({ quality: 50 }).toFile(avifOut);
    console.log(`Optimized ${file} -> ${webpOut}, ${avifOut}`);
  } catch (err) {
    console.error(`Error optimizing ${file}: ${err.message}`);
  }
}

async function run() {
  for (const d of DIRS) {
    const pattern = path.join(d, '**/*.+(png|jpg|jpeg)');
    const files = glob.sync(pattern, { nodir: true });
    for (const f of files) {
      await convert(f);
    }
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
