/**
 * Test for the speech chunker (src/lib/speech.ts). No DOM/test-runner needed —
 * asserts the chunking invariants over real scene narrations and edge cases.
 *
 * Run:  node_modules/.bin/esbuild scripts/verify-speech-chunks.ts --bundle \\
 *         --platform=node --format=esm --outfile=/tmp/vs.mjs && node /tmp/vs.mjs
 */
import { buildSceneSpeech, chunkForSpeech } from "../src/lib/speech";
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

// --- buildSceneSpeech: narration → pause → word list -----------------------
for (const scene of MEMORY_SCENES as Array<{
  title: string;
  narrativeDe: string;
  words: Array<{ article: string; word: string }>;
}>) {
  const WORD_GAP = 450;
  const segs = buildSceneSpeech(scene.narrativeDe, scene.words, {
    pauseMs: 2000,
    wordGapMs: WORD_GAP,
    maxLen: MAX,
  });
  const speakSegs = segs.filter(s => s.type === "speak") as Array<{ text: string; rate?: number }>;
  const pauses = segs.filter(s => s.type === "pause") as Array<{ ms: number }>;

  // (d) every spoken segment respects the cap
  if (speakSegs.some(s => s.text.length > MAX)) fail(`${scene.title}: scene segment exceeds ${MAX}`);

  if (scene.words.length) {
    // (e) one 2s pause after narration, then one word-gap pause between each word
    const bigPauses = pauses.filter(p => p.ms === 2000);
    const gapPauses = pauses.filter(p => p.ms === WORD_GAP);
    if (bigPauses.length !== 1) fail(`${scene.title}: expected exactly one 2000ms pause`);
    if (gapPauses.length !== scene.words.length - 1)
      fail(`${scene.title}: expected ${scene.words.length - 1} word-gap pauses, got ${gapPauses.length}`);

    // the 2s pause must sit between narration and the words (not first/last)
    const pauseAt = segs.findIndex(s => s.type === "pause" && s.ms === 2000);
    if (pauseAt <= 0 || pauseAt === segs.length - 1) fail(`${scene.title}: pause not between narration and words`);

    // (f) each word is its own "article noun" utterance, in order, slightly slower
    const wordSegs = speakSegs.slice(speakSegs.length - scene.words.length);
    scene.words.forEach((w, i) => {
      if (wordSegs[i].text !== `${w.article} ${w.word}`)
        fail(`${scene.title}: word ${i} is "${wordSegs[i].text}", expected "${w.article} ${w.word}"`);
      if (!(wordSegs[i].rate && wordSegs[i].rate! < 0.95))
        fail(`${scene.title}: word "${w.word}" should read slower than narration`);
    });
  }
}

console.log(
  failures === 0
    ? `\nALL PASS ✓ (checked ${MEMORY_SCENES.length} scenes + edge cases)`
    : `\n${failures} FAILED`,
);
process.exit(failures === 0 ? 0 : 1);
