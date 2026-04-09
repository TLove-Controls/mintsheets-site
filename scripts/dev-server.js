const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const root = process.cwd();

function readArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }

  const prefixed = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  return prefixed ? prefixed.split('=').slice(1).join('=') : undefined;
}

const port = Number(readArgValue('--port') || process.env.PORT || 3000);
const host = readArgValue('--host') || process.env.HOST || '127.0.0.1';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

function resolvePath(requestUrl) {
  const parsed = new URL(requestUrl, `http://${host}:${port}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(root, safePath);

  if (pathname.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!path.extname(filePath)) {
    const htmlPath = `${filePath}.html`;
    if (fs.existsSync(htmlPath)) return htmlPath;
    const dirIndexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(dirIndexPath)) return dirIndexPath;
  }

  return filePath;
}

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  const method = req.method || 'GET';
  if (!['GET', 'HEAD'].includes(method)) {
    send(res, 405, { 'content-type': 'text/plain; charset=utf-8' }, 'Method Not Allowed');
    return;
  }

  const filePath = resolvePath(req.url || '/');
  if (!filePath.startsWith(root)) {
    send(res, 403, { 'content-type': 'text/plain; charset=utf-8' }, 'Forbidden');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      send(res, 404, { 'content-type': 'text/plain; charset=utf-8' }, 'Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const headers = {
      'cache-control': 'no-store',
      'content-type': contentType,
    };

    if (method === 'HEAD') {
      send(res, 200, headers, '');
      return;
    }

    const stream = fs.createReadStream(filePath);
    res.writeHead(200, headers);
    stream.pipe(res);
    stream.on('error', () => {
      if (!res.headersSent) {
        send(res, 500, { 'content-type': 'text/plain; charset=utf-8' }, 'Server Error');
      } else {
        res.destroy();
      }
    });
  });
});

server.listen(port, host, () => {
  console.log(`MintSheets dev server running at http://${host}:${port}`);
  console.log(`Serving ${root}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Try: npm run dev -- --port 3001`);
    process.exit(1);
  }

  if (error.code === 'EACCES') {
    console.error(`Could not bind to ${host}:${port}. Try a different port, for example: npm run dev -- --port 4173`);
    process.exit(1);
  }

  console.error(error.message);
  process.exit(1);
});
