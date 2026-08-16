import { describe, it, expect } from 'vitest';
import { scanAll, scanText } from '@/lib/copy/check';
import { collectContentCopy } from '@/lib/copy/collectContentCopy';

/**
 * CLAUDE.md invariant 2: no screen states or implies whether the user's
 * case is covered. This re-runs scripts/copy-check.ts's exact scan (via
 * the shared lib/copy/collectContentCopy.ts collector, so the script and
 * this suite can never scan two different sets of strings) as a vitest
 * suite so `pnpm test:safety` gates it too, with a positive control
 * proving the scanner actually catches a verdict when one exists.
 */
describe('no-verdict copy scan', () => {
  it('every piece of copy and content is free of banned verdict/blame phrasing', () => {
    expect(scanAll(collectContentCopy())).toEqual([]);
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
