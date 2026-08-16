import Link from 'next/link';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { StationFragment } from '@/components/pathway/StationFragment';
import { scenarios } from '@/data/scenarios';
import { referenceEntries } from '@/data/reference';
import { referenceHref } from '@/lib/content/reference';
import { computeFragment } from '@/lib/network/fragment';
import { network } from '@/lib/network/definition';

/**
 * DESIGN.md v2 §7: "Staff mode. Flat scenario list plus the reference
 * index. Landscape-friendly, desk-readable, optimised for speed."
 * MIGRATION.md step 6 — the reference index lives alongside the scenario
 * list, not behind a separate click.
 */
export default function PetugasPage() {
  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <StationFragment fragment={computeFragment(network, null)} />
        <h1 className="text-heading font-medium mb-6 mt-4">Mode petugas</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-key font-medium mb-3">Skenario</h2>
            <ul className="divide-y divide-rule border border-rule rounded-md">
              {scenarios.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/id/petugas/${s.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-4 min-h-[48px] hover:bg-ink/5"
                  >
                    <span className="text-body-lg">{s.title}</span>
                    <span aria-hidden className="text-ink/50">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-key font-medium mb-3">Referensi JKN</h2>
            <ul className="divide-y divide-rule border border-rule rounded-md">
              {referenceEntries.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={referenceHref(r.slug)}
                    className="flex items-center justify-between gap-4 px-4 py-4 min-h-[48px] hover:bg-ink/5"
                  >
                    <span className="text-body-lg">{r.title}</span>
                    <span aria-hidden className="text-ink/50">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
