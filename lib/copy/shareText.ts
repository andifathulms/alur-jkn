import type { Scenario } from '@/lib/scenario/schema';
import type { Rule } from '@/lib/rules/schema';
import { UNOFFICIAL_STATEMENT } from './strings';

export const SHARE_TEMPLATE_LABELS = {
  nextAction: 'Yang bisa dilakukan sekarang:',
  question: 'Pertanyaan untuk petugas:',
  source: 'Dasar aturan:',
} as const;

/**
 * PRD.md §6.5: a clean card per scenario, sized and worded for WhatsApp —
 * "the family forwards it to the relative asking questions from another
 * city." Pure — assembles only fields already banned-phrase scanned
 * (invariant 2), plus the fixed unofficial statement.
 */
export function scenarioShareText(scenario: Scenario, citedRules: Rule[]): string {
  const sources = citedRules
    .map((rule) => `${rule.citation.instrument}, ${rule.citation.article}`)
    .join('; ');

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
    `${SHARE_TEMPLATE_LABELS.source} ${sources}`,
    '',
    UNOFFICIAL_STATEMENT,
  ].join('\n');
}
