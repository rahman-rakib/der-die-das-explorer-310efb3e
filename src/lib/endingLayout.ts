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

export const MIN_FS = 12;
export const MAX_FS = 26;

const R_MAX = 148; // largest inner radius (keeps the disk within a phone's width)
const SPREAD = 0.82; // how far rows reach toward the disk edge (1 = the very edge)
const DPAD = 8; // padding between the outermost bubble and the drawn disk edge

/**
 * Bubble box geometry for an ending. The width factor deliberately *over*-
 * estimates bold glyph width so the packer always reserves enough room (an
 * under-estimate previously let a wide ending poke outside the disk). `scale`
 * shrinks a busy gender's bubbles so they all fit the capped disk.
 */
export function endingBox(sizeWeight: number, suffixLen: number, scale = 1): EndingBox {
  const fontSize = (MIN_FS + sizeWeight * (MAX_FS - MIN_FS)) * scale;
  const padV = (3 + sizeWeight * 4) * scale;
  const padH = (8 + sizeWeight * 8) * scale;
  const w = suffixLen * fontSize * 0.72 + 2 * padH + 4;
  const h = fontSize * 1.2 + 2 * padV + 4;
  return { w, h, fontSize, padV, padH };
}

const jitter = 5;
const gap = 7;
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
 * Lay out the endings: find the largest font scale (≤1) at which all bubbles
 * fit the max disk, then size the disk to the actual content. Returns the
 * positions, the disk radius, and the scale (which the component applies to the
 * rendered font size / padding so it matches the packed boxes).
 */
export function packEndings(baseBoxes: Box[]): PackResult {
  const N = baseBoxes.length;
  if (N === 0) return { positions: [], radius: 60, scale: 1 };

  for (let scale = 1; scale >= 0.5; scale -= 0.04) {
    const boxes = baseBoxes.map(b => ({ w: b.w * scale, h: b.h * scale }));
    const positions = tryPack(boxes, R_MAX);
    if (positions) {
      // Size the disk to the content so it's never oversized and nothing pokes out.
      let contentR = 0;
      for (let i = 0; i < N; i++) {
        const reach = Math.hypot(
          Math.abs(positions[i].cx) + boxes[i].w / 2,
          Math.abs(positions[i].cy) + boxes[i].h / 2,
        );
        if (reach > contentR) contentR = reach;
      }
      return { positions, radius: Math.min(R_MAX, contentR + DPAD), scale };
    }
  }

  // Smallest scale still didn't fit (shouldn't happen for ≤ ~20 endings): pack at
  // the smallest scale and accept it.
  const scale = 0.5;
  const boxes = baseBoxes.map(b => ({ w: b.w * scale, h: b.h * scale }));
  const positions = tryPack(boxes, R_MAX) ?? boxes.map(() => ({ cx: 0, cy: 0 }));
  return { positions, radius: R_MAX, scale };
}
