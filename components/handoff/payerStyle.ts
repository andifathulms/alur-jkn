import type { Payer } from '@/lib/scenario/schema';

/**
 * Colour encodes payer identity only (DESIGN.md §2). Every lane also gets a
 * distinct background pattern so identity never rests on colour alone —
 * invariant 9. Patterns are CSS background-images, not border-style, so they
 * don't collide with the shared border classes callers apply.
 */
export function payerClasses(payer: Payer): { bg: string; pattern: string } {
  switch (payer.type) {
    case 'jkn':
      return { bg: 'bg-payer-1', pattern: '' }; // solid — the default lane
    case 'jasaRaharja':
      return {
        bg: 'bg-payer-2',
        pattern:
          'bg-[repeating-linear-gradient(45deg,rgba(247,245,240,0.35)_0,rgba(247,245,240,0.35)_4px,transparent_4px,transparent_10px)]',
      };
    case 'jaminanKecelakaanKerja':
      return {
        bg: 'bg-payer-3',
        pattern:
          'bg-[radial-gradient(rgba(247,245,240,0.45)_1.5px,transparent_1.5px)] bg-[length:8px_8px]',
      };
    case 'self':
      return {
        bg: 'bg-self',
        pattern:
          'bg-[repeating-linear-gradient(-45deg,rgba(247,245,240,0.35)_0,rgba(247,245,240,0.35)_2px,transparent_2px,transparent_8px)]',
      };
    default: {
      const _exhaustive: never = payer;
      return _exhaustive;
    }
  }
}
