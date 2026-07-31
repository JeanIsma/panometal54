const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const root = path.join(__dirname, 'dist');
const ports = Array.from({ length: 11 }, (_, i) => 5173 + i);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const requested = decoded === '/' ? '/index.html' : decoded;
  const resolved = path.resolve(root, '.' + requested);
  return resolved.startsWith(path.resolve(root)) ? resolved : null;
}

function requestHandler(req, res) {
  let filePath = safePath(req.url || '/');
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) filePath = path.join(filePath, 'index.html');

    fs.readFile(filePath, (error, content) => {
      if (error) {
        // Single-page fallback for normal website routes.
        fs.readFile(path.join(root, 'index.html'), (fallbackError, fallback) => {
          if (fallbackError) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('File not found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
          res.end(fallback);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': mime[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' || ext === '.js' || ext === '.css' ? 'no-store' : 'public, max-age=3600'
      });
      res.end(content);
    });
  });
}

function openBrowser(url) {
  if (process.platform === 'win32') exec(`start "" "${url}"`);
  else if (process.platform === 'darwin') exec(`open "${url}"`);
  else exec(`xdg-open "${url}" >/dev/null 2>&1`);
}

function tryPort(index = 0) {
  if (index >= ports.length) {
    console.error('Could not find a free port between 5173 and 5183.');
    process.exitCode = 1;
    return;
  }

  const port = ports[index];
  const server = http.createServer(requestHandler);

  server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Trying ${port + 1}...`);
      tryPort(index + 1);
      return;
    }
    console.error(error);
    process.exitCode = 1;
  });

  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}/`;
    console.log('=================================================');
    console.log(' PANOMETAL54 WEBSITE IS RUNNING');
    console.log('=================================================');
    console.log(`Open: ${url}`);
    console.log('Keep this window open while viewing the website.');
    console.log('Press Ctrl+C to stop the website.');
    console.log('');
    if (!process.env.PANOMETAL_NO_OPEN) setTimeout(() => openBrowser(url), 500);
  });

  const shutdown = () => server.close(() => process.exit(0));
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('dist/index.html is missing. Run BUILD-WEBSITE.bat first.');
  process.exit(1);
}

tryPort();
