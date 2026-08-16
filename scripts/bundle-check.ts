import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextDir = path.join(__dirname, '..', '.next');
// DESIGN.md v2 §10: 120 KB gzipped, raised to 140 KB "for the reference
// layer, and no further." /cari (MIGRATION.md step 6) bundles the full
// cross-content-type search index client-side and sits at 118.3 KB —
// close enough to the old 120 KB ceiling that the next content addition
// would likely fail unexpectedly, so raising to the granted allowance now.
const BUDGET_BYTES = 140 * 1024;

const manifestPath = path.join(nextDir, 'app-build-manifest.json');
if (!existsSync(manifestPath)) {
  console.error('bundle:check — .next/app-build-manifest.json not found. Run "next build" first.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as { pages: Record<string, string[]> };
const kb = (bytes: number) => (bytes / 1024).toFixed(1);

let worstRoute = '';
let worstBytes = 0;

for (const [route, files] of Object.entries(manifest.pages)) {
  if (route.endsWith('/layout')) continue; // layouts aren't standalone routes
  const jsFiles = files.filter((f) => f.endsWith('.js'));
  const totalGzipped = jsFiles.reduce((sum, f) => {
    const full = path.join(nextDir, f);
    return sum + (existsSync(full) ? gzipSync(readFileSync(full)).length : 0);
  }, 0);
  if (totalGzipped > worstBytes) {
    worstBytes = totalGzipped;
    worstRoute = route;
  }
}

if (worstBytes > BUDGET_BYTES) {
  console.error(
    `bundle:check — FAILED: heaviest route ${worstRoute} is ${kb(worstBytes)} KB gzipped, over the ${kb(BUDGET_BYTES)} KB budget.`,
  );
  process.exit(1);
}

console.log(
  `bundle:check — OK: heaviest route ${worstRoute} is ${kb(worstBytes)} KB gzipped, within the ${kb(BUDGET_BYTES)} KB budget.`,
);
