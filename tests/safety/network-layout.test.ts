import { describe, it, expect } from 'vitest';
import { network } from '@/lib/network/definition';
import { computeFullLayout } from '@/lib/network/layout';

/** DESIGN.md v3 §5, "The home page is the network" — pure layout math, build order step 3. */
describe('computeFullLayout', () => {
  const layout = computeFullLayout(network);

  it('positions every station and every off-network item', () => {
    for (const station of network.stations) {
      expect(layout.stationPositions[station.id]).toBeDefined();
    }
    for (const item of network.offNetwork) {
      expect(layout.offNetworkPositions[item.id]).toBeDefined();
    }
  });

  it('the referral line stations increase in x, left to right, at a constant y', () => {
    const referral = network.lines.find((l) => l.kind === 'referral');
    if (!referral) throw new Error('expected a referral line');
    const points = referral.stationIds.map((id) => layout.stationPositions[id]);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (!prev || !curr) throw new Error('missing point');
      expect(curr.x).toBeGreaterThan(prev.x);
      expect(curr.y).toBe(prev.y);
    }
  });

  it('the self-branch stations descend below and away from the hub they branch from', () => {
    const selfBranch = network.lines.find((l) => l.kind === 'selfBranch');
    if (selfBranch?.kind !== 'selfBranch') throw new Error('expected a selfBranch line');
    const hub = layout.stationPositions[selfBranch.branchesFromStationId];
    if (!hub) throw new Error('missing hub position');
    for (const id of selfBranch.stationIds) {
      const point = layout.stationPositions[id];
      if (!point) throw new Error(`missing position for ${id}`);
      expect(point.y).toBeGreaterThan(hub.y);
    }
  });

  it('the off-network cluster sits entirely below every station — visually detached, never overlapping the network', () => {
    const maxStationY = Math.max(...Object.values(layout.stationPositions).map((p) => p.y));
    const minClusterY = Math.min(...Object.values(layout.offNetworkPositions).map((p) => p.y));
    expect(minClusterY).toBeGreaterThan(maxStationY);
  });

  it('the viewBox contains every positioned point', () => {
    const allPoints = [...Object.values(layout.stationPositions), ...Object.values(layout.offNetworkPositions)];
    for (const point of allPoints) {
      expect(point.x).toBeLessThanOrEqual(layout.viewBoxWidth);
      expect(point.y).toBeLessThanOrEqual(layout.viewBoxHeight);
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeGreaterThanOrEqual(0);
    }
  });

  it('no two stations or off-network items share the exact same point', () => {
    const allPoints = [...Object.values(layout.stationPositions), ...Object.values(layout.offNetworkPositions)];
    const keys = allPoints.map((p) => `${p.x},${p.y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('throws if the network is missing one of the three required line kinds', () => {
    const broken = {
      stations: network.stations,
      lines: network.lines.filter((l) => l.kind !== 'careBypass'),
      offNetwork: network.offNetwork,
    };
    expect(() => computeFullLayout(broken as typeof network)).toThrow();
  });
});
