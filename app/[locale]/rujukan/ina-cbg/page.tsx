import { notFound } from 'next/navigation';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { InaCbgDiagram } from '@/components/reference/InaCbgDiagram';
import { ReferenceCitationList } from '@/components/reference/ReferenceCitationList';
import { getReference } from '@/data/reference';
import { isStale } from '@/lib/rules/schema';

/**
 * MIGRATION.md step 3 — the spine. "This page is the correction the whole
 * product exists to make — give it room": wide measure, one section per
 * screenful, no dense reference-table treatment here (that's the other
 * five sections, step 4).
 */
export default function InaCbgPage() {
  const entry = getReference('ina-cbg');
  if (!entry) notFound();

  const now = new Date();
  const citedCitations = entry.citations.map((citation) => ({
    citation,
    stale: isStale(citation.verifiedAt, now),
  }));

  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 space-y-10">
        <div>
          <h1 className="text-heading font-medium">{entry.title}</h1>
          <p className="text-body-lg mt-3">{entry.summary}</p>
        </div>

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
    </div>
  );
}
