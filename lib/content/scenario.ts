import { z } from 'zod';
import { OutcomeSchema } from './outcome';
import { RuleRefSchema } from './ruleRef';
import { PositionSchema } from '@/lib/network/position';

/**
 * v2 content model, type 1 of 3 (PRD.md §5.1) — an administrative
 * situation, one question per screen, ending in a next action and a
 * question to ask. v1's ten scenarios migrate here unchanged in wording;
 * `routing` is replaced by `outcome` (lib/content/outcome.ts) so a scenario
 * can now be State A, B, or C instead of being forced into a payer lane.
 */
export const ScenarioSchema = z
  .object({
    contentType: z.literal('scenario'),
    id: z.string().min(1),
    title: z.string().min(1),
    /** Explains the rule. Never a second-person verdict — pnpm copy:check scans this. */
    explanation: z.string().min(1),
    outcome: OutcomeSchema,
    /** DESIGN.md v3 §5/§7: where this scenario sits on the network — StationFragment renders from this. */
    position: PositionSchema,
    ruleRefs: z.array(RuleRefSchema).min(1),
    /** CLAUDE.md invariant: every scenario carries a next action. */
    nextAction: z.string().min(1),
    /** CLAUDE.md invariant: and a question to ask. This is the product's output. */
    questionToAsk: z.string().min(1),
  })
  .strict();
export type Scenario = z.infer<typeof ScenarioSchema>;
