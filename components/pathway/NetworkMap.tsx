import type { Network } from '@/lib/network/schema';
import type { FullLayout } from '@/lib/network/layout';
import type { ConditionHighlight } from '@/lib/network/highlightedRoute';
import { strokeDasharrayFor } from '@/lib/network/linePatternStroke';
import { colorVarFor } from '@/lib/network/lineColorVar';

const INTERCHANGE_RADIUS = 14;
const STATION_RADIUS = 9;
const OFF_NETWORK_RADIUS = 6;
const DIMMED_OPACITY = 0.25;

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
  const interchangeId = network.lines.find((l) => l.kind === 'selfBranch')?.branchesFromStationId;
  const lineOpacity = (lineId: string) => (!highlight || highlight.lineIds.has(lineId) ? 1 : DIMMED_OPACITY);
  const stationOpacity = (stationId: string) =>
    !highlight || highlight.stationIds.has(stationId) ? 1 : DIMMED_OPACITY;

  return (
    <div>
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
          return (
            <g key={station.id} opacity={stationOpacity(station.id)}>
              <circle
                cx={point.x}
                cy={point.y}
                r={isInterchange ? INTERCHANGE_RADIUS : STATION_RADIUS}
                fill="var(--color-paper)"
                stroke="var(--color-ink)"
                strokeWidth={isInterchange ? 4 : 3}
              />
              <text x={point.x} y={point.y - (isInterchange ? 22 : 16)} textAnchor="middle" className="fill-ink font-medium" fontSize={13}>
                {station.label}
              </text>
              {station.sublabel && (
                <text x={point.x} y={point.y + (isInterchange ? 30 : 22)} textAnchor="middle" className="fill-ink/70" fontSize={11}>
                  {station.sublabel}
                </text>
              )}
            </g>
          );
        })}

        {network.offNetwork.map((item) => {
          const point = layout.offNetworkPositions[item.id];
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
                strokeDasharray="2 4"
              />
              <text x={point.x} y={point.y + 20} textAnchor="middle" className="fill-ink" fontSize={11}>
                {item.label}
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
