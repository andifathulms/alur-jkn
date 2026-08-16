import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRulePack } from '../lib/rules/loader';
import { isStale } from '../lib/rules/schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rulesDir = path.join(__dirname, '..', 'data', 'rules');

let failed = false;
const now = new Date();

// --- Rule packs: instrument, article, sourceUrl, verifiedAt on every rule ---

const files = readdirSync(rulesDir).filter((f) => f.endsWith('.json'));

if (files.length === 0) {
  console.error('content:validate — no rule packs found in data/rules/');
  process.exit(1);
}

for (const file of files) {
  const raw = JSON.parse(readFileSync(path.join(rulesDir, file), 'utf-8'));
  try {
    const pack = loadRulePack(raw, file);
    for (const rule of pack.rules) {
      if (isStale(rule.citation.verifiedAt, now)) {
        console.warn(
          `content:validate — STALE: ${pack.packId}.${rule.id} last verified ${rule.citation.verifiedAt}`,
        );
      }
    }
    console.log(`content:validate — OK: ${file} (${pack.rules.length} rules)`);
  } catch (err) {
    failed = true;
    console.error(String(err instanceof Error ? err.message : err));
  }
}

// --- Scenarios: outcome branch requirements ---
// data/scenarios/index.ts already runs ScenarioSchema.parse() at import
// time (which throws on a malformed outcome — e.g. 'excluded' missing
// pasal52Article, 'depends' missing question), so a successful import
// already proves the zod-level invariant. This re-asserts it explicitly
// and by content, not just by not-having-thrown, so a schema regression
// that silently stops enforcing the requirement still gets caught here.

try {
  const { scenarios } = await import('../data/scenarios');
  for (const scenario of scenarios) {
    if (scenario.outcome.type === 'excluded' && !scenario.outcome.pasal52Article.trim()) {
      failed = true;
      console.error(`content:validate — ${scenario.id}: 'excluded' outcome has an empty pasal52Article`);
    }
    if (scenario.outcome.type === 'depends' && !scenario.outcome.question.trim()) {
      failed = true;
      console.error(`content:validate — ${scenario.id}: 'depends' outcome has an empty question`);
    }
  }
  console.log(`content:validate — OK: ${scenarios.length} scenarios, outcome branches complete.`);
} catch (err) {
  failed = true;
  console.error(String(err instanceof Error ? err.message : err));
}

// --- Reference entries: citations, staleness ---
// data/reference/index.ts already runs ReferenceSchema.parse() at import
// time, so a successful import already proves the zod-level invariant
// (every reference entry has at least one citation, each with instrument,
// article, sourceUrl, verifiedAt). This adds staleness warnings, the same
// treatment as rule packs.

try {
  const { referenceEntries } = await import('../data/reference');
  for (const entry of referenceEntries) {
    for (const citation of entry.citations) {
      if (isStale(citation.verifiedAt, now)) {
        console.warn(`content:validate — STALE: reference.${entry.slug} last verified ${citation.verifiedAt}`);
      }
    }
  }
  console.log(`content:validate — OK: ${referenceEntries.length} reference entries, citations complete.`);
} catch (err) {
  failed = true;
  console.error(String(err instanceof Error ? err.message : err));
}

// --- Conditions: five sections + INA-CBG link ---
// TODO(step 5): data/conditions/ and lib/content/condition.ts don't exist
// yet (MIGRATION.md step 5). Once they do, validate here that every
// condition carries all five §5.3 sections and a link to the INA-CBG
// reference — the same pattern as the scenario check above.

if (failed) {
  console.error('content:validate — FAILED.');
  process.exit(1);
}

console.log('content:validate — all content valid.');
