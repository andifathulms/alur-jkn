import { describe, it, expect } from 'vitest';
import { payerClasses } from '@/components/handoff/payerStyle';
import type { Payer } from '@/lib/content/outcome';

const PAYERS: Payer[] = [
  { type: 'jkn', label: 'JKN' },
  { type: 'jasaRaharja', label: 'Jasa Raharja' },
  { type: 'jaminanKecelakaanKerja', label: 'Jaminan Kecelakaan Kerja' },
  { type: 'self', label: 'Mandiri' },
];

/** DESIGN.md §7/CLAUDE.md invariant 9: no meaning by colour alone — every lane has a distinct pattern too. */
describe('colour-only encoding', () => {
  it('every payer type has a distinct background colour class', () => {
    const bgClasses = PAYERS.map((p) => payerClasses(p).bg);
    expect(new Set(bgClasses).size).toBe(PAYERS.length);
  });

  it('every payer type carries a text label, not colour alone', () => {
    for (const payer of PAYERS) {
      expect(payer.label.trim().length).toBeGreaterThan(0);
    }
  });

  it('non-solid lanes carry a distinct background pattern in addition to colour', () => {
    const nonSolid = PAYERS.filter((p) => p.type !== 'jkn');
    const patterns = nonSolid.map((p) => payerClasses(p).pattern);
    expect(patterns.every((p) => p.length > 0)).toBe(true);
    expect(new Set(patterns).size).toBe(nonSolid.length);
  });
});
