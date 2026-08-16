import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRulePack } from '../lib/rules/loader';
import { isStale } from '../lib/rules/schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rulesDir = path.join(__dirname, '..', 'data', 'rules');

const files = readdirSync(rulesDir).filter((f) => f.endsWith('.json'));

if (files.length === 0) {
  console.error('rules:validate — no rule packs found in data/rules/');
  process.exit(1);
}

let failed = false;
const now = new Date();

for (const file of files) {
  const raw = JSON.parse(readFileSync(path.join(rulesDir, file), 'utf-8'));
  try {
    const pack = loadRulePack(raw, file);
    for (const rule of pack.rules) {
      if (isStale(rule.citation.verifiedAt, now)) {
        console.warn(
          `rules:validate — STALE: ${pack.packId}.${rule.id} last verified ${rule.citation.verifiedAt}`,
        );
      }
    }
    console.log(`rules:validate — OK: ${file} (${pack.rules.length} rules)`);
  } catch (err) {
    failed = true;
    console.error(String(err instanceof Error ? err.message : err));
  }
}

if (failed) {
  console.error('rules:validate — FAILED. Every rule must carry instrument, article, sourceUrl, verifiedAt.');
  process.exit(1);
}

console.log(`rules:validate — all ${files.length} pack(s) valid.`);
