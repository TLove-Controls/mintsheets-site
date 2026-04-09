const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outputPath = path.join(root, 'scripts', 'lib', 'page-manifest.json');
const ignored = new Set([
  '127.0.0.1_2026-03-30_08-48-30.report.html',
  'live_index.html',
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

function matchContent(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeEntities(match[1].trim()) : '';
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&middot;/g, '·')
    .replace(/&rarr;/g, '→')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsaquo;/g, '›')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseJsonLdBlocks(html) {
  const blocks = [];
  const regex = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi;
  let match;
  while ((match = regex.exec(html))) {
    try {
      blocks.push(decodeJsonValue(JSON.parse(match[1])));
    } catch {
      // ignore invalid JSON-LD blocks
    }
  }
  return blocks;
}

function decodeJsonValue(value) {
  if (typeof value === 'string') return decodeEntities(value);
  if (Array.isArray(value)) return value.map(decodeJsonValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, decodeJsonValue(inner)]));
  }
  return value;
}

function withoutBreadcrumb(blocks) {
  return blocks.filter((block) => block['@type'] !== 'BreadcrumbList');
}

function getRoute(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized === 'index.html') return '/';
  return `/${normalized.replace(/index\.html$/, '')}`;
}

function routeSlug(route) {
  if (route === '/') return 'home';
  return route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

function generatedOgImageUrl(route) {
  const isArticle = route.startsWith('/blog/') && route !== '/blog/';
  const isCalculator = route.startsWith('/hvac-') && route !== '/hvac-calculators/';
  if (!isArticle && !isCalculator) return '';
  return `https://mintsheets.com/shared/images/og/${routeSlug(route)}.png`;
}

const manifest = {};

for (const filePath of walk(root)) {
  const relPath = path.relative(root, filePath).replace(/\\/g, '/');
  if (ignored.has(relPath)) continue;

  const html = fs.readFileSync(filePath, 'utf8');
  if (!html.trim()) continue;

  const route = getRoute(relPath);
  const ldBlocks = parseJsonLdBlocks(html);
  const breadcrumbBlock = ldBlocks.find((block) => block['@type'] === 'BreadcrumbList');
  const structuredData = withoutBreadcrumb(ldBlocks);

  manifest[route] = {
    file: relPath,
    title: matchContent(html, /<title>([\s\S]*?)<\/title>/i),
    description: matchContent(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    canonical: matchContent(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
    ogTitle: matchContent(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i),
    ogDescription: matchContent(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i),
    ogType: matchContent(html, /<meta\s+property="og:type"\s+content="([^"]*)"/i) || 'website',
    ogImage: generatedOgImageUrl(route) || matchContent(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i),
    twitterTitle: matchContent(html, /<meta\s+name="twitter:title"\s+content="([^"]*)"/i),
    twitterDescription: matchContent(html, /<meta\s+name="twitter:description"\s+content="([^"]*)"/i),
    twitterImage: generatedOgImageUrl(route) || matchContent(html, /<meta\s+name="twitter:image"\s+content="([^"]*)"/i),
    structuredData,
    breadcrumbs: breadcrumbBlock?.itemListElement?.map((item) => ({
      name: item.name,
      item: item.item,
    })) || [],
  };
}

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Wrote ${Object.keys(manifest).length} manifest entries to ${path.relative(root, outputPath)}`);
