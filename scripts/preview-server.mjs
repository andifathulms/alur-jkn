import http from 'node:http';
import handler from 'serve-handler';

const BASE_PATH = '/alur-jkn';
const PORT = 4173;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '') {
    res.writeHead(302, { Location: `${BASE_PATH}/` });
    res.end();
    return;
  }
  if (!req.url.startsWith(BASE_PATH)) {
    res.writeHead(404);
    res.end('Not found — this preview serves under the production basePath, e.g. /alur-jkn/id/');
    return;
  }
  req.url = req.url.slice(BASE_PATH.length) || '/';
  handler(req, res, { public: 'out' });
});

server.listen(PORT, () => {
  console.log(`Preview at http://localhost:${PORT}${BASE_PATH}/id/`);
});
