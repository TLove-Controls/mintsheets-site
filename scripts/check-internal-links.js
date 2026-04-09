const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ignoredFiles = new Set([
  '127.0.0.1_2026-03-30_08-48-30.report.html',
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

function resolveSitePath(urlPath) {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return path.join(root, 'index.html');
  const withoutSlash = clean.replace(/^\/+/, '');
  const direct = path.join(root, withoutSlash);
  const indexPath = path.join(root, withoutSlash, 'index.html');
  const htmlPath = path.join(root, `${withoutSlash}.html`);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  if (fs.existsSync(indexPath)) return indexPath;
  if (fs.existsSync(htmlPath)) return htmlPath;
  return null;
}

function lineNumberFromIndex(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

const htmlFiles = walk(root).filter((file) => !ignoredFiles.has(path.basename(file)));
const errors = [];

for (const filePath of htmlFiles) {
  const relPath = path.relative(root, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf8');

  const attrRegex = /(href|src)="([^"]+)"/gi;
  let match;
  while ((match = attrRegex.exec(html))) {
    const [, attr, rawValue] = match;
    const value = rawValue.trim();
    const line = lineNumberFromIndex(html, match.index);

    if (!value || value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('data:')) continue;
    if (/^https?:\/\//i.test(value)) continue;
    if (value.startsWith('//')) continue;

    if (value.startsWith('/')) {
      const resolved = resolveSitePath(value);
      if (!resolved) {
        errors.push(`${relPath}:${line} broken ${attr} ${value}`);
        continue;
      }

      if (value.includes('#')) {
        const targetHtml = fs.readFileSync(resolved, 'utf8');
        const anchor = value.split('#')[1];
        if (anchor && !targetHtml.includes(`id="${anchor}"`)) {
          errors.push(`${relPath}:${line} missing anchor ${value}`);
        }
      }
      continue;
    }

    const clean = value.split('#')[0].split('?')[0];
    const resolved = path.resolve(path.dirname(filePath), clean);
    if (!fs.existsSync(resolved)) {
      errors.push(`${relPath}:${line} broken ${attr} ${value}`);
    }
  }
}

if (errors.length) {
  console.log(errors.join('\n'));
  console.log(`\nInternal link QA failed with ${errors.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML files. No broken internal links or local asset paths found.`);
}
