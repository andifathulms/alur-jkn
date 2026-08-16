import { z } from 'zod';

/**
 * DESIGN.md v3 §5, "The pathway — a system, not a page." A station is
 * identity + label only — no coordinates. Layout (where a station sits on
 * a rendered map) is a rendering concern for a later build-order step
 * (`StationFragment`, step 2), derived *from* this topology, not stored
 * alongside it — this step is "pure data ... no rendering."
 */
export const StationSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    sublabel: z.string().min(1).optional(),
  })
  .strict();
export type Station = z.infer<typeof StationSchema>;

/**
 * DESIGN.md §2: "Every payer also carries a line pattern ... The pattern
 * is not decoration and not a fallback — it is the primary encoding for
 * anyone who cannot separate the hues." §11: "Map lines carry their
 * pattern too — a network distinguished only by hue fails this rule as
 * surely as a badge would." `sparseDash` is not one of the four named
 * payer patterns (solid/longDash/dashDot/dot, one per payer-1/2/3/self) —
 * it's reserved for the care-bypass line, which is not a payer lane and
 * needs its own distinct pattern for the same colour-blind-safe reason.
 */
export const LinePatternSchema = z.enum(['solid', 'longDash', 'dashDot', 'dot', 'sparseDash']);
export type LinePattern = z.infer<typeof LinePatternSchema>;

/** Tailwind colour tokens a line may use — never a raw hex (CLAUDE.md conventions). */
export const LineColorTokenSchema = z.enum(['payer-1', 'care', 'self']);
export type LineColorToken = z.infer<typeof LineColorTokenSchema>;

const lineShape = {
  id: z.string().min(1),
  label: z.string().min(1),
  colorToken: LineColorTokenSchema,
  pattern: LinePatternSchema,
  /** Ordered station ids this line visits, start to end. Must reference real stations — see NetworkSchema's superRefine. */
  stationIds: z.array(z.string().min(1)).min(1),
};

/**
 * DESIGN.md §5 names three line shapes precisely, and they are not
 * interchangeable:
 * - 'referral': the main line, FKTP → Rumah Sakit → Sub-spesialis.
 * - 'careBypass': "enters the hospital directly, skipping the first
 *   station" — it originates outside the referral chain entirely, so it
 *   carries `entersFromOutsideNetwork: true` rather than connecting from
 *   another station.
 * - 'selfBranch': "descends from the hospital interchange through the
 *   three things that can still cost money" — it carries
 *   `branchesFromStationId`, the station it descends from.
 */
export const LineSchema = z.discriminatedUnion('kind', [
  z
    .object({
      ...lineShape,
      kind: z.literal('referral'),
    })
    .strict(),
  z
    .object({
      ...lineShape,
      kind: z.literal('careBypass'),
      entersFromOutsideNetwork: z.literal(true),
    })
    .strict(),
  z
    .object({
      ...lineShape,
      kind: z.literal('selfBranch'),
      branchesFromStationId: z.string().min(1),
    })
    .strict(),
]);
export type Line = z.infer<typeof LineSchema>;

/**
 * DESIGN.md §5, "Pasal 52 sits off the network": "The exclusions are drawn
 * as stations connected to nothing. A small detached cluster, unlinked to
 * any line, labelled with the article." Deliberately not a Station — it
 * has no line membership — and it carries its own citation, the way a
 * pengecualian reference entry does (`lib/content/reference.ts`).
 */
export const OffNetworkItemSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    article: z.string().min(1),
  })
  .strict();
export type OffNetworkItem = z.infer<typeof OffNetworkItemSchema>;

export const NetworkSchema = z
  .object({
    stations: z.array(StationSchema).min(1),
    lines: z.array(LineSchema).min(1),
    /**
     * Not "a small curated subset" — DESIGN.md says "small" describing the
     * cluster's visual weight on the map, not a licence to under-represent
     * the real exclusion list. This product's core safety principle is
     * never implying a narrower (or wider) exclusion set than the
     * regulation actually enumerates, so the definition in
     * lib/network/definition.ts derives this array from the real
     * pengecualian reference entries rather than re-authoring it.
     */
    offNetwork: z.array(OffNetworkItemSchema).min(1),
  })
  .strict()
  .superRefine((network, ctx) => {
    const stationIds = new Set(network.stations.map((s) => s.id));
    if (stationIds.size !== network.stations.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate station id', path: ['stations'] });
    }

    const lineIds = new Set(network.lines.map((l) => l.id));
    if (lineIds.size !== network.lines.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate line id', path: ['lines'] });
    }

    network.lines.forEach((line, lineIndex) => {
      line.stationIds.forEach((stationId, stationIndex) => {
        if (!stationIds.has(stationId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Line "${line.id}" references unknown station "${stationId}"`,
            path: ['lines', lineIndex, 'stationIds', stationIndex],
          });
        }
      });

      if (line.kind === 'selfBranch' && !stationIds.has(line.branchesFromStationId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Line "${line.id}" branches from unknown station "${line.branchesFromStationId}"`,
          path: ['lines', lineIndex, 'branchesFromStationId'],
        });
      }
    });

    const offNetworkIds = new Set(network.offNetwork.map((o) => o.id));
    if (offNetworkIds.size !== network.offNetwork.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate off-network item id', path: ['offNetwork'] });
    }
  });
export type Network = z.infer<typeof NetworkSchema>;
