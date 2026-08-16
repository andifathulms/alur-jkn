import { z } from 'zod';

/** A pointer into a rule pack (data/rules/) — shared by scenario and condition content. */
export const RuleRefSchema = z
  .object({
    packId: z.string().min(1),
    ruleId: z.string().min(1),
  })
  .strict();
export type RuleRef = z.infer<typeof RuleRefSchema>;
