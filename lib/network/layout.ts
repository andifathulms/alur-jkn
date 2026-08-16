import type { Network } from './schema';
import { wrapLabel } from './wrapLabel';

export interface Point {
  x: number;
  y: number;
}

export interface FullLayout {
  stationPositions: Record<string, Point>;
  offNetworkPositions: Record<string, Point>;
  /** DESIGN.md v3 §5's off-network cluster carries real Pasal 52 terms, some well over a column's width — pre-wrapped here so NetworkMap only ever renders fixed-width `<tspan>` lines, never a raw string that could overflow into its neighbour. */
  offNetworkLabelLines: Record<string, string[]>;
  /** Every station's own label/sublabel, pre-wrapped the same way — the self-branch runs three stations close together diagonally, and an un-wrapped label like "Alat kesehatan di atas batas" both overlapped the branch line and clipped past the left edge of the viewBox. */
  stationLabelLines: Record<string, string[]>;
  stationSublabelLines: Record<string, string[]>;
  viewBoxWidth: number;
  viewBoxHeight: number;
}

const REFERRAL_MARGIN_X = 60;
const REFERRAL_GAP_X = 180;
const REFERRAL_LINE_Y = 80;

// Equal X/Y steps keep the branch at DESIGN.md §5's "45° angles only." Large
// enough that a two-line label above one station and a two-line sublabel
// below the next don't collide along the diagonal.
const SELF_BRANCH_STEP = 85;
const SELF_BRANCH_Y_START_OFFSET = 90;

const STATION_LABEL_MAX_CHARS = 14;
const STATION_LABEL_LINE_HEIGHT = 13;
const STATION_SUBLABEL_MAX_CHARS = 16;
const STATION_SUBLABEL_LINE_HEIGHT = 12;

const CLUSTER_COL_GAP = 150;
// Matches NetworkMap.tsx's OFF_NETWORK_RADIUS (12) + OFF_NETWORK_LABEL_GAP
// (14) + roughly a line of text, so a bigger marker doesn't collide with
// the row below it.
const CLUSTER_ROW_BASE_GAP = 64;
const CLUSTER_LINE_HEIGHT = 14;
const CLUSTER_LABEL_MAX_CHARS = 20;
const CLUSTER_TOP_MARGIN = 110;

const VIEW_MARGIN = 50;

// Matches components/pathway/NetworkMap.tsx's STATION_RADIUS and its
// side-label horizontal gap — needed here only to size the viewBox
// correctly around the self-branch's start-anchored labels.
const STATION_RADIUS = 9;
const SIDE_LABEL_GAP = 10;

// A generous per-character width estimate (Atkinson Hyperlegible, both the
// 13px label and 11px sublabel sizes) used only to keep centred text from
// clipping the viewBox edge — approximate on purpose, padding errs wide.
const APPROX_CHAR_WIDTH = 7;

function widthOf(lines: string[]): number {
  const longest = Math.max(0, ...lines.map((l) => l.length));
  return longest * APPROX_CHAR_WIDTH;
}

/**
 * DESIGN.md v3 §5, "The home page is the network": "The full map, at full
 * width, with the emergency bypass and the off-network exclusions
 * visible." Pure geometry — invariant 18, nothing is computed in a
 * component. Deliberately not hand-authored per-station coordinates (the
 * old components/pathway/PathwayMap.tsx approach): the off-network
 * cluster's size varies with the real Pasal 52 content (11 items today,
 * PRD.md's target is "around twenty-one"), so its layout has to be
 * computed from however many items actually exist, not fixed in advance.
 */
export function computeFullLayout(network: Network): FullLayout {
  const referral = network.lines.find((l) => l.kind === 'referral');
  const careBypass = network.lines.find((l) => l.kind === 'careBypass');
  const selfBranch = network.lines.find((l) => l.kind === 'selfBranch');
  if (!referral || !careBypass || !selfBranch) {
    throw new Error('lib/network/layout.ts: network is missing one of referral/careBypass/selfBranch');
  }

  const stationPositions: Record<string, Point> = {};
  const stationLabelLines: Record<string, string[]> = {};
  const stationSublabelLines: Record<string, string[]> = {};
  for (const station of network.stations) {
    stationLabelLines[station.id] = wrapLabel(station.label, STATION_LABEL_MAX_CHARS);
    stationSublabelLines[station.id] = station.sublabel ? wrapLabel(station.sublabel, STATION_SUBLABEL_MAX_CHARS) : [];
  }

  referral.stationIds.forEach((id, index) => {
    stationPositions[id] = { x: REFERRAL_MARGIN_X + index * REFERRAL_GAP_X, y: REFERRAL_LINE_Y };
  });

  const hub = stationPositions[selfBranch.branchesFromStationId];
  if (!hub) {
    throw new Error(
      `lib/network/layout.ts: self-branch hub station "${selfBranch.branchesFromStationId}" has no referral-line position`,
    );
  }

  selfBranch.stationIds.forEach((id, index) => {
    stationPositions[id] = {
      x: hub.x - (index + 1) * SELF_BRANCH_STEP,
      y: hub.y + SELF_BRANCH_Y_START_OFFSET + index * SELF_BRANCH_STEP,
    };
  });

  const cols = Math.max(1, Math.ceil(Math.sqrt(network.offNetwork.length)));
  const clusterStartY =
    Math.max(
      REFERRAL_LINE_Y,
      hub.y + SELF_BRANCH_Y_START_OFFSET + selfBranch.stationIds.length * SELF_BRANCH_STEP,
    ) + CLUSTER_TOP_MARGIN;

  const offNetworkLabelLines: Record<string, string[]> = {};
  for (const item of network.offNetwork) {
    offNetworkLabelLines[item.id] = wrapLabel(item.label, CLUSTER_LABEL_MAX_CHARS);
  }

  // Row height follows the tallest (most-wrapped) label in that row, not a
  // fixed constant — a row holding one long Pasal 52 term next to short
  // ones still gets enough vertical room for all of that term's lines.
  const rowCount = Math.ceil(network.offNetwork.length / cols);
  const rowHeights: number[] = Array.from({ length: rowCount }, () => CLUSTER_ROW_BASE_GAP);
  network.offNetwork.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const lines = offNetworkLabelLines[item.id]?.length ?? 1;
    const needed = CLUSTER_ROW_BASE_GAP + Math.max(0, lines - 1) * CLUSTER_LINE_HEIGHT;
    rowHeights[row] = Math.max(rowHeights[row]!, needed);
  });
  const rowStartY: number[] = [];
  let cumulativeY = clusterStartY;
  for (const height of rowHeights) {
    rowStartY.push(cumulativeY);
    cumulativeY += height;
  }

  const offNetworkPositions: Record<string, Point> = {};
  network.offNetwork.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    offNetworkPositions[item.id] = {
      x: REFERRAL_MARGIN_X + col * CLUSTER_COL_GAP,
      y: rowStartY[row]!,
    };
  });

  // Self-branch stations render their label/sublabel to the side (start-
  // anchored, right of the circle — see NetworkMap.tsx), since the branch's
  // 45° line runs through the space directly above/below each station.
  // Every other station (including the interchange, whose label and
  // sublabel both stack above the circle — three lines converge on it, so
  // above is the only side clear of all of them) keeps centred text,
  // extending on both sides of its point. Either way, a station near the
  // left edge with a wide label clipped the viewBox before this accounted
  // for label width rather than just the point itself — shift everything
  // right if it would still clip.
  const selfBranchStationIdSet = new Set(selfBranch.stationIds);
  let minReachX = Infinity;
  let maxReachX = -Infinity;
  for (const [id, point] of Object.entries(stationPositions)) {
    const labelWidth = widthOf(stationLabelLines[id] ?? []);
    const sublabelWidth = widthOf(stationSublabelLines[id] ?? []);
    if (selfBranchStationIdSet.has(id)) {
      minReachX = Math.min(minReachX, point.x - STATION_RADIUS);
      maxReachX = Math.max(maxReachX, point.x + STATION_RADIUS + SIDE_LABEL_GAP + Math.max(labelWidth, sublabelWidth));
    } else {
      const half = Math.max(labelWidth, sublabelWidth) / 2;
      minReachX = Math.min(minReachX, point.x - half);
      maxReachX = Math.max(maxReachX, point.x + half);
    }
  }
  for (const [id, point] of Object.entries(offNetworkPositions)) {
    const half = widthOf(offNetworkLabelLines[id] ?? []) / 2;
    minReachX = Math.min(minReachX, point.x - half);
    maxReachX = Math.max(maxReachX, point.x + half);
  }

  const shiftX = minReachX < VIEW_MARGIN ? VIEW_MARGIN - minReachX : 0;
  if (shiftX > 0) {
    for (const point of Object.values(stationPositions)) point.x += shiftX;
    for (const point of Object.values(offNetworkPositions)) point.x += shiftX;
  }

  const allPoints = [...Object.values(stationPositions), ...Object.values(offNetworkPositions)];
  const maxY = Math.max(cumulativeY, ...allPoints.map((p) => p.y));

  return {
    stationPositions,
    offNetworkPositions,
    offNetworkLabelLines,
    stationLabelLines,
    stationSublabelLines,
    viewBoxWidth: maxReachX + shiftX + VIEW_MARGIN,
    viewBoxHeight: maxY + VIEW_MARGIN,
  };
}
