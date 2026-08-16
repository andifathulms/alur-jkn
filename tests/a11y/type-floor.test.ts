import { describe, it, expect } from 'vitest';
import tailwindConfig from '@/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

/** DESIGN.md §4/§7: 16px floor, 18px body minimum. Asserted at the token level — invariant 10. */
describe('type floor', () => {
  const resolved = resolveConfig(tailwindConfig as any);
  const fontSize = resolved.theme.fontSize as Record<string, [string, unknown]>;

  function px(name: string): number {
    const entry = fontSize[name];
    if (!entry) throw new Error(`No fontSize token named "${name}" in tailwind.config.ts`);
    return parseInt(entry[0], 10);
  }

  it('caption is exactly the 16px floor', () => {
    expect(px('caption')).toBe(16);
  });

  it('body meets the 18px minimum', () => {
    expect(px('body')).toBeGreaterThanOrEqual(18);
  });

  it('no custom size token is below the 16px floor', () => {
    for (const name of ['caption', 'body', 'body-lg', 'key', 'heading']) {
      expect(px(name)).toBeGreaterThanOrEqual(16);
    }
  });
});
