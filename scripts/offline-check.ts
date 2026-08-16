import { existsSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error — serve-handler ships no types; same usage as scripts/preview-server.mjs.
import handler from 'serve-handler';
import { chromium } from 'playwright';

/**
 * DESIGN.md §17, "Offline, asserted" — one of the six new gating checks.
 * "A smoke test that the service worker registers and that a second load
 * succeeds with the network blocked." Build order step 9: the service
 * worker itself now exists (DESIGN.md §18 — @ducanh2912/next-pwa at
 * build time, the one permitted dependency, wired in next.config.js).
 * This replaces the placeholder that only checked a source file existed.
 *
 * Playwright drives the real, production `out/` build under its
 * production basePath, same as `pnpm preview` — a Node-only test can't
 * make this claim, since Cache Storage and Service Worker interception
 * don't exist outside a browser. Requires `pnpm build` to have already
 * run (CI order: build, then this).
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const BASE_PATH = '/alur-jkn';
const PORT = 4174;

const outDir = path.join(root, 'out');
if (!existsSync(outDir)) {
  console.error('offline:check — FAILED: out/ does not exist. Run "pnpm build" first.');
  process.exit(1);
}
if (!existsSync(path.join(outDir, 'sw.js'))) {
  console.error(
    'offline:check — FAILED: out/sw.js does not exist. DESIGN.md §18 — the service worker should be generated at build time by next.config.js\'s withPWA wrapper.',
  );
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(404);
    res.end();
    return;
  }
  if (req.url === '/' || req.url === '') {
    res.writeHead(302, { Location: `${BASE_PATH}/` });
    res.end();
    return;
  }
  if (!req.url.startsWith(BASE_PATH)) {
    res.writeHead(404);
    res.end();
    return;
  }
  req.url = req.url.slice(BASE_PATH.length) || '/';
  handler(req, res, { public: 'out' });
});

async function main() {
  await new Promise<void>((resolve) => server.listen(PORT, resolve));

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${BASE_PATH}/id/`, { waitUntil: 'load' });

    const emergencyTextFirstLoad = await page.locator('[role="alert"]').first().textContent();
    if (!emergencyTextFirstLoad || emergencyTextFirstLoad.trim().length === 0) {
      throw new Error('emergency banner did not render on first load');
    }

    const swState = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active?.state === 'activated') return reg.active.state;
      return new Promise<string>((resolve) => {
        const worker = reg.active ?? reg.waiting ?? reg.installing;
        if (!worker) return resolve('none');
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') resolve(worker.state);
        });
      });
    });
    if (swState !== 'activated') {
      throw new Error(`service worker did not reach "activated" state (got: ${swState})`);
    }

    await page.context().setOffline(true);
    await page.reload({ waitUntil: 'load' });

    const emergencyTextSecondLoad = await page.locator('[role="alert"]').first().textContent();
    if (!emergencyTextSecondLoad || emergencyTextSecondLoad.trim() !== emergencyTextFirstLoad.trim()) {
      throw new Error(
        `second load with the network blocked did not render the same content. First: "${emergencyTextFirstLoad}". Second: "${emergencyTextSecondLoad}".`,
      );
    }

    console.log('offline:check — OK: service worker registers, activates, and a second load with the network blocked succeeds.');
  } finally {
    await browser.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

main().catch((err) => {
  console.error('offline:check — FAILED:', err instanceof Error ? err.message : err);
  server.close();
  process.exit(1);
});
