import type { Network } from '@/lib/network/schema';
import type { FullLayout } from '@/lib/network/layout';
import type { ConditionHighlight } from '@/lib/network/highlightedRoute';
import { strokeDasharrayFor } from '@/lib/network/linePatternStroke';
import { colorVarFor } from '@/lib/network/lineColorVar';

const INTERCHANGE_RADIUS = 14;
const STATION_RADIUS = 9;
// Large enough that the dashed stroke reads as a ring — at the old r=6 it
// compressed into a fuzzy dot indistinguishable from a loading spinner,
// which defeats DESIGN.md §5's point ("stations connected to nothing" is
// the whole argument, and it can't land if the marker itself is illegible).
const OFF_NETWORK_RADIUS = 12;
const OFF_NETWORK_LABEL_GAP = 14;
const DIMMED_OPACITY = 0.25;
const LABEL_LINE_HEIGHT = 13;
const SUBLABEL_LINE_HEIGHT = 12;

/**
 * DESIGN.md v3 §5, "The home page is the network": the full map, every
 * station, every line, the off-network cluster — not a fragment. Static
 * inline SVG (aria-hidden) plus a sr-only text equivalent, generated from
 * `network` and an already-computed `layout` (lib/network/layout.ts) —
 * nothing is computed in this component, invariant 18.
 *
 * `highlight` is optional — omitted (the home page, `/alur`) every line
 * and station renders at full opacity. When present (a condition page,
 * DESIGN.md v3 §5 "Condition pages carry their own route"), anything not
 * named in `highlight` dims instead of disappearing — "everything else
 * dimmed," not hidden, so the rest of the system stays legible as context.
 */
export function NetworkMap({
  network,
  layout,
  highlight,
}: {
  network: Network;
  layout: FullLayout;
  highlight?: ConditionHighlight;
}) {
  const selfBranchLine = network.lines.find((l) => l.kind === 'selfBranch');
  const interchangeId = selfBranchLine?.branchesFromStationId;
  const selfBranchStationIds = new Set(selfBranchLine?.stationIds ?? []);
  const lineOpacity = (lineId: string) => (!highlight || highlight.lineIds.has(lineId) ? 1 : DIMMED_OPACITY);
  const stationOpacity = (stationId: string) =>
    !highlight || highlight.stationIds.has(stationId) ? 1 : DIMMED_OPACITY;

  return (
    <div className="print:break-inside-avoid">
      <svg
        viewBox={`0 0 ${layout.viewBoxWidth} ${layout.viewBoxHeight}`}
        aria-hidden="true"
        className="w-full h-auto"
      >
        {network.lines.map((line) => {
          const points = line.stationIds
            .map((id) => layout.stationPositions[id])
            .filter((p): p is { x: number; y: number } => Boolean(p));

          if (line.kind === 'careBypass') {
            const target = points[0];
            if (!target) return null;
            const entryY = target.y + 90;
            return (
              <path
                key={line.id}
                d={`M ${target.x} ${entryY} L ${target.x} ${target.y}`}
                stroke={colorVarFor(line.colorToken)}
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray={strokeDasharrayFor(line.pattern)}
                opacity={lineOpacity(line.id)}
              />
            );
          }

          if (line.kind === 'selfBranch') {
            const hub = layout.stationPositions[line.branchesFromStationId];
            if (!hub) return null;
            const path = [hub, ...points].map((p) => `${p.x} ${p.y}`).join(' L ');
            return (
              <path
                key={line.id}
                d={`M ${path}`}
                fill="none"
                stroke={colorVarFor(line.colorToken)}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={strokeDasharrayFor(line.pattern)}
                opacity={lineOpacity(line.id)}
              />
            );
          }

          if (points.length < 2) return null;
          const path = points.map((p) => `${p.x} ${p.y}`).join(' L ');
          return (
            <path
              key={line.id}
              d={`M ${path}`}
              fill="none"
              stroke={colorVarFor(line.colorToken)}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={strokeDasharrayFor(line.pattern)}
              opacity={lineOpacity(line.id)}
            />
          );
        })}

        {network.stations.map((station) => {
          const point = layout.stationPositions[station.id];
          if (!point) return null;
          const isInterchange = station.id === interchangeId;
          const isSelfBranchStation = selfBranchStationIds.has(station.id);
          const labelLines = layout.stationLabelLines[station.id] ?? [station.label];
          const sublabelLines = layout.stationSublabelLines[station.id] ?? [];
          const radius = isInterchange ? INTERCHANGE_RADIUS : STATION_RADIUS;

          // The self-branch runs at 45° — a label centred directly above its
          // station (fine for the horizontal referral line) sits right on
          // top of the diagonal line connecting it to its neighbours. Those
          // stations get their label/sublabel to the side instead, clear of
          // the line in both directions.
          //
          // The interchange has three lines converging on it (referral,
          // care-bypass, self-branch) — there's no side or below-circle
          // space that's clear of at least one of them, so both its label
          // and sublabel stack above the circle instead (sublabel on top,
          // since the label is the more prominent line and sits closer).
          const labelBlockHeight = (labelLines.length - 1) * LABEL_LINE_HEIGHT;
          const sublabelBlockHeight = (sublabelLines.length - 1) * SUBLABEL_LINE_HEIGHT;

          const labelX = isSelfBranchStation ? point.x + radius + 10 : point.x;
          const labelAnchor = isSelfBranchStation ? 'start' : 'middle';
          const sublabelX = isSelfBranchStation ? point.x + radius + 10 : point.x;
          const sublabelAnchor = isSelfBranchStation ? 'start' : 'middle';

          const labelTopY = isSelfBranchStation
            ? point.y - labelBlockHeight / 2 + 4
            : point.y - (isInterchange ? 22 : 16) - labelBlockHeight;
          const sublabelTopY = isSelfBranchStation
            ? labelTopY + labelBlockHeight + LABEL_LINE_HEIGHT + 2
            : isInterchange
              ? labelTopY - sublabelBlockHeight - SUBLABEL_LINE_HEIGHT - 6
              : point.y + 22;

          return (
            <g key={station.id} opacity={stationOpacity(station.id)}>
              <circle
                cx={point.x}
                cy={point.y}
                r={radius}
                fill="var(--color-paper)"
                stroke="var(--color-ink)"
                strokeWidth={isInterchange ? 4 : 3}
              />
              <text x={labelX} y={labelTopY} textAnchor={labelAnchor} className="fill-ink font-medium" fontSize={13}>
                {labelLines.map((line, lineIndex) => (
                  <tspan key={line} x={labelX} dy={lineIndex === 0 ? 0 : LABEL_LINE_HEIGHT}>
                    {line}
                  </tspan>
                ))}
              </text>
              {sublabelLines.length > 0 && (
                <text x={sublabelX} y={sublabelTopY} textAnchor={sublabelAnchor} className="fill-ink/70" fontSize={11}>
                  {sublabelLines.map((line, lineIndex) => (
                    <tspan key={line} x={sublabelX} dy={lineIndex === 0 ? 0 : SUBLABEL_LINE_HEIGHT}>
                      {line}
                    </tspan>
                  ))}
                </text>
              )}
            </g>
          );
        })}

        {network.offNetwork.map((item) => {
          const point = layout.offNetworkPositions[item.id];
          const lines = layout.offNetworkLabelLines[item.id] ?? [item.label];
          if (!point) return null;
          return (
            <g key={item.id} opacity={highlight ? DIMMED_OPACITY : 1}>
              <circle
                cx={point.x}
                cy={point.y}
                r={OFF_NETWORK_RADIUS}
                fill="none"
                stroke="var(--color-self)"
                strokeWidth={3}
                strokeDasharray="3 5"
              />
              <text
                x={point.x}
                y={point.y + OFF_NETWORK_RADIUS + OFF_NETWORK_LABEL_GAP}
                textAnchor="middle"
                className="fill-ink"
                fontSize={11}
              >
                {lines.map((line, lineIndex) => (
                  <tspan key={line} x={point.x} dy={lineIndex === 0 ? 0 : 13}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>

      <ol className="sr-only">
        {network.lines.map((line) => (
          <li key={line.id}>
            {line.label}: {line.stationIds.map((id) => network.stations.find((s) => s.id === id)?.label).join(' → ')}
          </li>
        ))}
        <li>
          Dikecualikan, tidak terhubung ke jalur mana pun (Pasal 52):{' '}
          {network.offNetwork.map((item) => `${item.label} (${item.article})`).join('; ')}
        </li>
      </ol>
    </div>
  );
}
