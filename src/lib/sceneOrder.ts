/**
 * Difficulty ordering for memory scenes.
 *
 * Scenes within an article are shown easiest → hardest so learners meet common
 * vocabulary before rarer words. Difficulty is derived from each scene's own
 * nouns against the CEFR practice lists, so it's self-maintaining: add a new
 * scene and it slots into the right place automatically, no manual ordering.
 *
 * Each noun scores 1 (A1–A2, easy), 2 (B1–B2, medium), or 3 (not in either
 * list → rarer/harder); a scene's difficulty is the mean of its nouns' scores.
 */

import { PRACTICE_WORDS_A1A2, PRACTICE_WORDS_B1B2 } from "@/data/practiceWords";
import type { MemoryScene } from "@/data/words";

const A1A2 = new Set(PRACTICE_WORDS_A1A2.map(w => w.word));
const B1B2 = new Set(PRACTICE_WORDS_B1B2.map(w => w.word));

/** 1 = easy (A1–A2), 2 = medium (B1–B2), 3 = rare/hard (not in either list). */
export function wordDifficulty(noun: string): number {
  if (A1A2.has(noun)) return 1;
  if (B1B2.has(noun)) return 2;
  return 3;
}

/** Mean difficulty of a scene's nouns (0 for an empty scene). */
export function sceneDifficulty(scene: MemoryScene): number {
  if (scene.words.length === 0) return 0;
  const total = scene.words.reduce((sum, w) => sum + wordDifficulty(w.word), 0);
  return total / scene.words.length;
}

/** Count of rare (score-3) nouns — used as a tie-break. */
function rareCount(scene: MemoryScene): number {
  return scene.words.reduce((n, w) => n + (wordDifficulty(w.word) === 3 ? 1 : 0), 0);
}

/**
 * Return a new array of scenes ordered easiest → hardest. Deterministic
 * (mean difficulty, then rare-word count, then id) so SSR and the client agree.
 */
export function orderByDifficulty(scenes: MemoryScene[]): MemoryScene[] {
  return [...scenes].sort((a, b) => {
    const d = sceneDifficulty(a) - sceneDifficulty(b);
    if (Math.abs(d) > 1e-9) return d;
    const r = rareCount(a) - rareCount(b);
    if (r !== 0) return r;
    return a.id.localeCompare(b.id);
  });
}
