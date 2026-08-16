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
});
