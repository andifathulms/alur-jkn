import * as strings from './strings';
import { SHARE_TEMPLATE_LABELS } from './shareText';
import { OUTCOME_LABELS, excludedStatementText } from './outcomeStrings';
import { SEARCH_LABELS, CONTENT_TYPE_LABELS } from './searchStrings';
import { CONDITION_SECTION_LABELS, CONDITION_INA_CBG_LINK_TEXT } from './conditionStrings';
import { scenarios } from '@/data/scenarios';
import { rulePacks } from '@/data/rules';
import { referenceEntries } from '@/data/reference';
import { conditions } from '@/data/conditions';
import type { Pasal52Entry } from './check';

/**
 * The single place that walks every piece of user-facing copy in the app —
 * fixed strings, scenario fields, rule statements, reference content — so
 * scripts/copy-check.ts and the test:safety suite scan exactly the same
 * content instead of two hand-maintained lists that can drift apart.
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

  for (const [name, value] of Object.entries(SEARCH_LABELS)) {
    entries[`lib/copy/searchStrings.ts:SEARCH_LABELS.${name}`] = value;
  }

  for (const [name, value] of Object.entries(CONTENT_TYPE_LABELS)) {
    entries[`lib/copy/searchStrings.ts:CONTENT_TYPE_LABELS.${name}`] = value;
  }

  for (const [name, value] of Object.entries(CONDITION_SECTION_LABELS)) {
    entries[`lib/copy/conditionStrings.ts:CONDITION_SECTION_LABELS.${name}`] = value;
  }
  entries['lib/copy/conditionStrings.ts:CONDITION_INA_CBG_LINK_TEXT'] = CONDITION_INA_CBG_LINK_TEXT;

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

  for (const reference of referenceEntries) {
    entries[`reference:${reference.slug}:title`] = reference.title;
    entries[`reference:${reference.slug}:summary`] = reference.summary;
    if (reference.format === 'explainer') {
      for (const section of reference.sections) {
        entries[`reference:${reference.slug}:section:${section.heading}`] = section.body;
      }
    } else {
      for (const entry of reference.entries) {
        entries[`reference:${reference.slug}:entry:${entry.term}:definition`] = entry.definition;
        entries[`reference:${reference.slug}:entry:${entry.term}:detail`] = entry.detail;
      }
    }
  }

  for (const condition of conditions) {
    entries[`condition:${condition.slug}:title`] = condition.title;
    entries[`condition:${condition.slug}:summary`] = condition.summary;
    entries[`condition:${condition.slug}:route`] = condition.route;
    entries[`condition:${condition.slug}:methodDeterminant`] = condition.methodDeterminant;
    entries[`condition:${condition.slug}:whyOneOption`] = condition.whyOneOption;
    entries[`condition:${condition.slug}:costsThatRemain`] = condition.costsThatRemain;
    entries[`condition:${condition.slug}:questionToAsk`] = condition.questionToAsk;
  }

  return entries;
}

/**
 * The Pasal 52 rule's view of the same content: fixed UI-template
 * fragments (OUTCOME_LABELS, SHARE_TEMPLATE_LABELS) are excluded — a bare
 * label like "Tidak ditanggung JKN — dikecualikan berdasarkan" is a
 * building block, not an assembled statement, so it can't itself satisfy
 * or violate "citation renders inline." What the rule actually governs is
 * narrative content, checked as whole entries (not split definition vs.
 * detail) so a citation mentioned in one half of an entry still counts as
 * "inline" for the other half:
 * - every scenario field, rule statement, and reference explainer section
 * - every reference entryList entry, composed as {definition} {detail} —
 *   `isExcludedStatement: true` only for pengecualian's entries, since
 *   that's the one reference section enumerating actual Pasal 52 items
 * - the one additional entry per 'excluded' scenario: the actual composed
 *   statement a State B outcome renders (excludedStatementText)
 */
export function collectPasal52Entries(): Pasal52Entry[] {
  const entries: Pasal52Entry[] = [];

  for (const [name, value] of Object.entries(strings)) {
    if (typeof value === 'string') entries.push({ source: `lib/copy/strings.ts:${name}`, text: value, isExcludedStatement: false });
  }

  for (const [name, value] of Object.entries(SEARCH_LABELS)) {
    entries.push({ source: `lib/copy/searchStrings.ts:SEARCH_LABELS.${name}`, text: value, isExcludedStatement: false });
  }

  for (const [name, value] of Object.entries(CONTENT_TYPE_LABELS)) {
    entries.push({ source: `lib/copy/searchStrings.ts:CONTENT_TYPE_LABELS.${name}`, text: value, isExcludedStatement: false });
  }

  for (const [name, value] of Object.entries(CONDITION_SECTION_LABELS)) {
    entries.push({
      source: `lib/copy/conditionStrings.ts:CONDITION_SECTION_LABELS.${name}`,
      text: value,
      isExcludedStatement: false,
    });
  }
  entries.push({
    source: 'lib/copy/conditionStrings.ts:CONDITION_INA_CBG_LINK_TEXT',
    text: CONDITION_INA_CBG_LINK_TEXT,
    isExcludedStatement: false,
  });

  for (const scenario of scenarios) {
    entries.push(
      { source: `scenario:${scenario.id}:title`, text: scenario.title, isExcludedStatement: false },
      { source: `scenario:${scenario.id}:explanation`, text: scenario.explanation, isExcludedStatement: false },
      { source: `scenario:${scenario.id}:nextAction`, text: scenario.nextAction, isExcludedStatement: false },
      { source: `scenario:${scenario.id}:questionToAsk`, text: scenario.questionToAsk, isExcludedStatement: false },
    );
    if (scenario.outcome.type === 'depends') {
      entries.push({
        source: `scenario:${scenario.id}:outcome.question`,
        text: scenario.outcome.question,
        isExcludedStatement: false,
      });
    }
    if (scenario.outcome.type === 'excluded') {
      entries.push({
        source: `scenario:${scenario.id}:outcome.excludedStatement`,
        text: excludedStatementText(scenario.outcome.pasal52Article),
        isExcludedStatement: true,
      });
    }
  }

  for (const pack of rulePacks) {
    for (const rule of pack.rules) {
      entries.push({ source: `rule:${pack.packId}.${rule.id}:statement`, text: rule.statement, isExcludedStatement: false });
    }
  }

  for (const reference of referenceEntries) {
    // pengecualian's title/summary describe the Pasal 52 list itself — the
    // one place a page-level mention of "tidak ditanggung" is expected —
    // and its summary already names the article inline in the same sentence.
    const isPengecualianPage = reference.slug === 'pengecualian';
    entries.push(
      { source: `reference:${reference.slug}:title`, text: reference.title, isExcludedStatement: isPengecualianPage },
      { source: `reference:${reference.slug}:summary`, text: reference.summary, isExcludedStatement: isPengecualianPage },
    );
    if (reference.format === 'explainer') {
      for (const section of reference.sections) {
        entries.push({
          source: `reference:${reference.slug}:section:${section.heading}`,
          text: section.body,
          isExcludedStatement: false,
        });
      }
    } else {
      const isPengecualian = reference.slug === 'pengecualian';
      for (const entry of reference.entries) {
        entries.push({
          source: `reference:${reference.slug}:entry:${entry.term}`,
          text: `${entry.definition} ${entry.detail}`,
          isExcludedStatement: isPengecualian,
        });
      }
    }
  }

  // Conditions never route to State B — PRD.md §5.3: "Never a verdict. If
  // something is not in Pasal 52, do not write that it is not covered —
  // write what actually determines it." Every field is a plain violation
  // check, none is ever an allowed carrier.
  for (const condition of conditions) {
    entries.push(
      { source: `condition:${condition.slug}:title`, text: condition.title, isExcludedStatement: false },
      { source: `condition:${condition.slug}:summary`, text: condition.summary, isExcludedStatement: false },
      { source: `condition:${condition.slug}:route`, text: condition.route, isExcludedStatement: false },
      {
        source: `condition:${condition.slug}:methodDeterminant`,
        text: condition.methodDeterminant,
        isExcludedStatement: false,
      },
      { source: `condition:${condition.slug}:whyOneOption`, text: condition.whyOneOption, isExcludedStatement: false },
      {
        source: `condition:${condition.slug}:costsThatRemain`,
        text: condition.costsThatRemain,
        isExcludedStatement: false,
      },
      { source: `condition:${condition.slug}:questionToAsk`, text: condition.questionToAsk, isExcludedStatement: false },
    );
  }

  return entries;
}
