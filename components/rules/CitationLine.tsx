import type { RuleCitation } from '@/lib/rules/schema';
import { STALENESS_WARNING } from '@/lib/copy/strings';

/**
 * CLAUDE.md invariant 12: every rule and reference entry carries
 * instrument, article, source, and verification date. `stale` is computed
 * by the caller (a server component/page) so this stays presentational —
 * invariant 15. Shared by RuleCitationList and the reference layer's
 * citation lists so there's one rendering of "what a citation looks like."
 */
export function CitationLine({ citation, stale }: { citation: RuleCitation; stale: boolean }) {
  return (
    <li className="border border-rule rounded-md p-3">
      <p className="font-mono text-caption text-ink/80">
        {citation.instrument}, {citation.article}
      </p>
      <p className="text-caption text-ink/70 mt-1">
        Diverifikasi {citation.verifiedAt} ·{' '}
        <a href={citation.sourceUrl} className="underline" target="_blank" rel="noreferrer">
          sumber
        </a>
      </p>
      {stale && (
        <p className="text-caption text-ink mt-1 font-bold underline decoration-2">{STALENESS_WARNING}</p>
      )}
    </li>
  );
}
