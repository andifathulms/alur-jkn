import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PathwayMap } from '@/components/pathway/PathwayMap';

/**
 * DESIGN.md §6: the route drawing forward. globals.css collapses
 * .pathway-progress's animation under prefers-reduced-motion, but the
 * element and its final-state stroke must render regardless — this
 * checks the animated progress segment actually appears for each
 * position, not just that the marker does.
 */
describe('pathway route-drawing', () => {
  it('renders no progress segment when no position is set', () => {
    const { container } = render(<PathwayMap />);
    expect(container.querySelectorAll('.pathway-progress')).toHaveLength(0);
  });

  it.each(['fktp', 'rumahSakit', 'subSpesialis'] as const)(
    'renders one referral-line progress segment for position "%s"',
    (position) => {
      const { container } = render(<PathwayMap position={position} />);
      expect(container.querySelectorAll('.pathway-progress')).toHaveLength(1);
    },
  );

  it('renders the emergency-route progress segment for gawatDarurat', () => {
    const { container } = render(<PathwayMap position="gawatDarurat" />);
    const segments = container.querySelectorAll('.pathway-progress');
    expect(segments).toHaveLength(1);
    expect(segments[0]?.getAttribute('stroke')).toBe('var(--color-care)'); // --care, DESIGN.md §2 — emergency route only
  });
});
