import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * DESIGN.md §17, "Map coverage" — one of the six new gating checks.
 * "Every route that renders coverage content carries a station fragment;
 * every diagram has its `sr-only` text equivalent."
 *
 * Not yet meaningfully implementable: `StationFragment` (DESIGN.md §5,
 * build order step 2) does not exist yet as of this script's introduction
 * — this is step 1 (the canonical network schema) only. This script
 * checks for the component's existence and, once it exists, will check
 * every coverage route (every route rendering `EmergencyBanner`, per
 * invariant 1) imports and renders it. Today it correctly and honestly
 * reports that zero routes do, because the component doesn't exist.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const appDir = path.join(root, 'app');
const stationFragmentPath = path.join(root, 'components', 'pathway', 'StationFragment.tsx');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name === 'page.tsx' ? [full] : [];
  });
}

let stationFragmentExists = true;
try {
  readFileSync(stationFragmentPath, 'utf-8');
} catch {
  stationFragmentExists = false;
}

if (!stationFragmentExists) {
  console.error(
    'map:check — FAILED: components/pathway/StationFragment.tsx does not exist yet (DESIGN.md §5, build order step 2). ' +
      'No coverage route can carry a station fragment until it does. Not currently a blocking gate — see this script\'s header comment.',
  );
  process.exit(1);
}

// Once StationFragment exists, check every route that renders EmergencyBanner also renders it.
let failed = false;
let coverageRouteCount = 0;

for (const file of walk(appDir)) {
  const source = readFileSync(file, 'utf-8');
  if (!source.includes('EmergencyBanner')) continue;
  coverageRouteCount++;
  const relative = path.relative(root, file);
  if (!source.includes('StationFragment')) {
    failed = true;
    console.error(`map:check — FAIL ${relative}: renders EmergencyBanner but not StationFragment`);
  }
}

if (failed) {
  console.error('\nmap:check — FAILED.');
  process.exit(1);
}

console.log(`map:check — OK: all ${coverageRouteCount} coverage route(s) carry a station fragment.`);
