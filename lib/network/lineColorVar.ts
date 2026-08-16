import type { LineColorToken } from './schema';

/** Maps a line's colour token to the CSS custom property in app/globals.css — never a raw hex literal. */
export function colorVarFor(token: LineColorToken): string {
  return `var(--color-${token})`;
}
