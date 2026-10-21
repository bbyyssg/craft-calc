// Gauge (tension) maths: stitches and rows for a size, and converting a pattern to your gauge.

export interface Gauge {
  count: number; // stitches (or rows) counted in the swatch
  over: number; // over this many cm (usually 10)
}

const per = (g: Gauge) => {
  if (!(g.count > 0) || !(g.over > 0)) throw new Error("gauge");
  return g.count / g.over;
};

/** Stitches (or rows) needed for `cm` at the given gauge, unrounded. */
export function countForSize(g: Gauge, cm: number): number {
  if (!(cm > 0)) throw new Error("size");
  return per(g) * cm;
}

/** Size in cm that `count` stitches (or rows) measure at the given gauge. */
export function sizeForCount(g: Gauge, count: number): number {
  if (!(count > 0)) throw new Error("count");
  return count / per(g);
}

/** Convert a pattern's stitch (or row) count to your gauge, unrounded. */
export function convertCount(patternCount: number, patternGauge: Gauge, yourGauge: Gauge): number {
  if (!(patternCount > 0)) throw new Error("count");
  return (patternCount * per(yourGauge)) / per(patternGauge);
}

/**
 * Round `value` to the nearest number of the form multiple × n + extra (n ≥ 1),
 * e.g. ribbing 2×2 + 2 edge stitches → 2n + 2. Ties go up. multiple = 1, extra = 0 → plain rounding.
 */
export function roundToMultiple(value: number, multiple = 1, extra = 0): number {
  if (!Number.isInteger(multiple) || multiple < 1) throw new Error("multiple");
  if (!Number.isInteger(extra) || extra < 0) throw new Error("extra");
  const n = Math.max(1, Math.floor((value - extra) / multiple + 0.5));
  return n * multiple + extra;
}
