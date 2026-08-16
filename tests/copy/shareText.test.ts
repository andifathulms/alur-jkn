import { describe, it, expect } from 'vitest';
import { scenarioShareText } from '@/lib/copy/shareText';
import { getScenario } from '@/data/scenarios';
import { rulePacks } from '@/data/rules';
import { findRule } from '@/lib/rules/loader';
import { UNOFFICIAL_STATEMENT } from '@/lib/copy/strings';

describe('scenarioShareText', () => {
  const scenario = getScenario('tanpa-rujukan')!;
  const citedRules = scenario.ruleRefs.map((ref) => findRule(rulePacks, ref.packId, ref.ruleId));
  const text = scenarioShareText(scenario, citedRules);

  it('includes the scenario title, next action, and question', () => {
    expect(text).toContain(scenario.title);
    expect(text).toContain(scenario.nextAction);
    expect(text).toContain(scenario.questionToAsk);
  });

  it('includes every cited rule instrument and article', () => {
    for (const rule of citedRules) {
      expect(text).toContain(rule.citation.instrument);
      expect(text).toContain(rule.citation.article);
    }
  });

  it('always includes the unofficial statement — this is a take-away artifact', () => {
    expect(text).toContain(UNOFFICIAL_STATEMENT);
  });
});
