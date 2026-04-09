const fs = require('fs');
const path = require('path');

const { SKIP_LINK_STYLE } = require('./lib/shared-html');

const root = process.cwd();
const DEFAULT_OG_IMAGE = 'https://mintsheets.com/shared/images/hvac-troubleshooting-preview.png';

const mojibakeMap = new Map([
  ['â€œ', '&ldquo;'],
  ['â€', '&rdquo;'],
  ['â€™', '&rsquo;'],
  ['â€˜', '&lsquo;'],
  ['â€”', '&mdash;'],
  ['â€“', '&ndash;'],
  ['â€¦', '&hellip;'],
  ['â€¢', '&bull;'],
  ['â€º', '&rsaquo;'],
  ['âœ‰ï¸', '&#x2709;'],
  ['âœ‰', '&#x2709;'],
  ['Ã—', '&times;'],
  ['ðŸ§®', '&#x1F9EE;'],
  ['ðŸ“', '&#x1F4DD;'],
  ['ðŸ“‹', '&#x1F4CB;'],
  ['ðŸ“Š', '&#x1F4CA;'],
  ['ðŸ”§', '&#x1F527;'],
  ['ðŸ’°', '&#x1F4B0;'],
  ['ðŸ†', '&#x1F3C6;'],
  ['ðŸ’¾', '&#x1F4BE;'],
  ['ðŸ–¨ï¸', '&#x1F5A8;'],
  ['ðŸ—‘ï¸', '&#x1F5D1;'],
  ['ðŸ”„', '&#x1F504;'],
  ['âš¡', '&#x26A1;'],
  ['â¬›', '&#x2B1B;'],
  ['ðŸ¥ˆ', '&#x1F948;'],
  ['ðŸ¥‡', '&#x1F947;'],
  ['â€œas is.â€', '&ldquo;as is.&rdquo;'],
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

function replaceAll(content, search, replacement) {
  while (content.includes(search)) {
    content = content.replace(search, replacement);
  }
  return content;
}

function getMetaContent(content, key, type = 'name') {
  const regex = new RegExp(`<meta\\s+${type}="${escapeRegExp(key)}"\\s+content="([^"]*)"\\s*/?>`, 'i');
  const match = content.match(regex);
  return match ? match[1] : '';
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function injectMeta(content, markup) {
  if (content.includes(markup)) return content;
  return content.replace('</head>', `${markup}\n</head>`);
}

function ensureBody(content) {
  if (!/<body\b/i.test(content)) {
    content = content.replace('</head>', '</head>\n\n<body class="has-sticky-ad">');
    content = content.replace(/\s*<\/html>\s*$/i, '\n</body>\n</html>\n');
  }

  return content.replace(/<body([^>]*)>/i, (match, attrs) => {
    if (/class=/i.test(attrs)) {
      return /has-sticky-ad/.test(attrs)
        ? `<body${attrs}>`
        : `<body${attrs.replace(/class=(["'])(.*?)\1/i, (classMatch, quote, value) => `class=${quote}${value} has-sticky-ad${quote}`)}>`;
    }
    return `<body class="has-sticky-ad"${attrs}>`;
  });
}

function ensureSkipLink(content) {
  if (!content.includes('class="skip-link"')) {
    content = content.replace(/<body[^>]*>/i, (match) => `${match}\n  <a class="skip-link" href="#main-content">Skip to content</a>`);
  }

  if (!content.includes('.skip-link')) {
    content = injectMeta(content, SKIP_LINK_STYLE.trim());
  }

  return content;
}

function ensureMain(content) {
  if (/<main\b/i.test(content)) {
    return content.replace(/<main(?![^>]*\bid=)/i, '<main id="main-content"');
  }

  const footerIndex = content.search(/<footer\b/i);
  const navMatch = content.match(/<\/nav>\s*(?=\s*<div class="container"|<section|<div class="breadcrumbs"|<div class="container">)/i);
  if (!navMatch || footerIndex === -1) return content;

  const insertAt = navMatch.index + navMatch[0].length;
  content = `${content.slice(0, insertAt)}\n  <main id="main-content">\n${content.slice(insertAt)}`;

  const footerMatch = content.match(/\s*<footer\b/i);
  if (!footerMatch) return content;
  const footerAt = footerMatch.index;
  return `${content.slice(0, footerAt)}\n  </main>\n${content.slice(footerAt)}`;
}

function ensureNavLabels(content) {
  content = content.replace(/<nav class="nav-links"(?![^>]*aria-label)/i, '<nav class="nav-links" aria-label="Primary"');
  content = content.replace(/<nav class="mobile-nav"(?![^>]*aria-label)/i, '<nav class="mobile-nav" aria-label="Mobile"');
  return content;
}

function ensureMetaTags(content) {
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'MintSheets';
  const description = getMetaContent(content, 'description') || getMetaContent(content, 'og:description', 'property') || 'Free HVAC calculators and guides from MintSheets.';
  const ogImage = getMetaContent(content, 'og:image', 'property') || DEFAULT_OG_IMAGE;

  const metaEntries = [
    `<meta name="author" content="MintSheets">`,
    `<meta name="robots" content="index,follow">`,
    `<meta name="theme-color" content="#0F172A">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:site_name" content="MintSheets">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
  ];

  if (!/rel="icon"/i.test(content)) {
    metaEntries.unshift(`<link rel="icon" type="image/x-icon" href="/brand/favicon.ico">`);
  }

  for (const entry of metaEntries) {
    const keyMatch = entry.match(/(?:name|property)="([^"]+)"/i);
    if (!keyMatch) continue;
    const key = keyMatch[1];
    const attr = entry.includes('property=') ? 'property' : 'name';
    const existing = new RegExp(`<meta\\s+${attr}="${escapeRegExp(key)}"\\s+content="([^"]*)"\\s*/?>`, 'i');

    if (existing.test(content)) {
      if (key.startsWith('twitter:')) {
        content = content.replace(existing, entry);
      }
      continue;
    }

    content = injectMeta(content, entry);
  }

  return content;
}

function normalizeWhitespace(content) {
  content = content.replace(/\r\n/g, '\n');
  content = content.replace(/\n{3,}/g, '\n\n');
  return `${content.trim()}\n`;
}

function improveFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  if (!content.trim()) {
    return false;
  }

  for (const [bad, good] of mojibakeMap.entries()) {
    content = replaceAll(content, bad, good);
  }

  content = ensureBody(content);
  content = ensureSkipLink(content);
  content = ensureMain(content);
  content = ensureNavLabels(content);
  content = ensureMetaTags(content);
  content = normalizeWhitespace(content);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

const files = walk(root).filter((file) => {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  return rel !== '127.0.0.1_2026-03-30_08-48-30.report.html';
});

let changed = 0;
for (const file of files) {
  if (improveFile(file)) {
    changed += 1;
    console.log(`updated ${path.relative(root, file)}`);
  }
}

console.log(`\nImproved ${changed} HTML files.`);
