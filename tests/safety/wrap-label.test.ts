import { describe, it, expect } from 'vitest';
import { wrapLabel } from '@/lib/network/wrapLabel';

/**
 * Pure greedy word-wrap for SVG labels — build order step 3's off-network
 * cluster used a single `<text>` line per item regardless of length,
 * which overlapped its neighbours for the real (long) Pasal 52 terms.
 */
describe('wrapLabel', () => {
  it('returns the whole text as one line when it already fits', () => {
    expect(wrapLabel('Pelayanan estetik', 20)).toEqual(['Pelayanan estetik']);
  });

  it('wraps a long label onto multiple lines, never exceeding the max width', () => {
    const lines = wrapLabel('Alat kontrasepsi, kosmetik, dan perbekalan kesehatan rumah tangga', 20);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(20);
  });

  it('never drops or reorders words', () => {
    const text = 'Pengobatan alternatif dan komplementer';
    const lines = wrapLabel(text, 15);
    expect(lines.join(' ')).toBe(text);
  });

  it('a single word longer than the max width still returns as its own line, not truncated', () => {
    expect(wrapLabel('Superkalifragilistikekspialidosius', 10)).toEqual(['Superkalifragilistikekspialidosius']);
  });

  it('returns an empty array for empty input', () => {
    expect(wrapLabel('', 20)).toEqual([]);
  });

  it('collapses repeated whitespace between words', () => {
    expect(wrapLabel('Pelayanan   estetik', 20)).toEqual(['Pelayanan estetik']);
  });
});
