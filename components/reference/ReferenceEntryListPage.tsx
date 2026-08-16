import { notFound } from 'next/navigation';
import { ReferenceEntryList } from '@/components/reference/ReferenceEntryList';
import { ShareCard } from '@/components/share/ShareCard';
import { getReference } from '@/data/reference';
import { isStale } from '@/lib/rules/schema';
import { referenceShareText } from '@/lib/copy/shareText';

/**
 * The shared body for every entryList reference page (pengecualian, poli,
 * alat-kesehatan, obat, kelas) — one place, so all five stay structurally
 * identical instead of five hand-copied page files drifting apart.
 */
export function ReferenceEntryListPage({ slug }: { slug: string }) {
  const entry = getReference(slug);
  if (!entry || entry.format !== 'entryList') notFound();

  const now = new Date();
  const displayEntries = entry.entries.map((item) => ({
    entry: item,
    stale: isStale(item.citation.verifiedAt, now),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading font-medium">{entry.title}</h1>
        <p className="text-body-lg mt-3">{entry.summary}</p>
      </div>
      <ShareCard shareText={referenceShareText(entry)} />
      <ReferenceEntryList entries={displayEntries} />
    </div>
  );
}
