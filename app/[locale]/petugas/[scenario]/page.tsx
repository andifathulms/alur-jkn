import { notFound } from 'next/navigation';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { QuestionCard } from '@/components/question/QuestionCard';
import { PayerHandoffBar } from '@/components/handoff/PayerHandoffBar';
import { RuleCitationList } from '@/components/rules/RuleCitationList';
import { scenarios } from '@/data/scenarios';
import { rulePacks } from '@/data/rules';
import { findRule } from '@/lib/rules/loader';
import { isStale } from '@/lib/rules/schema';

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

  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <h1 className="text-heading font-medium">{scenario.title}</h1>
        <p className="text-body-lg">{scenario.explanation}</p>

        <PayerHandoffBar routing={scenario.routing} />

        <QuestionCard nextAction={scenario.nextAction} questionToAsk={scenario.questionToAsk} />

        <div>
          <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70 mb-2">Dasar aturan</h2>
          <RuleCitationList citedRules={citedRules} />
        </div>
      </div>
    </div>
  );
}
