import type { PayerRouting } from '@/lib/content/outcome';
import { payerClasses } from './payerStyle';

/**
 * DESIGN.md §6: the payer handoff — makes "someone pays first, then JKN"
 * (PRD.md §2.3) visible rather than asserted. No numeric claim distorts the
 * split, so segments render equal width; only the labels carry the limit.
 * `prefers-reduced-motion` in globals.css collapses --dur-draw to instant.
 */
export function PayerHandoffBar({ routing }: { routing: PayerRouting }) {
  if (routing.type === 'single') {
    const { bg, pattern } = payerClasses(routing.payer);
    return (
      <div className="space-y-2">
        <div className={`h-10 rounded-md border-4 border-ink/20 ${bg} ${pattern}`} />
        <p className="text-caption">{routing.payer.label}</p>
      </div>
    );
  }

  const primary = payerClasses(routing.primary);
  const next = payerClasses(routing.continuesWith);

  return (
    <div className="space-y-2">
      <div className="flex h-10 rounded-md overflow-hidden border-4 border-ink/20">
        <div className={`w-1/2 ${primary.bg} ${primary.pattern} transition-[width] duration-draw ease-alur`} />
        <div className={`w-1/2 ${next.bg} ${next.pattern} transition-[width] duration-draw ease-alur`} />
      </div>
      <p className="text-caption">
        <strong>{routing.primary.label}</strong> {routing.primaryLimitNote}, lalu{' '}
        <strong>{routing.continuesWith.label}</strong> melanjutkan.
      </p>
    </div>
  );
}
