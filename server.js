const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const types = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

http.createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  const relative = pathname === '/' ? 'index.html' : pathname === '/map' || pathname === '/map/' ? 'map/index.html' : pathname.slice(1);
  const filename = path.resolve(root, relative);
  if (!filename.startsWith(root)) return response.writeHead(403).end('Forbidden');
  fs.readFile(filename, (error, data) => {
    if (error) return response.writeHead(404).end('Not found');
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'text/html; charset=utf-8' });
    response.end(data);
  });
}).listen(port, () => console.log(`Mortgage prototype: http://localhost:${port}`));
