import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { conditions, getCondition } from '@/data/conditions';
import { rulePacks } from '@/data/rules';
import { findRule } from '@/lib/rules/loader';
import { isStale } from '@/lib/rules/schema';
import { ConditionTemplate } from '@/components/condition/ConditionTemplate';
import { CONDITION_SECTION_LABELS } from '@/lib/copy/conditionStrings';
import { referenceHref } from '@/lib/content/reference';

/**
 * MIGRATION.md step 5. CLAUDE.md v2 invariant 6: every condition page
 * carries all five sections — validator-enforced at the schema level
 * (ConditionSchema requires each as non-empty), re-asserted here by
 * content. Invariant 7: every condition page links to INA-CBG — asserted
 * at the render level, since the link is hardcoded in the template, not a
 * data field.
 */
describe('condition content', () => {
  it('has exactly the two MIGRATION.md step 5 example conditions', () => {
    expect(conditions.map((c) => c.slug).sort()).toEqual(['operasi-katarak', 'operasi-usus-buntu']);
  });

  it.each(conditions.map((c) => [c.slug, c] as const))('%s has all five non-empty sections', (_slug, condition) => {
    expect(condition.route.trim().length).toBeGreaterThan(0);
    expect(condition.methodDeterminant.trim().length).toBeGreaterThan(0);
    expect(condition.whyOneOption.trim().length).toBeGreaterThan(0);
    expect(condition.costsThatRemain.trim().length).toBeGreaterThan(0);
    expect(condition.questionToAsk.trim().length).toBeGreaterThan(0);
    expect(condition.ruleRefs.length).toBeGreaterThan(0);
  });

  it('no condition models coverage as a boolean field — there is no outcome/verdict concept at all', () => {
    for (const condition of conditions) {
      expect(condition).not.toHaveProperty('isCovered');
      expect(condition).not.toHaveProperty('outcome');
    }
  });

  describe.each(conditions.map((c) => c.slug))('%s renders through ConditionTemplate', (slug) => {
    const condition = getCondition(slug)!;
    const now = new Date();
    const citedRules = condition.ruleRefs.map((ref) => {
      const rule = findRule(rulePacks, ref.packId, ref.ruleId);
      return { rule, stale: isStale(rule.citation.verifiedAt, now) };
    });

    it('has no axe violations', async () => {
      const { container } = render(<ConditionTemplate condition={condition} citedRules={citedRules} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('renders all five section labels in order', () => {
      const { container } = render(<ConditionTemplate condition={condition} citedRules={citedRules} />);
      const headings = Array.from(container.querySelectorAll('h2')).map((h) => h.textContent);
      const expectedOrder = [
        CONDITION_SECTION_LABELS.route,
        CONDITION_SECTION_LABELS.methodDeterminant,
        CONDITION_SECTION_LABELS.whyOneOption,
        CONDITION_SECTION_LABELS.costsThatRemain,
        CONDITION_SECTION_LABELS.questionToAsk,
      ];
      // headings also includes "Dasar aturan" at the end — check the first five match, in order.
      expect(headings.slice(0, 5)).toEqual(expectedOrder);
    });

    it('links to the INA-CBG reference — invariant 7', () => {
      const { container } = render(<ConditionTemplate condition={condition} citedRules={citedRules} />);
      const link = container.querySelector(`a[href="${referenceHref('ina-cbg')}"]`);
      expect(link).not.toBeNull();
    });

    it('never renders a coverage verdict phrase', async () => {
      const { scanText } = await import('@/lib/copy/check');
      const { container } = render(<ConditionTemplate condition={condition} citedRules={citedRules} />);
      expect(scanText(container.textContent ?? '', slug)).toEqual([]);
    });
  });
});
