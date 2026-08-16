import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { scanPasal52Rule } from '@/lib/copy/check';
import { collectPasal52Entries } from '@/lib/copy/collectContentCopy';
import { excludedStatementText } from '@/lib/copy/outcomeStrings';
import { scenarios } from '@/data/scenarios';
import { OutcomeDisplay } from '@/components/state/OutcomeDisplay';

/**
 * CLAUDE.md v2 invariant 3: "tidak ditanggung" and its variants may appear
 * only on a State B ('excluded') outcome, and only with its article
 * citation rendered inline. This mirrors scripts/copy-check.ts's Pasal 52
 * pass (via the same collectPasal52Entries()) so `pnpm test:safety` gates
 * it too, plus positive/negative controls and a DOM-level check that the
 * component actually renders what the composer function promises.
 */
describe('Pasal 52 rule', () => {
  it('the real app content has zero Pasal 52 rule violations', () => {
    expect(scanPasal52Rule(collectPasal52Entries())).toEqual([]);
  });

  it('positive control: flags "tidak ditanggung" outside an excluded statement', () => {
    const violations = scanPasal52Rule([
      { source: 'fixture', text: 'Laparoskopi tidak ditanggung.', isExcludedStatement: false },
    ]);
    expect(violations.length).toBeGreaterThan(0);
  });

  it('positive control: flags an excluded statement missing its article citation', () => {
    const violations = scanPasal52Rule([
      { source: 'fixture', text: 'Tidak ditanggung JKN, tanpa keterangan lebih lanjut.', isExcludedStatement: true },
    ]);
    expect(violations.length).toBeGreaterThan(0);
  });

  it('negative control: a correctly composed excluded statement passes', () => {
    const violations = scanPasal52Rule([
      { source: 'fixture', text: excludedStatementText('Pasal 52'), isExcludedStatement: true },
    ]);
    expect(violations).toEqual([]);
  });

  it('negative control: "tidak dijamin" language with no excluded flag still fails (variant coverage)', () => {
    const violations = scanPasal52Rule([
      { source: 'fixture', text: 'Layanan ini tidak dijamin JKN.', isExcludedStatement: false },
    ]);
    expect(violations.length).toBeGreaterThan(0);
  });

  it('exactly one scenario is classified excluded, and it is the Pasal 52 exclusion list scenario', () => {
    const excluded = scenarios.filter((s) => s.outcome.type === 'excluded');
    expect(excluded.map((s) => s.id)).toEqual(['layanan-dikecualikan']);
  });

  it('OutcomeDisplay renders the excluded statement textContent exactly matching the composer', () => {
    const { container } = render(<OutcomeDisplay outcome={{ type: 'excluded', pasal52Article: 'Pasal 52' }} />);
    const p = container.querySelector('p');
    expect(p?.textContent).toBe(excludedStatementText('Pasal 52'));
  });
});
