const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const STYLES_DIR = path.join(__dirname, '..', 'styles');

// Read source files
const markdown = fs.readFileSync(path.join(CONTENT_DIR, 'index.md'), 'utf-8');
const css = fs.readFileSync(path.join(STYLES_DIR, 'style.css'), 'utf-8');

// Convert markdown to HTML
const htmlContent = marked.parse(markdown);

// Build full HTML page
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>singapore.md — Singapore's README</title>
  <meta name="description" content="Singapore's README — a structured directory of government portals, industry data, and live APIs for AI agents and humans.">
  <meta property="og:title" content="singapore.md">
  <meta property="og:description" content="Singapore's README for AI agents and humans.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://singapore.md">
  <link rel="canonical" href="https://singapore.md">
  <style>${css}</style>
</head>
<body>
  <article>${htmlContent}</article>
</body>
</html>`;

// Write outputs
fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), html);
fs.copyFileSync(path.join(CONTENT_DIR, 'index.md'), path.join(PUBLIC_DIR, 'index.md'));

console.log('Build complete:');
console.log('  public/index.html');
console.log('  public/index.md');
console.log('  public/llms.txt (manual)');
