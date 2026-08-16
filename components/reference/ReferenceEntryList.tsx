import type { ReferenceEntry } from '@/lib/content/reference';
import { CitationLine } from '@/components/rules/CitationLine';
import { slugify } from '@/lib/content/slugify';

interface DisplayEntry {
  entry: ReferenceEntry;
  stale: boolean;
}

/**
 * DESIGN.md v2 §4 "entry shape": term, one-line definition, the detail,
 * the citation line. Rendered as a stacked card list rather than a
 * `<table>` — DESIGN.md says tables are *allowed* here, not required, and
 * a card list satisfies the same section's 200%-zoom/reflow requirement
 * trivially since it's never a wide row to begin with. Each entry carries
 * an anchor id (MIGRATION.md step 6: "reference entries are
 * deep-linkable") so search results and other pages can link straight to
 * it, not just to the section.
 */
export function ReferenceEntryList({ entries }: { entries: DisplayEntry[] }) {
  return (
    <ul className="space-y-6">
      {entries.map(({ entry, stale }) => (
        <li
          key={entry.term}
          id={slugify(entry.term)}
          className="border-b border-rule pb-6 last:border-none last:pb-0 scroll-mt-4"
        >
          <h3 className="text-key font-medium">{entry.term}</h3>
          <p className="text-body-lg mt-1">{entry.definition}</p>
          <p className="text-body mt-2 text-ink/85">{entry.detail}</p>
          <ul className="mt-3">
            <CitationLine citation={entry.citation} stale={stale} />
          </ul>
        </li>
      ))}
    </ul>
  );
}
