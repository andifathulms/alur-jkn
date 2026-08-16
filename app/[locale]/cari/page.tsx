import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { SearchBox } from '@/components/search/SearchBox';
import { buildSearchIndex } from '@/lib/search/searchIndex';

/** MIGRATION.md step 6: search across all three content types. */
export default function CariPage() {
  const items = buildSearchIndex();

  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6">
        <h1 className="text-heading font-medium mb-6">Cari</h1>
        <SearchBox items={items} />
      </div>
    </div>
  );
}
