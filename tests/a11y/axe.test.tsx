import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { QuestionCard } from '@/components/question/QuestionCard';
import { PathwayMap } from '@/components/pathway/PathwayMap';
import { PayerHandoffBar } from '@/components/handoff/PayerHandoffBar';

/**
 * jsdom has no layout engine, so axe-core's colour-contrast and target-size
 * checks are inert here — those are covered by the "manual verification on
 * a real device" step in CLAUDE.md's deployment section, not by this suite.
 * What this suite does cover: structural a11y (roles, alt text, labelling)
 * that axe can evaluate from markup alone.
 */
describe('automated a11y — structural checks', () => {
  it('EmergencyBanner has no axe violations', async () => {
    const { container } = render(<EmergencyBanner />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('QuestionCard has no axe violations', async () => {
    const { container } = render(
      <QuestionCard nextAction="Lakukan ini." questionToAsk="Tanyakan ini?" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('PathwayMap svg has an accessible name', async () => {
    const { container, getByRole } = render(<PathwayMap />);
    expect(getByRole('img')).toHaveAccessibleName();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('PayerHandoffBar (single and coordination) has no axe violations', async () => {
    const single = render(
      <PayerHandoffBar routing={{ type: 'single', payer: { type: 'self', label: 'Mandiri' } }} />,
    );
    expect(await axe(single.container)).toHaveNoViolations();

    const coordination = render(
      <PayerHandoffBar
        routing={{
          type: 'coordination',
          primary: { type: 'jasaRaharja', label: 'Jasa Raharja' },
          primaryLimitNote: 'sampai batas tertentu',
          continuesWith: { type: 'jkn', label: 'JKN' },
        }}
      />,
    );
    expect(await axe(coordination.container)).toHaveNoViolations();
  });
});
