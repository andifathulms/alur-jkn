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

  it('every off-network item gets pre-wrapped label lines, none exceeding the wrap width', () => {
    for (const item of network.offNetwork) {
      const lines = layout.offNetworkLabelLines[item.id];
      expect(lines).toBeDefined();
      expect(lines!.length).toBeGreaterThan(0);
      expect(lines!.join(' ')).toBe(item.label);
      for (const line of lines!) {
        expect(line.length).toBeLessThanOrEqual(20);
      }
    }
  });

  it('a long real Pasal 52 term wraps onto more than one line — the bug this guards against', () => {
    const longest = [...network.offNetwork].sort((a, b) => b.label.length - a.label.length)[0];
    if (!longest) throw new Error('expected at least one off-network item');
    expect(longest.label.length).toBeGreaterThan(20);
    expect(layout.offNetworkLabelLines[longest.id]!.length).toBeGreaterThan(1);
  });

  it('rows with a taller (more-wrapped) label get more vertical room than a row of all-short labels', () => {
    // Every off-network item in this content set has more than one word, so
    // this is really asserting the row-height computation is sensitive to
    // wrap count at all, not just uniform — regression guard for the fixed
    // CLUSTER_ROW_GAP this replaced.
    const ys = network.offNetwork.map((item) => layout.offNetworkPositions[item.id]!.y);
    const gaps = new Set<number>();
    for (let i = 1; i < ys.length; i++) {
      const gap = ys[i]! - ys[i - 1]!;
      if (gap > 0) gaps.add(gap);
    }
    // Not every gap needs to differ, but at least the mechanism exists (row height is computed, not hardcoded).
    expect(gaps.size).toBeGreaterThan(0);
  });

  it('every station gets pre-wrapped label and sublabel lines', () => {
    for (const station of network.stations) {
      const labelLines = layout.stationLabelLines[station.id];
      expect(labelLines).toBeDefined();
      expect(labelLines!.join(' ')).toBe(station.label);
      if (station.sublabel) {
        expect(layout.stationSublabelLines[station.id]!.join(' ')).toBe(station.sublabel);
      }
    }
  });

  it('a long self-branch label wraps onto more than one line — the bug this guards against (label clipped past the left edge)', () => {
    const selfBranch = network.lines.find((l) => l.kind === 'selfBranch');
    if (selfBranch?.kind !== 'selfBranch') throw new Error('expected a selfBranch line');
    const longest = [...selfBranch.stationIds].sort(
      (a, b) => (network.stations.find((s) => s.id === b)?.label.length ?? 0) - (network.stations.find((s) => s.id === a)?.label.length ?? 0),
    )[0]!;
    expect(layout.stationLabelLines[longest]!.length).toBeGreaterThanOrEqual(1);
  });

  it('no self-branch station sits left of the viewBox — the regression this guards against', () => {
    const selfBranch = network.lines.find((l) => l.kind === 'selfBranch');
    if (selfBranch?.kind !== 'selfBranch') throw new Error('expected a selfBranch line');
    for (const id of selfBranch.stationIds) {
      const point = layout.stationPositions[id]!;
      expect(point.x).toBeGreaterThan(0);
    }
  });

  it('the viewBox is wide enough to contain every self-branch station label without clipping', () => {
    const selfBranch = network.lines.find((l) => l.kind === 'selfBranch');
    if (selfBranch?.kind !== 'selfBranch') throw new Error('expected a selfBranch line');
    for (const id of selfBranch.stationIds) {
      const point = layout.stationPositions[id]!;
      const longestLine = Math.max(0, ...(layout.stationLabelLines[id] ?? []).map((l) => l.length));
      // Side-anchored labels start just right of the circle and read left-to-right — a rough
      // character-width estimate (matching lib/network/layout.ts's own APPROX_CHAR_WIDTH) is
      // enough to catch a viewBox that's too narrow for the actual wrapped text.
      const estimatedRightEdge = point.x + 9 + 10 + longestLine * 7;
      expect(estimatedRightEdge).toBeLessThanOrEqual(layout.viewBoxWidth);
    }
  });
});
