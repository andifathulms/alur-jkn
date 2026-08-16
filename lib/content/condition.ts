import { z } from 'zod';
import { RuleRefSchema } from './ruleRef';

/**
 * v2 content model, type 3 of 3 (PRD.md §5.3, MIGRATION.md step 5) — a
 * named procedure or condition, never a verdict. Five sections as five
 * *named, required* fields rather than a generic array — CLAUDE.md
 * invariant 6 says a missing section fails the build, and a required
 * field on a `.strict()` schema is a stronger guarantee of that than an
 * array a caller could accidentally leave short.
 *
 * There is deliberately no per-condition INA-CBG link field: every
 * condition page's template renders a link to /rujukan/ina-cbg
 * unconditionally (invariant 7) — hardcoding it in the component means it
 * can't be forgotten by whoever writes the next condition's data, the way
 * a data field could be left empty or copy-pasted wrong.
 */
export const ConditionSchema = z
  .object({
    contentType: z.literal('condition'),
    slug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    /** §1 The route — which poli, referral or emergency bypass. */
    route: z.string().min(1),
    /** §2 What determines the method — medical indication, not a coverage rule. */
    methodDeterminant: z.string().min(1),
    /** §3 Why you may be offered one option — the package tariff. Links to INA-CBG via the template, not a field. */
    whyOneOption: z.string().min(1),
    /** §4 What can still cost money — class upgrade, non-formulary drugs, devices over ceiling. */
    costsThatRemain: z.string().min(1),
    /** §5 The question to ask — the product's actual output, same as a scenario's. */
    questionToAsk: z.string().min(1),
    ruleRefs: z.array(RuleRefSchema).min(1),
  })
  .strict();
export type Condition = z.infer<typeof ConditionSchema>;

export function conditionHref(slug: string): string {
  return `/id/kondisi/${slug}`;
}
