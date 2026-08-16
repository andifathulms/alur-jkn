import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button, LinkButton, buttonClassName } from '@/components/primitives/Button';
import { OutcomeDisplay } from '@/components/state/OutcomeDisplay';
import { payerClasses } from '@/components/handoff/payerStyle';

/**
 * DESIGN.md v3's build order step 7, "the primitive layer": Button/LinkButton
 * absorb the bordered-button className duplicated across ShareCard,
 * PathwayExplorer, FamilyWizard, and the home page. Never a hand-written
 * arbitrary min-height — tokens:check enforces that codebase-wide, this
 * pins it at the source.
 */
describe('Button primitive', () => {
  it('uses the target-size tokens, never an arbitrary min-h value', () => {
    expect(buttonClassName({})).toMatch(/min-h-target\b/);
    expect(buttonClassName({ size: 'family' })).toMatch(/min-h-target-family\b/);
    expect(buttonClassName({})).not.toMatch(/min-h-\[/);
  });

  it('Button has no axe violations', async () => {
    const { container } = render(<Button>Cetak</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('LinkButton has no axe violations', async () => {
    const { container } = render(<LinkButton href="/id/petugas">Mode petugas</LinkButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('a pressed button gets the filled ink treatment', () => {
    expect(buttonClassName({ pressed: true })).toContain('bg-ink text-paper');
    expect(buttonClassName({ pressed: false })).not.toContain('bg-ink text-paper');
  });
});

/**
 * DESIGN.md §3, State B: rendered in the `--self` lane. OutcomeDisplay's
 * excluded-state swatch used to reimplement `--self`'s background and
 * pattern inline; it now goes through payerStyle.ts like every other
 * payer-coloured surface. This guards against that regressing silently.
 */
describe('OutcomeDisplay excluded state reuses payerStyle', () => {
  it('renders the same bg/pattern classes payerClasses gives the self lane', () => {
    const expected = payerClasses({ type: 'self', label: 'Mandiri' });
    const { container } = render(
      <OutcomeDisplay outcome={{ type: 'excluded', pasal52Article: 'Pasal 52 huruf a' }} />,
    );
    const swatch = container.querySelector('div.h-10');
    expect(swatch?.className).toContain(expected.bg);
    if (expected.pattern) expect(swatch?.className).toContain(expected.pattern);
  });
});
