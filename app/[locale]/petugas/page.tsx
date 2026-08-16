import Link from 'next/link';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { scenarios } from '@/data/scenarios';

/** DESIGN.md §5: flat scenario list, one tap to the explanation, readable across a desk. */
export default function PetugasPage() {
  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
        <h1 className="text-heading font-medium mb-6">Mode petugas — daftar skenario</h1>
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
    </div>
  );
}
