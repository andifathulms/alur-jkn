import { z } from 'zod';
import { RuleCitationSchema } from '@/lib/rules/schema';
import { PositionSchema } from '@/lib/network/position';

export const ReferenceSectionSchema = z
  .object({
    heading: z.string().min(1),
    body: z.string().min(1),
  })
  .strict();
export type ReferenceSection = z.infer<typeof ReferenceSectionSchema>;

/**
 * DESIGN.md v2 §4, "entry shape": term, one-line plain-Indonesian
 * definition, the detail, the citation line — nothing longer than a short
 * paragraph before a break. Each entry carries its own citation (not one
 * shared citation for the whole page), because a pengecualian entry's
 * article is what makes it a genuine State B item rather than staff
 * shorthand (PRD.md §3) — invariant 3 requires that citation inline with
 * the entry, not just present somewhere on the page.
 */
export const ReferenceEntrySchema = z
  .object({
    term: z.string().min(1),
    definition: z.string().min(1),
    detail: z.string().min(1),
    citation: RuleCitationSchema,
  })
  .strict();
export type ReferenceEntry = z.infer<typeof ReferenceEntrySchema>;

const referenceBaseFields = {
  contentType: z.literal('reference'),
  slug: z.string().min(1),
  title: z.string().min(1),
  /** DESIGN.md v2 §4 "entry shape": a one-line plain-Indonesian definition — here, of the whole section. */
  summary: z.string().min(1),
  /** DESIGN.md v3 §5/§7: where this section sits on the network — null if it doesn't map to one place. */
  position: PositionSchema,
};

/**
 * v2 content model, type 2 of 3 (PRD.md §5.2) — browsable, staff-oriented
 * reference material. DESIGN.md v2 §4 gives two different shapes:
 * - 'explainer' (MIGRATION.md step 3): INA-CBG only — one narrative page,
 *   one diagram, a small number of page-level citations.
 * - 'entryList' (MIGRATION.md step 4): pengecualian, poli, alat-kesehatan,
 *   obat, kelas — a scannable list of {term, definition, detail, citation}
 *   entries, optionally rendered as a table (DESIGN.md v2 §4: "tables are
 *   allowed here").
 */
export const ReferenceSchema = z.discriminatedUnion('format', [
  z
    .object({
      ...referenceBaseFields,
      format: z.literal('explainer'),
      sections: z.array(ReferenceSectionSchema).min(1),
      /** CLAUDE.md invariant 12: every reference entry carries its citations. */
      citations: z.array(RuleCitationSchema).min(1),
    })
    .strict(),
  z
    .object({
      ...referenceBaseFields,
      format: z.literal('entryList'),
      entries: z.array(ReferenceEntrySchema).min(1),
      /**
       * DESIGN.md v3 §4: alat-kesehatan and kelas are tabular data — a
       * staff member scanning for a replacement interval needs a cell, not
       * a paragraph. pengecualian, poli, and obat stay stacked cards
       * (pengecualian's plain-language examples matter more than any
       * column). Required, not defaulted, so every entryList reference
       * states its own classification explicitly.
       */
      tabular: z.boolean(),
    })
    .strict(),
]);
export type Reference = z.infer<typeof ReferenceSchema>;

/** The one canonical path every other page links back to — PRD.md §5.2, "the spine." */
export function referenceHref(slug: string): string {
  return `/id/rujukan/${slug}`;
}
