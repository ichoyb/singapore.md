const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const STYLES_DIR = path.join(__dirname, '..', 'styles');
const PORT = 3456;

function build() {
  execSync('node build/build.js', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
  console.log(`[${new Date().toLocaleTimeString()}] Rebuilt`);
}

// Initial build
build();

// Watch for changes
for (const dir of [CONTENT_DIR, STYLES_DIR]) {
  fs.watch(dir, { recursive: true }, () => {
    try { build(); } catch (e) { console.error('Build error:', e.message); }
  });
}

// Serve
const MIME = {
  '.html': 'text/html',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(PUBLIC_DIR, filePath);
  const ext = path.extname(fullPath);

  if (!fullPath.startsWith(PUBLIC_DIR) || !fs.existsSync(fullPath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  res.writeHead(200, { 'Content-Type': (MIME[ext] || 'application/octet-stream') + '; charset=utf-8' });
  res.end(fs.readFileSync(fullPath));
});

server.listen(PORT, () => {
  console.log(`\nsingapore.md dev server`);
  console.log(`  Local:    http://localhost:${PORT}`);
  console.log(`  Markdown: http://localhost:${PORT}/index.md`);
  console.log(`  llms.txt: http://localhost:${PORT}/llms.txt`);
  console.log(`\nWatching content/ and styles/ for changes...\n`);
});
