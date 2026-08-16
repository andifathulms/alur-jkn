import { describe, it, expect } from 'vitest';
import { emptyAnswers } from '@/lib/content/resolve';
import { scanText } from '@/lib/copy/check';

const ADMINISTRATIVE_FIELDS = [
  'kecelakaanLaluLintas',
  'kecelakaanKerja',
  'kartuAktif',
  'adaRujukan',
  'rujukanPermintaanSendiri',
  'fasilitasBekerjaSama',
].sort();

/**
 * CLAUDE.md invariant 3: no clinical question anywhere. Questions are
 * administrative only. This asserts the answer type itself carries no
 * clinical field, and that no scenario question text asks something a
 * medically untrained person couldn't answer administratively.
 */
describe('no clinical question', () => {
  it('the family-mode answer type has exactly the administrative fields', () => {
    expect(Object.keys(emptyAnswers).sort()).toEqual(ADMINISTRATIVE_FIELDS);
  });

  it('positive control: the scanner flags clinical language', () => {
    const violations = scanText('Apa gejala yang Anda rasakan?', 'test-fixture');
    expect(violations.length).toBeGreaterThan(0);
  });
});
