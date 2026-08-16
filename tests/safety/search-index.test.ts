import { describe, it, expect } from 'vitest';
import { buildSearchIndex, searchItems } from '@/lib/search/searchIndex';
import { scenarios } from '@/data/scenarios';
import { referenceEntries } from '@/data/reference';
import { conditions } from '@/data/conditions';

/** MIGRATION.md step 6: search across all three content types. */
describe('search index', () => {
  const index = buildSearchIndex();

  it('covers all three content types', () => {
    const types = new Set(index.map((i) => i.contentType));
    expect(types).toEqual(new Set(['scenario', 'reference', 'condition']));
  });

  it('has one item per scenario', () => {
    const scenarioItems = index.filter((i) => i.contentType === 'scenario');
    expect(scenarioItems).toHaveLength(scenarios.length);
  });

  it('has one item per condition', () => {
    const conditionItems = index.filter((i) => i.contentType === 'condition');
    expect(conditionItems).toHaveLength(conditions.length);
  });

  it('has one item per reference entry (deep-linked), not one per section', () => {
    const referenceItems = index.filter((i) => i.contentType === 'reference');
    const expectedCount = referenceEntries.reduce(
      (sum, r) => sum + (r.format === 'explainer' ? 1 : r.entries.length),
      0,
    );
    expect(referenceItems).toHaveLength(expectedCount);
  });

  it('every entryList reference item is deep-linked via a #anchor', () => {
    const pengecualianItems = index.filter((i) => i.title.startsWith('Pengecualian'));
    expect(pengecualianItems.length).toBeGreaterThan(0);
    for (const item of pengecualianItems) {
      expect(item.href).toContain('#');
    }
  });

  it('the explainer reference item is not anchor-linked (it is the whole page)', () => {
    const inaCbgItem = index.find((i) => i.href === '/id/rujukan/ina-cbg');
    expect(inaCbgItem).toBeDefined();
  });

  it('searchItems matches by title or snippet, case-insensitively', () => {
    const results = searchItems(index, 'KACAMATA');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => `${r.title} ${r.snippet}`.toLowerCase().includes('kacamata'))).toBe(true);
  });

  it('searchItems returns nothing for an empty query', () => {
    expect(searchItems(index, '')).toEqual([]);
    expect(searchItems(index, '   ')).toEqual([]);
  });

  it('searchItems returns nothing for a query matching no content', () => {
    expect(searchItems(index, 'zzz-tidak-ada-kata-ini')).toEqual([]);
  });

  it('finds a condition by its own text', () => {
    const results = searchItems(index, 'apendektomi');
    expect(results.some((r) => r.contentType === 'condition')).toBe(true);
  });
});
