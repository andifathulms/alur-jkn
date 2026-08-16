import * as strings from './strings';
import { SHARE_TEMPLATE_LABELS } from './shareText';
import { OUTCOME_LABELS, excludedStatementText } from './outcomeStrings';
import { scenarios } from '@/data/scenarios';
import { rulePacks } from '@/data/rules';
import type { Pasal52Entry } from './check';

/**
 * The single place that walks every piece of user-facing copy in the app —
 * fixed strings, scenario fields, rule statements — so scripts/copy-check.ts
 * and the test:safety suite scan exactly the same content instead of two
 * hand-maintained lists that can drift apart.
 */
export function collectContentCopy(): Record<string, string> {
  const entries: Record<string, string> = {};

  for (const [name, value] of Object.entries(strings)) {
    if (typeof value === 'string') entries[`lib/copy/strings.ts:${name}`] = value;
  }

  for (const [name, value] of Object.entries(SHARE_TEMPLATE_LABELS)) {
    entries[`lib/copy/shareText.ts:SHARE_TEMPLATE_LABELS.${name}`] = value;
  }

  for (const [name, value] of Object.entries(OUTCOME_LABELS)) {
    entries[`lib/copy/outcomeStrings.ts:OUTCOME_LABELS.${name}`] = value;
  }

  for (const scenario of scenarios) {
    entries[`scenario:${scenario.id}:title`] = scenario.title;
    entries[`scenario:${scenario.id}:explanation`] = scenario.explanation;
    entries[`scenario:${scenario.id}:nextAction`] = scenario.nextAction;
    entries[`scenario:${scenario.id}:questionToAsk`] = scenario.questionToAsk;
    if (scenario.outcome.type === 'depends') {
      entries[`scenario:${scenario.id}:outcome.question`] = scenario.outcome.question;
    }
  }

  for (const pack of rulePacks) {
    for (const rule of pack.rules) {
      entries[`rule:${pack.packId}.${rule.id}:statement`] = rule.statement;
    }
  }

  return entries;
}

/**
 * The Pasal 52 rule's view of the same content: every entry from
 * collectContentCopy() *except* raw UI-template fragments (OUTCOME_LABELS,
 * SHARE_TEMPLATE_LABELS) — a bare label like "Tidak ditanggung JKN —
 * dikecualikan berdasarkan" is a building block, not an assembled
 * statement, so it can't itself satisfy or violate "citation renders
 * inline." What the rule actually governs is narrative content (scenario
 * fields, rule statements, prose strings) plus the one additional entry
 * per 'excluded' scenario: the actual composed statement a State B outcome
 * renders (lib/copy/outcomeStrings.ts's excludedStatementText) — the only
 * place the phrase is allowed, and only because its citation is baked in.
 */
export function collectPasal52Entries(): Pasal52Entry[] {
  const generic = collectContentCopy();
  const entries: Pasal52Entry[] = Object.entries(generic)
    .filter(
      ([source]) =>
        !source.startsWith('lib/copy/outcomeStrings.ts:OUTCOME_LABELS.') &&
        !source.startsWith('lib/copy/shareText.ts:SHARE_TEMPLATE_LABELS.'),
    )
    .map(([source, text]) => ({ source, text, isExcludedStatement: false }));

  for (const scenario of scenarios) {
    if (scenario.outcome.type === 'excluded') {
      entries.push({
        source: `scenario:${scenario.id}:outcome.excludedStatement`,
        text: excludedStatementText(scenario.outcome.pasal52Article),
        isExcludedStatement: true,
      });
    }
  }

  return entries;
}
