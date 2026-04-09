const fs = require('fs');
const path = require('path');

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'lib', 'page-manifest.json'), 'utf8'));
const outputPath = path.join(root, 'sitemap.xml');

function getPriority(route) {
  if (route === '/') return '1.0';
  if (route === '/blog/' || route === '/hvac-calculators/') return '0.9';
  if (route.startsWith('/hvac-')) return '0.9';
  if (route.startsWith('/blog/')) return '0.8';
  if (route.startsWith('/free/')) return '0.8';
  return '0.3';
}

function getChangefreq(route) {
  if (route === '/' || route === '/blog/' || route === '/hvac-calculators/') return 'weekly';
  return 'monthly';
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const routes = Object.entries(manifest)
  .filter(([, entry]) => entry.canonical)
  .sort(([a], [b]) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(([route, entry]) => `  <url>
    <loc>${escapeXml(entry.canonical)}</loc>
    <changefreq>${getChangefreq(route)}</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Generated sitemap with ${routes.length} URLs.`);
