## Problem

The 🔊 button on a Memory Scene calls `speakScene` → `playSegments` in `src/components/ddd/MemoryScenesView.tsx`. The current flow plays reliably on desktop Chrome but silently does nothing on some phones (mostly iOS Safari, occasionally Android Chrome). There are three known browser quirks combining here:

1. **iOS Safari drops `speak()` if `cancel()` runs in the same tick when the queue is empty.** We unconditionally call `synth.cancel()` inside `stopSpeech()` before queuing the new utterance, so the very first tap on a fresh page can be eaten.
2. **iOS Safari requires the first `SpeechSynthesisUtterance` to be created *and* spoken inside the user-gesture callstack, with no prior async hop.** Today the utterance is created synchronously inside `next()`, but `next()` is reached via `playSegments(buildSceneSpeech(...))` and `stopSpeech()` first — the gesture chain is intact, but only barely; any added await (e.g. voice lookup) would break it. We can harden this with an explicit warmup utterance.
3. **The keep-alive `setInterval(() => synth.resume(), 5000)` is a Chrome-desktop workaround.** On iOS Safari, calling `resume()` on a non-paused queue can re-trigger the "start" state machine and stall later utterances. It should not run on iOS.

## Fix

Edit `src/components/ddd/MemoryScenesView.tsx` only — no API changes, no other files touched.

1. **Skip the pre-cancel when nothing is playing.** In `playSegments`, only call `synth.cancel()` if `synth.speaking || synth.pending`. When the queue is already empty (the common "first tap" case on mobile), go straight to `speak()` so iOS keeps the gesture lock.
2. **Synchronous warmup utterance.** At the top of `playSegments`, create one tiny `SpeechSynthesisUtterance(" ")` with `volume = 0` and `synth.speak()` it immediately, before the loop. This claims the audio context inside the gesture on iOS; the real chunks then queue behind it and play. Costs nothing on desktop.
3. **Gate the keep-alive interval to non-iOS.** Detect iOS via `/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)` and skip `setInterval(resume)` there. The Chrome ~15s cutoff doesn't apply to iOS Safari, so the keep-alive is pure downside on iPhone/iPad.
4. **Guard `u.onend` / `u.onerror` against double-advance.** Wrap `next` so it only fires once per utterance — iOS occasionally fires both `end` and `error` for the same chunk, which currently skips a segment. Trivial flag inside `next`.

No changes to `buildSceneSpeech`, the segment shape, the UI, or any other component. The button, styling, and layout stay identical.

## Verification

- Manual: tap 🔊 on a scene in mobile preview (iPhone-sized viewport) — it should start within ~200 ms on the first tap, and a second tap should interrupt and restart cleanly.
- Desktop Chrome: long narrations (>15 s) must still survive (keep-alive still runs on non-iOS).
- No regressions to the "tap a new scene mid-playback" path — `speechGen` token still invalidates stale callbacks.