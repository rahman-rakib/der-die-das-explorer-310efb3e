/**
 * Geometry test for the Endings circular packer (src/lib/endingLayout.ts).
 * No DOM/test-runner needed — asserts the packer output over the REAL ending
 * sets: every bubble inside the disk, no overlaps, reading order preserved.
 *
 * Run:  node_modules/.bin/esbuild scripts/verify-ending-layout.ts --bundle \\
 *         --platform=node --format=esm --outfile=/tmp/vp.mjs && node /tmp/vp.mjs
 */
import rulesData from "../src/data/rules.json";
import { endingBox, packEndings, sharedEndingScale } from "../src/lib/endingLayout";

const RAW = rulesData as { rules: Record<string, any[]> };

const ARTS = ["der", "die", "das"];
const endingsOf = (art: string) => (RAW.rules[art] ?? []).filter(r => r.examples.length >= 5);

// Mirror the component's display order: alphabetical, then deterministic adjacent
// swaps (same as RulesView.endingDisplayOrder). The scale is order-sensitive, so
// scale-computation and packing must use this SAME order.
function displayOrder(art: string) {
  const arr = [...endingsOf(art)].sort((a, b) => a.suffix.localeCompare(b.suffix, "de", { sensitivity: "base" }));
  let h = 0; const seed = arr.map(r => r.suffix).join("|");
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 0xffffffff; };
  for (let i = 0; i < arr.length - 1; i++) if (rand() < 0.45) [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
  return arr;
}
const ORDERED: Record<string, any[]> = Object.fromEntries(ARTS.map(art => [art, displayOrder(art)]));

// Per-gender layout options — must match RulesView's ENDING_OPTS.
const OPTS: Record<string, { fill?: number; shiftX?: number; rowGap?: number }> = {
  der: {},
  die: { shiftX: -8 },
  das: { fill: 0.85, rowGap: 24 },
};

// One shared scale across all three genders — exactly what the component computes,
// from the SAME display order and options it renders.
const SCALE = sharedEndingScale(
  ARTS.map(art => ({ boxes: ORDERED[art].map(r => endingBox(r.sizeWeight, r.suffix.length)), opts: OPTS[art] })),
);

// Collect every ending across genders for the cross-gender frequency check (f).
const allEndings: { art: string; suffix: string; sizeWeight: number; font: number }[] = [];

let failures = 0;
for (const art of ARTS) {
  const arr = ORDERED[art];

  const baseBoxes = arr.map(r => endingBox(r.sizeWeight, r.suffix.length));
  const out = packEndings(baseBoxes.map(b => ({ w: b.w, h: b.h })), SCALE, OPTS[art]);
  const pos = out.positions;
  const R = out.radius;
  const boxes = arr.map(r => endingBox(r.sizeWeight, r.suffix.length, out.scale));
  arr.forEach((r, i) => allEndings.push({ art, suffix: r.suffix, sizeWeight: r.sizeWeight, font: boxes[i].fontSize }));

  // (a) every bubble fully inside the disk
  let outside = 0, maxReach = 0;
  for (let i = 0; i < boxes.length; i++) {
    const cornerX = Math.abs(pos[i].cx) + boxes[i].w / 2;
    const cornerY = Math.abs(pos[i].cy) + boxes[i].h / 2;
    const reach = Math.hypot(cornerX, cornerY);
    maxReach = Math.max(maxReach, reach);
    if (reach > R + 0.5) outside++;
  }
  // (b) no two bubbles overlap (axis-aligned box test)
  let overlaps = 0;
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const ox = Math.abs(pos[i].cx - pos[j].cx) < (boxes[i].w + boxes[j].w) / 2;
    const oy = Math.abs(pos[i].cy - pos[j].cy) < (boxes[i].h + boxes[j].h) / 2;
    if (ox && oy) overlaps++;
  }
  // (c) reading order preserved: non-decreasing row (cy), left-to-right within a
  // row — tolerant of the organic jitter band (±jitter on each axis).
  const T = 9; // jitter tolerance (2*jitter + 1)
  let orderViol = 0;
  for (let i = 1; i < pos.length; i++) {
    if (pos[i].cy < pos[i - 1].cy - T) orderViol++; // jumped up to an earlier row
    else if (Math.abs(pos[i].cy - pos[i - 1].cy) <= T && pos[i].cx < pos[i - 1].cx - T) orderViol++; // backwards within a row
  }
  const rows = new Set(pos.map(p => Math.round(p.cy / 40))).size; // bucket by ~row spacing

  // (d) frequency preserved: within a gender, a higher sizeWeight must never
  // render at a smaller font than a lower one (font ∝ weight, monotonic).
  let freqViol = 0;
  const byWeight = [...arr].sort((a, b) => a.sizeWeight - b.sizeWeight);
  for (let i = 1; i < byWeight.length; i++) {
    const prev = endingBox(byWeight[i - 1].sizeWeight, byWeight[i - 1].suffix.length, out.scale);
    const cur = endingBox(byWeight[i].sizeWeight, byWeight[i].suffix.length, out.scale);
    if (cur.fontSize < prev.fontSize - 1e-6) freqViol++;
  }

  // (e) legibility: even after the fit-to-disk shrink, the smallest bubble in
  // every gender stays readable (the original complaint was die crushed to ~8px).
  const minFont = Math.min(...boxes.map(b => b.fontSize));
  const legible = minFont >= 10;

  const ok = outside === 0 && overlaps === 0 && orderViol === 0 && freqViol === 0 && legible;
  if (!ok) failures++;
  console.log(`${art}: ${boxes.length} bubbles, ${rows} rows | scale ${out.scale.toFixed(2)} | font ${minFont.toFixed(1)}–${Math.max(...boxes.map(b => b.fontSize)).toFixed(1)}px | inside=${outside === 0} | no-overlap=${overlaps === 0} | order=${orderViol === 0} | freq=${freqViol === 0} | legible=${legible} ${ok ? "PASS" : "FAIL"}`);
}

// (f) CROSS-GENDER frequency preserved: pool every ending across all three
// genders, sort by global sizeWeight, and assert the rendered font never
// decreases. This locks in "a frequent ending (e.g. der -er) always renders
// bigger than a rarer one (e.g. das -um)" — the regression the per-gender scale
// caused. With one shared scale, font is strictly monotonic in weight, so it holds.
const sorted = [...allEndings].sort((a, b) => a.sizeWeight - b.sizeWeight);
let xViol = 0;
for (let i = 1; i < sorted.length; i++) {
  if (sorted[i].font < sorted[i - 1].font - 1e-6) {
    xViol++;
    console.log(`  ✗ cross-gender: ${sorted[i].art} -${sorted[i].suffix} (w=${sorted[i].sizeWeight.toFixed(2)}, ${sorted[i].font.toFixed(1)}px) < ${sorted[i - 1].art} -${sorted[i - 1].suffix} (w=${sorted[i - 1].sizeWeight.toFixed(2)}, ${sorted[i - 1].font.toFixed(1)}px)`);
  }
}
if (xViol > 0) failures++;
// Spot-check the example Rakib raised: der -er must be bigger than das -um.
const er = allEndings.find(e => e.art === "der" && e.suffix === "er");
const um = allEndings.find(e => e.art === "das" && e.suffix === "um");
const erUmOk = !er || !um || er.font > um.font;
if (!erUmOk) failures++;
console.log(`cross-gender freq: ${xViol === 0 ? "PASS" : `${xViol} violation(s) FAIL`}` +
  (er && um ? ` | der -er=${er.font.toFixed(1)}px > das -um=${um.font.toFixed(1)}px: ${erUmOk ? "PASS" : "FAIL"}` : ""));

console.log(failures === 0 ? "\nALL PASS ✓" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
