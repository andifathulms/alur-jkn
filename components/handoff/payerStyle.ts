import type { Payer } from '@/lib/content/outcome';

/**
 * Colour encodes payer identity only (DESIGN.md §2). Every lane also gets a
 * distinct background pattern so identity never rests on colour alone —
 * invariant 9. Patterns are CSS background-images, not border-style, so they
 * don't collide with the shared border classes callers apply.
 *
 * DESIGN.md v3 §15, "print is a surface": black on white, no colour. Every
 * `bg` here also carries `print:bg-black` — the pattern background-image
 * survives (it's a fixed rgba overlay, not colour-token-driven), so on a
 * printed sheet the lane is still legible by its distinct pattern, same
 * principle as invariant 9 applied to paper instead of a screen.
 */
export function payerClasses(payer: Payer): { bg: string; pattern: string } {
  switch (payer.type) {
    case 'jkn':
      return { bg: 'bg-payer-1 print:bg-black', pattern: '' }; // solid — the default lane
    case 'jasaRaharja':
      return {
        bg: 'bg-payer-2 print:bg-black',
        pattern:
          'bg-[repeating-linear-gradient(45deg,rgba(247,245,240,0.35)_0,rgba(247,245,240,0.35)_4px,transparent_4px,transparent_10px)]',
      };
    case 'jaminanKecelakaanKerja':
      return {
        bg: 'bg-payer-3 print:bg-black',
        pattern:
          'bg-[radial-gradient(rgba(247,245,240,0.45)_1.5px,transparent_1.5px)] bg-[length:8px_8px]',
      };
    case 'self':
      return {
        bg: 'bg-self print:bg-black',
        pattern:
          'bg-[repeating-linear-gradient(-45deg,rgba(247,245,240,0.35)_0,rgba(247,245,240,0.35)_2px,transparent_2px,transparent_8px)]',
      };
    default: {
      const _exhaustive: never = payer;
      return _exhaustive;
    }
  }
}
