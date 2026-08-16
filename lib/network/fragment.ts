import type { Network, LineColorToken, LinePattern } from './schema';

/** Where a reader currently is, for a station fragment — a real network station, an off-network Pasal 52 item, or unknown. */
export type Position = { type: 'station'; stationId: string } | { type: 'offNetwork'; itemId: string } | null;

export interface FragmentStation {
  id: string;
  label: string;
  sublabel?: string;
  isCurrent: boolean;
}

export interface FragmentSegment {
  lineId: string;
  lineLabel: string;
  colorToken: LineColorToken;
  pattern: LinePattern;
  /** A local window, not the whole line — DESIGN.md §5: "the local piece of the network." */
  stations: FragmentStation[];
}

export interface OffNetworkFragment {
  type: 'offNetwork';
  id: string;
  label: string;
  article: string;
}

export interface StationFragmentView {
  type: 'network';
  segments: FragmentSegment[];
  /** The sentence a sr-only reader gets and a visible caption can reuse — "you are here," in words. */
  currentLabel: string;
}

export type Fragment = StationFragmentView | OffNetworkFragment;

function stationById(network: Network, id: string) {
  const station = network.stations.find((s) => s.id === id);
  if (!station) throw new Error(`lib/network/fragment.ts: unknown station id "${id}"`);
  return station;
}

/** A window of at most 3 stations around `centerId` within an ordered id list — the station before, itself, and after. */
function windowAround(stationIds: readonly string[], centerId: string): string[] {
  const index = stationIds.indexOf(centerId);
  if (index === -1) return [];
  const start = Math.max(0, index - 1);
  const end = Math.min(stationIds.length, index + 2);
  return stationIds.slice(start, end);
}

function segmentForLine(network: Network, lineId: string, windowIds: string[], currentStationId: string): FragmentSegment {
  const line = network.lines.find((l) => l.id === lineId);
  if (!line) throw new Error(`lib/network/fragment.ts: unknown line id "${lineId}"`);
  return {
    lineId: line.id,
    lineLabel: line.label,
    colorToken: line.colorToken,
    pattern: line.pattern,
    stations: windowIds.map((id) => {
      const station = stationById(network, id);
      return { id: station.id, label: station.label, sublabel: station.sublabel, isCurrent: id === currentStationId };
    }),
  };
}

/**
 * DESIGN.md §5/§11: the local piece of the network around a position, plus
 * the sentence its sr-only text equivalent is built from. Pure — no
 * rendering, invariant 18 ("nothing is computed in a component"); a
 * component only renders whatever this returns.
 */
export function computeFragment(network: Network, position: Position): Fragment {
  if (position === null) {
    const referral = network.lines.find((l) => l.kind === 'referral');
    if (!referral) throw new Error('lib/network/fragment.ts: no referral line in network');
    return {
      type: 'network',
      segments: [
        {
          lineId: referral.id,
          lineLabel: referral.label,
          colorToken: referral.colorToken,
          pattern: referral.pattern,
          stations: referral.stationIds.map((id) => {
            const station = stationById(network, id);
            return { id: station.id, label: station.label, sublabel: station.sublabel, isCurrent: false };
          }),
        },
      ],
      currentLabel: 'Posisi belum ditentukan.',
    };
  }

  if (position.type === 'offNetwork') {
    const item = network.offNetwork.find((o) => o.id === position.itemId);
    if (!item) throw new Error(`lib/network/fragment.ts: unknown off-network item id "${position.itemId}"`);
    return { type: 'offNetwork', id: item.id, label: item.label, article: item.article };
  }

  const { stationId } = position;
  const station = stationById(network, stationId);

  const linesTouchingStation = network.lines.filter(
    (line) => line.stationIds.includes(stationId) || (line.kind === 'selfBranch' && line.branchesFromStationId === stationId),
  );

  const segments: FragmentSegment[] = [];
  for (const line of linesTouchingStation) {
    if (line.stationIds.includes(stationId)) {
      segments.push(segmentForLine(network, line.id, windowAround(line.stationIds, stationId), stationId));
    } else if (line.kind === 'selfBranch') {
      // The station is where this branch starts, not on the branch itself — show its first stop or two for context.
      const preview = line.stationIds.slice(0, 2);
      segments.push({
        lineId: line.id,
        lineLabel: line.label,
        colorToken: line.colorToken,
        pattern: line.pattern,
        stations: preview.map((id) => {
          const s = stationById(network, id);
          return { id: s.id, label: s.label, sublabel: s.sublabel, isCurrent: false };
        }),
      });
    }
  }

  return {
    type: 'network',
    segments,
    currentLabel: `Posisi Anda: ${station.label}${station.sublabel ? ` (${station.sublabel})` : ''}.`,
  };
}
