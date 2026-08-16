import type { Network } from './schema';
import type { Condition } from '@/lib/content/condition';

export interface ConditionHighlight {
  lineIds: Set<string>;
  stationIds: Set<string>;
}

/**
 * DESIGN.md v3 §5, "Condition pages carry their own route": "renders the
 * network with its own path highlighted and everything else dimmed:
 * ... whether the emergency bypass applies, and which out-of-pocket stops
 * are in play for that procedure." Pure — invariant 18, nothing computed
 * in a component.
 *
 * The referral trunk (FKTP → Rumah Sakit → Sub-spesialis) is always
 * highlighted: every condition in this content model reaches the network
 * through it. The care-bypass line and specific self-branch stops
 * highlight only when the condition's own fields say they apply — a
 * condition that names no out-of-pocket stops draws none highlighted,
 * same as it naming no emergency route.
 */
export function computeConditionHighlight(network: Network, condition: Condition): ConditionHighlight {
  const referral = network.lines.find((l) => l.kind === 'referral');
  if (!referral) throw new Error('lib/network/highlightedRoute.ts: network has no referral line');

  const lineIds = new Set<string>([referral.id]);
  const stationIds = new Set<string>(referral.stationIds);

  if (condition.emergencyBypassApplies) {
    const careBypass = network.lines.find((l) => l.kind === 'careBypass');
    if (careBypass) {
      lineIds.add(careBypass.id);
      careBypass.stationIds.forEach((id) => stationIds.add(id));
    }
  }

  if (condition.outOfPocketStops.length > 0) {
    const selfBranch = network.lines.find((l) => l.kind === 'selfBranch');
    if (selfBranch) {
      lineIds.add(selfBranch.id);
      for (const stop of condition.outOfPocketStops) stationIds.add(stop);
    }
  }

  return { lineIds, stationIds };
}
