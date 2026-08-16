import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * DESIGN.md §17, "Map coverage" — one of the six new gating checks.
 * "Every route that renders coverage content carries a station fragment;
 * every diagram has its `sr-only` text equivalent."
 *
 * A route satisfies this with either `StationFragment` (the local,
 * cropped view — build order step 2) or `NetworkMap` (the full map — step
 * 3). Both carry a `sr-only` text equivalent by construction (see their
 * own tests). A page can carry the network directly, or indirectly by
 * rendering a component (e.g. `FamilyWizard`, `ConditionTemplate`,
 * `ReferenceEntryListPage`) that itself renders one of the two — this
 * script follows local imports transitively so page.tsx files that
 * delegate rendering still count.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const appDir = path.join(root, 'app');
const stationFragmentPath = path.join(root, 'components', 'pathway', 'StationFragment.tsx');
const networkMapPath = path.join(root, 'components', 'pathway', 'NetworkMap.tsx');

function walk(dir: string, matcher: (name: string) => boolean): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full, matcher);
    return matcher(entry.name) ? [full] : [];
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

function resolveImport(fromFile: string, specifier: string): string | null {
  if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return null;
  const base = specifier.startsWith('@/')
    ? path.join(root, specifier.slice(2))
    : path.join(path.dirname(fromFile), specifier);
  const candidates = [base, `${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  return candidates.find((c) => existsSync(c)) ?? null;
}

function localImportsOf(file: string, source: string): string[] {
  const specifiers = [...source.matchAll(/from ['"]([^'"]+)['"]/g)].map((m) => m[1]!);
  return specifiers.map((s) => resolveImport(file, s)).filter((p): p is string => p !== null);
}

const carriesNetworkCache = new Map<string, boolean>();

function carriesNetwork(file: string, seen: Set<string> = new Set()): boolean {
  if (carriesNetworkCache.has(file)) return carriesNetworkCache.get(file)!;
  if (seen.has(file)) return false;
  seen.add(file);

  const source = readFileSync(file, 'utf-8');
  if (source.includes('<StationFragment') || source.includes('<NetworkMap')) {
    carriesNetworkCache.set(file, true);
    return true;
  }
  const result = localImportsOf(file, source).some((imported) => carriesNetwork(imported, seen));
  carriesNetworkCache.set(file, result);
  return result;
}

let failed = false;
let coverageRouteCount = 0;

for (const file of walk(appDir, (name) => name === 'page.tsx' || name === 'layout.tsx')) {
  if (path.basename(file) !== 'page.tsx') continue;
  const source = readFileSync(file, 'utf-8');
  if (source.includes('redirect(')) continue; // pure redirect — renders nothing, no content to carry the network
  const layoutFile = path.join(path.dirname(file), 'layout.tsx');
  const rendersEmergencyBanner =
    source.includes('<EmergencyBanner') || (existsSync(layoutFile) && readFileSync(layoutFile, 'utf-8').includes('<EmergencyBanner'));
  if (!rendersEmergencyBanner) continue;
  coverageRouteCount++;
  const relative = path.relative(root, file);
  if (!carriesNetwork(file)) {
    failed = true;
    console.error(`map:check — FAIL ${relative}: renders EmergencyBanner but neither StationFragment nor NetworkMap`);
  }
}

if (failed) {
  console.error('\nmap:check — FAILED.');
  process.exit(1);
}

console.log(`map:check — OK: all ${coverageRouteCount} coverage route(s) carry the network.`);
