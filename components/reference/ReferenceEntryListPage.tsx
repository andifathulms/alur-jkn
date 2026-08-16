import { notFound } from 'next/navigation';
import { ReferenceEntryList } from '@/components/reference/ReferenceEntryList';
import { ReferenceEntryTable } from '@/components/reference/ReferenceEntryTable';
import { ShareCard } from '@/components/share/ShareCard';
import { StationFragment } from '@/components/pathway/StationFragment';
import { getReference } from '@/data/reference';
import { isStale } from '@/lib/rules/schema';
import { referenceShareText } from '@/lib/copy/shareText';
import { computeFragment } from '@/lib/network/fragment';
import { network } from '@/lib/network/definition';

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
  const fragment = computeFragment(network, entry.position);

  return (
    <div className="space-y-8">
      <StationFragment fragment={fragment} />
      <div>
        <h1 className="text-heading font-medium">{entry.title}</h1>
        <p className="text-body-lg mt-3">{entry.summary}</p>
      </div>
      <ShareCard shareText={referenceShareText(entry)} />
      {entry.tabular ? (
        <ReferenceEntryTable entries={displayEntries} caption={`Rincian ${entry.title.toLowerCase()}`} />
      ) : (
        <ReferenceEntryList entries={displayEntries} />
      )}
    </div>
  );
}
