import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { SearchBox } from '@/components/search/SearchBox';
import { StationFragment } from '@/components/pathway/StationFragment';
import { buildSearchIndex } from '@/lib/search/searchIndex';
import { computeFragment } from '@/lib/network/fragment';
import { network } from '@/lib/network/definition';

/** MIGRATION.md step 6: search across all three content types. */
export default function CariPage() {
  const items = buildSearchIndex();
  const fragment = computeFragment(network, null);

  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6">
        <StationFragment fragment={fragment} />
        <h1 className="text-heading font-medium mb-6 mt-4">Cari</h1>
        <SearchBox items={items} />
      </div>
    </div>
  );
}
