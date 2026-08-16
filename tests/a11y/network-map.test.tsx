import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { NetworkMap } from '@/components/pathway/NetworkMap';
import { network } from '@/lib/network/definition';
import { computeFullLayout } from '@/lib/network/layout';

/** DESIGN.md v3 §5, "The home page is the network." Build order step 3. */
describe('NetworkMap', () => {
  const layout = computeFullLayout(network);

  it('has no axe violations', async () => {
    const { container } = render(<NetworkMap network={network} layout={layout} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('the SVG is aria-hidden', () => {
    const { container } = render(<NetworkMap network={network} layout={layout} />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('the sr-only text equivalent lists every line and every off-network item', () => {
    const { container } = render(<NetworkMap network={network} layout={layout} />);
    const text = container.querySelector('ol.sr-only')?.textContent ?? '';
    for (const line of network.lines) {
      expect(text).toContain(line.label);
    }
    for (const item of network.offNetwork) {
      expect(text).toContain(item.label);
      expect(text).toContain(item.article);
    }
  });

  it('every station and every off-network item is drawn', () => {
    const { container } = render(<NetworkMap network={network} layout={layout} />);
    const circles = container.querySelectorAll('svg circle');
    expect(circles.length).toBe(network.stations.length + network.offNetwork.length);
  });

  it('the interchange (self-branch hub) renders larger than the other stations', () => {
    const { container } = render(<NetworkMap network={network} layout={layout} />);
    const selfBranch = network.lines.find((l) => l.kind === 'selfBranch');
    if (selfBranch?.kind !== 'selfBranch') throw new Error('expected selfBranch line');
    const hub = layout.stationPositions[selfBranch.branchesFromStationId];
    if (!hub) throw new Error('missing hub position');
    const circles = Array.from(container.querySelectorAll('svg circle'));
    const hubCircle = circles.find((c) => c.getAttribute('cx') === String(hub.x) && c.getAttribute('cy') === String(hub.y));
    const otherStationCircle = circles.find((c) => c !== hubCircle && c.getAttribute('stroke') === 'var(--color-ink)');
    expect(Number(hubCircle?.getAttribute('r'))).toBeGreaterThan(Number(otherStationCircle?.getAttribute('r')));
  });

  it('never renders a raw hex literal — every colour is a CSS custom property', () => {
    const { container } = render(<NetworkMap network={network} layout={layout} />);
    const svg = container.querySelector('svg');
    expect(svg?.innerHTML).not.toMatch(/#[0-9A-Fa-f]{3,6}\b/);
  });

  it('off-network items are drawn with a dashed/dotted stroke, distinct from solid station circles', () => {
    const { container } = render(<NetworkMap network={network} layout={layout} />);
    const [firstItem] = network.offNetwork;
    if (!firstItem) throw new Error('expected at least one off-network item');
    const point = layout.offNetworkPositions[firstItem.id];
    if (!point) throw new Error('missing off-network position');
    const circles = Array.from(container.querySelectorAll('svg circle'));
    const offNetworkCircle = circles.find(
      (c) => c.getAttribute('cx') === String(point.x) && c.getAttribute('cy') === String(point.y),
    );
    expect(offNetworkCircle?.getAttribute('stroke-dasharray')).toBeTruthy();
  });

  describe('with a highlight (DESIGN.md v3 §5, condition route diagrams — build order step 8)', () => {
    it('without a highlight, every line and station renders at full opacity', async () => {
      const { container } = render(<NetworkMap network={network} layout={layout} />);
      for (const el of container.querySelectorAll('svg path, svg g')) {
        expect(el.getAttribute('opacity')).not.toBe('0.25');
      }
      expect(await axe(container)).toHaveNoViolations();
    });

    it('a line/station not named in the highlight dims; a named one stays at full opacity', async () => {
      const referral = network.lines.find((l) => l.kind === 'referral')!;
      const highlight = { lineIds: new Set([referral.id]), stationIds: new Set(referral.stationIds) };
      const { container } = render(<NetworkMap network={network} layout={layout} highlight={highlight} />);

      const careBypass = network.lines.find((l) => l.kind === 'careBypass')!;
      const paths = Array.from(container.querySelectorAll('svg path'));
      // the care-bypass path is the shortest — a single "M x y L x y" vertical segment.
      const dimmedPath = paths.find((p) => p.getAttribute('opacity') === '0.25');
      expect(dimmedPath).toBeDefined();

      const referralPath = paths.find((p) =>
        referral.stationIds.every((id) => p.getAttribute('d')?.includes(String(layout.stationPositions[id]?.x))),
      );
      expect(referralPath?.getAttribute('opacity')).not.toBe('0.25');

      expect(careBypass.id).not.toBe(referral.id); // sanity: distinct lines
      expect(await axe(container)).toHaveNoViolations();
    });

    it('the off-network cluster dims whenever a highlight is present, regardless of its contents', () => {
      const highlight = { lineIds: new Set<string>(), stationIds: new Set<string>() };
      const { container } = render(<NetworkMap network={network} layout={layout} highlight={highlight} />);
      const [firstItem] = network.offNetwork;
      if (!firstItem) throw new Error('expected at least one off-network item');
      const point = layout.offNetworkPositions[firstItem.id];
      const group = Array.from(container.querySelectorAll('svg g')).find((g) =>
        g.querySelector(`circle[cx="${point?.x}"][cy="${point?.y}"]`),
      );
      expect(group?.getAttribute('opacity')).toBe('0.25');
    });
  });
});
