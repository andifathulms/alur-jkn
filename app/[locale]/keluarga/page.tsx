import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { FamilyWizard } from './FamilyWizard';
import { network } from '@/lib/network/definition';

/** DESIGN.md §5: family mode — one question per screen, generous spacing, no progress pressure. */
export default function KeluargaPage() {
  return (
    <div>
      <EmergencyBanner />
      <FamilyWizard network={network} />
    </div>
  );
}
