import { z } from 'zod';

/**
 * Payer identity, never a coverage verdict. CLAUDE.md conventions: "Outcomes
 * are modelled as payer routing, never as a boolean. There is no `isCovered`
 * field in this codebase, and introducing one is a design regression."
 */
export const PayerSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('jkn'), label: z.string().min(1) }),
  z.object({ type: z.literal('jasaRaharja'), label: z.string().min(1) }),
  z.object({ type: z.literal('jaminanKecelakaanKerja'), label: z.string().min(1) }),
  z.object({ type: z.literal('self'), label: z.string().min(1) }),
]);
export type Payer = z.infer<typeof PayerSchema>;

/**
 * A single payer settles the case, or a coordination case where one payer
 * settles first up to a limit and JKN continues (PRD.md §2.3, DESIGN.md §2).
 */
export const PayerRoutingSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('single'),
    payer: PayerSchema,
  }),
  z.object({
    type: z.literal('coordination'),
    primary: PayerSchema,
    primaryLimitNote: z.string().min(1),
    continuesWith: PayerSchema,
  }),
]);
export type PayerRouting = z.infer<typeof PayerRoutingSchema>;

export const RuleRefSchema = z.object({
  packId: z.string().min(1),
  ruleId: z.string().min(1),
});
export type RuleRef = z.infer<typeof RuleRefSchema>;

export const ScenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Explains the rule. Never a second-person verdict — pnpm copy:check scans this. */
  explanation: z.string().min(1),
  routing: PayerRoutingSchema,
  ruleRefs: z.array(RuleRefSchema).min(1),
  /** CLAUDE.md invariant 11: every scenario ends with a next action. */
  nextAction: z.string().min(1),
  /** CLAUDE.md invariant 11: and a question to ask. This is the product's output. */
  questionToAsk: z.string().min(1),
});
export type Scenario = z.infer<typeof ScenarioSchema>;
