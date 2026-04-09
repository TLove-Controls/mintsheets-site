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
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function countMatches(content, regex) {
  return (content.match(regex) || []).length;
}

function validateFile(filePath) {
  const relPath = path.relative(root, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  const warnings = [];

  if (!content.trim()) {
    warnings.push('file is empty');
    return { relPath, errors, warnings };
  }

  const required = [
    ['doctype', /<!DOCTYPE html>/i],
    ['html lang', /<html\b[^>]*\blang=/i],
    ['body', /<body\b/i],
    ['main#main-content', /<main\b[^>]*id="main-content"/i],
    ['title', /<title>[\s\S]+?<\/title>/i],
    ['meta description', /<meta\s+name="description"\s+content="[^"]+"/i],
    ['canonical', /<link\s+rel="canonical"\s+href="https:\/\/mintsheets\.com\/[^"]*"/i],
    ['h1', /<h1\b[\s\S]*?<\/h1>/i],
    ['skip link', /class="skip-link"/i],
    ['twitter:title', /<meta\s+name="twitter:title"\s+content="[^"]+"/i],
    ['twitter:description', /<meta\s+name="twitter:description"\s+content="[^"]+"/i],
    ['twitter:image', /<meta\s+name="twitter:image"\s+content="https:\/\/mintsheets\.com\/[^"]+"/i],
  ];

  for (const [label, regex] of required) {
    if (!regex.test(content)) {
      errors.push(`missing ${label}`);
    }
  }

  if (countMatches(content, /<body\b/gi) > 1) errors.push('multiple <body> tags');
  if (countMatches(content, /<main\b/gi) > 1) warnings.push('multiple <main> tags');
  if (countMatches(content, /<title>/gi) > 1) errors.push('multiple <title> tags');
  if (countMatches(content, /<h1\b/gi) > 1) warnings.push('multiple <h1> tags');

  const badSequences = ['ï¿½', 'â€œ', 'â€', 'â€™', 'â€˜', 'â€”', 'â€“', 'â€¦', 'â€¢', 'â€º', 'âœ‰', 'Ã—', 'ðŸ'];
  const foundBad = badSequences.filter((sequence) => content.includes(sequence));
  if (foundBad.length) {
    errors.push(`encoding artifacts found: ${foundBad.join(', ')}`);
  }

  return { relPath, errors, warnings };
}

const files = walk(root).filter((file) => !ignoredFiles.has(path.basename(file)));
const results = files.map(validateFile);
const warnings = results.filter((result) => result.warnings.length);
const failures = results.filter((result) => result.errors.length);

for (const result of results) {
  if (!result.errors.length && !result.warnings.length) continue;
  console.log(`\n${result.relPath}`);
  for (const error of result.errors) {
    console.log(`  ERROR: ${error}`);
  }
  for (const warning of result.warnings) {
    console.log(`  WARN: ${warning}`);
  }
}

console.log(`\nChecked ${results.length} HTML files.`);
console.log(`Errors: ${failures.length}`);
console.log(`Warnings: ${warnings.length}`);

if (failures.length) {
  process.exitCode = 1;
}
