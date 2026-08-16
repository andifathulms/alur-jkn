import { describe, it, expect } from 'vitest';
import { scenarios } from '@/data/scenarios';

/** CLAUDE.md invariant 11: every scenario ends with a next action and a question to ask. */
describe('scenario completeness', () => {
  it('has all ten M1 scenarios', () => {
    expect(scenarios).toHaveLength(10);
  });

  it.each(scenarios.map((s) => [s.id, s] as const))('%s has a next action and a question to ask', (_id, s) => {
    expect(s.nextAction.trim().length).toBeGreaterThan(0);
    expect(s.questionToAsk.trim().length).toBeGreaterThan(0);
    expect(s.ruleRefs.length).toBeGreaterThan(0);
  });

  it('no scenario models coverage as a boolean field', () => {
    for (const s of scenarios) {
      expect(s).not.toHaveProperty('isCovered');
      expect(s.routing.type === 'single' || s.routing.type === 'coordination').toBe(true);
    }
  });
});
