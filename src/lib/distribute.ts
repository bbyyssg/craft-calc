// Spread increases or decreases evenly across a row (flat) or a round (in the round).
//
// Increase: one new stitch (e.g. M1) is made between two stitches, so it uses no stitches.
// Decrease: each decrease (e.g. k2tog) works two stitches into one.
// Flat rows leave plain stitches at both edges (k + 1 gaps); rounds have k equal gaps.

export type Shaping = "inc" | "dec";
export type Mode = "flat" | "round";

export interface DistributeInput {
  stitches: number; // stitches currently on the needle
  changes: number; // number of increases or decreases to work
  shaping: Shaping;
  mode: Mode;
}

/** A group of identical repeats: work `knit` plain stitches then one inc/dec, `times` times. */
export interface Run {
  knit: number;
  times: number;
}

export interface DistributeResult {
  /** Plain stitches before each inc/dec, in order. Length = changes. */
  gaps: number[];
  /** Plain stitches after the last inc/dec (always 0 in the round). */
  tail: number;
  runs: Run[];
  finalStitches: number;
}

/** Split `total` into `parts` integers that differ by at most 1, spread as evenly as possible. */
export function evenSplit(total: number, parts: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < parts; i++) {
    out.push(Math.floor(((i + 1) * total) / parts) - Math.floor((i * total) / parts));
  }
  return out;
}

/** Collapse consecutive equal gaps into runs. */
export function toRuns(gaps: number[]): Run[] {
  const runs: Run[] = [];
  for (const g of gaps) {
    const last = runs[runs.length - 1];
    if (last && last.knit === g) last.times++;
    else runs.push({ knit: g, times: 1 });
  }
  return runs;
}

export function validateDistribute({ stitches, changes, shaping, mode }: DistributeInput): string | null {
  if (!Number.isInteger(stitches) || stitches < 1) return "stitches";
  if (!Number.isInteger(changes) || changes < 1) return "changes";
  if (shaping === "inc" && changes > (mode === "flat" ? stitches - 1 : stitches)) return "tooManyInc";
  if (shaping === "dec" && changes * 2 > stitches) return "tooManyDec";
  return null;
}

export function distribute(input: DistributeInput): DistributeResult {
  const error = validateDistribute(input);
  if (error) throw new Error(error);
  const { stitches, changes, shaping, mode } = input;
  // Stitches worked plain (not used by a decrease).
  const plain = shaping === "inc" ? stitches : stitches - 2 * changes;
  const segments = mode === "flat" ? changes + 1 : changes;

  let parts = evenSplit(plain, segments);
  if (mode === "flat") {
    // Prefer a symmetric layout [a/2, a, a, ..., a, a/2]: split into `changes` gaps and share
    // the first gap between both edges. Keep the plain split if that would leave an edge empty.
    const inner = evenSplit(plain, changes);
    const head = Math.ceil(inner[0] / 2);
    const tail = inner[0] - head;
    if (tail > 0) parts = [head, ...inner.slice(1), tail];
  }

  const gaps = parts.slice(0, changes);
  const tail = mode === "flat" ? parts[changes] : 0;
  const finalStitches = shaping === "inc" ? stitches + changes : stitches - changes;
  return { gaps, tail, runs: toRuns(gaps), finalStitches };
}

/** Helper: number of changes needed to go from `from` to `to` stitches. */
export function changesBetween(from: number, to: number): { shaping: Shaping; changes: number } {
  return to >= from ? { shaping: "inc", changes: to - from } : { shaping: "dec", changes: from - to };
}
