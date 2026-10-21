import { test } from "node:test";
import assert from "node:assert/strict";
import { distribute, evenSplit, toRuns, validateDistribute, changesBetween } from "./distribute.ts";
import { circleRounds, circleDiameter, roundsForDiameter } from "./circle.ts";
import { countForSize, sizeForCount, convertCount, roundToMultiple } from "./gauge.ts";
import { candleFromWater, candleFromTotal, fragranceForWax } from "./candle.ts";

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

test("evenSplit: parts differ by at most 1 and add up", () => {
  for (const [t, p] of [[58, 10], [7, 3], [100, 7], [5, 5], [0, 4]]) {
    const parts = evenSplit(t, p);
    assert.equal(parts.length, p);
    assert.equal(sum(parts), t);
    assert.ok(Math.max(...parts) - Math.min(...parts) <= 1);
  }
});

test("toRuns groups consecutive equal gaps", () => {
  assert.deepEqual(toRuns([3, 3, 4, 4, 4, 3]), [
    { knit: 3, times: 2 },
    { knit: 4, times: 3 },
    { knit: 3, times: 1 },
  ]);
});

test("distribute: 20 sts, 4 increases in the round = (k5, M1) x 4", () => {
  const r = distribute({ stitches: 20, changes: 4, shaping: "inc", mode: "round" });
  assert.deepEqual(r.runs, [{ knit: 5, times: 4 }]);
  assert.equal(r.tail, 0);
  assert.equal(r.finalStitches, 24);
});

test("distribute: 58 sts + 10 increases flat (tricotandocroche example) keeps edges plain", () => {
  const r = distribute({ stitches: 58, changes: 10, shaping: "inc", mode: "flat" });
  assert.equal(r.gaps.length, 10);
  assert.equal(sum(r.gaps) + r.tail, 58);
  assert.ok(r.gaps[0] >= 1 && r.tail >= 1);
  assert.ok(r.gaps.slice(1).every((g) => g === 5 || g === 6));
  assert.equal(r.finalStitches, 68);
});

test("distribute: decreases use two stitches each", () => {
  const r = distribute({ stitches: 60, changes: 10, shaping: "dec", mode: "round" });
  assert.deepEqual(r.runs, [{ knit: 4, times: 10 }]); // (k4, k2tog) x 10 = 60
  assert.equal(r.finalStitches, 50);
  const f = distribute({ stitches: 61, changes: 6, shaping: "dec", mode: "flat" });
  assert.equal(sum(f.gaps) + f.tail + 2 * 6, 61);
  assert.equal(f.finalStitches, 55);
});

test("distribute: every stitch increased in the round", () => {
  const r = distribute({ stitches: 12, changes: 12, shaping: "inc", mode: "round" });
  assert.deepEqual(r.runs, [{ knit: 1, times: 12 }]);
  assert.equal(r.finalStitches, 24);
});

test("distribute: rejects impossible requests", () => {
  assert.equal(validateDistribute({ stitches: 10, changes: 6, shaping: "dec", mode: "round" }), "tooManyDec");
  assert.equal(validateDistribute({ stitches: 10, changes: 10, shaping: "inc", mode: "flat" }), "tooManyInc");
  assert.equal(validateDistribute({ stitches: 10, changes: 0, shaping: "inc", mode: "flat" }), "changes");
  assert.equal(validateDistribute({ stitches: 2.5, changes: 1, shaping: "inc", mode: "flat" }), "stitches");
  assert.throws(() => distribute({ stitches: 10, changes: 6, shaping: "dec", mode: "round" }));
});

test("distribute: totals always balance (property check)", () => {
  for (let n = 2; n <= 80; n++) {
    for (let k = 1; k <= n; k++) {
      for (const shaping of ["inc", "dec"] as const) {
        for (const mode of ["flat", "round"] as const) {
          const input = { stitches: n, changes: k, shaping, mode };
          if (validateDistribute(input)) continue;
          const r = distribute(input);
          const used = sum(r.gaps) + r.tail + (shaping === "dec" ? 2 * k : 0);
          assert.equal(used, n, JSON.stringify(input));
          assert.ok(r.gaps.every((g) => g >= 0));
          const all = mode === "flat" ? r.gaps.slice(1) : r.gaps;
          if (all.length) assert.ok(Math.max(...all) - Math.min(...all) <= 1, JSON.stringify(input));
        }
      }
    }
  }
});

test("changesBetween", () => {
  assert.deepEqual(changesBetween(80, 96), { shaping: "inc", changes: 16 });
  assert.deepEqual(changesBetween(96, 80), { shaping: "dec", changes: 16 });
});

test("circle: 6 sc start → 6, 12, 18, 24", () => {
  const r = circleRounds({ start: 6, rounds: 4, stagger: false });
  assert.deepEqual(r.map((x) => x.stitches), [6, 12, 18, 24]);
  assert.deepEqual(r.map((x) => x.between), [null, 0, 1, 2]);
});

test("circle: 12 dc start → round 6 has 72 (Melonchillo example)", () => {
  const r = circleRounds({ start: 12, rounds: 6 });
  assert.equal(r[5].stitches, 72);
  assert.equal(r[3].stitches, 48);
});

test("circle: staggered rounds still add up", () => {
  for (const x of circleRounds({ start: 6, rounds: 20 }).slice(1)) {
    const s = 6;
    const total = x.lead + x.trail + (x.between ?? 0) * (s - 1) + 2 * s;
    assert.equal(total, x.stitches);
    assert.equal(x.lead + x.trail, x.between);
  }
});

test("circle: diameter estimate and inverse", () => {
  assert.equal(circleDiameter(10, 0.5), 10);
  assert.equal(roundsForDiameter(10, 0.5), 10);
  assert.equal(roundsForDiameter(10.1, 0.5), 11);
  assert.throws(() => circleRounds({ start: 2, rounds: 3 }));
});

test("gauge: 18 sts / 10 cm, 55 cm → 99 sts (rule of three)", () => {
  assert.equal(countForSize({ count: 18, over: 10 }, 55), 99);
  assert.equal(countForSize({ count: 24, over: 10 }, 60), 144);
  assert.equal(sizeForCount({ count: 20, over: 10 }, 94), 47);
});

test("gauge: non-10 cm swatch (10 sts in 7.5 cm, 23 cm → 30.67)", () => {
  assert.ok(Math.abs(countForSize({ count: 10, over: 7.5 }, 23) - 30.6667) < 1e-3);
});

test("gauge: convert pattern 44 sts at 17/10 to 23/10 → ≈ 59.5 → 60", () => {
  const v = convertCount(44, { count: 17, over: 10 }, { count: 23, over: 10 });
  assert.ok(Math.abs(v - 59.529) < 1e-3);
  assert.equal(roundToMultiple(v), 60);
});

test("gauge: round to a stitch multiple", () => {
  assert.equal(roundToMultiple(99, 4, 2), 98); // 4n + 2
  assert.equal(roundToMultiple(100, 4, 2), 102); // tie goes up
  assert.equal(roundToMultiple(101, 4, 0), 100);
  assert.equal(roundToMultiple(1, 6, 1), 7); // never below one repeat
  assert.throws(() => roundToMultiple(10, 0));
});

test("candle: 100 g water, 8% of wax (candlesmolds example) → 79.6 g wax + 6.4 g fragrance", () => {
  const r = candleFromWater(100, 8);
  assert.equal(r.total, 86);
  assert.equal(r.wax, 79.6);
  assert.equal(r.fragrance, 6.4);
});

test("candle: finished 340 g at 10% (Noveltties Plus example) → 309.1 + 30.9", () => {
  const r = candleFromTotal(340, 10);
  assert.equal(r.wax, 309.1);
  assert.equal(r.fragrance, 30.9);
});

test("candle: several candles and fragrance for a known wax weight", () => {
  const r = candleFromWater(250, 10, 4);
  assert.equal(r.total, 860);
  assert.equal(r.perCandle.total, 215);
  assert.equal(r.wax + r.fragrance, 860);
  assert.equal(fragranceForWax(500, 8), 40);
  assert.equal(fragranceForWax(200, 7), 14);
  assert.throws(() => candleFromWater(0, 8));
  assert.throws(() => candleFromWater(100, 8, 1.5));
});
