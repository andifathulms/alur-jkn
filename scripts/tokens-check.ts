import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * DESIGN.md §17, "Token consumption" — one of the six new gating checks.
 * "Fail on a hand-written arbitrary target value where a token exists,
 * and on a raw hex in `app/` or `components/`."
 *
 * Build order step 7 (the primitive layer, components/primitives/Button.tsx)
 * absorbed every arbitrary `min-h-[48px]`/`[56px]` into the
 * `min-h-target`/`min-h-target-family` tokens, and PathwayMap.tsx's raw hex
 * literals became `var(--color-x)`. The remaining 3 raw hex literals are
 * all in InaCbgDiagram.tsx, which build order step 8 rewrites as a
 * data-bound diagram — fixing its colours now would be thrown away then.
 * Not yet a blocking gate; becomes one once step 8 lands.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const targetDirs = ['app', 'components'].map((d) => path.join(root, d));

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') ? [full] : [];
  });
}

const ARBITRARY_TARGET_RE = /min-h-\[(48|56)px\]/g;
const RAW_HEX_RE = /#[0-9A-Fa-f]{3,8}\b/g;

let failed = false;
let arbitraryCount = 0;
let hexCount = 0;

for (const dir of targetDirs) {
  for (const file of walk(dir)) {
    const relative = path.relative(root, file);
    const source = readFileSync(file, 'utf-8');

    for (const m of source.matchAll(ARBITRARY_TARGET_RE)) {
      failed = true;
      arbitraryCount++;
      const suggestion = m[1] === '48' ? 'min-h-target' : 'min-h-target-family';
      console.error(`tokens:check — FAIL ${relative}: "min-h-[${m[1]}px]" — use "${suggestion}" instead`);
    }

    for (const m of source.matchAll(RAW_HEX_RE)) {
      failed = true;
      hexCount++;
      console.error(`tokens:check — FAIL ${relative}: raw hex literal "${m[0]}" — use a Tailwind colour token`);
    }
  }
}

if (failed) {
  console.error(
    `\ntokens:check — FAILED: ${arbitraryCount} arbitrary target value(s), ${hexCount} raw hex literal(s). Not currently a blocking gate — see this script's header comment.`,
  );
  process.exit(1);
}

console.log('tokens:check — OK: no arbitrary target values, no raw hex literals.');
