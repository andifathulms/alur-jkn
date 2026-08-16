import type { Fragment } from '@/lib/network/fragment';
import { strokeDasharrayFor } from '@/lib/network/linePatternStroke';
import { colorVarFor } from '@/lib/network/lineColorVar';
import { wrapLabel } from '@/lib/network/wrapLabel';

const SEGMENT_HEIGHT = 64;
const STATION_GAP = 130;
const MARGIN_X = 20;

// Matches components/pathway/NetworkMap.tsx's off-network marker: a small
// dashed circle read as a fuzzy dot rather than a legible "disconnected"
// ring, and an un-wrapped long Pasal 52 term (e.g. "Pelayanan lain di luar
// manfaat jaminan kesehatan") overflowed this component's fixed 200-unit
// viewBox width entirely.
const OFF_NETWORK_RADIUS = 12;
const OFF_NETWORK_LABEL_GAP = 14;
const OFF_NETWORK_LABEL_MAX_CHARS = 20;
const OFF_NETWORK_LINE_HEIGHT = 15;

/**
 * DESIGN.md v3 §5/§7/§11 — "the local piece of the network, with the
 * current location marked ... sits at the top of every scenario page,
 * every reference entry page, and every condition page." Static inline
 * SVG, no JavaScript, generated from an already-computed `Fragment`
 * (lib/network/fragment.ts's `computeFragment`) — nothing is computed in
 * this component, invariant 18.
 *
 * The diagram is `aria-hidden`; the `sr-only` ordered list beneath it is
 * the actual accessible content — "a diagram without a text path is not
 * finished" (§11).
 */
export function StationFragment({ fragment }: { fragment: Fragment }) {
  if (fragment.type === 'offNetwork') {
    const lines = wrapLabel(fragment.label, OFF_NETWORK_LABEL_MAX_CHARS);
    const labelTopY = 40 + OFF_NETWORK_RADIUS + OFF_NETWORK_LABEL_GAP;
    const viewBoxHeight = labelTopY + (lines.length - 1) * OFF_NETWORK_LINE_HEIGHT + 16;
    return (
      <div className="print:break-inside-avoid">
        <svg
          viewBox={`0 0 200 ${viewBoxHeight}`}
          aria-hidden="true"
          className="w-full max-w-xs h-auto"
        >
          <circle
            cx={100}
            cy={40}
            r={OFF_NETWORK_RADIUS}
            fill="none"
            stroke={colorVarFor('self')}
            strokeWidth={3}
            strokeDasharray="3 5"
          />
          <text x={100} y={labelTopY} textAnchor="middle" className="fill-ink font-medium" fontSize={13}>
            {lines.map((line, lineIndex) => (
              <tspan key={line} x={100} dy={lineIndex === 0 ? 0 : OFF_NETWORK_LINE_HEIGHT}>
                {line}
              </tspan>
            ))}
          </text>
        </svg>
        <p className="text-caption text-ink/70 mt-1">
          {fragment.label} — dikecualikan berdasarkan {fragment.article}, tidak terhubung ke jalur mana pun.
        </p>
        <ol className="sr-only">
          <li>
            {fragment.label}, dikecualikan berdasarkan {fragment.article}, tidak terhubung ke jalur mana pun (posisi
            Anda saat ini).
          </li>
        </ol>
      </div>
    );
  }

  const height = fragment.segments.length * SEGMENT_HEIGHT;
  const width = MARGIN_X * 2 + STATION_GAP * 2;

  return (
    <div className="print:break-inside-avoid">
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="w-full max-w-md h-auto">
        {fragment.segments.map((segment, segmentIndex) => {
          const y = segmentIndex * SEGMENT_HEIGHT + SEGMENT_HEIGHT / 2;
          const lastIndex = segment.stations.length - 1;
          // Centre a segment's stations within the fixed viewBox width — a
          // single- or two-station segment (e.g. the emergency bypass,
          // which only touches one station) would otherwise start flush
          // against the left margin and clip its own label.
          const segmentOffsetX = (width - lastIndex * STATION_GAP) / 2;
          const xFor = (stationIndex: number) => segmentOffsetX + stationIndex * STATION_GAP;
          return (
            <g key={segment.lineId}>
              {lastIndex > 0 && (
                <line
                  x1={xFor(0)}
                  y1={y}
                  x2={xFor(lastIndex)}
                  y2={y}
                  stroke={colorVarFor(segment.colorToken)}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharrayFor(segment.pattern)}
                />
              )}
              {segment.stations.map((station, stationIndex) => (
                <g key={station.id}>
                  <circle
                    cx={xFor(stationIndex)}
                    cy={y}
                    r={station.isCurrent ? 10 : 7}
                    fill={station.isCurrent ? colorVarFor(segment.colorToken) : 'var(--color-paper)'}
                    stroke="var(--color-ink)"
                    strokeWidth={station.isCurrent ? 4 : 2.5}
                  />
                  <text
                    x={xFor(stationIndex)}
                    y={y - 16}
                    textAnchor="middle"
                    className={station.isCurrent ? 'fill-ink font-bold' : 'fill-ink font-medium'}
                    fontSize={12}
                  >
                    {station.label}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <p className="text-caption text-ink/70 mt-1">{fragment.currentLabel}</p>
      <ol className="sr-only">
        {fragment.segments.map((segment) => (
          <li key={segment.lineId}>
            {segment.lineLabel}:{' '}
            {segment.stations
              .map((s) => `${s.label}${s.isCurrent ? ' (posisi Anda saat ini)' : ''}`)
              .join(' → ')}
          </li>
        ))}
      </ol>
    </div>
  );
}
