const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'lib', 'page-manifest.json'), 'utf8'));
const outputDir = path.join(root, 'shared', 'images', 'og');

const palettes = [
  { bg1: '#0B1C35', bg2: '#163D63', accent: '#2ECC71', accent2: '#22D3EE' },
  { bg1: '#101828', bg2: '#1D3557', accent: '#6EE7B7', accent2: '#38BDF8' },
  { bg1: '#0F172A', bg2: '#3B1F4A', accent: '#F59E0B', accent2: '#22D3EE' },
  { bg1: '#0B1324', bg2: '#1F4D5A', accent: '#A3E635', accent2: '#38BDF8' },
];

function routeSlug(route) {
  if (route === '/') return 'home';
  return route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

function isTarget(route) {
  return (route.startsWith('/blog/') && route !== '/blog/') ||
    (route.startsWith('/hvac-') && route !== '/hvac-calculators/');
}

function trimBrand(value = '') {
  return value.replace(/\s+\|\s+MintSheets.*$/, '').trim();
}

function deriveLabel(route) {
  if (route.startsWith('/blog/')) return 'HVAC Guide';
  if (route.includes('break-even')) return 'Business Planning';
  if (route.includes('valuation')) return 'Business Strategy';
  if (route.includes('profit-margin')) return 'Margin Analysis';
  if (route.includes('service-price') || route.includes('service-markup') || route.includes('bid')) return 'Pricing Tool';
  if (route.includes('labor')) return 'Operations Tool';
  if (route.includes('energy-savings')) return 'Efficiency Tool';
  if (route.includes('static-pressure') || route.includes('flow-rate') || route.includes('cfm') || route.includes('airflow')) return 'Technical Tool';
  if (route.includes('duct') || route.includes('mini-split') || route.includes('load')) return 'Sizing Tool';
  return 'HVAC Calculator';
}

function deriveSubtitle(entry) {
  const source = (entry.ogDescription || entry.description || '').trim();
  if (!source) return 'Free field-ready HVAC tool from MintSheets';
  return source.length > 120 ? `${source.slice(0, 117).trimEnd()}...` : source;
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildSvg(route, entry) {
  const palette = palettes[hashString(route) % palettes.length];
  const titleLines = wrapText(trimBrand(entry.title), 34);
  const subtitleLines = wrapText(deriveSubtitle(entry), 60).slice(0, 2);
  const label = deriveLabel(route);
  const slug = route.replace(/^\/|\/$/g, '');

  const titleSvg = titleLines.map((line, index) =>
    `<text x="96" y="${220 + (index * 74)}" fill="#F8FAFC" font-size="60" font-family="Arial, Helvetica, sans-serif" font-weight="700">${escapeXml(line)}</text>`
  ).join('');

  const subtitleSvg = subtitleLines.map((line, index) =>
    `<text x="96" y="${470 + (index * 34)}" fill="#B8CCE0" font-size="28" font-family="Arial, Helvetica, sans-serif">${escapeXml(line)}</text>`
  ).join('');

  return `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.bg1}" />
        <stop offset="100%" stop-color="${palette.bg2}" />
      </linearGradient>
      <linearGradient id="pill" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${palette.accent}" />
        <stop offset="100%" stop-color="${palette.accent2}" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.35"/>
      </filter>
    </defs>

    <rect width="1200" height="630" fill="url(#bg)" />
    <circle cx="1040" cy="104" r="190" fill="${palette.accent}" opacity="0.12"/>
    <circle cx="1060" cy="520" r="210" fill="${palette.accent2}" opacity="0.12"/>
    <circle cx="120" cy="90" r="120" fill="${palette.accent}" opacity="0.08"/>

    <rect x="72" y="64" width="1056" height="502" rx="32" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />

    <rect x="96" y="96" width="270" height="44" rx="22" fill="url(#pill)" filter="url(#shadow)"/>
    <text x="126" y="125" fill="#08111F" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700">${escapeXml(label)}</text>

    <text x="96" y="178" fill="#7DD3FC" font-size="24" font-family="Arial, Helvetica, sans-serif" letter-spacing="3">MINTSHEETS</text>
    ${titleSvg}
    ${subtitleSvg}

    <line x1="96" y1="540" x2="1104" y2="540" stroke="rgba(255,255,255,0.14)" />
    <text x="96" y="582" fill="#8AA4BF" font-size="22" font-family="Arial, Helvetica, sans-serif">${escapeXml(slug)}</text>
    <text x="1104" y="582" text-anchor="end" fill="${palette.accent}" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700">mintsheets.com</text>
  </svg>`;
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  let generated = 0;

  for (const [route, entry] of Object.entries(manifest)) {
    if (!isTarget(route)) continue;
    const filename = `${routeSlug(route)}.png`;
    const outputPath = path.join(outputDir, filename);
    const svg = buildSvg(route, entry);
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9, quality: 90 })
      .toFile(outputPath);
    generated += 1;
    console.log(`generated ${path.relative(root, outputPath)}`);
  }

  console.log(`\nGenerated ${generated} OG images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
