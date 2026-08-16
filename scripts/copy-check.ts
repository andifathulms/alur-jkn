import { scanAll } from '../lib/copy/check';
import * as strings from '../lib/copy/strings';
import { SHARE_TEMPLATE_LABELS } from '../lib/copy/shareText';
import { scenarios } from '../data/scenarios';
import { rulePacks } from '../data/rules';

const entries: Record<string, string> = {};

for (const [name, value] of Object.entries(strings)) {
  if (typeof value === 'string') entries[`lib/copy/strings.ts:${name}`] = value;
}

for (const [name, value] of Object.entries(SHARE_TEMPLATE_LABELS)) {
  entries[`lib/copy/shareText.ts:SHARE_TEMPLATE_LABELS.${name}`] = value;
}

for (const scenario of scenarios) {
  entries[`scenario:${scenario.id}:explanation`] = scenario.explanation;
  entries[`scenario:${scenario.id}:nextAction`] = scenario.nextAction;
  entries[`scenario:${scenario.id}:questionToAsk`] = scenario.questionToAsk;
}

for (const pack of rulePacks) {
  for (const rule of pack.rules) {
    entries[`rule:${pack.packId}.${rule.id}:statement`] = rule.statement;
  }
}

const violations = scanAll(entries);

if (violations.length > 0) {
  console.error(`copy:check — FAILED, ${violations.length} violation(s):\n`);
  for (const v of violations) {
    console.error(`  ${v.source}\n    matched "${v.match}" — ${v.reason}\n`);
  }
  process.exit(1);
}

console.log(`copy:check — OK, scanned ${Object.keys(entries).length} string(s).`);
