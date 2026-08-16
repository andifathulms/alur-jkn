import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * DESIGN.md §17, "Map coverage" — one of the six new gating checks.
 * "Every route that renders coverage content carries a station fragment;
 * every diagram has its `sr-only` text equivalent."
 *
 * A route satisfies this with either `StationFragment` (the local,
 * cropped view — build order step 2) or `NetworkMap` (the full map — step
 * 3, so far only the home page). Both carry a `sr-only` text equivalent
 * by construction (see their own tests); this script only checks that
 * one of the two is present on every route that renders `EmergencyBanner`
 * (every "coverage" route, per invariant 1).
 *
 * As of this script's introduction (before build order step 2) neither
 * component existed; it correctly reported that zero routes carried one.
 * Not yet a blocking gate — most coverage routes still don't render
 * either component (step 4 wires StationFragment onto them).
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const appDir = path.join(root, 'app');
const stationFragmentPath = path.join(root, 'components', 'pathway', 'StationFragment.tsx');
const networkMapPath = path.join(root, 'components', 'pathway', 'NetworkMap.tsx');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name === 'page.tsx' ? [full] : [];
  });
}

function exists(p: string): boolean {
  try {
    readFileSync(p, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

if (!exists(stationFragmentPath) && !exists(networkMapPath)) {
  console.error(
    'map:check — FAILED: neither components/pathway/StationFragment.tsx nor NetworkMap.tsx exist yet ' +
      "(DESIGN.md §5, build order steps 2-3). No coverage route can carry either. Not currently a blocking gate — see this script's header comment.",
  );
  process.exit(1);
}

let failed = false;
let coverageRouteCount = 0;

for (const file of walk(appDir)) {
  const source = readFileSync(file, 'utf-8');
  if (!source.includes('EmergencyBanner')) continue;
  coverageRouteCount++;
  const relative = path.relative(root, file);
  if (!source.includes('StationFragment') && !source.includes('NetworkMap')) {
    failed = true;
    console.error(`map:check — FAIL ${relative}: renders EmergencyBanner but neither StationFragment nor NetworkMap`);
  }
}

if (failed) {
  console.error('\nmap:check — FAILED.');
  process.exit(1);
}

console.log(`map:check — OK: all ${coverageRouteCount} coverage route(s) carry the network.`);
