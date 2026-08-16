import { describe, it, expect } from 'vitest';
import { OutcomeSchema } from '@/lib/content/outcome';
import { scenarios } from '@/data/scenarios';

/**
 * CLAUDE.md v2 invariant 4: outcomes are `{ type: 'payer' | 'excluded' |
 * 'depends' }`. 'excluded' requires `pasal52Article`; 'depends' requires
 * `question`. There is no coverage boolean, and the schema is meant to
 * make one unrepresentable — not just unused. `.strict()` on every branch
 * means these are proven by rejection, not just by omission.
 */
describe('outcome model', () => {
  it('accepts a valid payer outcome', () => {
    const result = OutcomeSchema.safeParse({
      type: 'payer',
      routing: { type: 'single', payer: { type: 'jkn', label: 'JKN' } },
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid excluded outcome with its article', () => {
    const result = OutcomeSchema.safeParse({ type: 'excluded', pasal52Article: 'Pasal 52' });
    expect(result.success).toBe(true);
  });

  it('rejects an excluded outcome missing pasal52Article', () => {
    const result = OutcomeSchema.safeParse({ type: 'excluded' });
    expect(result.success).toBe(false);
  });

  it('accepts a valid depends outcome with its question', () => {
    const result = OutcomeSchema.safeParse({ type: 'depends', question: 'Apakah ada indikasi medis?' });
    expect(result.success).toBe(true);
  });

  it('rejects a depends outcome missing question', () => {
    const result = OutcomeSchema.safeParse({ type: 'depends' });
    expect(result.success).toBe(false);
  });

  it('rejects an isCovered field on any branch — proven by rejection, not omission', () => {
    const withBoolean = [
      { type: 'payer', routing: { type: 'single', payer: { type: 'jkn', label: 'JKN' } }, isCovered: true },
      { type: 'excluded', pasal52Article: 'Pasal 52', isCovered: false },
      { type: 'depends', question: 'Apakah ada indikasi medis?', isCovered: false },
    ];
    for (const candidate of withBoolean) {
      expect(OutcomeSchema.safeParse(candidate).success).toBe(false);
    }
  });

  it('rejects an unrecognised fourth state', () => {
    const result = OutcomeSchema.safeParse({ type: 'covered' });
    expect(result.success).toBe(false);
  });

  it('every migrated scenario outcome satisfies its branch requirement', () => {
    for (const scenario of scenarios) {
      if (scenario.outcome.type === 'excluded') {
        expect(scenario.outcome.pasal52Article.trim().length).toBeGreaterThan(0);
      }
      if (scenario.outcome.type === 'depends') {
        expect(scenario.outcome.question.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('at least one scenario exercises each of the three states', () => {
    const types = new Set(scenarios.map((s) => s.outcome.type));
    expect(types).toEqual(new Set(['payer', 'excluded', 'depends']));
  });
});
