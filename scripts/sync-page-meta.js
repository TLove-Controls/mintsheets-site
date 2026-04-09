const fs = require('fs');
const path = require('path');

const root = process.cwd();
const manifestPath = path.join(root, 'scripts', 'lib', 'page-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function upsertMeta(html, attr, key, content) {
  const regex = new RegExp(`<meta\\s+${attr}="${escapeRegExp(key)}"\\s+content="[^"]*"\\s*/?>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${content}">`;
  if (regex.test(html)) return html.replace(regex, tag);
  return html.replace('</head>', `${tag}\n</head>`);
}

function upsertLink(html, rel, href) {
  const regex = new RegExp(`<link\\s+rel="${escapeRegExp(rel)}"\\s+href="[^"]*"\\s*/?>`, 'i');
  const tag = `<link rel="${rel}" href="${href}">`;
  if (regex.test(html)) return html.replace(regex, tag);
  return html.replace('</head>', `${tag}\n</head>`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getRoute(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized === 'index.html') return '/';
  return `/${normalized.replace(/index\.html$/, '')}`;
}

function breadcrumbJsonLd(entry) {
  if (!entry.breadcrumbs?.length) return '';
  return `<script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entry.breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }, null, 2)}
  </script>`;
}

function breadcrumbNav(entry) {
  if (!entry.breadcrumbs?.length) return '';
  const visible = entry.breadcrumbs.map((crumb, index) => {
    const isLast = index === entry.breadcrumbs.length - 1;
    if (isLast) return `<span class="breadcrumb-current">${crumb.name}</span>`;
    const href = new URL(crumb.item).pathname;
    return `<a href="${href}">${crumb.name}</a>`;
  }).join('\n        <span class="breadcrumb-separator">&rsaquo;</span>\n        ');

  return `<nav class="breadcrumb-bar" aria-label="Breadcrumb">
      <div class="container">
        ${visible}
      </div>
    </nav>`;
}

function legalBreadcrumb(entry) {
  if (!entry.breadcrumbs?.length) return '';
  return `<div class="breadcrumbs"><a href="/">Home</a> &rsaquo; ${entry.breadcrumbs[entry.breadcrumbs.length - 1].name}</div>`;
}

let changed = 0;

for (const [route, entry] of Object.entries(manifest)) {
  const filePath = path.join(root, entry.file);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${entry.title}</title>`);
  html = upsertMeta(html, 'name', 'description', entry.description);
  html = upsertLink(html, 'canonical', entry.canonical);

  html = upsertMeta(html, 'property', 'og:title', entry.ogTitle || entry.title);
  html = upsertMeta(html, 'property', 'og:description', entry.ogDescription || entry.description);
  html = upsertMeta(html, 'property', 'og:type', entry.ogType || 'website');
  html = upsertMeta(html, 'property', 'og:url', entry.canonical);
  if (entry.ogImage) html = upsertMeta(html, 'property', 'og:image', entry.ogImage);

  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:title', entry.twitterTitle || entry.title);
  html = upsertMeta(html, 'name', 'twitter:description', entry.twitterDescription || entry.description);
  if (entry.twitterImage || entry.ogImage) {
    html = upsertMeta(html, 'name', 'twitter:image', entry.twitterImage || entry.ogImage);
  }

  const breadcrumbScript = breadcrumbJsonLd(entry);
  const breadcrumbScriptRegex = /<script type="application\/ld\+json">\s*[\s\S]*?"@type"\s*:\s*"BreadcrumbList"[\s\S]*?<\/script>/i;
  if (breadcrumbScript) {
    if (breadcrumbScriptRegex.test(html)) html = html.replace(breadcrumbScriptRegex, breadcrumbScript);
    else html = html.replace('</head>', `${breadcrumbScript}\n\n</head>`);
  }

  if (/<nav class="breadcrumb-bar" aria-label="Breadcrumb">[\s\S]*?<\/nav>/i.test(html) && entry.breadcrumbs?.length) {
    html = html.replace(/<nav class="breadcrumb-bar" aria-label="Breadcrumb">[\s\S]*?<\/nav>/i, breadcrumbNav(entry));
  }

  if (/<div class="breadcrumbs">[\s\S]*?<\/div>/i.test(html) && entry.breadcrumbs?.length) {
    html = html.replace(/<div class="breadcrumbs">[\s\S]*?<\/div>/i, legalBreadcrumb(entry));
  }

  html = `${html.trim()}\n`;

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    changed += 1;
    console.log(`synced meta ${route} -> ${entry.file}`);
  }
}

console.log(`\nSynced meta and breadcrumbs in ${changed} HTML files.`);
