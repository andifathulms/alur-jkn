import { z } from 'zod';
import { RuleCitationSchema } from '@/lib/rules/schema';

export const ReferenceSectionSchema = z
  .object({
    heading: z.string().min(1),
    body: z.string().min(1),
  })
  .strict();
export type ReferenceSection = z.infer<typeof ReferenceSectionSchema>;

/**
 * v2 content model, type 2 of 3 (PRD.md §5.2) — browsable, staff-oriented
 * reference material. PRD.md names six pages under this one type, but
 * DESIGN.md v2 §4 gives INA-CBG a different shape from the other five:
 * "INA-CBG is not a table. It is an explainer with one diagram," versus an
 * entry-list/table shape for pengecualian, poli, alat-kesehatan, obat, and
 * kelas (MIGRATION.md step 4). `format: 'explainer'` is the only branch
 * built so far — step 4 adds an entry-list format once its actual content
 * shape (device ceilings, poli rules, etc.) is known, rather than
 * guessing that shape now.
 */
export const ReferenceSchema = z
  .object({
    contentType: z.literal('reference'),
    format: z.literal('explainer'),
    slug: z.string().min(1),
    title: z.string().min(1),
    /** DESIGN.md v2 §4 "entry shape": a one-line plain-Indonesian definition. */
    summary: z.string().min(1),
    sections: z.array(ReferenceSectionSchema).min(1),
    /** CLAUDE.md invariant 12: every reference entry carries its citations. */
    citations: z.array(RuleCitationSchema).min(1),
  })
  .strict();
export type Reference = z.infer<typeof ReferenceSchema>;

/** The one canonical path every other page links back to — PRD.md §5.2, "the spine." */
export function referenceHref(slug: string): string {
  return `/id/rujukan/${slug}`;
}
