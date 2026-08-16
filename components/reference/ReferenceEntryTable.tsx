import type { ReferenceEntry } from '@/lib/content/reference';
import { CitationLine } from '@/components/rules/CitationLine';
import { slugify } from '@/lib/content/slugify';

interface DisplayEntry {
  entry: ReferenceEntry;
  stale: boolean;
}

/**
 * DESIGN.md v3 §4, "Tables — specified": a real `<table>` for the two
 * entryList references that are genuinely tabular (alat-kesehatan, kelas),
 * not a grid of divs. Semantic caption/thead/th-scope, hairline `--rule`
 * separators, no zebra striping. No numeric column exists in the current
 * content (ceilings and intervals are stated in prose, not as figures —
 * CLAUDE.md invariant 9 forbids rupiah figures anyway), so the
 * tabular-nums/right-align rule has nothing to apply to yet; it applies
 * automatically to any numeric column added later via `font-mono`.
 *
 * Reflows to stacked rows below the `md` breakpoint and at 200% zoom
 * (which shrinks the effective viewport the same way): the header row
 * hides, each cell becomes a block with its own visible column label, and
 * the citation moves from a table cell to sitting under the row.
 */
export function ReferenceEntryTable({ entries, caption }: { entries: DisplayEntry[]; caption: string }) {
  return (
    <table className="w-full block md:table border-collapse">
      <caption className="text-left text-body text-ink/70 mb-3 block md:table-caption md:caption-top">
        {caption}
      </caption>
      <thead className="hidden md:table-header-group">
        <tr className="border-b-2 border-rule">
          <th scope="col" className="text-left text-caption font-bold uppercase tracking-wide py-3 pr-4">
            Item
          </th>
          <th scope="col" className="text-left text-caption font-bold uppercase tracking-wide py-3 pr-4">
            Ketentuan
          </th>
          <th scope="col" className="text-left text-caption font-bold uppercase tracking-wide py-3">
            Detail
          </th>
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {entries.map(({ entry, stale }) => (
          <tr
            key={entry.term}
            id={slugify(entry.term)}
            className="block md:table-row border-b border-rule py-4 md:py-0 scroll-mt-4"
          >
            <th
              scope="row"
              className="block md:table-cell text-left font-medium text-key md:text-body-lg align-top py-1 md:py-3 md:pr-4 md:min-h-target"
            >
              {entry.term}
            </th>
            <td className="block md:table-cell align-top py-1 md:py-3 md:pr-4">
              <span aria-hidden className="md:hidden text-caption font-bold uppercase tracking-wide text-ink/70 block">
                Ketentuan
              </span>
              <span className="text-body">{entry.definition}</span>
            </td>
            <td className="block md:table-cell align-top py-1 md:py-3">
              <span aria-hidden className="md:hidden text-caption font-bold uppercase tracking-wide text-ink/70 block">
                Detail
              </span>
              <span className="text-body">{entry.detail}</span>
              <ul className="mt-2 mb-3 md:mb-3">
                <CitationLine citation={entry.citation} stale={stale} />
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
