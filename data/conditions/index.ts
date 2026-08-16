import { ConditionSchema, type Condition } from '@/lib/content/condition';
import { findRule } from '@/lib/rules/loader';
import { rulePacks } from '@/data/rules';

import { operasiUsusBuntu } from './operasi-usus-buntu';
import { operasiKatarak } from './operasi-katarak';

const rawConditions: Condition[] = [operasiUsusBuntu, operasiKatarak];

export const conditions: Condition[] = rawConditions.map((condition) => {
  const parsed = ConditionSchema.parse(condition);
  for (const ref of parsed.ruleRefs) {
    findRule(rulePacks, ref.packId, ref.ruleId);
  }
  return parsed;
});

export function getCondition(slug: string): Condition | undefined {
  return conditions.find((c) => c.slug === slug);
}
