import { describe, it, expect } from 'vitest';
import { network } from '@/lib/network/definition';
import { computeFragment } from '@/lib/network/fragment';

/** DESIGN.md v3 §5/§11, build order step 2 — pure logic behind StationFragment. */
describe('computeFragment', () => {
  it('null position returns the referral line with nothing marked current', () => {
    const fragment = computeFragment(network, null);
    if (fragment.type !== 'network') throw new Error('expected a network fragment');
    expect(fragment.segments).toHaveLength(1);
    expect(fragment.segments[0]?.stations.every((s) => !s.isCurrent)).toBe(true);
  });

  it('a mid-referral-line station (FKTP) windows to itself and its one neighbour', () => {
    const fragment = computeFragment(network, { type: 'station', stationId: 'fktp' });
    if (fragment.type !== 'network') throw new Error('expected a network fragment');
    const referralSegment = fragment.segments.find((s) => s.lineId === 'referral');
    expect(referralSegment?.stations.map((s) => s.id)).toEqual(['fktp', 'rumahSakit']);
    expect(referralSegment?.stations.find((s) => s.id === 'fktp')?.isCurrent).toBe(true);
  });

  it('the interchange (Rumah Sakit) appears in all three lines that touch it', () => {
    const fragment = computeFragment(network, { type: 'station', stationId: 'rumahSakit' });
    if (fragment.type !== 'network') throw new Error('expected a network fragment');
    const lineIds = fragment.segments.map((s) => s.lineId).sort();
    expect(lineIds).toEqual(['careBypass', 'referral', 'selfBranch']);
  });

  it('a self-branch station (naik kelas) only appears on the self branch, marked current', () => {
    const fragment = computeFragment(network, { type: 'station', stationId: 'naikKelas' });
    if (fragment.type !== 'network') throw new Error('expected a network fragment');
    expect(fragment.segments).toHaveLength(1);
    expect(fragment.segments[0]?.lineId).toBe('selfBranch');
    expect(fragment.segments[0]?.stations.find((s) => s.id === 'naikKelas')?.isCurrent).toBe(true);
  });

  it('an off-network position returns an isolated item, not a network fragment', () => {
    const [firstOffNetwork] = network.offNetwork;
    if (!firstOffNetwork) throw new Error('expected at least one off-network item');
    const fragment = computeFragment(network, { type: 'offNetwork', itemId: firstOffNetwork.id });
    expect(fragment.type).toBe('offNetwork');
    if (fragment.type !== 'offNetwork') throw new Error('expected offNetwork fragment');
    expect(fragment.label).toBe(firstOffNetwork.label);
    expect(fragment.article).toBe(firstOffNetwork.article);
  });

  it('currentLabel names the station and its sublabel', () => {
    const fragment = computeFragment(network, { type: 'station', stationId: 'rumahSakit' });
    if (fragment.type !== 'network') throw new Error('expected a network fragment');
    expect(fragment.currentLabel).toContain('Rumah Sakit');
    expect(fragment.currentLabel).toContain('Interchange');
  });

  it('throws on an unknown station id rather than silently returning nothing', () => {
    expect(() => computeFragment(network, { type: 'station', stationId: 'not-a-real-station' })).toThrow();
  });

  it('throws on an unknown off-network item id', () => {
    expect(() => computeFragment(network, { type: 'offNetwork', itemId: 'not-a-real-item' })).toThrow();
  });
});
