import type { Outcome } from '@/lib/content/outcome';
import { PayerHandoffBar } from '@/components/handoff/PayerHandoffBar';
import { OUTCOME_LABELS, PASAL_52_INSTRUMENT } from '@/lib/copy/outcomeStrings';

/**
 * DESIGN.md v2 §3 — the three states, dispatched from a scenario's (or
 * later, a condition's) `outcome`. This is the only place in the codebase
 * allowed to route to State B copy, and State B is the only place allowed
 * to say "tidak ditanggung" — always with its article rendered inline.
 */
export function OutcomeDisplay({ outcome }: { outcome: Outcome }) {
  switch (outcome.type) {
    case 'payer':
      return <PayerHandoffBar routing={outcome.routing} />;

    case 'excluded':
      return (
        <div className="space-y-2">
          <div className="h-10 rounded-md border-4 border-ink/20 bg-self bg-[repeating-linear-gradient(-45deg,rgba(247,245,240,0.35)_0,rgba(247,245,240,0.35)_2px,transparent_2px,transparent_8px)]" />
          <p className="text-caption">
            {OUTCOME_LABELS.excludedPrefix}{' '}
            <span className="font-mono">
              {PASAL_52_INSTRUMENT}, {outcome.pasal52Article}
            </span>
            .
          </p>
        </div>
      );

    case 'depends':
      return (
        <div className="space-y-2">
          <div className="h-10 rounded-md border-4 border-ink/20 bg-rule bg-[repeating-linear-gradient(45deg,rgba(31,36,33,0.18)_0,rgba(31,36,33,0.18)_3px,transparent_3px,transparent_11px)]" />
          <p className="text-caption">
            <span className="font-bold">{OUTCOME_LABELS.dependsPrefix}</span> {outcome.question}
          </p>
        </div>
      );

    default: {
      const _exhaustive: never = outcome;
      return _exhaustive;
    }
  }
}
