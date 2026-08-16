import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { QuestionCard } from '@/components/question/QuestionCard';
import { EMERGENCY_MESSAGE } from '@/lib/copy/strings';

/**
 * CLAUDE.md invariant 1: the emergency message is first in DOM order on
 * every screen that discusses coverage. Every locale page composes
 * <EmergencyBanner /> before any coverage content — this asserts the
 * banner itself renders the fixed wording and precedes sibling content
 * when composed the way every page in app/[locale]/ does.
 */
describe('emergency-first ordering', () => {
  it('renders the fixed emergency wording verbatim', () => {
    const { getByRole } = render(<EmergencyBanner />);
    expect(getByRole('alert')).toHaveTextContent(EMERGENCY_MESSAGE);
  });

  it('precedes coverage content when composed as every page does', () => {
    const { container } = render(
      <div>
        <EmergencyBanner />
        <QuestionCard nextAction="Lakukan ini." questionToAsk="Tanyakan ini?" />
      </div>,
    );
    const alert = container.querySelector('[role="alert"]');
    const body = container.textContent ?? '';
    expect(alert).not.toBeNull();
    // The alert's own text must appear before the question card's text in document order.
    const alertIndex = body.indexOf(EMERGENCY_MESSAGE);
    const questionIndex = body.indexOf('Tanyakan ini?');
    expect(alertIndex).toBeGreaterThanOrEqual(0);
    expect(alertIndex).toBeLessThan(questionIndex);
  });

  it('is never dismissible — no close/dismiss control', () => {
    const { queryByRole } = render(<EmergencyBanner />);
    expect(queryByRole('button')).toBeNull();
  });
});
