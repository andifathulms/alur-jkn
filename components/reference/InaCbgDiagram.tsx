const BOX_X = 20;
const BOX_Y = 20;
const BOX_WIDTH = 400;
const HEADER_HEIGHT = 48;
const ROW_HEIGHT = 44;
const ITEM_HEIGHT = 32;
const FOOTER_HEIGHT = 55;
const COLS = 2;

/**
 * DESIGN.md v3 §4: "The diagram is data-bound. Each condition supplies
 * the items inside its own package, and the diagram renders that
 * package." No hardcoded example list — `items` comes from the caller (a
 * condition's `inaCbgPackageItems`, or the general reference page's own
 * illustrative example), computed nowhere in this component (invariant
 * 18). The box's height grows with the row count so a longer package
 * never gets cropped, but its *width* and general shape never change —
 * which is the point: "the box is the same size regardless of which
 * method sits inside it." Flat, thick strokes, rounded caps, no
 * gradients or shadows — DESIGN.md §2/§5. No rupiah figures anywhere,
 * per invariant 9.
 */
export function InaCbgDiagram({
  items,
  caption,
  ariaLabel,
}: {
  items: string[];
  caption: string;
  ariaLabel: string;
}) {
  const rows = Math.ceil(items.length / COLS);
  const gridTop = BOX_Y + HEADER_HEIGHT;
  const gridHeight = rows * ROW_HEIGHT;
  const footerLineY = gridTop + gridHeight + 15;
  const boxBottom = footerLineY + FOOTER_HEIGHT - 15;
  const viewBoxHeight = boxBottom + 20;

  return (
    <figure>
      <svg viewBox={`0 0 440 ${viewBoxHeight}`} role="img" aria-label={ariaLabel} className="w-full h-auto">
        <rect
          x={BOX_X}
          y={BOX_Y}
          width={BOX_WIDTH}
          height={boxBottom - BOX_Y}
          rx={16}
          fill="none"
          stroke="var(--color-payer-1)"
          strokeWidth={8}
        />
        <text x={BOX_X + 20} y={BOX_Y + 32} className="fill-ink font-medium" fontSize={16}>
          Satu paket INA-CBG
        </text>

        {items.map((item, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const x = BOX_X + 20 + col * 190;
          const y = gridTop + row * ROW_HEIGHT;
          return (
            <g key={item}>
              <rect x={x} y={y} width={170} height={ITEM_HEIGHT} rx={8} fill="var(--color-payer-1)" opacity={0.12} />
              <text x={x + 12} y={y + 21} className="fill-ink" fontSize={14}>
                {item}
              </text>
            </g>
          );
        })}

        <line x1={BOX_X} y1={footerLineY} x2={BOX_X + BOX_WIDTH} y2={footerLineY} stroke="var(--color-rule)" strokeWidth={2} />
        <text x={BOX_X} y={footerLineY + 20} className="fill-ink/70" fontSize={13}>
          Tarif paket tidak berubah menurut metode mana yang dipakai di dalamnya.
        </text>
      </svg>
      <figcaption className="text-caption text-ink/70 mt-2">{caption}</figcaption>
    </figure>
  );
}
