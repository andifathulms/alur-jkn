import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { StationFragment } from '@/components/pathway/StationFragment';
import { computeFragment } from '@/lib/network/fragment';
import { network } from '@/lib/network/definition';

/**
 * DESIGN.md v3 §11: "The map has a text equivalent. Every diagram is
 * aria-hidden and accompanied by a sr-only ordered list of its stations,
 * branches and the current position. A diagram without a text path is not
 * finished." Build order step 2.
 */
describe('StationFragment', () => {
  it('the SVG is aria-hidden, and a sr-only ordered list stands in for it', () => {
    const fragment = computeFragment(network, { type: 'station', stationId: 'fktp' });
    const { container } = render(<StationFragment fragment={fragment} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    const list = container.querySelector('ol.sr-only');
    expect(list).not.toBeNull();
    expect(list?.textContent).toContain('FKTP');
  });

  it('the sr-only list marks the current position in words', () => {
    const fragment = computeFragment(network, { type: 'station', stationId: 'rumahSakit' });
    const { container } = render(<StationFragment fragment={fragment} />);
    expect(container.querySelector('ol.sr-only')?.textContent).toContain('posisi Anda saat ini');
  });

  it('an off-network position renders its article and is not part of a line', () => {
    const [firstItem] = network.offNetwork;
    if (!firstItem) throw new Error('expected at least one off-network item');
    const fragment = computeFragment(network, { type: 'offNetwork', itemId: firstItem.id });
    const { container, getAllByText } = render(<StationFragment fragment={fragment} />);
    expect(getAllByText(new RegExp(firstItem.article)).length).toBeGreaterThan(0);
    expect(container.querySelector('ol.sr-only')?.textContent).toContain('tidak terhubung');
  });

  it('has no axe violations for a station position, an interchange position, and an off-network position', async () => {
    const stationFragment = computeFragment(network, { type: 'station', stationId: 'fktp' });
    const interchangeFragment = computeFragment(network, { type: 'station', stationId: 'rumahSakit' });
    const [firstItem] = network.offNetwork;
    if (!firstItem) throw new Error('expected at least one off-network item');
    const offNetworkFragment = computeFragment(network, { type: 'offNetwork', itemId: firstItem.id });

    for (const fragment of [stationFragment, interchangeFragment, offNetworkFragment]) {
      const { container } = render(<StationFragment fragment={fragment} />);
      expect(await axe(container)).toHaveNoViolations();
    }
  });

  it('uses only the token colour tokens via CSS variables — never a raw hex literal', () => {
    const fragment = computeFragment(network, { type: 'station', stationId: 'rumahSakit' });
    const { container } = render(<StationFragment fragment={fragment} />);
    const svg = container.querySelector('svg');
    expect(svg?.innerHTML).not.toMatch(/#[0-9A-Fa-f]{3,6}\b/);
    expect(svg?.innerHTML).toMatch(/var\(--color-/);
  });

  it('a single-station segment centres its station rather than starting flush against the left margin', () => {
    // rumahSakit is an interchange: its careBypass segment has exactly one
    // station. Left-aligned at the old fixed x, a wide centred label (e.g.
    // "Rumah Sakit") would extend past the viewBox's left edge and clip —
    // this asserts the circle sits at the segment's horizontal centre.
    const fragment = computeFragment(network, { type: 'station', stationId: 'rumahSakit' });
    if (fragment.type !== 'network') throw new Error('expected a network fragment');
    const careBypassSegment = fragment.segments.find((s) => s.stations.length === 1);
    if (!careBypassSegment) throw new Error('expected a single-station segment (the emergency bypass)');

    const { container } = render(<StationFragment fragment={fragment} />);
    const svg = container.querySelector('svg');
    const viewBoxWidth = Number(svg?.getAttribute('viewBox')?.split(' ')[2]);
    const circles = Array.from(container.querySelectorAll('circle'));
    // The single-station segment's circle should sit at the horizontal midpoint of the viewBox.
    const centred = circles.some((c) => Math.abs(Number(c.getAttribute('cx')) - viewBoxWidth / 2) < 0.01);
    expect(centred).toBe(true);
  });

  it('an off-network marker is a legible dashed ring, not a tiny fuzzy dot', () => {
    // The old r=6 circle compressed its dasharray into something that read
    // as a loading spinner rather than "disconnected from the network."
    const [firstItem] = network.offNetwork;
    if (!firstItem) throw new Error('expected at least one off-network item');
    const fragment = computeFragment(network, { type: 'offNetwork', itemId: firstItem.id });
    const { container } = render(<StationFragment fragment={fragment} />);
    const circle = container.querySelector('circle');
    expect(Number(circle?.getAttribute('r'))).toBeGreaterThanOrEqual(10);
    expect(circle?.getAttribute('stroke-dasharray')).toBeTruthy();
  });

  it('a long off-network label wraps rather than overflowing the fixed 200-unit viewBox width', () => {
    const longest = [...network.offNetwork].sort((a, b) => b.label.length - a.label.length)[0];
    if (!longest) throw new Error('expected at least one off-network item');
    const fragment = computeFragment(network, { type: 'offNetwork', itemId: longest.id });
    const { container } = render(<StationFragment fragment={fragment} />);
    const tspans = container.querySelectorAll('svg text tspan');
    expect(tspans.length).toBeGreaterThan(0);
    for (const tspan of Array.from(tspans)) {
      // Each wrapped line stays well within the 200-unit viewBox — a
      // generous per-character estimate is enough to catch an unwrapped
      // full-length label, which would run to 300px+.
      expect((tspan.textContent ?? '').length * 7).toBeLessThan(200);
    }
  });
});
