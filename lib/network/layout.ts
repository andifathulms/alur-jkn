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
  viewBoxWidth: number;
  viewBoxHeight: number;
}

const REFERRAL_MARGIN_X = 60;
const REFERRAL_GAP_X = 180;
const REFERRAL_LINE_Y = 80;

const SELF_BRANCH_X_STEP = 55;
const SELF_BRANCH_Y_STEP = 55;
const SELF_BRANCH_Y_START_OFFSET = 90;

const CLUSTER_COL_GAP = 150;
const CLUSTER_ROW_BASE_GAP = 46;
const CLUSTER_LINE_HEIGHT = 14;
const CLUSTER_LABEL_MAX_CHARS = 20;
const CLUSTER_TOP_MARGIN = 110;

const VIEW_MARGIN = 50;

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
      x: hub.x - (index + 1) * SELF_BRANCH_X_STEP,
      y: hub.y + SELF_BRANCH_Y_START_OFFSET + index * SELF_BRANCH_Y_STEP,
    };
  });

  const cols = Math.max(1, Math.ceil(Math.sqrt(network.offNetwork.length)));
  const clusterStartY =
    Math.max(
      REFERRAL_LINE_Y,
      hub.y + SELF_BRANCH_Y_START_OFFSET + selfBranch.stationIds.length * SELF_BRANCH_Y_STEP,
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

  const allPoints = [...Object.values(stationPositions), ...Object.values(offNetworkPositions)];
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const maxY = Math.max(cumulativeY, ...allPoints.map((p) => p.y));

  return {
    stationPositions,
    offNetworkPositions,
    offNetworkLabelLines,
    viewBoxWidth: maxX + VIEW_MARGIN,
    viewBoxHeight: maxY + VIEW_MARGIN,
  };
}
