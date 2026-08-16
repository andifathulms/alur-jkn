import type { Scenario } from '@/lib/content/scenario';
import type { Reference } from '@/lib/content/reference';
import type { Condition } from '@/lib/content/condition';
import type { Rule, RuleCitation } from '@/lib/rules/schema';
import { UNOFFICIAL_STATEMENT } from './strings';
import { CONDITION_SECTION_LABELS } from './conditionStrings';

export const SHARE_TEMPLATE_LABELS = {
  nextAction: 'Yang bisa dilakukan sekarang:',
  question: 'Pertanyaan untuk petugas:',
  source: 'Dasar aturan:',
} as const;

function citationLine(citation: RuleCitation): string {
  return `${citation.instrument}, ${citation.article}`;
}

/** Same citation often repeats across entries (e.g. every pengecualian item cites Pasal 52) — list it once. */
function dedupedCitationLines(citations: RuleCitation[]): string {
  return [...new Set(citations.map(citationLine))].join('; ');
}

/**
 * PRD.md §6.5: a clean card per scenario, sized and worded for WhatsApp —
 * "the family forwards it to the relative asking questions from another
 * city." Pure — assembles only fields already banned-phrase scanned
 * (invariant 2), plus the fixed unofficial statement.
 */
export function scenarioShareText(scenario: Scenario, citedRules: Rule[]): string {
  return [
    scenario.title,
    '',
    scenario.explanation,
    '',
    SHARE_TEMPLATE_LABELS.nextAction,
    scenario.nextAction,
    '',
    SHARE_TEMPLATE_LABELS.question,
    scenario.questionToAsk,
    '',
    `${SHARE_TEMPLATE_LABELS.source} ${dedupedCitationLines(citedRules.map((r) => r.citation))}`,
    '',
    UNOFFICIAL_STATEMENT,
  ].join('\n');
}

/**
 * MIGRATION.md step 7: share cards and print sheets for reference
 * entries, matching the existing scenario share card. Handles both
 * reference formats — 'explainer' (INA-CBG's sections) and 'entryList'
 * (the other five, where citations usually repeat across entries and are
 * deduped into one source line rather than one per entry).
 */
export function referenceShareText(reference: Reference): string {
  const body: string[] =
    reference.format === 'explainer'
      ? reference.sections.flatMap((section) => [section.heading, section.body, ''])
      : reference.entries.flatMap((entry) => [entry.term, entry.definition, entry.detail, '']);

  const citations =
    reference.format === 'explainer' ? reference.citations : reference.entries.map((e) => e.citation);

  return [
    reference.title,
    '',
    reference.summary,
    '',
    ...body,
    `${SHARE_TEMPLATE_LABELS.source} ${dedupedCitationLines(citations)}`,
    '',
    UNOFFICIAL_STATEMENT,
  ].join('\n');
}

/**
 * MIGRATION.md step 7: share cards and print sheets for condition pages.
 * Walks the same five fixed sections as ConditionTemplate, in the same
 * order, under the same labels.
 */
export function conditionShareText(condition: Condition, citedRules: Rule[]): string {
  return [
    condition.title,
    '',
    condition.summary,
    '',
    CONDITION_SECTION_LABELS.route,
    condition.route,
    '',
    CONDITION_SECTION_LABELS.methodDeterminant,
    condition.methodDeterminant,
    '',
    CONDITION_SECTION_LABELS.whyOneOption,
    condition.whyOneOption,
    '',
    CONDITION_SECTION_LABELS.costsThatRemain,
    condition.costsThatRemain,
    '',
    CONDITION_SECTION_LABELS.questionToAsk,
    condition.questionToAsk,
    '',
    `${SHARE_TEMPLATE_LABELS.source} ${dedupedCitationLines(citedRules.map((r) => r.citation))}`,
    '',
    UNOFFICIAL_STATEMENT,
  ].join('\n');
}
