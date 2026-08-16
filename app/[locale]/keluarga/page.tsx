import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { FamilyWizard } from './FamilyWizard';

/** DESIGN.md §5: family mode — one question per screen, generous spacing, no progress pressure. */
export default function KeluargaPage() {
  return (
    <div>
      <EmergencyBanner />
      <FamilyWizard />
    </div>
  );
}
