const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ignored = new Set([
  '127.0.0.1_2026-03-30_08-48-30.report.html',
  'live_index.html',
]);

const replacements = [
  ['Â·', '&middot;'],
  ['Ã‚Â·', '&middot;'],
  ['â†’', '&rarr;'],
  ['Ã¢â€ â€™', '&rarr;'],
  ['â€”', '&mdash;'],
  ['â€“', '&ndash;'],
  ['Ã¯Â¿Â½', ''],
  ['ï¿½', ''],
  ['ðŸ“Š', '&#x1F4CA;'],
  ['ðŸ“ˆ', '&#x1F4C8;'],
  ['ðŸ’°', '&#x1F4B0;'],
  ['ðŸ”§', '&#x1F527;'],
  ['ðŸ“‹', '&#x1F4CB;'],
  ['ðŸ’µ', '&#x1F4B5;'],
  ['ðŸ‘·', '&#x1F477;'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

let changed = 0;
for (const filePath of walk(root)) {
  const relPath = path.relative(root, filePath).replace(/\\/g, '/');
  if (ignored.has(relPath)) continue;
  const original = fs.readFileSync(filePath, 'utf8');
  let next = original;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  if (next !== original) {
    fs.writeFileSync(filePath, next, 'utf8');
    changed += 1;
    console.log(`fixed ${relPath}`);
  }
}

console.log(`\nFixed encoding artifacts in ${changed} HTML files.`);
