import { RuleCitationList } from '@/components/rules/RuleCitationList';
import { rulePacks } from '@/data/rules';
import { isStale } from '@/lib/rules/schema';

/** PRD.md §6.6: every parameter with its instrument, article, and verification date, browsable independently. */
export default function AturanPage() {
  const now = new Date();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 space-y-10">
      <h1 className="text-heading font-medium">Referensi aturan</h1>
      {rulePacks.map((pack) => (
        <section key={pack.packId}>
          <h2 className="text-key font-medium mb-3">{pack.title}</h2>
          <RuleCitationList
            citedRules={pack.rules.map((rule) => ({ rule, stale: isStale(rule.citation.verifiedAt, now) }))}
          />
        </section>
      ))}
    </div>
  );
}
