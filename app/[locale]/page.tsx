import Link from 'next/link';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { NetworkMap } from '@/components/pathway/NetworkMap';
import { LinkButton } from '@/components/primitives/Button';
import { network } from '@/lib/network/definition';
import { computeFullLayout } from '@/lib/network/layout';

/**
 * DESIGN.md v3 §5, "The home page is the network": "Not a heading, a
 * paragraph, and two cards. The full map, at full width, with the
 * emergency bypass and the off-network exclusions visible. Mode
 * selection sits above it as a small pair of links, not as the entire
 * first screen. A visitor should understand the shape of the referral
 * system before they choose a door."
 */
export default function HomePage() {
  const layout = computeFullLayout(network);

  return (
    <div>
      <EmergencyBanner />
      <div className="px-4 py-8 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-body text-ink/80">
            Alur JKN menjelaskan sistem rujukan dan penjaminan — bukan verdict, bukan kanal resmi BPJS
            Kesehatan.
          </p>
          <nav className="flex gap-3 flex-wrap" aria-label="Pilih mode">
            <LinkButton href="/id/petugas">Mode petugas</LinkButton>
            <LinkButton href="/id/keluarga" size="family">
              Mode keluarga
            </LinkButton>
          </nav>
        </div>

        <NetworkMap network={network} layout={layout} />

        <div className="max-w-3xl mx-auto mt-6">
          <Link href="/id/alur" className="underline underline-offset-4 text-body inline-block">
            Jelajahi posisi Anda di peta →
          </Link>
        </div>
      </div>
    </div>
  );
}
