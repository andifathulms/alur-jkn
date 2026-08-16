import { RulePackSchema, type RulePack } from './schema';

/**
 * Pure: validates one raw pack object against the schema and returns it typed.
 * Callers (scripts/validate-rules.ts, data/rules/index.ts) own reading files.
 */
export function loadRulePack(raw: unknown, sourceLabel: string): RulePack {
  const result = RulePackSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid rule pack in ${sourceLabel}:\n${issues}`);
  }
  return result.data;
}

export function findRule(packs: RulePack[], packId: string, ruleId: string) {
  const pack = packs.find((p) => p.packId === packId);
  if (!pack) throw new Error(`Unknown rule pack: ${packId}`);
  const rule = pack.rules.find((r) => r.id === ruleId);
  if (!rule) throw new Error(`Unknown rule: ${packId}.${ruleId}`);
  return rule;
}
