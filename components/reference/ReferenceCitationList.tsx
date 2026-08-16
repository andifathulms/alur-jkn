import type { RuleCitation } from '@/lib/rules/schema';
import { CitationLine } from '@/components/rules/CitationLine';

interface CitedEntry {
  citation: RuleCitation;
  stale: boolean;
}

/** CLAUDE.md invariant 12 — same citation shape and rendering as rule packs, via CitationLine. */
export function ReferenceCitationList({ citations }: { citations: CitedEntry[] }) {
  return (
    <ul className="space-y-3">
      {citations.map(({ citation, stale }) => (
        <CitationLine key={`${citation.instrument}-${citation.article}`} citation={citation} stale={stale} />
      ))}
    </ul>
  );
}
