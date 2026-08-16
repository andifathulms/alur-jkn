import { describe, it, expect } from 'vitest';
import { referenceEntries, getReference } from '@/data/reference';

/**
 * MIGRATION.md step 3: the INA-CBG page is mechanism-only, no rupiah
 * figures (the generic Rp banned-phrase pattern in no-verdict.test.ts
 * already covers this since reference content is now part of
 * collectContentCopy()) — this asserts the content-model-level shape:
 * every section present, every citation complete.
 */
describe('reference content — INA-CBG', () => {
  const inaCbg = getReference('ina-cbg');

  it('exists and is the spine entry', () => {
    expect(inaCbg).toBeDefined();
    expect(inaCbg?.format).toBe('explainer');
  });

  it('has at least the four MIGRATION.md-required explanatory points', () => {
    expect(inaCbg?.sections.length).toBeGreaterThanOrEqual(4);
    for (const section of inaCbg?.sections ?? []) {
      expect(section.heading.trim().length).toBeGreaterThan(0);
      expect(section.body.trim().length).toBeGreaterThan(0);
    }
  });

  it('carries at least one complete citation', () => {
    expect(inaCbg?.citations.length).toBeGreaterThan(0);
    for (const citation of inaCbg?.citations ?? []) {
      expect(citation.instrument.trim().length).toBeGreaterThan(0);
      expect(citation.article.trim().length).toBeGreaterThan(0);
      expect(citation.sourceUrl.trim().length).toBeGreaterThan(0);
      expect(citation.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('is the only reference entry so far — step 4 adds the other five', () => {
    expect(referenceEntries.map((r) => r.slug)).toEqual(['ina-cbg']);
  });
});
