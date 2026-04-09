const fs = require('fs');
const path = require('path');

const root = process.cwd();
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

function ensureLink(html, href) {
  if (html.includes(`href="${href}"`)) return html;
  return html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);
}

function stripStyleBlock(html, regex) {
  return html.replace(regex, '');
}

function stripSharedRulesFromStyleBlock(html, selectors) {
  return html.replace(/<style>([\s\S]*?)<\/style>/gi, (full, css) => {
    let nextCss = css;
    for (const selector of selectors) {
      nextCss = nextCss.replace(selector, '');
    }
    nextCss = nextCss.replace(/\n{3,}/g, '\n\n').trim();
    return nextCss ? `<style>\n${nextCss}\n  </style>` : '';
  });
}

const sharedRulePatterns = [
  /\s*\.skip-link\s*\{[\s\S]*?\}\s*\.skip-link:focus\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.breadcrumb-bar\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.breadcrumb-bar\s+\.container\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.breadcrumb-bar\s+a\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.breadcrumb-bar\s+a:hover\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.breadcrumb-separator\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.breadcrumb-current\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.notice-box\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.section-banner\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.section-banner\s+\.icon\s*\{[\s\S]*?\}\s*/gi,
];

const articleRulePatterns = [
  /\s*\.article-wrap\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.article-wrap h2\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.article-wrap h3\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.article-wrap p\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.article-wrap ul,\s*[\r\n\s]*\.article-wrap ol\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.article-wrap li\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.article-wrap a\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.article-wrap a:hover,\s*[\r\n\s]*\.article-wrap a:focus\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.step-card\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.step-number\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.step-card h3\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.step-card p\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.tool-link\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.tool-link:hover,\s*[\r\n\s]*\.tool-link:focus\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.article-meta\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.callout\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.callout strong\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.data-table\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.data-table th\s*\{[\s\S]*?\}\s*/gi,
  /\s*\.data-table td\s*\{[\s\S]*?\}\s*/gi,
];

const exactLegalStyleBlock = /<style>\s*:root \{ --bg:#0F172A; --panel:#1E293B; --text:#F1F5F9; --muted:#94A3B8; --primary:#2ECC71; --radius:12px; \}\s*\*\{box-sizing:border-box;\}\s*body\{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:var\(--bg\);color:var\(--text\);line-height:1\.6;\}\s*\.container\{max-width:980px;margin:0 auto;padding:20px;\}\s*a\{color:var\(--primary\);text-decoration:none;\}\s*\.card\{background:var\(--panel\);border:1px solid #334155;border-radius:var\(--radius\);padding:18px;margin:16px 0;\}\s*h1,h2\{margin:0 0 12px;\}\s*p,ul\{margin:0 0 12px;\}\s*ul\{padding-left:20px;\}\s*\.breadcrumbs\{font-size:13px;color:var\(--muted\);margin-bottom:18px;\}\s*\.legal-nav\{display:flex;flex-wrap:wrap;gap:8px;font-size:14px;\}\s*<\/style>/i;

let changed = 0;

for (const filePath of walk(root)) {
  const relPath = path.relative(root, filePath).replace(/\\/g, '/');
  if (ignored.has(relPath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  html = ensureLink(html, '/shared/css/page-chrome.css?v=1');
  html = stripSharedRulesFromStyleBlock(html, sharedRulePatterns);

  const isArticle = /^blog\/(?!index\.html$).+\/index\.html$/.test(relPath);
  if (isArticle) {
    html = ensureLink(html, '/shared/css/article.css?v=1');
    html = stripSharedRulesFromStyleBlock(html, articleRulePatterns);
  }

  const isLegal = /^(privacy-policy|terms-of-service|cookie-policy|disclaimer)\/index\.html$/.test(relPath);
  if (isLegal) {
    html = ensureLink(html, '/shared/css/legal.css?v=1');
    html = stripStyleBlock(html, exactLegalStyleBlock);
    html = html.replace(/<main id="main-content"(?![^>]*class=)/i, '<main id="main-content" class="legal-page"');
    html = html.replace(/<main id="main-content" class="([^"]*)"/i, (match, classes) => {
      return classes.includes('legal-page')
        ? match
        : `<main id="main-content" class="${classes} legal-page"`;
    });
  }

  html = html.replace(/\n{3,}/g, '\n\n').trim() + '\n';

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    changed += 1;
    console.log(`synced css ${relPath}`);
  }
}

console.log(`\nSynced shared CSS in ${changed} HTML files.`);
