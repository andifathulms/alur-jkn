import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * DESIGN.md §17, "String uniqueness" — one of the six new gating checks.
 * DESIGN.md §9: "One string per meaning. Two different 'not found' messages
 * currently exist for the same state. Every user-visible string lives in
 * `lib/copy/` exactly once."
 *
 * This checks two things, both mechanical:
 * 1. No two exported string constants in lib/copy/*.ts share the exact same
 *    value under different names (a copy-pasted literal, not re-exported).
 * 2. No JSX text literal in app/ or components/ exactly matches a lib/copy/
 *    constant's value — if it does, that call site should import the
 *    constant instead of re-typing it.
 *
 * What this does NOT catch: two *different* strings used for the same
 * *meaning* (the actual "not found" case DESIGN.md names — "Tidak
 * ditemukan." in ReferenceRail.tsx vs. SEARCH_LABELS.noResults's "Tidak
 * ditemukan. Coba kata kunci lain." are different byte sequences). That's a
 * wording/consolidation decision, not something a literal-value scan can
 * detect — flagged as a real gap, not silently ignored.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const copyDir = path.join(root, 'lib', 'copy');

function extractStringConstants(source: string, file: string): Array<{ name: string; value: string }> {
  const results: Array<{ name: string; value: string }> = [];
  // export const NAME = '...' or export const NAME = "..." — top-level literal constants only.
  const re = /export const ([A-Z_][A-Z0-9_]*)\s*=\s*(['"])((?:\\.|(?!\2).)*)\2/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const name = m[1];
    const value = m[3];
    if (name && value && value.length >= 4) results.push({ name: `${file}:${name}`, value });
  }
  return results;
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') ? [full] : [];
  });
}

let failed = false;

// --- 1. Duplicate values across lib/copy/*.ts constants ---

const copyFiles = readdirSync(copyDir).filter((f) => f.endsWith('.ts'));
const allConstants: Array<{ name: string; value: string }> = [];
for (const file of copyFiles) {
  const source = readFileSync(path.join(copyDir, file), 'utf-8');
  allConstants.push(...extractStringConstants(source, file));
}

const byValue = new Map<string, string[]>();
for (const { name, value } of allConstants) {
  const existing = byValue.get(value);
  if (existing) {
    existing.push(name);
  } else {
    byValue.set(value, [name]);
  }
}

for (const [value, names] of byValue) {
  if (names.length > 1) {
    failed = true;
    console.error(`strings:check — FAIL duplicate value across lib/copy/: ${JSON.stringify(value.slice(0, 60))}`);
    for (const name of names) console.error(`  - ${name}`);
  }
}

// --- 2. JSX/TSX literals outside lib/copy that exactly match a lib/copy value ---

const copyValues = new Set(allConstants.map((c) => c.value));
const appDirs = ['app', 'components'].map((d) => path.join(root, d));

for (const dir of appDirs) {
  for (const file of walk(dir)) {
    const relative = path.relative(root, file);
    const source = readFileSync(file, 'utf-8');
    const stringLiteralRe = /(['"])((?:\\.|(?!\1).){4,})\1/g;
    let m: RegExpExecArray | null;
    while ((m = stringLiteralRe.exec(source))) {
      const value = m[2];
      if (value && copyValues.has(value)) {
        failed = true;
        console.error(
          `strings:check — FAIL ${relative} re-types a lib/copy/ string instead of importing it: ${JSON.stringify(value.slice(0, 60))}`,
        );
      }
    }
  }
}

if (failed) {
  console.error('\nstrings:check — FAILED. See tests/README or DESIGN.md §9 for the "one string per meaning" rule.');
  process.exit(1);
}

console.log(`strings:check — OK: ${allConstants.length} lib/copy/ constants, no exact duplicates found.`);
