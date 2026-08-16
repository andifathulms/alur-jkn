import { z } from 'zod';

/**
 * Where a piece of content sits on the network — DESIGN.md v3 §5: "It is
 * static inline SVG generated from the content schema's existing position
 * field." Shared by scenario/reference/condition content schemas
 * (lib/content/*.ts) so every content type points at the same network,
 * lib/network/definition.ts's `network`.
 */
export const PositionSchema = z
  .union([
    z.object({ type: z.literal('station'), stationId: z.string().min(1) }).strict(),
    z.object({ type: z.literal('offNetwork'), itemId: z.string().min(1) }).strict(),
  ])
  .nullable();
export type Position = z.infer<typeof PositionSchema>;
