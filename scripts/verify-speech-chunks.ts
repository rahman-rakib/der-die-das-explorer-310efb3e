/**
 * Test for the speech chunker (src/lib/speech.ts). No DOM/test-runner needed —
 * asserts the chunking invariants over real scene narrations and edge cases.
 *
 * Run:  node_modules/.bin/esbuild scripts/verify-speech-chunks.ts --bundle \\
 *         --platform=node --format=esm --outfile=/tmp/vs.mjs && node /tmp/vs.mjs
 */
import { chunkForSpeech } from "../src/lib/speech";
import { MEMORY_SCENES } from "../src/data/words";

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};

const MAX = 180;

// --- invariant checks on every real scene narration -------------------------
for (const scene of MEMORY_SCENES as Array<{ title: string; narrativeDe: string }>) {
  const chunks = chunkForSpeech(scene.narrativeDe, MAX);

  // (a) nothing dropped: joined chunks contain every word of the source
  const srcWords = scene.narrativeDe.trim().split(/\s+/).filter(Boolean);
  const outWords = chunks.join(" ").split(/\s+/).filter(Boolean);
  if (srcWords.length !== outWords.length) {
    fail(`${scene.title}: word count changed ${srcWords.length} → ${outWords.length}`);
  }

  // (b) every chunk respects the length cap (the whole point — beat the ~15s cutoff)
  const tooLong = chunks.filter(c => c.length > MAX);
  if (tooLong.length) fail(`${scene.title}: ${tooLong.length} chunk(s) exceed ${MAX} chars`);

  // (c) no empty/whitespace-only chunks
  if (chunks.some(c => !c.trim())) fail(`${scene.title}: produced an empty chunk`);
}

// --- explicit edge cases ----------------------------------------------------
const longestScene = (MEMORY_SCENES as Array<{ narrativeDe: string }>)
  .reduce((a, b) => (b.narrativeDe.length > a.narrativeDe.length ? b : a));
if (chunkForSpeech(longestScene.narrativeDe).length < 2) {
  fail("longest scene should split into multiple chunks");
}

if (chunkForSpeech("").length !== 0) fail('empty string should yield no chunks');
if (chunkForSpeech("   ").length !== 0) fail("whitespace-only should yield no chunks");

const oneWord = "Salz";
if (chunkForSpeech(oneWord).join("") !== oneWord) fail("short text should pass through unchanged");

// a single sentence longer than the cap must still be broken down
const longSentence = "der " + "Tisch und ".repeat(40) + "Stuhl.";
const lc = chunkForSpeech(longSentence, MAX);
if (lc.some(c => c.length > MAX)) fail("over-long single sentence not broken under cap");

console.log(
  failures === 0
    ? `\nALL PASS ✓ (checked ${MEMORY_SCENES.length} scenes + edge cases)`
    : `\n${failures} FAILED`,
);
process.exit(failures === 0 ? 0 : 1);
