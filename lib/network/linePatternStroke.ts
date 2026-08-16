import type { LinePattern } from './schema';

/**
 * DESIGN.md §2/§11 — every line pattern must be visually distinct, not
 * just a colour. SVG `stroke-dasharray` per pattern; `undefined` for
 * 'solid' omits the attribute entirely (a plain unbroken stroke).
 */
export function strokeDasharrayFor(pattern: LinePattern): string | undefined {
  switch (pattern) {
    case 'solid':
      return undefined;
    case 'longDash':
      return '16 8';
    case 'dashDot':
      return '12 6 2 6';
    case 'dot':
      return '3 6';
    case 'sparseDash':
      return '1 18';
    default: {
      const _exhaustive: never = pattern;
      return _exhaustive;
    }
  }
}
