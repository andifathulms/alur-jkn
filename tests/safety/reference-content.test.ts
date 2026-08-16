import { describe, it, expect } from 'vitest';
import { referenceEntries, getReference } from '@/data/reference';

const ALL_SLUGS = ['ina-cbg', 'pengecualian', 'poli', 'alat-kesehatan', 'obat', 'kelas'];

function expectCompleteCitation(citation: { instrument: string; article: string; sourceUrl: string; verifiedAt: string }) {
  expect(citation.instrument.trim().length).toBeGreaterThan(0);
  expect(citation.article.trim().length).toBeGreaterThan(0);
  expect(citation.sourceUrl.trim().length).toBeGreaterThan(0);
  expect(citation.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
}

describe('reference content', () => {
  it('has all six sections — INA-CBG (step 3) plus the five from step 4', () => {
    expect(referenceEntries.map((r) => r.slug).sort()).toEqual([...ALL_SLUGS].sort());
  });

  describe('INA-CBG (explainer)', () => {
    const inaCbg = getReference('ina-cbg');

    it('exists and is the spine entry', () => {
      expect(inaCbg).toBeDefined();
      expect(inaCbg?.format).toBe('explainer');
    });

    it('has at least the four MIGRATION.md-required explanatory points', () => {
      if (inaCbg?.format !== 'explainer') throw new Error('expected explainer format');
      expect(inaCbg.sections.length).toBeGreaterThanOrEqual(4);
      for (const section of inaCbg.sections) {
        expect(section.heading.trim().length).toBeGreaterThan(0);
        expect(section.body.trim().length).toBeGreaterThan(0);
      }
    });

    it('carries at least one complete citation', () => {
      if (inaCbg?.format !== 'explainer') throw new Error('expected explainer format');
      expect(inaCbg.citations.length).toBeGreaterThan(0);
      inaCbg.citations.forEach(expectCompleteCitation);
    });
  });

  describe.each(['pengecualian', 'poli', 'alat-kesehatan', 'obat', 'kelas'])('%s (entryList)', (slug) => {
    const entry = getReference(slug);

    it('exists and is an entryList', () => {
      expect(entry).toBeDefined();
      expect(entry?.format).toBe('entryList');
    });

    it('has at least one complete entry', () => {
      if (entry?.format !== 'entryList') throw new Error('expected entryList format');
      expect(entry.entries.length).toBeGreaterThan(0);
      for (const item of entry.entries) {
        expect(item.term.trim().length).toBeGreaterThan(0);
        expect(item.definition.trim().length).toBeGreaterThan(0);
        expect(item.detail.trim().length).toBeGreaterThan(0);
        expectCompleteCitation(item.citation);
      }
    });
  });

  it('pengecualian is the only entryList section whose entries cite Pasal 52', () => {
    const nonPengecualianSlugs = ['poli', 'alat-kesehatan', 'obat', 'kelas'];
    for (const slug of nonPengecualianSlugs) {
      const entry = getReference(slug);
      if (entry?.format !== 'entryList') throw new Error('expected entryList format');
      for (const item of entry.entries) {
        expect(item.citation.article).not.toBe('Pasal 52');
      }
    }
  });
});
