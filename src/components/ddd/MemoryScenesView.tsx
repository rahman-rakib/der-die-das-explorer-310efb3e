import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ARTICLE_META,
  MEMORY_SCENES,
  type Article,
  type MemoryScene,
  type Word,
} from "@/data/words";
import { ArticleBadge, WordPill } from "./ArticleBadge";
import { loadProgress, markSceneMastered, recordAnswer } from "@/lib/progress";
import { buildSceneSpeech, type SpeechSegment } from "@/lib/speech";
import { orderByDifficulty } from "@/lib/sceneOrder";

const TABS: Article[] = ["das", "der", "die"];

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// Speech playback. We play a list of segments (spoken chunks + timed pauses)
// in order: a scene is narrated, then a short pause, then its covered words are
// read aloud. Chrome/Edge cut a single utterance off after ~15s, so narrations
// are pre-chunked (see buildSceneSpeech) and we nudge resume() to survive the
// engine's auto-pause. A generation token makes a new play cancel the old one
// cleanly — synth.cancel() fires onend on pending utterances, and stale
// callbacks must not advance the new sequence.
let speechKeepAlive: ReturnType<typeof setInterval> | null = null;
let speechTimer: ReturnType<typeof setTimeout> | null = null;
let speechGen = 0;

// iOS Safari quirks: (a) calling resume() on a non-paused queue can stall later
// utterances, and (b) cancel() in the same tick as speak() on an empty queue
// silently drops the new utterance. Detect once.
const IS_IOS =
  typeof navigator !== "undefined" &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as Navigator).maxTouchPoints > 1));

function clearSpeechTimers() {
  if (speechKeepAlive) {
    clearInterval(speechKeepAlive);
    speechKeepAlive = null;
  }
  if (speechTimer) {
    clearTimeout(speechTimer);
    speechTimer = null;
  }
}

function stopSpeech() {
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  clearSpeechTimers();
}

function playSegments(segments: SpeechSegment[]) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  const gen = ++speechGen; // invalidate any in-flight sequence

  // Only cancel if something is actually queued — iOS Safari drops the next
  // speak() if cancel() is called on an empty queue in the same gesture tick.
  if (synth.speaking || synth.pending) synth.cancel();
  clearSpeechTimers();

  // Synchronous warmup utterance: claims the audio context inside the user
  // gesture on iOS, so the real chunks that follow are allowed to play.
  const warmup = new SpeechSynthesisUtterance(" ");
  warmup.volume = 0;
  warmup.lang = "de-DE";
  synth.speak(warmup);

  let i = 0;
  const next = () => {
    if (gen !== speechGen) return; // superseded by a newer play
    if (i >= segments.length) {
      if (speechKeepAlive) {
        clearInterval(speechKeepAlive);
        speechKeepAlive = null;
      }
      return;
    }
    const seg = segments[i++];
    if (seg.type === "pause") {
      speechTimer = setTimeout(next, seg.ms);
      return;
    }
    const u = new SpeechSynthesisUtterance(seg.text);
    u.lang = "de-DE";
    u.rate = seg.rate ?? 0.95; // word readout plays a touch slower
    // iOS occasionally fires both end and error for the same utterance — only
    // advance once so we don't skip the following segment.
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      next();
    };
    u.onend = advance;
    u.onerror = advance;
    synth.speak(u);
  };

  // resume() is a Chrome-desktop workaround for its ~15s auto-pause. iOS
  // Safari has no such cutoff, and calling resume() there can stall the queue.
  if (!IS_IOS) {
    speechKeepAlive = setInterval(() => {
      if (synth.speaking) synth.resume();
    }, 5000);
  }
  next();
}

/** Narrate a scene, pause, then read its covered words aloud. */
function speakScene(scene: MemoryScene) {
  playSegments(buildSceneSpeech(scene.narrativeDe, scene.words));
}

function SceneImage({ scene }: { scene: MemoryScene }) {
  const [failed, setFailed] = useState(false);
  const m = ARTICLE_META[scene.tone];
  if (failed) {
    return (
      <div
        className="flex aspect-square w-full flex-col items-center justify-center rounded-xl"
        style={{ backgroundColor: `var(--${m.soft})`, color: `var(--${m.color})` }}
      >
        <div className="px-6 text-center text-lg font-extrabold">{scene.title}</div>
        <div className="mt-2 text-xs font-semibold opacity-70">🎨 Illustration coming soon</div>
      </div>
    );
  }
  return (
    <img
      src={scene.image}
      alt={scene.title}
      onError={() => setFailed(true)}
      className="aspect-square w-full rounded-xl object-cover"
      style={{ backgroundColor: `var(--${m.soft})` }}
      // Only the active scene is mounted, so eager-load it (with explicit
      // dimensions to reserve the square and avoid layout shift). Neighbours are
      // warmed separately so a swipe shows instantly.
      width={900}
      height={900}
      loading="eager"
      decoding="async"
    />
  );
}

function SceneCard({
  scene,
  index,
  total,
  mastered,
  onDrill,
  onPrev,
  onNext,
}: {
  scene: MemoryScene;
  index: number;
  total: number;
  mastered: boolean;
  onDrill: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const m = ARTICLE_META[scene.tone];
  const [showTranslation, setShowTranslation] = useState(false);
  const canNav = !!onPrev && !!onNext;
  return (
    <article
      className="overflow-hidden rounded-3xl border bg-card shadow-md"
      style={{ borderColor: `var(--${m.color})` }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ backgroundColor: `var(--${m.soft})` }}
      >
        <ArticleBadge article={scene.tone} size="sm" />
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          {mastered && <span title="Mastered" className="text-base">⭐</span>}
          {canNav && (
            <button
              onClick={onPrev}
              aria-label="Previous scene"
              className="flex h-6 w-6 items-center justify-center rounded-full border bg-card text-sm shadow-sm active:scale-90"
              style={{ borderColor: `var(--${m.color})`, color: `var(--${m.color})` }}
            >
              ‹
            </button>
          )}
          <span>Scene {index + 1} / {total}</span>
          {canNav && (
            <button
              onClick={onNext}
              aria-label="Next scene"
              className="flex h-6 w-6 items-center justify-center rounded-full border bg-card text-sm shadow-sm active:scale-90"
              style={{ borderColor: `var(--${m.color})`, color: `var(--${m.color})` }}
            >
              ›
            </button>
          )}
        </div>
      </div>

      <motion.div
        className="px-3 pt-3"
        drag={canNav ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) onNext?.();
          else if (info.offset.x > 60) onPrev?.();
        }}
        style={{ touchAction: "pan-y" }}
      >
        <SceneImage scene={scene} />
      </motion.div>

      <div className="px-5 pt-4">
        <h2 className="text-[22px] font-extrabold leading-tight">{scene.title}</h2>

        <div className="mt-3 flex items-start gap-2">
          <p
            className="flex-1 text-[16px] font-medium"
            style={{ lineHeight: 1.7 }}
          >
            {scene.narrativeDe}
          </p>
          <button
            onClick={() => speakScene(scene)}
            aria-label="Anhören"
            title="Anhören"
            className="shrink-0 rounded-full border bg-card p-2 text-base shadow-sm"
            style={{ borderColor: `var(--${m.color})` }}
          >
            🔊
          </button>
        </div>

        <button
          onClick={() => setShowTranslation(v => !v)}
          className="mt-3 rounded-full border bg-card px-3 py-1.5 text-xs font-bold shadow-sm"
        >
          🇬🇧 {showTranslation ? "Hide translation" : "Show translation"}
        </button>

        <AnimatePresence initial={false}>
          {showTranslation && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 overflow-hidden text-[14px] italic text-muted-foreground"
              style={{ lineHeight: 1.6 }}
            >
              {scene.narrativeEn}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2 px-5 pt-4">
        {scene.words.map(w => (
          <WordPill key={w.article + w.word} article={w.article} word={w.word} english={w.english} />
        ))}
      </div>

      {scene.note && (
        <p className="mx-5 mt-4 rounded-xl bg-muted px-3 py-2 text-xs italic">💡 {scene.note}</p>
      )}

      <div className="px-5 pb-5 pt-4">
        <button
          onClick={onDrill}
          className="w-full rounded-full py-3 text-sm font-extrabold text-white shadow-md"
          style={{ backgroundColor: `var(--${m.color})` }}
        >
          🔍 Diese Szene üben
        </button>
      </div>
    </article>
  );
}

function SceneDrill({
  scene,
  onExit,
}: {
  scene: MemoryScene;
  onExit: (perfect: boolean) => void;
}) {
  const deck = useMemo(() => shuffle(scene.words), [scene]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [reveal, setReveal] = useState<Article | null>(null);
  const word: Word | undefined = deck[i];
  const done = i >= deck.length;
  const m = ARTICLE_META[scene.tone];

  const pick = (a: Article) => {
    if (!word || reveal) return;
    const correct = a === word.article;
    setReveal(word.article);
    recordAnswer(word.article, word.word, correct);
    if (correct) {
      setScore(s => s + 1);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 }, scalar: 0.7 });
    }
    setTimeout(() => {
      setReveal(null);
      setI(n => n + 1);
    }, correct ? 800 : 1400);
  };

  useEffect(() => {
    if (done && score === deck.length) {
      markSceneMastered(scene.id);
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    }
  }, [done, score, deck.length, scene.id]);

  if (done) {
    const perfect = score === deck.length;
    return (
      <div className="flex flex-col items-center px-6 pt-10 text-center">
        <div className="text-6xl">{perfect ? "⭐" : "🎯"}</div>
        <h2 className="mt-3 text-2xl font-extrabold">{perfect ? "Scene mastered!" : "Nice work!"}</h2>
        <p className="mt-2 text-muted-foreground">
          {score} / {deck.length} correct on <b>{scene.title}</b>.
        </p>
        <button
          onClick={() => onExit(perfect)}
          className="mt-6 rounded-full px-6 py-3 font-bold text-white shadow-md"
          style={{ backgroundColor: `var(--${m.color})` }}
        >
          Back to scenes
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <div className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground">
        <button onClick={() => onExit(false)}>← Exit</button>
        <span>{i + 1} / {deck.length}</span>
        <span>Score: {score}</span>
      </div>

      <div
        className="flex h-60 w-full flex-col items-center justify-center rounded-3xl border p-6 shadow-xl"
        style={{
          borderColor: reveal ? `var(--${ARTICLE_META[reveal].color})` : `var(--${m.color})`,
          backgroundColor: reveal ? `var(--${ARTICLE_META[reveal].soft})` : `var(--${m.soft})`,
        }}
      >
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {scene.title}
        </div>
        <div className="mt-2 text-4xl font-extrabold">
          {reveal && (
            <span style={{ color: `var(--${ARTICLE_META[reveal].color})` }}>{reveal} </span>
          )}
          {word!.word}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{word!.english}</div>
      </div>

      <div className="grid w-full grid-cols-3 gap-2">
        {(["der", "die", "das"] as Article[]).map(a => {
          const am = ARTICLE_META[a];
          return (
            <motion.button
              key={a}
              whileTap={{ scale: 0.94 }}
              disabled={!!reveal}
              onClick={() => pick(a)}
              className="rounded-2xl py-4 text-lg font-extrabold uppercase tracking-wider text-white shadow-md disabled:opacity-60"
              style={{
                backgroundColor: `var(--${am.color})`,
                outline: reveal === a ? "4px solid var(--success)" : undefined,
              }}
            >
              <span className="mr-1">{am.icon}</span>{a}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function MemoryScenesView() {
  const [tab, setTab] = useState<Article | "shuffle">("das");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [drilling, setDrilling] = useState<MemoryScene | null>(null);
  const [shuffleScene, setShuffleScene] = useState<MemoryScene | null>(null);
  const [mastered, setMastered] = useState<string[]>([]);

  useEffect(() => {
    setMastered(loadProgress().scenesMastered);
  }, [drilling]);

  const scenes = useMemo(() => {
    if (tab === "shuffle") {
      return shuffleScene ? [shuffleScene] : [];
    }
    // Within an article, show scenes easiest → hardest (by their words' CEFR level).
    return orderByDifficulty(MEMORY_SCENES.filter(s => s.tone === tab));
  }, [tab, shuffleScene]);

  // Re-roll shuffle when entering tab
  useEffect(() => {
    if (tab === "shuffle") {
      setShuffleScene(MEMORY_SCENES[Math.floor(Math.random() * MEMORY_SCENES.length)]);
      setIndex(0);
    } else {
      setIndex(0);
    }
  }, [tab]);

  const total = scenes.length;
  const scene = scenes[Math.min(index, Math.max(0, total - 1))];

  const go = (delta: number) => {
    if (total <= 1) return;
    setDirection(delta);
    setIndex(i => (i + delta + total) % total);
  };

  // Warm the previous/next scene images so swiping shows them instantly instead
  // of fetching on demand. `new Image()` populates the browser cache; the actual
  // <img> then hits that cache. Runs only in the browser.
  useEffect(() => {
    if (typeof window === "undefined" || total <= 1) return;
    for (const delta of [1, -1]) {
      const neighbor = scenes[(index + delta + total) % total];
      if (neighbor?.image) {
        const img = new Image();
        img.src = neighbor.image;
      }
    }
  }, [scenes, index, total]);

  if (drilling) {
    return (
      <div className="px-2 pb-8 pt-4">
        <SceneDrill
          scene={drilling}
          onExit={() => setDrilling(null)}
        />
      </div>
    );
  }

  return (
    <div className="px-4 pb-8 pt-6">
      <h1 className="text-3xl font-extrabold">Memory Scenes</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bizarre tableaux that bundle tricky words into one unforgettable image.
      </p>

      <div className="mt-2 text-xs font-semibold text-muted-foreground">
        ⭐ Mastered: {mastered.length} / {MEMORY_SCENES.length}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5 rounded-full border bg-muted p-1">
        {(TABS as (Article | "shuffle")[]).concat(["shuffle"]).map(t => {
          const isActive = tab === t;
          const label = t === "shuffle" ? "🎲" : t.toUpperCase();
          const color = t === "shuffle" ? "primary" : ARTICLE_META[t as Article].color;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="rounded-full py-1.5 text-xs font-extrabold uppercase tracking-wider transition"
              style={{
                backgroundColor: isActive ? `var(--${color})` : "transparent",
                color: isActive ? "#fff" : "var(--muted-foreground)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {scene ? (
        <>
          <div className="relative mt-5 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={scene.id}
                custom={direction}
                initial={{ x: direction >= 0 ? 80 : -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction >= 0 ? -80 : 80, opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                <SceneCard
                  scene={scene}
                  index={tab === "shuffle" ? 0 : index}
                  total={tab === "shuffle" ? 1 : total}
                  mastered={mastered.includes(scene.id)}
                  onDrill={() => setDrilling(scene)}
                  onPrev={tab !== "shuffle" && total > 1 ? () => go(-1) : undefined}
                  onNext={tab !== "shuffle" && total > 1 ? () => go(1) : undefined}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {tab !== "shuffle" && total > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {scenes.map((_, i) => (
                <span
                  key={i}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === index ? 18 : 6,
                    backgroundColor: i === index
                      ? `var(--${ARTICLE_META[tab as Article].color})`
                      : "var(--muted)",
                  }}
                />
              ))}
            </div>
          )}

          {tab === "shuffle" && (
            <button
              onClick={() => setShuffleScene(MEMORY_SCENES[Math.floor(Math.random() * MEMORY_SCENES.length)])}
              className="mt-4 w-full rounded-full border bg-card py-3 text-sm font-bold shadow-sm"
            >
              🎲 Roll another scene
            </button>
          )}
        </>
      ) : null}
    </div>
  );
}
