/**
 * Tests for the review-log helpers (src/lib/review.ts).
 * Run:  node_modules/.bin/esbuild scripts/verify-review.ts --bundle \
 *         --platform=node --format=esm --outfile=/tmp/vr.mjs && node /tmp/vr.mjs
 */
import { reviewStats, filterReview, type ReviewItem } from "../src/lib/review";

let failures = 0;
const ok = (cond: boolean, msg: string) => { if (!cond) { failures++; console.log(`  ✗ ${msg}`); } };

const items: ReviewItem[] = [
  { prompt: "Tisch", picked: "der", correct: "der", isCorrect: true },
  { prompt: "Sonne", picked: "der", correct: "die", isCorrect: false },
  { prompt: "Auto", picked: "", correct: "das", isCorrect: false }, // timed out / unanswered
];

const s = reviewStats(items);
ok(s.total === 3, `total should be 3, got ${s.total}`);
ok(s.correct === 1, `correct should be 1, got ${s.correct}`);
ok(s.wrong === 2, `wrong should be 2, got ${s.wrong}`);

ok(filterReview(items, false).length === 3, "all items when mistakesOnly=false");
ok(filterReview(items, true).length === 2, "only mistakes when mistakesOnly=true");
ok(filterReview(items, true).every(i => !i.isCorrect), "mistakes filter keeps only wrong");

const empty = reviewStats([]);
ok(empty.total === 0 && empty.correct === 0 && empty.wrong === 0, "empty log is all zeros");
ok(filterReview([], true).length === 0, "filtering empty stays empty");

console.log(failures === 0 ? "\nALL PASS ✓" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
