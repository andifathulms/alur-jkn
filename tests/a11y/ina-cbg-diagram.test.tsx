import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { InaCbgDiagram } from '@/components/reference/InaCbgDiagram';
import { scanText } from '@/lib/copy/check';

describe('InaCbgDiagram', () => {
  it('has an accessible name and no axe violations', async () => {
    const { container, getByRole } = render(<InaCbgDiagram />);
    expect(getByRole('img')).toHaveAccessibleName();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('contains no rupiah figures anywhere in its rendered text', () => {
    const { container } = render(<InaCbgDiagram />);
    const violations = scanText(container.textContent ?? '', 'InaCbgDiagram');
    expect(violations).toEqual([]);
  });
});
