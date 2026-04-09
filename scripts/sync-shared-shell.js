const fs = require('fs');
const path = require('path');
const {
  MOBILE_NAV,
  NAV_SCRIPT,
  SITE_FOOTER,
  SITE_HEADER,
  SKIP_LINK_STYLE,
} = require('./lib/shared-html');

const root = process.cwd();
const ignored = new Set([
  '127.0.0.1_2026-03-30_08-48-30.report.html',
  'live_index.html',
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function normalizeShell(content) {
  if (!content.includes('<body')) return content;
  if (content.includes('<footer class="site-footer">')) return content;

  content = content.replace(/<style>\s*\.skip-link[\s\S]*?<\/style>/i, SKIP_LINK_STYLE);
  content = content.replace(/<a class="skip-link" href="#main-content">Skip to content<\/a>/i, '  <a class="skip-link" href="#main-content">Skip to content</a>');

  const headerRegex = /<header class="site-header">[\s\S]*?<\/header>/i;
  if (headerRegex.test(content)) {
    content = content.replace(headerRegex, SITE_HEADER);
  }

  const mobileNavRegex = /(?:<!-- Mobile Navigation -->\s*)?<div class="mobile-nav-overlay" id="mobile-nav-overlay"><\/div>\s*<nav class="mobile-nav"[\s\S]*?<\/nav>/i;
  if (mobileNavRegex.test(content)) {
    content = content.replace(mobileNavRegex, MOBILE_NAV);
  }

  const footerRegex = /<footer id="mint-footer"[\s\S]*?<\/footer>/i;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, SITE_FOOTER);
  }

  const navScriptRegex = /<script>\s*\(function \(\) \{\s*var btn = document\.getElementById\('hamburger-btn'\);[\s\S]*?\}\)\(\);\s*<\/script>/i;
  if (navScriptRegex.test(content)) {
    content = content.replace(navScriptRegex, NAV_SCRIPT);
  }

  content = content.replace(/<span class="breadcrumb-separator">(?:â€º|ï¿½|›)<\/span>/g, '<span class="breadcrumb-separator">&rsaquo;</span>');
  content = content.replace(/<div class="breadcrumbs">([\s\S]*?) ï¿½ ([\s\S]*?)<\/div>/g, '<div class="breadcrumbs">$1 &rsaquo; $2</div>');

  content = content.replace(/\n{3,}/g, '\n\n');
  return `${content.trim()}\n`;
}

let changed = 0;

for (const filePath of walk(root)) {
  const relPath = path.relative(root, filePath).replace(/\\/g, '/');
  if (ignored.has(relPath)) continue;

  const original = fs.readFileSync(filePath, 'utf8');
  const next = normalizeShell(original);
  if (next !== original) {
    fs.writeFileSync(filePath, next, 'utf8');
    changed += 1;
    console.log(`synced ${relPath}`);
  }
}

console.log(`\nSynced shared shell in ${changed} HTML files.`);
