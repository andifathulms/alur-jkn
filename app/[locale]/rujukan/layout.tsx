import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { ReferenceRail } from '@/components/reference/ReferenceRail';
import { referenceEntries } from '@/data/reference';

/**
 * DESIGN.md v2 §4: "Six reference pages, all sharing one layout: a
 * scannable index, then entries." EmergencyBanner moves here (out of each
 * individual page) so it's never duplicated and never forgotten on a new
 * section — still first in DOM order on every /rujukan/* screen.
 */
export default function RujukanLayout({ children }: { children: React.ReactNode }) {
  const railItems = referenceEntries.map((r) => ({ slug: r.slug, title: r.title }));

  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 grid md:grid-cols-[240px_1fr] gap-8">
        <ReferenceRail items={railItems} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
