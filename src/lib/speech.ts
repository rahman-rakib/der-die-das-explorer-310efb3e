/**
 * Text chunking for speech synthesis.
 *
 * Chrome/Edge silently cut off any single `SpeechSynthesisUtterance` after
 * ~15 seconds, so a long scene narration dies mid-word. The fix is to split
 * the text into sentence-sized chunks and queue them as separate utterances —
 * each one is short enough to finish before the engine times out. This module
 * holds the pure splitting logic (no DOM) so it can be unit-tested; the actual
 * `speechSynthesis` calls live in the component.
 */

/**
 * Break long text into a word-aligned piece no longer than `maxLen`, preferring
 * to cut at a comma and otherwise at the last whitespace. Used only for a single
 * sentence that is itself longer than `maxLen`.
 */
function splitLong(sentence: string, maxLen: number): string[] {
  const out: string[] = [];
  let rest = sentence.trim();
  while (rest.length > maxLen) {
    // Prefer a clause break (comma) within the window, else the last space.
    const window = rest.slice(0, maxLen + 1);
    let cut = window.lastIndexOf(",");
    if (cut > maxLen * 0.4) {
      cut += 1; // keep the comma with the left piece
    } else {
      cut = window.lastIndexOf(" ");
      if (cut <= 0) cut = maxLen; // no space at all → hard cut
    }
    out.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) out.push(rest);
  return out;
}

/**
 * Split `text` into chunks no longer than `maxLen` characters, cutting at
 * sentence boundaries where possible and packing consecutive short sentences
 * together so the speech still flows naturally. A sentence longer than `maxLen`
 * is broken further at clause/word boundaries via {@link splitLong}.
 */
/**
 * A playback segment: either spoken text (optionally at a custom rate) or a
 * silent pause (ms). A scene is narrated, then a pause, then its covered words
 * are read aloud one at a time.
 */
export type SpeechSegment =
  | { type: "speak"; text: string; rate?: number }
  | { type: "pause"; ms: number };

/**
 * Build the playback plan for a scene: the narration (chunked), a pause, then
 * the covered words spoken as "article + noun" — each word its OWN utterance,
 * separated by a short gap and read a touch slower, so every word lands cleanly
 * for the learner (commas in one breath read too fast and flat). Pure — the
 * caller drives `speechSynthesis`.
 */
export function buildSceneSpeech(
  narrativeDe: string,
  words: ReadonlyArray<{ article: string; word: string }>,
  opts: { pauseMs?: number; wordGapMs?: number; wordRate?: number; maxLen?: number } = {},
): SpeechSegment[] {
  const { pauseMs = 2000, wordGapMs = 450, wordRate = 0.9, maxLen = 180 } = opts;
  const segments: SpeechSegment[] = chunkForSpeech(narrativeDe, maxLen).map(text => ({
    type: "speak",
    text,
  }));
  if (words.length) {
    segments.push({ type: "pause", ms: pauseMs });
    words.forEach((w, i) => {
      if (i > 0) segments.push({ type: "pause", ms: wordGapMs });
      segments.push({ type: "speak", text: `${w.article} ${w.word}`, rate: wordRate });
    });
  }
  return segments;
}

export function chunkForSpeech(text: string, maxLen = 180): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Sentences, keeping their terminal punctuation (. ! ? … ;).
  const sentences = trimmed.match(/[^.!?;…]+[.!?;…]*/g) ?? [trimmed];

  const chunks: string[] = [];
  let buf = "";
  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;

    if (s.length > maxLen) {
      if (buf) {
        chunks.push(buf);
        buf = "";
      }
      chunks.push(...splitLong(s, maxLen));
      continue;
    }

    // Pack with the running buffer while it still fits, else flush.
    if (buf && buf.length + 1 + s.length > maxLen) {
      chunks.push(buf);
      buf = s;
    } else {
      buf = buf ? `${buf} ${s}` : s;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}
