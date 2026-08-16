import { describe, it, expect } from 'vitest';
import { scenarioShareText, referenceShareText, conditionShareText } from '@/lib/copy/shareText';
import { getScenario } from '@/data/scenarios';
import { getReference } from '@/data/reference';
import { getCondition } from '@/data/conditions';
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

describe('referenceShareText', () => {
  it('explainer format (INA-CBG): includes title, summary, every section, and citations', () => {
    const inaCbg = getReference('ina-cbg')!;
    if (inaCbg.format !== 'explainer') throw new Error('expected explainer format');
    const text = referenceShareText(inaCbg);
    expect(text).toContain(inaCbg.title);
    expect(text).toContain(inaCbg.summary);
    for (const section of inaCbg.sections) {
      expect(text).toContain(section.heading);
      expect(text).toContain(section.body);
    }
    for (const citation of inaCbg.citations) {
      expect(text).toContain(citation.article);
    }
    expect(text).toContain(UNOFFICIAL_STATEMENT);
  });

  it('entryList format (pengecualian): includes every entry and deduped citations', () => {
    const pengecualian = getReference('pengecualian')!;
    if (pengecualian.format !== 'entryList') throw new Error('expected entryList format');
    const text = referenceShareText(pengecualian);
    for (const entry of pengecualian.entries) {
      expect(text).toContain(entry.term);
      expect(text).toContain(entry.definition);
    }
    // every pengecualian entry cites the same article — dedup means it appears once in the source line, not 11 times
    const sourceLine = text.split('\n').find((line) => line.startsWith('Dasar aturan:'));
    expect(sourceLine?.match(/Pasal 52/g)?.length).toBe(1);
  });

  it('never contains a rupiah figure — mechanism only', () => {
    for (const reference of ['ina-cbg', 'pengecualian', 'poli', 'alat-kesehatan', 'obat', 'kelas']) {
      const entry = getReference(reference)!;
      expect(referenceShareText(entry)).not.toMatch(/\bRp\.?\s?\d/);
    }
  });
});

describe('conditionShareText', () => {
  const condition = getCondition('operasi-usus-buntu')!;
  const citedRules = condition.ruleRefs.map((ref) => findRule(rulePacks, ref.packId, ref.ruleId));
  const text = conditionShareText(condition, citedRules);

  it('includes all five sections in order, under their fixed labels', () => {
    const order = [condition.route, condition.methodDeterminant, condition.whyOneOption, condition.costsThatRemain, condition.questionToAsk];
    let lastIndex = -1;
    for (const section of order) {
      const index = text.indexOf(section);
      expect(index).toBeGreaterThan(lastIndex);
      lastIndex = index;
    }
  });

  it('always includes the unofficial statement', () => {
    expect(text).toContain(UNOFFICIAL_STATEMENT);
  });
});
