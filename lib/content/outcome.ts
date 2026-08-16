import { z } from 'zod';

/**
 * Payer identity, never a coverage verdict. CLAUDE.md conventions:
 * discriminated unions for payers, keyed on `type`, so an exhaustive
 * switch with a `never` default surfaces every call site that needs
 * updating when a payer is added.
 */
export const PayerSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('jkn'), label: z.string().min(1) }).strict(),
  z.object({ type: z.literal('jasaRaharja'), label: z.string().min(1) }).strict(),
  z.object({ type: z.literal('jaminanKecelakaanKerja'), label: z.string().min(1) }).strict(),
  z.object({ type: z.literal('self'), label: z.string().min(1) }).strict(),
]);
export type Payer = z.infer<typeof PayerSchema>;

/**
 * A single payer settles the case, or a coordination case where one payer
 * settles first up to a limit and JKN continues (PRD.md §2.3, DESIGN.md §2).
 */
export const PayerRoutingSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('single'),
      payer: PayerSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal('coordination'),
      primary: PayerSchema,
      primaryLimitNote: z.string().min(1),
      continuesWith: PayerSchema,
    })
    .strict(),
]);
export type PayerRouting = z.infer<typeof PayerRoutingSchema>;

/**
 * The three states — DESIGN.md v2 §3, CLAUDE.md v2 invariant 4. This is the
 * whole of what an outcome can be; there is no fourth shape and no boolean.
 * `.strict()` on every branch means an accidental `isCovered` (or any other
 * unrecognised field) fails validation instead of being silently stripped —
 * the schema is meant to make a coverage verdict unrepresentable, not just
 * unused.
 *
 * - 'payer': State A. A payer settles it — rendered as a payer lane.
 * - 'excluded': State B. Only for items enumerated in Perpres 82/2018
 *   Pasal 52. `pasal52Article` is required and must render inline wherever
 *   this is shown — it is what distinguishes a genuine regulatory
 *   exclusion from staff shorthand (PRD.md §3).
 * - 'depends': State C. Medical indication, hospital capability, tariff
 *   package, or any other administrative contingency. `question` is
 *   required — a 'depends' with no question is an incomplete screen, not a
 *   neutral one (DESIGN.md §3).
 */
export const OutcomeSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('payer'),
      routing: PayerRoutingSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal('excluded'),
      pasal52Article: z.string().min(1),
    })
    .strict(),
  z
    .object({
      type: z.literal('depends'),
      question: z.string().min(1),
    })
    .strict(),
]);
export type Outcome = z.infer<typeof OutcomeSchema>;
