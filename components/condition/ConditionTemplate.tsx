import Link from 'next/link';
import type { Condition } from '@/lib/content/condition';
import { RuleCitationList } from '@/components/rules/RuleCitationList';
import { ShareCard } from '@/components/share/ShareCard';
import { NetworkMap } from '@/components/pathway/NetworkMap';
import { InaCbgDiagram } from '@/components/reference/InaCbgDiagram';
import { CONDITION_SECTION_LABELS, CONDITION_INA_CBG_LINK_TEXT } from '@/lib/copy/conditionStrings';
import { referenceHref } from '@/lib/content/reference';
import { conditionShareText } from '@/lib/copy/shareText';
import type { Network } from '@/lib/network/schema';
import type { FullLayout } from '@/lib/network/layout';
import type { ConditionHighlight } from '@/lib/network/highlightedRoute';
import type { Rule } from '@/lib/rules/schema';

interface CitedRule {
  rule: Rule;
  stale: boolean;
}

/**
 * PRD.md §5.3 — five fixed sections, always in this order. DESIGN.md v3
 * §7: family-mode column width, fixed labelled blocks, "so a repeat user
 * learns where to look. The route diagram (§5) sits above the five
 * sections." This is the *only* place a condition page is assembled —
 * one template, so the order can't drift page to page.
 *
 * `network`/`layout`/`highlight` are computed by the caller (invariant
 * 18, nothing computed in a component) — same discipline as `citedRules`'
 * `stale` booleans. DESIGN.md v3 §5, "Condition pages carry their own
 * route": the full network renders here with this condition's path
 * highlighted, replacing the plain station fragment other page types use
 * — "the strongest thing this app can show."
 *
 * The INA-CBG link in §3 is hardcoded here, not a per-condition data
 * field (invariant 7) — every condition reaches the spine unconditionally,
 * regardless of what a future condition's data does or doesn't include.
 */
export function ConditionTemplate({
  condition,
  citedRules,
  network,
  layout,
  highlight,
}: {
  condition: Condition;
  citedRules: CitedRule[];
  network: Network;
  layout: FullLayout;
  highlight: ConditionHighlight;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:px-6 space-y-8">
      <div>
        <h1 className="text-heading font-medium">{condition.title}</h1>
        <p className="text-body-lg mt-3">{condition.summary}</p>
      </div>

      <NetworkMap network={network} layout={layout} highlight={highlight} />

      <ShareCard shareText={conditionShareText(condition, citedRules.map((c) => c.rule))} />

      <section className="print:break-inside-avoid">
        <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70">
          {CONDITION_SECTION_LABELS.route}
        </h2>
        <p className="text-body-lg mt-2">{condition.route}</p>
      </section>

      <section className="print:break-inside-avoid">
        <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70">
          {CONDITION_SECTION_LABELS.methodDeterminant}
        </h2>
        <p className="text-body-lg mt-2">{condition.methodDeterminant}</p>
      </section>

      <section className="print:break-inside-avoid">
        <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70">
          {CONDITION_SECTION_LABELS.whyOneOption}
        </h2>
        <p className="text-body-lg mt-2">{condition.whyOneOption}</p>
        <div className="mt-4">
          <InaCbgDiagram
            items={condition.inaCbgPackageItems}
            caption={`Paket INA-CBG untuk ${condition.title.toLowerCase()} — bukan daftar lengkap dan tidak menunjukkan nilai tarif.`}
            ariaLabel={`Diagram satu paket INA-CBG untuk ${condition.title}, berisi: ${condition.inaCbgPackageItems.join(', ')} — dengan tarif paket yang sama untuk semuanya`}
          />
        </div>
        <Link href={referenceHref('ina-cbg')} className="inline-block mt-2 underline underline-offset-4 text-body">
          {CONDITION_INA_CBG_LINK_TEXT} →
        </Link>
      </section>

      <section className="print:break-inside-avoid">
        <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70">
          {CONDITION_SECTION_LABELS.costsThatRemain}
        </h2>
        <p className="text-body-lg mt-2">{condition.costsThatRemain}</p>
      </section>

      <section className="border-2 border-ink rounded-lg p-4 sm:p-6 print:break-inside-avoid">
        <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70">
          {CONDITION_SECTION_LABELS.questionToAsk}
        </h2>
        <p className="text-key font-medium mt-2">{condition.questionToAsk}</p>
      </section>

      <div>
        <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70 mb-2">Dasar aturan</h2>
        <RuleCitationList citedRules={citedRules} />
      </div>
    </div>
  );
}
