/**
 * Pure, deterministic layout for the "Endings" bubble circle.
 *
 * The Compounds section is a free-flowing flex-wrap cloud, but Endings are far
 * fewer per gender (≈13–16), so they sit inside a circular background. We want
 * them to read like the compounds — alphabetical-ish, top-to-bottom — yet fill
 * the disk: rows are short near the top/bottom (narrow chord) and wide in the
 * middle. Everything here is deterministic (no Math.random) because the app is
 * server-rendered then hydrated — random positions would cause hydration
 * mismatches and flicker.
 */

export interface Box {
  /** rendered width of the bubble in px */
  w: number;
  /** rendered height of the bubble in px */
  h: number;
}

export interface Pos {
  /** centre x relative to the circle centre (px; negative = left) */
  cx: number;
  /** centre y relative to the circle centre (px; negative = up) */
  cy: number;
}

export const MIN_FS = 10;
export const MAX_FS = 22;

/**
 * Bubble box geometry for an ending, from its size weight and label length.
 * Kept here (not inlined in the component) so the layout test measures exactly
 * what the UI renders.
 */
export function endingBox(sizeWeight: number, suffixLen: number) {
  const fontSize = MIN_FS + sizeWeight * (MAX_FS - MIN_FS);
  const padV = Math.round(2 + sizeWeight * 3);
  const padH = Math.round(6 + sizeWeight * 6);
  // 0.62 ≈ average glyph-width / font-size for this bold font; +4 for the border.
  const w = suffixLen * fontSize * 0.62 + 2 * padH + 4;
  const h = fontSize * 1.15 + 2 * padV + 4;
  return { w, h, fontSize, padV, padH };
}

/**
 * Lay bubbles out in centred horizontal rows that fit inside a circle of radius
 * ``R``. Items are placed in the given (reading) order, left-to-right then
 * top-to-bottom, so alphabetical flow is preserved.
 *
 * Strategy: try each row count; for a count ``nRows`` the row centres are symmetric
 * about 0 (so the stack is auto-centred), and each row may only be as wide as
 * the circle's chord at that row's *far* edge — which guarantees every bubble
 * stays inside the disk. Prefer the largest row count that places everything
 * with no empty row (spreads the bubbles to fill the circle); fall back to the
 * largest count that simply fits, then to a single row.
 */
export function packEndings(items: Box[], R: number, gap = 6, jitter = 3): Pos[] {
  const N = items.length;
  if (N === 0) return [];

  const rowH = Math.max(...items.map(b => b.h));
  // Reserve room so the organic jitter (added at the end) never pushes a bubble
  // outside the disk or into a neighbour: pack inside a slightly smaller radius
  // and widen the inter-bubble / inter-row spacing by the jitter amount.
  const packR = Math.max(0, R - Math.ceil(jitter * 1.6));
  const rowGap = gap + jitter;
  const itemGap = gap + jitter;
  const maxRows = Math.max(1, Math.floor((2 * packR + rowGap) / (rowH + rowGap)));

  // A full layout for a given row count. ALWAYS returns a position for every
  // item (no holes): once the rows are exhausted, leftovers pile into the last
  // row, which then "overflows" its chord — we record that so the selector can
  // avoid it. `overflowRows` counts rows wider than the disk allows there.
  const layoutFor = (nRows: number): { pos: Pos[]; emptyRows: number; overflowRows: number } | null => {
    const centers: number[] = [];
    for (let k = 0; k < nRows; k++) centers.push((k - (nRows - 1) / 2) * (rowH + rowGap));
    // Outermost row must sit fully inside the (jitter-reserved) circle vertically.
    if (Math.abs(centers[0]) + rowH / 2 > packR) return null;

    // Half the usable width of each row = the chord at the row's far edge.
    const halfW = centers.map(c => {
      const yFar = Math.abs(c) + rowH / 2;
      const v = packR * packR - yFar * yFar;
      return v > 0 ? Math.sqrt(v) : 0;
    });

    const rows: number[][] = Array.from({ length: nRows }, () => []);
    let i = 0;
    for (let k = 0; k < nRows && i < N; k++) {
      const isLast = k === nRows - 1;
      let wsum = 0;
      while (i < N) {
        const add = items[i].w + (rows[k].length ? itemGap : 0);
        // Row full — but never break on the last row (must place the rest) and
        // always take at least one item per row.
        if (!isLast && rows[k].length && wsum + add > 2 * halfW[k]) break;
        rows[k].push(i);
        wsum += add;
        i++;
      }
    }

    let overflowRows = 0;
    const pos: Pos[] = new Array(N);
    for (let k = 0; k < nRows; k++) {
      const row = rows[k];
      if (row.length === 0) continue;
      const totalW =
        row.reduce((s, idx) => s + items[idx].w, 0) + itemGap * (row.length - 1);
      if (totalW > 2 * halfW[k] + 0.5) overflowRows++;
      let x = -totalW / 2;
      for (const idx of row) {
        pos[idx] = { cx: x + items[idx].w / 2, cy: centers[k] };
        x += items[idx].w + itemGap;
      }
    }
    return { pos, emptyRows: rows.filter(r => r.length === 0).length, overflowRows };
  };

  // Prefer the largest row count that fits with no overflow and no empty row
  // (spreads bubbles to fill the disk); else the fewest-overflow layout.
  let best: Pos[] | null = null;
  let fewestOverflow: { pos: Pos[]; overflowRows: number } | null = null;
  for (let nRows = 1; nRows <= maxRows; nRows++) {
    const res = layoutFor(nRows);
    if (!res) break; // taller counts only get worse
    if (!fewestOverflow || res.overflowRows < fewestOverflow.overflowRows) {
      fewestOverflow = { pos: res.pos, overflowRows: res.overflowRows };
    }
    if (res.overflowRows === 0 && res.emptyRows === 0) best = res.pos;
  }

  const base = best ?? fewestOverflow?.pos ?? items.map(() => ({ cx: 0, cy: 0 }));

  // Organic jitter: a small, deterministic per-bubble nudge in x and y so the
  // rows read as hand-scattered (like the compounds cloud) while alphabetical
  // order stays clear. Deterministic ⇒ SSR-safe; bounded by `jitter` and
  // absorbed by the reserved radius/spacing, so still inside-disk & overlap-free.
  return base.map((p, i) => {
    const dx = ((((i * 11) % 5) - 2) / 2) * jitter;          // −jitter .. +jitter
    const dy = ((((i * 7 + (i % 3) * 2) % 5) - 2) / 2) * jitter;
    return { cx: p.cx + dx, cy: p.cy + dy };
  });
}
