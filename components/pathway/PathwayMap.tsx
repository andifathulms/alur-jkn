export type PathwayPosition = 'fktp' | 'rumahSakit' | 'subSpesialis' | 'gawatDarurat' | null;

const STATIONS = [
  { id: 'fktp', label: 'FKTP', sub: 'Puskesmas / klinik', x: 60 },
  { id: 'rumahSakit', label: 'Rumah Sakit', sub: 'Interchange', x: 220 },
  { id: 'subSpesialis', label: 'Sub-spesialis', sub: 'Rujukan lanjutan', x: 380 },
] as const;

const LINE_Y = 90;
const CARE_Y = 170;

/**
 * The referral system as a transit map — DESIGN.md §3. One line runs
 * FKTP → RS → sub-spesialis in a payer lane colour; a second line enters
 * the hospital directly from below in --care, skipping FKTP — the
 * emergency route. Position is marked on whichever line applies.
 *
 * DESIGN.md §6, "the route drawing forward": when a position is set, the
 * segment from the start to that position draws along the line in
 * --dur-draw (500ms) with the --ease timing function. The base lines stay
 * muted (--rule) so the vivid, animated overlay reads as "you are here,"
 * not just "this line exists." globals.css collapses the animation to the
 * final frame under prefers-reduced-motion.
 */
export function PathwayMap({ position = null }: { position?: PathwayPosition }) {
  const rs = STATIONS[1];
  const fktp = STATIONS[0];

  const referralProgressX = position === 'gawatDarurat' || position === null
    ? null
    : STATIONS.find((s) => s.id === position)?.x ?? null;

  return (
    <svg
      viewBox="0 0 440 220"
      role="img"
      aria-label="Peta alur rujukan: FKTP ke Rumah Sakit ke sub-spesialis, dengan jalur gawat darurat langsung ke Rumah Sakit"
      className="w-full h-auto"
    >
      {/* base referral line — muted, represents the whole system */}
      <line
        x1={STATIONS[0].x}
        y1={LINE_Y}
        x2={STATIONS[2].x}
        y2={LINE_Y}
        stroke="var(--color-rule)"
        strokeWidth={8}
        strokeLinecap="round"
      />

      {/* base emergency route — muted dashed, enters the hospital from below, skipping FKTP */}
      <path
        d={`M ${rs.x} ${CARE_Y} L ${rs.x} ${LINE_Y}`}
        stroke="var(--color-rule)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray="1 18"
      />

      {referralProgressX !== null && (
        <line
          key={`progress-${position}`}
          x1={fktp.x}
          y1={LINE_Y}
          x2={referralProgressX}
          y2={LINE_Y}
          stroke="var(--color-payer-1)"
          strokeWidth={8}
          strokeLinecap="round"
          pathLength={1}
          className="pathway-progress"
        />
      )}

      {position === 'gawatDarurat' && (
        <line
          x1={rs.x}
          y1={CARE_Y}
          x2={rs.x}
          y2={LINE_Y}
          stroke="var(--color-care)"
          strokeWidth={8}
          strokeLinecap="round"
          pathLength={1}
          className="pathway-progress"
        />
      )}

      <circle cx={rs.x} cy={CARE_Y} r={7} fill="var(--color-care)" />
      <text x={rs.x} y={CARE_Y + 24} textAnchor="middle" className="fill-ink" fontSize={13}>
        Jalur gawat darurat
      </text>

      {STATIONS.map((s) => (
        <g key={s.id}>
          <circle
            cx={s.x}
            cy={LINE_Y}
            r={s.id === 'rumahSakit' ? 14 : 10}
            fill="var(--color-paper)"
            stroke="var(--color-ink)"
            strokeWidth={3}
          />
          <text x={s.x} y={LINE_Y - 26} textAnchor="middle" className="fill-ink font-medium" fontSize={15}>
            {s.label}
          </text>
          <text x={s.x} y={LINE_Y - 10} textAnchor="middle" className="fill-ink/70" fontSize={12}>
            {s.sub}
          </text>
        </g>
      ))}

      {position &&
        (() => {
          const marker =
            position === 'gawatDarurat'
              ? { x: rs.x, y: (CARE_Y + LINE_Y) / 2 }
              : { x: STATIONS.find((s) => s.id === position)?.x ?? STATIONS[0].x, y: LINE_Y };
          return (
            <circle cx={marker.x} cy={marker.y} r={6} fill="var(--color-ink)">
              <title>Posisi Anda</title>
            </circle>
          );
        })()}
    </svg>
  );
}
