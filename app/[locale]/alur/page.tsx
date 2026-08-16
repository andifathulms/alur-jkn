import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { NetworkMap } from '@/components/pathway/NetworkMap';
import { PathwayExplorer } from '@/components/pathway/PathwayExplorer';
import { network } from '@/lib/network/definition';
import { computeFullLayout } from '@/lib/network/layout';

/** DESIGN.md §3: the signature view — the referral system as a transit map. */
export default function AlurPage() {
  const layout = computeFullLayout(network);

  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 space-y-6">
        <h1 className="text-heading font-medium">Peta alur rujukan</h1>
        <p className="text-body-lg">
          Satu jalur berjalan dari FKTP ke rumah sakit, lalu ke sub-spesialis bila diperlukan. Jalur gawat
          darurat masuk langsung ke rumah sakit, melewati FKTP.
        </p>
        <NetworkMap network={network} layout={layout} />
        <PathwayExplorer />
      </div>
    </div>
  );
}
