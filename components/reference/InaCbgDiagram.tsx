const ITEMS = ['Operasi terbuka', 'Laparoskopi', 'Rawat inap', 'Obat & alkes'] as const;

/**
 * MIGRATION.md step 3: "One diagram: a package containing several items,
 * with the note that the package does not change when the method inside
 * it changes." Flat, thick strokes, rounded caps, no gradients or shadows
 * — DESIGN.md v2 §2/§5. No rupiah figures anywhere, per this page's
 * mechanism-only rule.
 */
export function InaCbgDiagram() {
  return (
    <figure>
      <svg
        viewBox="0 0 440 220"
        role="img"
        aria-label="Diagram satu paket INA-CBG berisi beberapa metode berbeda — operasi terbuka, laparoskopi, rawat inap, obat dan alat kesehatan — dengan tarif paket yang sama untuk semuanya"
        className="w-full h-auto"
      >
        <rect
          x={20}
          y={20}
          width={400}
          height={140}
          rx={16}
          fill="none"
          stroke="#2F6B5E"
          strokeWidth={8}
        />
        <text x={40} y={52} className="fill-ink font-medium" fontSize={16}>
          Satu paket INA-CBG
        </text>

        {ITEMS.map((item, i) => {
          const cols = 2;
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = 40 + col * 190;
          const y = 68 + row * 44;
          return (
            <g key={item}>
              <rect x={x} y={y} width={170} height={32} rx={8} fill="#2F6B5E" opacity={0.12} />
              <text x={x + 12} y={y + 21} className="fill-ink" fontSize={14}>
                {item}
              </text>
            </g>
          );
        })}

        <line x1={20} y1={185} x2={420} y2={185} stroke="#DCD8CF" strokeWidth={2} />
        <text x={20} y={205} className="fill-ink/70" fontSize={13}>
          Tarif paket tidak berubah menurut metode mana yang dipakai di dalamnya.
        </text>
      </svg>
      <figcaption className="text-caption text-ink/70 mt-2">
        Contoh skematik — bukan daftar lengkap dan tidak menunjukkan nilai tarif.
      </figcaption>
    </figure>
  );
}
