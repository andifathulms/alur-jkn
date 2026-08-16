import { z } from 'zod';

/**
 * Every rule cites the instrument that establishes it — CLAUDE.md invariant 6.
 * The build rejects an uncited rule; see scripts/validate-content.ts.
 */
export const RuleCitationSchema = z.object({
  instrument: z.string().min(1),
  article: z.string().min(1),
  sourceUrl: z.string().url(),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'verifiedAt must be YYYY-MM-DD'),
});
export type RuleCitation = z.infer<typeof RuleCitationSchema>;

export const RuleSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(1),
  citation: RuleCitationSchema,
});
export type Rule = z.infer<typeof RuleSchema>;

export const RulePackSchema = z.object({
  packId: z.string().min(1),
  title: z.string().min(1),
  rules: z.array(RuleSchema).min(1),
});
export type RulePack = z.infer<typeof RulePackSchema>;

/** Packs whose oldest verifiedAt is older than this render a staleness warning (PRD.md §7). */
export const STALENESS_THRESHOLD_DAYS = 365;

export function isStale(verifiedAt: string, asOf: Date, thresholdDays = STALENESS_THRESHOLD_DAYS): boolean {
  const verified = new Date(`${verifiedAt}T00:00:00Z`);
  const ageMs = asOf.getTime() - verified.getTime();
  return ageMs > thresholdDays * 24 * 60 * 60 * 1000;
}
