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
    const citations = entry.format === 'explainer' ? entry.citations : entry.entries.map((e) => e.citation);
    for (const citation of citations) {
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

// --- Conditions: five sections + rule citations ---
// ConditionSchema (lib/content/condition.ts) requires all five §5.3
// sections as named, non-empty fields — data/conditions/index.ts already
// throws on a missing one at import time, so a successful import proves
// completeness. The INA-CBG link isn't a data field at all: every
// condition page's template (components/condition/ConditionTemplate.tsx)
// renders it unconditionally, and tests/safety/condition-content.test.tsx
// asserts that render-level guarantee for every condition.

try {
  const { conditions } = await import('../data/conditions');
  const { rulePacks: allPacks } = await import('../data/rules');
  for (const condition of conditions) {
    for (const ref of condition.ruleRefs) {
      const pack = allPacks.find((p) => p.packId === ref.packId);
      const resolved = pack?.rules.some((r) => r.id === ref.ruleId) ?? false;
      if (!resolved) {
        failed = true;
        console.error(`content:validate — ${condition.slug}: ruleRef ${ref.packId}.${ref.ruleId} does not resolve`);
      }
    }
  }
  console.log(`content:validate — OK: ${conditions.length} conditions, five sections and rule citations complete.`);
} catch (err) {
  failed = true;
  console.error(String(err instanceof Error ? err.message : err));
}

// --- Positions: every scenario/reference/condition position resolves against the real network ---
// DESIGN.md v3 §5: "static inline SVG generated from the content schema's
// existing position field." A typo'd stationId/itemId would otherwise only
// surface as a thrown error deep in lib/network/fragment.ts at render time.

try {
  const { network } = await import('../lib/network/definition');
  const stationIds = new Set(network.stations.map((s) => s.id));
  const offNetworkIds = new Set(network.offNetwork.map((o) => o.id));

  const { scenarios } = await import('../data/scenarios');
  const { referenceEntries } = await import('../data/reference');
  const { conditions } = await import('../data/conditions');

  const checkPosition = (source: string, position: { type: 'station' | 'offNetwork'; stationId?: string; itemId?: string } | null) => {
    if (!position) return;
    if (position.type === 'station' && position.stationId && !stationIds.has(position.stationId)) {
      failed = true;
      console.error(`content:validate — ${source}: position references unknown station "${position.stationId}"`);
    }
    if (position.type === 'offNetwork' && position.itemId && !offNetworkIds.has(position.itemId)) {
      failed = true;
      console.error(`content:validate — ${source}: position references unknown off-network item "${position.itemId}"`);
    }
  };

  for (const scenario of scenarios) checkPosition(`scenario:${scenario.id}`, scenario.position);
  for (const reference of referenceEntries) checkPosition(`reference:${reference.slug}`, reference.position);
  for (const condition of conditions) checkPosition(`condition:${condition.slug}`, condition.position);

  console.log(
    `content:validate — OK: ${scenarios.length + referenceEntries.length + conditions.length} content positions resolve against the network.`,
  );
} catch (err) {
  failed = true;
  console.error(String(err instanceof Error ? err.message : err));
}

if (failed) {
  console.error('content:validate — FAILED.');
  process.exit(1);
}

console.log('content:validate — all content valid.');
