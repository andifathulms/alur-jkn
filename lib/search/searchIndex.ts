import { scenarios } from '@/data/scenarios';
import { referenceEntries } from '@/data/reference';
import { conditions } from '@/data/conditions';
import { referenceHref } from '@/lib/content/reference';
import { conditionHref } from '@/lib/content/condition';
import { slugify } from '@/lib/content/slugify';

export interface SearchItem {
  contentType: 'scenario' | 'reference' | 'condition';
  title: string;
  snippet: string;
  href: string;
}

/**
 * MIGRATION.md step 6: search across all three content types. Pure — the
 * whole index is derived from already-loaded static data, no fetch, no
 * network (invariant 11). Reference entryList sections contribute one
 * item per *entry*, deep-linked via anchor (step 6: "reference entries
 * are deep-linkable"), not one item for the whole page — searching
 * "kacamata" should land on that entry directly.
 */
export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const scenario of scenarios) {
    items.push({
      contentType: 'scenario',
      title: scenario.title,
      snippet: scenario.explanation,
      href: `/id/petugas/${scenario.id}`,
    });
  }

  for (const reference of referenceEntries) {
    if (reference.format === 'explainer') {
      items.push({
        contentType: 'reference',
        title: reference.title,
        snippet: reference.summary,
        href: referenceHref(reference.slug),
      });
    } else {
      for (const entry of reference.entries) {
        items.push({
          contentType: 'reference',
          title: `${reference.title} — ${entry.term}`,
          snippet: entry.definition,
          href: `${referenceHref(reference.slug)}#${slugify(entry.term)}`,
        });
      }
    }
  }

  for (const condition of conditions) {
    items.push({
      contentType: 'condition',
      title: condition.title,
      snippet: condition.summary,
      href: conditionHref(condition.slug),
    });
  }

  return items;
}

/** Pure: case-insensitive substring match over title + snippet. Local filter, nothing sent anywhere. */
export function searchItems(items: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items.filter((item) => `${item.title} ${item.snippet}`.toLowerCase().includes(q));
}
