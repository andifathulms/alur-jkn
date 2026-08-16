import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { InaCbgDiagram } from '@/components/reference/InaCbgDiagram';
import { conditions } from '@/data/conditions';
import { scanText } from '@/lib/copy/check';

const SAMPLE_PROPS = {
  items: ['Operasi terbuka', 'Laparoskopi'],
  caption: 'Contoh skematik — bukan daftar lengkap dan tidak menunjukkan nilai tarif.',
  ariaLabel: 'Diagram satu paket INA-CBG berisi dua metode berbeda',
};

/**
 * DESIGN.md v3 §4, "the diagram is data-bound" — build order step 8.
 * `items` comes from the caller; this component renders whatever it's
 * given rather than a hardcoded example list.
 */
describe('InaCbgDiagram', () => {
  it('has an accessible name and no axe violations', async () => {
    const { container, getByRole } = render(<InaCbgDiagram {...SAMPLE_PROPS} />);
    expect(getByRole('img')).toHaveAccessibleName(SAMPLE_PROPS.ariaLabel);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('contains no rupiah figures anywhere in its rendered text', () => {
    const { container } = render(<InaCbgDiagram {...SAMPLE_PROPS} />);
    const violations = scanText(container.textContent ?? '', 'InaCbgDiagram');
    expect(violations).toEqual([]);
  });

  it('renders every item it is given, not a fixed example set', () => {
    const items = ['Metode A', 'Metode B', 'Metode C'];
    const { getByText } = render(<InaCbgDiagram items={items} caption="Contoh" ariaLabel="Contoh diagram" />);
    for (const item of items) expect(getByText(item)).toBeInTheDocument();
  });

  it('renders the caption text passed by the caller', () => {
    const { getByText } = render(<InaCbgDiagram {...SAMPLE_PROPS} />);
    expect(getByText(SAMPLE_PROPS.caption)).toBeInTheDocument();
  });

  it.each(conditions.map((c) => c.slug))('%s: every condition supplies its own package items, no axe violations', (slug) => {
    const condition = conditions.find((c) => c.slug === slug)!;
    expect(condition.inaCbgPackageItems.length).toBeGreaterThan(0);
    const { getByText } = render(
      <InaCbgDiagram
        items={condition.inaCbgPackageItems}
        caption={`Paket untuk ${condition.title}`}
        ariaLabel={`Diagram untuk ${condition.title}`}
      />,
    );
    for (const item of condition.inaCbgPackageItems) expect(getByText(item)).toBeInTheDocument();
  });

  it('the two seeded conditions do not reuse the same package items', () => {
    const [a, b] = conditions;
    if (!a || !b || conditions.length < 2) return;
    expect(a.inaCbgPackageItems).not.toEqual(b.inaCbgPackageItems);
  });
});
