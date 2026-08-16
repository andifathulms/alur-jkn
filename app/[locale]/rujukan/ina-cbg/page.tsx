import { notFound } from 'next/navigation';
import { InaCbgDiagram } from '@/components/reference/InaCbgDiagram';
import { ReferenceCitationList } from '@/components/reference/ReferenceCitationList';
import { ShareCard } from '@/components/share/ShareCard';
import { getReference } from '@/data/reference';
import { isStale } from '@/lib/rules/schema';
import { referenceShareText } from '@/lib/copy/shareText';

/**
 * MIGRATION.md step 3 — the spine. "This page is the correction the whole
 * product exists to make — give it room": wide measure, one section per
 * screenful, no dense reference-table treatment here (that's the other
 * five sections, step 4). EmergencyBanner and the index rail now come
 * from app/[locale]/rujukan/layout.tsx (step 4) — this page renders only
 * its own content.
 */
export default function InaCbgPage() {
  const entry = getReference('ina-cbg');
  if (!entry || entry.format !== 'explainer') notFound();

  const now = new Date();
  const citedCitations = entry.citations.map((citation) => ({
    citation,
    stale: isStale(citation.verifiedAt, now),
  }));

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-heading font-medium">{entry.title}</h1>
        <p className="text-body-lg mt-3">{entry.summary}</p>
      </div>

      <ShareCard shareText={referenceShareText(entry)} />

      <InaCbgDiagram />

      {entry.sections.map((section) => (
        <div key={section.heading}>
          <h2 className="text-key font-medium">{section.heading}</h2>
          <p className="text-body-lg mt-2">{section.body}</p>
        </div>
      ))}

      <div>
        <h2 className="text-caption font-bold uppercase tracking-wide text-ink/70 mb-2">Dasar aturan</h2>
        <ReferenceCitationList citations={citedCitations} />
      </div>
    </div>
  );
}
