import { describe, it, expect } from 'vitest';
import { NetworkSchema } from '@/lib/network/schema';
import { network } from '@/lib/network/definition';

/**
 * DESIGN.md v3 §5 — the canonical network, build order step 1. Pure data,
 * Zod-validated. No rendering exists yet (that's step 2 onward); this
 * proves the schema's referential-integrity rules actually reject bad
 * data, and that the real definition satisfies them.
 */
describe('network definition', () => {
  it('the real definition parses', () => {
    expect(() => NetworkSchema.parse(network)).not.toThrow();
  });

  it('has the referral line, the care bypass, and the self branch', () => {
    const kinds = network.lines.map((l) => l.kind).sort();
    expect(kinds).toEqual(['careBypass', 'referral', 'selfBranch']);
  });

  it('the referral line visits FKTP, Rumah Sakit, then Sub-spesialis in order', () => {
    const referral = network.lines.find((l) => l.kind === 'referral');
    expect(referral?.stationIds).toEqual(['fktp', 'rumahSakit', 'subSpesialis']);
  });

  it('the care bypass enters from outside the network and reaches Rumah Sakit, skipping FKTP', () => {
    const bypass = network.lines.find((l) => l.kind === 'careBypass');
    if (bypass?.kind !== 'careBypass') throw new Error('expected careBypass line');
    expect(bypass.entersFromOutsideNetwork).toBe(true);
    expect(bypass.stationIds).toEqual(['rumahSakit']);
    expect(bypass.stationIds).not.toContain('fktp');
  });

  it('the self branch descends from Rumah Sakit through the three things that can still cost money', () => {
    const branch = network.lines.find((l) => l.kind === 'selfBranch');
    if (branch?.kind !== 'selfBranch') throw new Error('expected selfBranch line');
    expect(branch.branchesFromStationId).toBe('rumahSakit');
    expect(branch.stationIds).toEqual(['naikKelas', 'obatNonFornas', 'alkesAboveCeiling']);
  });

  it('every line carries a distinct colour token and a distinct pattern — invariant 15, no colour-only encoding', () => {
    const colorTokens = network.lines.map((l) => l.colorToken);
    const patterns = network.lines.map((l) => l.pattern);
    expect(new Set(colorTokens).size).toBe(network.lines.length);
    expect(new Set(patterns).size).toBe(network.lines.length);
  });

  it('the off-network Pasal 52 cluster is non-empty and every item carries its article', () => {
    expect(network.offNetwork.length).toBeGreaterThan(0);
    for (const item of network.offNetwork) {
      expect(item.article.trim().length).toBeGreaterThan(0);
    }
  });

  it('the off-network cluster is derived from, and stays equal in size to, the real pengecualian list', async () => {
    const { getReference } = await import('@/data/reference');
    const pengecualian = getReference('pengecualian');
    if (pengecualian?.format !== 'entryList') throw new Error('expected entryList format');
    expect(network.offNetwork.length).toBe(pengecualian.entries.length);
  });

  it('rejects a line referencing an unknown station', () => {
    const bad = {
      stations: [{ id: 'a', label: 'A' }],
      lines: [
        {
          id: 'l1',
          kind: 'referral',
          label: 'L1',
          colorToken: 'payer-1',
          pattern: 'solid',
          stationIds: ['a', 'doesNotExist'],
        },
      ],
      offNetwork: [{ id: 'o1', label: 'O1', article: 'Pasal 52' }],
    };
    expect(() => NetworkSchema.parse(bad)).toThrow();
  });

  it('rejects a selfBranch line that branches from an unknown station', () => {
    const bad = {
      stations: [{ id: 'a', label: 'A' }],
      lines: [
        {
          id: 'l1',
          kind: 'selfBranch',
          label: 'L1',
          colorToken: 'self',
          pattern: 'dot',
          stationIds: ['a'],
          branchesFromStationId: 'doesNotExist',
        },
      ],
      offNetwork: [{ id: 'o1', label: 'O1', article: 'Pasal 52' }],
    };
    expect(() => NetworkSchema.parse(bad)).toThrow();
  });

  it('rejects duplicate station ids', () => {
    const bad = {
      stations: [
        { id: 'a', label: 'A' },
        { id: 'a', label: 'A again' },
      ],
      lines: [
        {
          id: 'l1',
          kind: 'referral',
          label: 'L1',
          colorToken: 'payer-1',
          pattern: 'solid',
          stationIds: ['a'],
        },
      ],
      offNetwork: [{ id: 'o1', label: 'O1', article: 'Pasal 52' }],
    };
    expect(() => NetworkSchema.parse(bad)).toThrow();
  });

  it('rejects an isCovered-style field on any line — schema is .strict()', () => {
    const bad = {
      stations: [{ id: 'a', label: 'A' }],
      lines: [
        {
          id: 'l1',
          kind: 'referral',
          label: 'L1',
          colorToken: 'payer-1',
          pattern: 'solid',
          stationIds: ['a'],
          isCovered: true,
        },
      ],
      offNetwork: [{ id: 'o1', label: 'O1', article: 'Pasal 52' }],
    };
    expect(() => NetworkSchema.parse(bad)).toThrow();
  });
});
