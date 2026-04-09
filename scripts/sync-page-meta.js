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

function jsonLdScript(data) {
  return `<script type="application/ld+json">
  ${JSON.stringify(data, null, 2)}
  </script>`;
}

function trimBrand(value = '') {
  return value
    .replace(/\s+\|\s+MintSheets.*$/, '')
    .trim();
}

function basePublisher() {
  return {
    '@type': 'Organization',
    name: 'MintSheets',
    logo: {
      '@type': 'ImageObject',
      url: 'https://mintsheets.com/brand/logo-without-background.png',
    },
  };
}

function primaryStructuredData(route, entry) {
  if (route === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: entry.canonical,
      name: 'MintSheets',
      description: entry.description,
      publisher: {
        '@type': 'Organization',
        name: 'MintSheets',
      },
    };
  }

  if (route === '/blog/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: trimBrand(entry.title),
      description: entry.description,
      url: entry.canonical,
      publisher: {
        '@type': 'Organization',
        name: 'MintSheets',
      },
    };
  }

  if (route.startsWith('/blog/')) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': entry.canonical,
      },
      headline: trimBrand(entry.title),
      description: entry.description,
      url: entry.canonical,
      image: entry.ogImage || entry.twitterImage,
      author: {
        '@type': 'Organization',
        name: 'MintSheets',
      },
      publisher: basePublisher(),
    };
  }

  if (route.startsWith('/hvac-') && route !== '/hvac-calculators/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: trimBrand(entry.title),
      url: entry.canonical,
      description: entry.description,
      applicationCategory: 'ProfessionalTool',
      operatingSystem: 'WEB',
    };
  }

  return null;
}

function buildDirectoryItemList(manifest, route, entry) {
  if (route === '/hvac-calculators/') {
    const calculators = Object.entries(manifest)
      .filter(([candidateRoute, candidate]) => candidateRoute.startsWith('/hvac-') && candidateRoute !== '/hvac-calculators/' && candidate.file.endsWith('/index.html'))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([candidateRoute, candidate], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: candidate.canonical,
        name: candidate.ogTitle || candidate.title.replace(/\s+\|\s+MintSheets.*$/, ''),
      }));

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: entry.title,
      itemListElement: calculators,
    };
  }

  if (route === '/blog/') {
    const articles = Object.entries(manifest)
      .filter(([candidateRoute]) => candidateRoute.startsWith('/blog/') && candidateRoute !== '/blog/')
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([candidateRoute, candidate], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: candidate.canonical,
        name: candidate.title.replace(/\s+\|\s+MintSheets.*$/, ''),
      }));

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: entry.title,
      itemListElement: articles,
    };
  }

  return null;
}

function getStructuredDataScripts(manifest, route, entry) {
  const blocks = [];
  const primary = primaryStructuredData(route, entry);
  if (primary) blocks.push(primary);

  for (const block of [...(entry.structuredData || [])].filter((block) => {
    if (!block || typeof block !== 'object') return false;
    if (block['@type'] === 'BreadcrumbList') return false;
    if ((route === '/blog/' || route === '/hvac-calculators/') && block['@type'] === 'ItemList') return false;
    if (route.startsWith('/blog/') && block['@type'] === 'BlogPosting') return false;
    if (route.startsWith('/hvac-') && route !== '/hvac-calculators/' && block['@type'] === 'SoftwareApplication') return false;
    if (route === '/' && block['@type'] === 'WebSite') return false;
    if (route === '/blog/' && block['@type'] === 'CollectionPage') return false;
    return true;
  })) {
    blocks.push(block);
  }
  const itemList = buildDirectoryItemList(manifest, route, entry);
  if (itemList) blocks.push(itemList);
  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: (entry.breadcrumbs || []).map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  });
  return blocks.map(jsonLdScript).join('\n\n');
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

  const structuredScripts = getStructuredDataScripts(manifest, route, entry);
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  if (structuredScripts) {
    html = html.replace('</head>', `${structuredScripts}\n\n</head>`);
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
