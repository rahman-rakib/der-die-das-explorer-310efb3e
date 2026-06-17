/**
 * Test for the scene difficulty ordering (src/lib/sceneOrder.ts). No DOM/test-
 * runner needed — asserts that each article's scenes come out easiest → hardest.
 *
 * Run:  node_modules/.bin/esbuild scripts/verify-scene-order.ts --bundle \\
 *         --platform=node --format=esm --outfile=/tmp/vo.mjs && node /tmp/vo.mjs
 */
import { MEMORY_SCENES } from "../src/data/words";
import { orderByDifficulty, sceneDifficulty } from "../src/lib/sceneOrder";

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};

for (const tone of ["der", "die", "das"] as const) {
  const group = MEMORY_SCENES.filter(s => s.tone === tone);
  const ordered = orderByDifficulty(group);

  // (a) same set of scenes, nothing dropped or duplicated
  if (ordered.length !== group.length) fail(`${tone}: count changed ${group.length} → ${ordered.length}`);
  const ids = new Set(ordered.map(s => s.id));
  if (ids.size !== group.length) fail(`${tone}: duplicate scenes after ordering`);

  // (b) difficulty is non-decreasing (easy → hard)
  for (let i = 1; i < ordered.length; i++) {
    if (sceneDifficulty(ordered[i]) < sceneDifficulty(ordered[i - 1]) - 1e-9) {
      fail(`${tone}: "${ordered[i].title}" easier than the scene before it`);
    }
  }

  // (c) deterministic — ordering the result again yields the identical sequence
  const again = orderByDifficulty(ordered);
  if (again.map(s => s.id).join("|") !== ordered.map(s => s.id).join("|")) {
    fail(`${tone}: ordering is not stable/deterministic`);
  }

  console.log(
    `${tone}: ${ordered.map(s => `${s.title}(${sceneDifficulty(s).toFixed(2)})`).join(" → ")}`,
  );
}

console.log(failures === 0 ? "\nALL PASS ✓" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
