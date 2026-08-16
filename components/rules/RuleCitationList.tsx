import type { Rule } from '@/lib/rules/schema';
import { CitationLine } from './CitationLine';

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
        <CitationLine key={rule.id} citation={rule.citation} stale={stale} />
      ))}
    </ul>
  );
}
