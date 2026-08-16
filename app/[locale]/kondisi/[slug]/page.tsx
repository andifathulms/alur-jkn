import { notFound } from 'next/navigation';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { ConditionTemplate } from '@/components/condition/ConditionTemplate';
import { conditions, getCondition } from '@/data/conditions';
import { rulePacks } from '@/data/rules';
import { findRule } from '@/lib/rules/loader';
import { isStale } from '@/lib/rules/schema';
import { computeFullLayout } from '@/lib/network/layout';
import { computeConditionHighlight } from '@/lib/network/highlightedRoute';
import { network } from '@/lib/network/definition';

export function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.slug }));
}

export default function ConditionPage({ params }: { params: { slug: string } }) {
  const condition = getCondition(params.slug);
  if (!condition) notFound();

  const now = new Date();
  const citedRules = condition.ruleRefs.map((ref) => {
    const rule = findRule(rulePacks, ref.packId, ref.ruleId);
    return { rule, stale: isStale(rule.citation.verifiedAt, now) };
  });
  const layout = computeFullLayout(network);
  const highlight = computeConditionHighlight(network, condition);

  return (
    <div>
      <EmergencyBanner />
      <ConditionTemplate
        condition={condition}
        citedRules={citedRules}
        network={network}
        layout={layout}
        highlight={highlight}
      />
    </div>
  );
}
