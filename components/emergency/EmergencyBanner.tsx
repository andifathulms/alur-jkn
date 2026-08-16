import { EMERGENCY_MESSAGE } from '@/lib/copy/strings';

/**
 * Fixed wording, DESIGN.md §8. Must be first in DOM order on every screen
 * that discusses coverage — CLAUDE.md invariant 1. Never dismissible, never
 * conditional on an answer, never moved below the fold.
 */
export function EmergencyBanner() {
  return (
    <div role="alert" className="bg-care text-paper px-4 py-4 sm:px-6">
      <p className="text-key font-medium max-w-3xl mx-auto">{EMERGENCY_MESSAGE}</p>
    </div>
  );
}
