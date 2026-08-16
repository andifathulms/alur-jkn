import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { QuestionCard } from '@/components/question/QuestionCard';
import { OutcomeDisplay } from '@/components/state/OutcomeDisplay';
import { RuleCitationList } from '@/components/rules/RuleCitationList';
import { ShareCard } from '@/components/share/ShareCard';
import { StationFragment } from '@/components/pathway/StationFragment';
import { scenarios } from '@/data/scenarios';
import { rulePacks } from '@/data/rules';
import { findRule } from '@/lib/rules/loader';
import { isStale } from '@/lib/rules/schema';
import { scenarioShareText } from '@/lib/copy/shareText';
import { computeFragment } from '@/lib/network/fragment';
import { network } from '@/lib/network/definition';

export function generateStaticParams() {
  return scenarios.map((s) => ({ scenario: s.id }));
}

export default function ScenarioDetailPage({ params }: { params: { scenario: string } }) {
  const scenario = scenarios.find((s) => s.id === params.scenario);
  if (!scenario) notFound();

  const now = new Date();
  const citedRules = scenario.ruleRefs.map((ref) => {
    const rule = findRule(rulePacks, ref.packId, ref.ruleId);
    return { rule, stale: isStale(rule.citation.verifiedAt, now) };
  });

  const shareText = scenarioShareText(
    scenario,
    citedRules.map((c) => c.rule),
  );
  const fragment = computeFragment(network, scenario.position);

  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <Link href="/id/petugas" className="no-print text-caption underline underline-offset-4">
          ← Daftar skenario
        </Link>

        <div className="mt-4">
          <StationFragment fragment={fragment} />
        </div>

        {/* DESIGN.md §5: landscape-friendly, readable across a desk. Two columns at md+
            keep the answer and the question visible together without scrolling. */}
        <div className="grid md:grid-cols-[3fr_2fr] gap-8 mt-4 print:block print:space-y-6">
          <div className="space-y-6">
            <h1 className="text-heading font-medium">{scenario.title}</h1>
            <p className="text-body-lg">{scenario.explanation}</p>
            <OutcomeDisplay outcome={scenario.outcome} />
            <QuestionCard nextAction={scenario.nextAction} questionToAsk={scenario.questionToAsk} />
          </div>

          <div className="space-y-6">
            <ShareCard shareText={shareText} />
            <div>
              <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70 mb-2">
                Dasar aturan
              </h2>
              <RuleCitationList citedRules={citedRules} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
