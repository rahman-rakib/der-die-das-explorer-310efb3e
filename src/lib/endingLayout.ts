/**
 * Pure, deterministic layout for the "Endings" bubble circle.
 *
 * Endings are few per gender (≈13–16), so they sit inside a circular background
 * (the Compounds use a free flex-wrap cloud). Goals: read like the compounds
 * (alphabetical, top→bottom) but FILL the disk — rows spread across the whole
 * disk (not a central band), narrow near the top/bottom and wide through the
 * centre, with an organic per-bubble jitter. A busy gender shrinks its font a
 * step so all bubbles fit; the disk is then sized to the actual content so it's
 * never oversized and nothing pokes out.
 *
 * Deterministic (no Math.random): the app is SSR'd then hydrated, so random
 * positions would cause hydration mismatches and flicker.
 */

export interface Box {
  w: number;
  h: number;
}

export interface Pos {
  cx: number; // centre x relative to disk centre (px)
  cy: number; // centre y relative to disk centre (px)
}

export interface EndingBox extends Box {
  fontSize: number;
  padV: number;
  padH: number;
}

export interface PackResult {
  positions: Pos[];
  /** inner radius the content occupies (the disk is drawn a touch larger) */
  radius: number;
  /** font scale applied so a busy gender fits (1 = full size) */
  scale: number;
}

// Endings use the SAME size rule as the compound cloud: font = MIN + weight*(MAX-MIN),
// with MIN 18 / MAX 30. Unlike the compounds (which flow freely and just wrap), the
// endings sit in a FIXED phone-width disk, so full-size bubbles don't fit — der/die
// would each need a ~450–490px circle. So the whole circle is shrunk by ONE shared
// factor (see sharedEndingScale): the smallest scale that lets the busiest gender
// fit the capped disk, applied identically to all three circles. A uniform scale
// leaves the formula's proportions untouched (every size ratio is preserved) and,
// crucially, keeps sizing comparable ACROSS genders — a frequent ending like die's
// -e or der's -er stays bigger than a rare one like das's -um. (A per-gender scale
// broke this: sparse das barely shrank while die shrank hard, inverting the sizes.)
export const MIN_FS = 18;
export const MAX_FS = 30;

// Fixed inner radius for EVERY ending circle (same-size disk on every tab).
// Sized to stay within the narrowest mainstream phone (≈360px wide minus the
// px-4 page padding → ~328px), because the disk SIZE is 2*(radius+6) and fonts
// are absolute px while bubble positions are %: if the disk had to clamp to a
// narrower container the bubbles would overflow.
const R_MAX = 158;
const SPREAD = 0.84; // how far rows reach toward the disk edge (1 = the very edge)

/**
 * Bubble box geometry for an ending. The width factor deliberately *over*-
 * estimates bold glyph width so the packer always reserves enough room (an
 * under-estimate previously let a wide ending poke outside the disk). `scale`
 * shrinks a busy gender's bubbles so they all fit the capped disk.
 */
export function endingBox(sizeWeight: number, suffixLen: number, scale = 1): EndingBox {
  const fontSize = (MIN_FS + sizeWeight * (MAX_FS - MIN_FS)) * scale;
  // Padding tightened (was 3+4w / 8+8w) so bubbles take less room and the shared
  // font scale can rise to ~0.75. The 0.72 width factor is left intact — it
  // over-estimates bold glyph width so text never spills its bubble.
  const padV = (2 + sizeWeight * 3) * scale;
  const padH = (5 + sizeWeight * 4) * scale;
  // The +4 safety margin is scaled too, so a box at scale s equals the scale-1
  // box times s exactly — the packer scales base boxes by s, and that must match
  // what's rendered or tight layouts mis-predict overlaps.
  const w = suffixLen * fontSize * 0.72 + 2 * padH + 4 * scale;
  const h = fontSize * 1.2 + 2 * padV + 4 * scale;
  return { w, h, fontSize, padV, padH };
}

const jitter = 3; // organic per-bubble offset (px); larger = more scatter, less room
const gap = 5;    // tightened (was 8) so the shared font scale can rise to ~0.75:
                  // the busiest gender packs congested to fit, while a sparse
                  // gender's few bubbles still spread out via FILL below.
// How much of each row's spare width to spread into (0 = bubbles packed tight in
// the row centre, 1 = pushed to the chord ends). A sparse gender (e.g. das) has
// lots of spare width; spreading distributes it as small even gaps so the fixed
// disk reads as filled rather than having one big empty band.
const FILL = 0.5;
const jit = (i: number) => ({
  dx: ((((i * 11) % 5) - 2) / 2) * jitter,
  dy: ((((i * 7 + (i % 3) * 2) % 5) - 2) / 2) * jitter,
});

/**
 * Try to place every bubble in spread rows inside radius R. Returns positions
 * (with jitter) if and only if ALL bubbles fit their row's chord — otherwise
 * null, so the caller can shrink the font and retry.
 */
function tryPack(items: Box[], R: number): Pos[] | null {
  const N = items.length;
  const rowH = Math.max(...items.map(b => b.h));
  const margin = Math.ceil(jitter * 1.6) + 2;
  const usableR = R - margin;
  if (usableR <= rowH / 2) return null;

  const spreadHalf = Math.max(0, (usableR - rowH / 2) * SPREAD);
  // Row count from the SPREAD extent so adjacent row centres are always at least
  // (rowH + gap) apart — otherwise rows would overlap vertically.
  const nRows = Math.max(1, Math.floor((2 * spreadHalf) / (rowH + gap)) + 1);
  const centers: number[] = [];
  for (let k = 0; k < nRows; k++) {
    centers.push(nRows === 1 ? 0 : -spreadHalf + (k * (2 * spreadHalf)) / (nRows - 1));
  }
  const halfW = centers.map(c => {
    const yFar = Math.abs(c) + rowH / 2;
    const v = usableR * usableR - yFar * yFar;
    return v > 0 ? Math.sqrt(v) : 0;
  });

  const rows: number[][] = Array.from({ length: nRows }, () => []);
  let i = 0;
  for (let k = 0; k < nRows && i < N; k++) {
    let wsum = 0;
    while (i < N) {
      if (rows[k].length === 0) {
        if (items[i].w > 2 * halfW[k]) break; // too wide for this row → defer to a wider one
        rows[k].push(i);
        wsum = items[i].w;
        i++;
      } else {
        const need = items[i].w + gap + jitter;
        if (wsum + need > 2 * halfW[k]) break;
        rows[k].push(i);
        wsum += need;
        i++;
      }
    }
  }
  if (i < N) return null; // didn't fit them all at this size

  const positions: Pos[] = new Array(N);
  for (let k = 0; k < nRows; k++) {
    const row = rows[k];
    if (row.length === 0) continue;
    const totalW =
      row.reduce((s, idx) => s + items[idx].w, 0) + (gap + jitter) * (row.length - 1);
    let x = -totalW / 2;
    for (const idx of row) {
      const { dx, dy } = jit(idx);
      positions[idx] = { cx: x + items[idx].w / 2 + dx, cy: centers[k] + dy };
      x += items[idx].w + gap + jitter;
    }
  }
  return positions;
}

/**
 * Distribute the bubbles to FILL the fixed disk: rows spread across the whole
 * disk height, and within each row the bubbles are spread (justified to {@link
 * FILL} of the row's chord) rather than clustered in the centre. Bubbles are
 * assigned to rows proportional to each row's chord width (so the wide middle
 * rows hold more, matching the circle), in reading order. Returns null if a row
 * can't hold its assigned bubbles — the caller then falls back to {@link tryPack}
 * (a gender too busy to spread out already fills the disk densely on its own).
 */
function spreadPack(items: Box[], R: number): Pos[] | null {
  const N = items.length;
  const rowH = Math.max(...items.map(b => b.h));
  const margin = Math.ceil(jitter * 1.6) + 2;
  const usableR = R - margin;
  if (usableR <= rowH / 2) return null;

  const spreadHalf = Math.max(0, (usableR - rowH / 2) * SPREAD);
  const nRows = Math.max(1, Math.floor((2 * spreadHalf) / (rowH + gap)) + 1);
  const centers: number[] = [];
  for (let k = 0; k < nRows; k++) {
    centers.push(nRows === 1 ? 0 : -spreadHalf + (k * (2 * spreadHalf)) / (nRows - 1));
  }
  const halfW = centers.map(c => {
    const yFar = Math.abs(c) + rowH / 2;
    const v = usableR * usableR - yFar * yFar;
    return v > 0 ? Math.sqrt(v) : 0;
  });

  // Assign bubble counts per row proportional to chord width, then fix rounding.
  const chord = halfW.map(h => 2 * h);
  const totalChord = chord.reduce((s, c) => s + c, 0);
  if (totalChord <= 0) return null;
  const quota = chord.map(c => Math.max(0, Math.round((N * c) / totalChord)));
  let diff = N - quota.reduce((s, q) => s + q, 0);
  const byChord = [...chord.keys()].sort((a, b) => chord[b] - chord[a]);
  for (const k of byChord) {
    if (diff === 0) break;
    if (diff > 0) { quota[k]++; diff--; }
    else if (quota[k] > 0) { quota[k]--; diff++; }
  }

  // Fill rows top→bottom in reading order, honouring each row's quota.
  const rows: number[][] = Array.from({ length: nRows }, () => []);
  let i = 0;
  for (let k = 0; k < nRows && i < N; k++) {
    let take = quota[k];
    while (take > 0 && i < N) { rows[k].push(i++); take--; }
  }
  while (i < N) rows[nRows - 1].push(i++); // safety: never drop a bubble

  // A row must actually hold its bubbles at tight spacing; if not, bail to greedy.
  for (let k = 0; k < nRows; k++) {
    const row = rows[k];
    if (row.length === 0) continue;
    const tight = row.reduce((s, idx) => s + items[idx].w, 0) + (gap + jitter) * (row.length - 1);
    if (tight > 2 * halfW[k]) return null;
  }

  // Place each row, justified to FILL of its chord (edges stay within usableR,
  // since the justified extent never exceeds the chord 2*halfW[k]).
  const positions: Pos[] = new Array(N);
  for (let k = 0; k < nRows; k++) {
    const row = rows[k];
    if (row.length === 0) continue;
    const sumW = row.reduce((s, idx) => s + items[idx].w, 0);
    const W = 2 * halfW[k];
    const tight = sumW + (gap + jitter) * (row.length - 1);
    const targetW = row.length > 1 ? Math.min(W, tight + (W - tight) * FILL) : sumW;
    const between = row.length > 1 ? (targetW - sumW) / (row.length - 1) : 0;
    let x = -targetW / 2;
    for (const idx of row) {
      const { dx, dy } = jit(idx);
      positions[idx] = { cx: x + items[idx].w / 2 + dx, cy: centers[k] + dy };
      x += items[idx].w + between;
    }
  }
  return positions;
}

/**
 * Pack a gender's (already-scaled) bubbles into the fixed disk and vertical-centre
 * them. Tries the spread/fill layout first, falling back to the dense greedy pack
 * for a gender too busy to distribute. Shared by {@link sharedEndingScale} (to
 * validate a scale) and {@link packEndings} (to render), so the layout that gets
 * validated is exactly the one drawn.
 */
function layout(scaledBoxes: Box[]): Pos[] {
  const N = scaledBoxes.length;
  const positions = spreadPack(scaledBoxes, R_MAX) ?? tryPack(scaledBoxes, R_MAX) ?? scaledBoxes.map(() => ({ cx: 0, cy: 0 }));
  // Vertical-centre so any leftover slack splits evenly top/bottom.
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < N; i++) {
    minY = Math.min(minY, positions[i].cy - scaledBoxes[i].h / 2);
    maxY = Math.max(maxY, positions[i].cy + scaledBoxes[i].h / 2);
  }
  const shiftY = (minY + maxY) / 2;
  for (let i = 0; i < N; i++) positions[i].cy -= shiftY;

  // Horizontal-centre by visual MASS (area-weighted), so a gender whose bigger
  // bubbles happen to land on one side doesn't look lopsided. A rigid shift of
  // the whole set; the disk stays fixed. Mass- rather than bbox-centred because
  // the eye tracks where the weight is, not the outermost edges.
  let comNum = 0;
  let comDen = 0;
  for (let i = 0; i < N; i++) {
    const a = scaledBoxes[i].w * scaledBoxes[i].h;
    comNum += positions[i].cx * a;
    comDen += a;
  }
  const shiftX = comDen > 0 ? comNum / comDen : 0;
  for (let i = 0; i < N; i++) positions[i].cx -= shiftX;
  return positions;
}

/** True if the *rendered* layout fits the disk (nothing outside) with no overlaps. */
function fitsClean(scaledBoxes: Box[]): boolean {
  const N = scaledBoxes.length;
  if (N === 0) return true;
  const pos = layout(scaledBoxes);
  for (let i = 0; i < N; i++) {
    const reach = Math.hypot(Math.abs(pos[i].cx) + scaledBoxes[i].w / 2, Math.abs(pos[i].cy) + scaledBoxes[i].h / 2);
    if (reach > R_MAX) return false;
  }
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    const ox = Math.abs(pos[i].cx - pos[j].cx) < (scaledBoxes[i].w + scaledBoxes[j].w) / 2;
    const oy = Math.abs(pos[i].cy - pos[j].cy) < (scaledBoxes[i].h + scaledBoxes[j].h) / 2;
    if (ox && oy) return false;
  }
  return true;
}

/**
 * The single font scale (≤1) shared by ALL three ending circles: the largest
 * scale at which EVERY gender RENDERS cleanly — nothing outside the fixed disk,
 * no overlaps — including the jitter and fill-justify, not just a tight pack.
 * One uniform factor keeps the size formula's proportions intact and bubbles
 * comparable across genders (a frequent ending always renders bigger than a
 * rarer one). Pass the base (scale-1) boxes for every gender; compute once and
 * feed the result to {@link packEndings}.
 */
export function sharedEndingScale(genderBoxes: Box[][]): number {
  for (let s = 1; s >= 0.4; s -= 0.02) {
    if (genderBoxes.every(boxes => fitsClean(boxes.map(b => ({ w: b.w * s, h: b.h * s }))))) {
      return s;
    }
  }
  return 0.4;
}

/**
 * Lay out one gender's endings at the given shared `scale` inside the FIXED disk
 * (every gender draws the same-size circle). Returns positions, the fixed radius,
 * and the scale (which the component re-applies to the rendered font/padding).
 */
export function packEndings(baseBoxes: Box[], scale: number): PackResult {
  const N = baseBoxes.length;
  if (N === 0) return { positions: [], radius: R_MAX, scale };
  const positions = layout(baseBoxes.map(b => ({ w: b.w * scale, h: b.h * scale })));
  return { positions, radius: R_MAX, scale };
}
