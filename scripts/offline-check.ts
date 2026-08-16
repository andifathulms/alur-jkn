import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * DESIGN.md §17, "Offline, asserted" — one of the six new gating checks.
 * "A smoke test that the service worker registers and that a second load
 * succeeds with the network blocked."
 *
 * Not yet meaningfully implementable: the service worker itself (DESIGN.md
 * §18, build order step 9 — Workbox or next-pwa at build time, the one
 * permitted third-party dependency) does not exist yet. A real "second
 * load with the network blocked" smoke test needs a browser (Playwright
 * or similar) driving the built `out/` directory, which is a bigger
 * addition than this check alone and belongs with step 9, not step 1.
 *
 * Today this only verifies the build-time precondition — that a service
 * worker source file exists to be built into `out/` — and fails honestly
 * because it doesn't. It is not the full smoke test DESIGN.md describes;
 * treat this as a placeholder that must be replaced, not extended, at
 * step 9. Not currently wired as a blocking gate — see build order.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const swSourceExists =
  existsSync(path.join(root, 'public', 'sw.js')) || existsSync(path.join(root, 'public', 'service-worker.js'));

if (!swSourceExists) {
  console.error(
    'offline:check — FAILED: no service worker source found (checked: public/sw.js, public/service-worker.js). ' +
      'DESIGN.md §18/build-order step 9 — not built yet. Not currently a blocking gate — see this script\'s header comment.',
  );
  console.error(`offline:check — also not yet implemented: the actual second-load-with-network-blocked smoke test.`);
  process.exit(1);
}

console.log('offline:check — service worker source found. (Full network-blocked smoke test still pending — see header comment.)');
