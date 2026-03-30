#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const measurementId = process.argv[2];
if (!measurementId) {
  console.error('Usage: node scripts/add-ga4.js <MEASUREMENT_ID>');
  process.exit(2);
}

const snippet = (id) => `<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${id}', { 'anonymize_ip': true });\n</script>\n`;

const files = glob.sync('**/*.html', { nodir: true, ignore: ['node_modules/**', '127.0.0.1_*.report.html'] });
let modified = 0;

for (const file of files) {
  const abs = path.resolve(file);
  let html = fs.readFileSync(abs, 'utf8');
  if (html.includes(measurementId)) continue; // already present
  const headClose = html.indexOf('</head>');
  if (headClose === -1) continue;
  // insert just before </head>
  html = html.slice(0, headClose) + '\n' + snippet(measurementId) + html.slice(headClose);
  fs.writeFileSync(abs, html, 'utf8');
  modified++;
  console.log(`Inserted GA4 into ${file}`);
}

console.log(`Done. Modified ${modified} files.`);
