// Container candle maths. Fragrance load is a percentage of the WAX weight
// (the usual convention of wax suppliers): fragrance = wax × load.
//
// Fill weight from a water test: weigh the water that fills the container up to the
// desired level, multiply by the wax factor (~0.86 for most container waxes, i.e. wax is
// about 86% as dense as water). That fill weight holds wax + fragrance together.

export const WAX_FACTORS = {
  soy: 0.86,
  paraffin: 0.86,
  coconut: 0.86,
  beeswax: 0.96,
} as const;

export interface CandleResult {
  wax: number; // grams of wax in total
  fragrance: number; // grams of fragrance oil in total
  total: number; // wax + fragrance
  perCandle: { wax: number; fragrance: number; total: number };
}

const round1 = (n: number) => Math.round((n + Number.EPSILON) * 10) / 10;

function split(totalPerCandle: number, loadPercent: number, count: number): CandleResult {
  if (!(loadPercent >= 0) || loadPercent > 50) throw new Error("load");
  if (!Number.isInteger(count) || count < 1) throw new Error("count");
  const waxEach = totalPerCandle / (1 + loadPercent / 100);
  const fragEach = totalPerCandle - waxEach;
  return {
    wax: round1(waxEach * count),
    fragrance: round1(fragEach * count),
    total: round1(totalPerCandle * count),
    perCandle: { wax: round1(waxEach), fragrance: round1(fragEach), total: round1(totalPerCandle) },
  };
}

/** From the water weight (g) a container holds → wax and fragrance. */
export function candleFromWater(waterGrams: number, loadPercent: number, count = 1, waxFactor = 0.86): CandleResult {
  if (!(waterGrams > 0)) throw new Error("water");
  if (!(waxFactor > 0.5 && waxFactor <= 1.1)) throw new Error("factor");
  return split(waterGrams * waxFactor, loadPercent, count);
}

/** From the desired finished weight of one candle (wax + fragrance) → wax and fragrance. */
export function candleFromTotal(totalGrams: number, loadPercent: number, count = 1): CandleResult {
  if (!(totalGrams > 0)) throw new Error("total");
  return split(totalGrams, loadPercent, count);
}

/** Fragrance for a known wax weight: wax × load. */
export function fragranceForWax(waxGrams: number, loadPercent: number): number {
  if (!(waxGrams > 0) || !(loadPercent >= 0)) throw new Error("input");
  return round1((waxGrams * loadPercent) / 100);
}
