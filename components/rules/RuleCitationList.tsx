import type { Rule } from '@/lib/rules/schema';
import { STALENESS_WARNING } from '@/lib/copy/strings';

interface CitedRule {
  rule: Rule;
  stale: boolean;
}

/**
 * CLAUDE.md invariant 6/7: every rule shown carries instrument, article,
 * source, and verification date. `stale` is computed by the caller (a
 * server component/page) so this stays a pure presentational component —
 * invariant 15.
 */
export function RuleCitationList({ citedRules }: { citedRules: CitedRule[] }) {
  return (
    <ul className="space-y-3">
      {citedRules.map(({ rule, stale }) => (
        <li key={rule.id} className="border border-rule rounded-md p-3">
          <p className="font-mono text-caption text-ink/80">
            {rule.citation.instrument}, {rule.citation.article}
          </p>
          <p className="text-caption text-ink/60 mt-1">
            Diverifikasi {rule.citation.verifiedAt} ·{' '}
            <a href={rule.citation.sourceUrl} className="underline" target="_blank" rel="noreferrer">
              sumber
            </a>
          </p>
          {stale && (
            <p className="text-caption text-ink mt-1 font-bold underline decoration-2">
              {STALENESS_WARNING}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
