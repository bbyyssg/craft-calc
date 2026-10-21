// Flat crochet circle: round 1 has `start` stitches worked into the ring; every following
// round adds `start` increases (one increase = two stitches in the same stitch), with one
// more plain stitch between increases each round. Optional staggering moves the increases
// so the circle stays round instead of turning into a polygon.

export interface CircleRound {
  round: number;
  stitches: number;
  /** Plain stitches between increases (null for round 1, which is worked into the ring). */
  between: number | null;
  /** Plain stitches before the first increase when staggered (0 = start with the increase). */
  lead: number;
  /** Plain stitches after the last increase. */
  trail: number;
}

export interface CircleInput {
  start: number; // stitches in round 1 (6 sc, 8 hdc, 12 dc are typical)
  rounds: number;
  stagger?: boolean;
}

export function circleRounds({ start, rounds, stagger = true }: CircleInput): CircleRound[] {
  if (!Number.isInteger(start) || start < 3 || start > 24) throw new Error("start");
  if (!Number.isInteger(rounds) || rounds < 1 || rounds > 100) throw new Error("rounds");
  const out: CircleRound[] = [{ round: 1, stitches: start, between: null, lead: 0, trail: 0 }];
  for (let r = 2; r <= rounds; r++) {
    const between = r - 2;
    // Staggered: on even rounds split the plain stitches of one repeat between the start and end.
    const lead = stagger && r % 2 === 0 ? Math.floor(between / 2) : 0;
    out.push({ round: r, stitches: start * r, between, lead, trail: between - lead });
  }
  return out;
}

/**
 * Rough finished diameter: each round adds about one stitch height to the radius,
 * so diameter ≈ 2 × rounds × round height.
 */
export function circleDiameter(rounds: number, roundHeightCm: number): number {
  if (!(roundHeightCm > 0)) throw new Error("height");
  return Math.round(2 * rounds * roundHeightCm * 10) / 10;
}

/** Rounds needed for a target diameter (rounded up). */
export function roundsForDiameter(diameterCm: number, roundHeightCm: number): number {
  if (!(diameterCm > 0) || !(roundHeightCm > 0)) throw new Error("input");
  return Math.ceil(diameterCm / (2 * roundHeightCm) - 1e-9);
}
