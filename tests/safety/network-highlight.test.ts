import { describe, it, expect } from 'vitest';
import { network } from '@/lib/network/definition';
import { computeConditionHighlight } from '@/lib/network/highlightedRoute';
import { conditions, getCondition } from '@/data/conditions';
import type { Condition } from '@/lib/content/condition';

const BASE: Condition = {
  contentType: 'condition',
  slug: 'test-condition',
  title: 'Uji',
  summary: 'Ringkasan uji.',
  position: { type: 'station', stationId: 'rumahSakit' },
  route: 'Rute uji.',
  methodDeterminant: 'Penentu metode uji.',
  whyOneOption: 'Alasan uji.',
  costsThatRemain: 'Biaya uji.',
  questionToAsk: 'Pertanyaan uji?',
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'rujukan-berjenjang' }],
  inaCbgPackageItems: ['Metode A'],
  emergencyBypassApplies: false,
  outOfPocketStops: [],
};

/**
 * DESIGN.md v3 §5, "Condition pages carry their own route" — build order
 * step 8. Pure function: given a condition's own fields, which network
 * lines/stations it highlights.
 */
describe('computeConditionHighlight', () => {
  it('always highlights the referral trunk and its three stations', () => {
    const highlight = computeConditionHighlight(network, BASE);
    expect(highlight.lineIds.has('referral')).toBe(true);
    expect(highlight.stationIds.has('fktp')).toBe(true);
    expect(highlight.stationIds.has('rumahSakit')).toBe(true);
    expect(highlight.stationIds.has('subSpesialis')).toBe(true);
  });

  it('does not highlight the care-bypass line when emergencyBypassApplies is false', () => {
    const highlight = computeConditionHighlight(network, { ...BASE, emergencyBypassApplies: false });
    expect(highlight.lineIds.has('careBypass')).toBe(false);
  });

  it('highlights the care-bypass line when emergencyBypassApplies is true', () => {
    const highlight = computeConditionHighlight(network, { ...BASE, emergencyBypassApplies: true });
    expect(highlight.lineIds.has('careBypass')).toBe(true);
  });

  it('does not highlight the self-branch line when no out-of-pocket stops are named', () => {
    const highlight = computeConditionHighlight(network, { ...BASE, outOfPocketStops: [] });
    expect(highlight.lineIds.has('selfBranch')).toBe(false);
    expect(highlight.stationIds.has('naikKelas')).toBe(false);
    expect(highlight.stationIds.has('obatNonFornas')).toBe(false);
    expect(highlight.stationIds.has('alkesAboveCeiling')).toBe(false);
  });

  it('highlights only the named out-of-pocket stops, not all three', () => {
    const highlight = computeConditionHighlight(network, { ...BASE, outOfPocketStops: ['naikKelas'] });
    expect(highlight.lineIds.has('selfBranch')).toBe(true);
    expect(highlight.stationIds.has('naikKelas')).toBe(true);
    expect(highlight.stationIds.has('obatNonFornas')).toBe(false);
    expect(highlight.stationIds.has('alkesAboveCeiling')).toBe(false);
  });

  it.each(conditions.map((c) => c.slug))('%s: real content produces a highlight with a non-empty referral trunk', (slug) => {
    const condition = getCondition(slug)!;
    const highlight = computeConditionHighlight(network, condition);
    expect(highlight.stationIds.size).toBeGreaterThanOrEqual(3);
  });
});
