// Cost and price of a batch of container candles.
//
// Cost per candle = materials (wax + fragrance + wick + container + label/packaging)
//                 + labour (batch minutes × hourly rate ÷ candles)
//                 + overhead (a % of materials + labour: electricity, tools, failed tests…).
// Keystone pricing: wholesale = cost × 2, retail = wholesale × 2 (both multipliers editable).
// Currency-agnostic: every price is in whatever currency the user types.

export interface CandleCostInput {
  count: number; // candles in the batch
  waxPricePerKg: number;
  waxGrams: number; // per candle
  fragrancePrice: number; // price of one bottle/pack
  fragranceBottleGrams: number; // size of that bottle in grams (1000 = price per kg)
  fragranceGrams: number; // per candle
  wick: number; // per candle
  container: number; // per candle (jar, tin, lid)
  packaging: number; // per candle (label, box, bag)
  laborMinutes: number; // for the whole batch
  hourlyRate: number;
  overheadPercent?: number; // on materials + labour, default 0
  wholesaleMultiplier?: number; // × cost, default 2
  retailMultiplier?: number; // × wholesale, default 2
}

export interface CandleCostResult {
  perCandle: {
    wax: number;
    fragrance: number;
    wick: number;
    container: number;
    packaging: number;
    materials: number;
    labor: number;
    overhead: number;
    cost: number;
  };
  batchCost: number;
  wholesale: number; // per candle
  retail: number; // per candle
  wholesaleProfit: number; // per candle, on top of the labour already counted in cost
  retailProfit: number;
  batchWholesale: number;
  batchRetail: number;
}

export type CandleCostError = "count" | "wax" | "fragrance" | "money" | "overhead" | "multiplier";

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const nonNeg = (n: number) => Number.isFinite(n) && n >= 0;

export function validateCandleCost(i: CandleCostInput): CandleCostError | null {
  if (!Number.isInteger(i.count) || i.count < 1) return "count";
  if (!nonNeg(i.waxPricePerKg) || !(i.waxGrams > 0) || !Number.isFinite(i.waxGrams)) return "wax";
  if (!nonNeg(i.fragranceGrams) || !nonNeg(i.fragrancePrice)) return "fragrance";
  if (i.fragranceGrams > 0 && i.fragrancePrice > 0 && !(i.fragranceBottleGrams > 0)) return "fragrance";
  if (![i.wick, i.container, i.packaging, i.laborMinutes, i.hourlyRate].every(nonNeg)) return "money";
  const overhead = i.overheadPercent ?? 0;
  if (!nonNeg(overhead) || overhead > 200) return "overhead";
  for (const m of [i.wholesaleMultiplier ?? 2, i.retailMultiplier ?? 2]) {
    if (!(m >= 1 && m <= 10)) return "multiplier";
  }
  return null;
}

export function candleCost(i: CandleCostInput): CandleCostResult {
  const error = validateCandleCost(i);
  if (error) throw new Error(error);
  const wax = (i.waxPricePerKg * i.waxGrams) / 1000;
  const fragrance = i.fragranceGrams > 0 && i.fragrancePrice > 0 ? (i.fragrancePrice * i.fragranceGrams) / i.fragranceBottleGrams : 0;
  const materials = wax + fragrance + i.wick + i.container + i.packaging;
  const labor = ((i.laborMinutes / 60) * i.hourlyRate) / i.count;
  const overhead = ((materials + labor) * (i.overheadPercent ?? 0)) / 100;
  // Round the cost first so the displayed prices are exactly cost × multiplier.
  const cost = round2(materials + labor + overhead);
  const wholesale = round2(cost * (i.wholesaleMultiplier ?? 2));
  const retail = round2(wholesale * (i.retailMultiplier ?? 2));
  return {
    perCandle: {
      wax: round2(wax),
      fragrance: round2(fragrance),
      wick: round2(i.wick),
      container: round2(i.container),
      packaging: round2(i.packaging),
      materials: round2(materials),
      labor: round2(labor),
      overhead: round2(overhead),
      cost,
    },
    batchCost: round2(cost * i.count),
    wholesale,
    retail,
    wholesaleProfit: round2(wholesale - cost),
    retailProfit: round2(retail - cost),
    batchWholesale: round2(wholesale * i.count),
    batchRetail: round2(retail * i.count),
  };
}
