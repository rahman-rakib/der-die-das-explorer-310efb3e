## Update project memory with current scenes catalog

There's no existing memory file yet. I'll create a `feature` memory documenting the current 20 memory scenes in `src/data/scenes.ts` so future sessions know what exists without re-reading the file.

### Files

**`mem://features/memory-scenes.md`** — frontmatter (`type: feature`, descriptive name/description) + a compact catalog grouped by tone (das / der / die), listing each scene's `id`, title, image path, word count, and the teaching note when present. Source of truth remains `src/data/scenes.ts`.

**`mem://index.md`** — create with a one-line Memories entry pointing to the file above:
- `[Memory scenes catalog](mem://features/memory-scenes) — 20 der/die/das scenes in src/data/scenes.ts (ids, titles, images, rule notes)`

No code changes.