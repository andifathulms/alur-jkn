import { scanAll, scanPasal52Rule } from '../lib/copy/check';
import { collectContentCopy, collectPasal52Entries } from '../lib/copy/collectContentCopy';

const entries = collectContentCopy();
const violations = scanAll(entries);

const pasal52Entries = collectPasal52Entries();
const pasal52Violations = scanPasal52Rule(pasal52Entries);

const allViolations = [...violations, ...pasal52Violations];

if (allViolations.length > 0) {
  console.error(`copy:check — FAILED, ${allViolations.length} violation(s):\n`);
  for (const v of allViolations) {
    console.error(`  ${v.source}\n    matched "${v.match}" — ${v.reason}\n`);
  }
  process.exit(1);
}

console.log(
  `copy:check — OK, scanned ${Object.keys(entries).length} string(s) (banned-phrase) and ${pasal52Entries.length} string(s) (Pasal 52 rule).`,
);
