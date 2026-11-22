// Local preview server for the portfolio.
// Binds to 127.0.0.1 only and serves an allowlist of site files, so the repository
// root (.git, backend, scripts, docs, content, notes) is never exposed.
// Usage: node scripts/preview-server.mjs [port]   (default 8000)
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.argv[2] || process.env.PORT || 8000);
const host = '127.0.0.1';

const siteDirs = ['assets', 'css', 'js', 'insights', 'projects'];
const siteFiles = new Set([
  'index.html', 'project.html', '404.html', 'faq.html', 'cookies.html',
  'privacy.html', 'terms.html', 'robots.txt', 'sitemap.xml',
]);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
};

function allowed(relative) {
  const parts = relative.split(sep).filter(Boolean);
  if (parts.length === 0 || parts.some(part => part.startsWith('.'))) return false;
  return parts.length === 1 ? siteFiles.has(parts[0]) : siteDirs.includes(parts[0]);
}

const server = createServer(async (request, response) => {
  const headers = { 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' };
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
    const relative = normalize(pathname === '/' ? 'index.html' : pathname.slice(1));
    const target = resolve(root, relative);
    if (!target.startsWith(root + sep) || !allowed(relative)) {
      response.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      return response.end('Not found');
    }
    const info = await stat(target);
    if (!info.isFile()) throw new Error('not a file');
    response.writeHead(200, {
      ...headers,
      'Content-Type': types[extname(target).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
    });
    if (request.method === 'HEAD') return response.end();
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`Preview on http://${host}:${port} (site files only; Ctrl+C to stop)`);
});
