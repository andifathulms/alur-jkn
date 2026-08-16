import { describe, it, expect } from 'vitest';
import { scanAll } from '@/lib/copy/check';
import * as strings from '@/lib/copy/strings';
import { scenarios } from '@/data/scenarios';
import { rulePacks } from '@/data/rules';
import { scanText } from '@/lib/copy/check';

/**
 * CLAUDE.md invariant 2: no screen states or implies whether the user's
 * case is covered. This is scripts/copy-check.ts's logic, re-run as a
 * vitest suite so `pnpm test:safety` gates it too, and with a positive
 * control proving the scanner actually catches a verdict when one exists.
 */
describe('no-verdict copy scan', () => {
  it('every scenario field is free of banned verdict/blame phrasing', () => {
    const entries: Record<string, string> = {};
    for (const [name, value] of Object.entries(strings)) {
      if (typeof value === 'string') entries[`strings.${name}`] = value;
    }
    for (const scenario of scenarios) {
      entries[`${scenario.id}.explanation`] = scenario.explanation;
      entries[`${scenario.id}.nextAction`] = scenario.nextAction;
      entries[`${scenario.id}.questionToAsk`] = scenario.questionToAsk;
    }
    for (const pack of rulePacks) {
      for (const rule of pack.rules) {
        entries[`${pack.packId}.${rule.id}.statement`] = rule.statement;
      }
    }
    expect(scanAll(entries)).toEqual([]);
  });

  it('positive control: the scanner catches a second-person verdict', () => {
    const violations = scanText('Anda tidak ditanggung untuk kasus ini.', 'test-fixture');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('positive control: the scanner catches a blame construction', () => {
    const violations = scanText('Seharusnya Anda ke Puskesmas dulu.', 'test-fixture');
    expect(violations.length).toBeGreaterThan(0);
  });
});
