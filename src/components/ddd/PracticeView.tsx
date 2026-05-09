import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ARTICLE_META, PRACTICE_WORDS, SUFFIX_EXCEPTION_WORDS, FILL_SENTENCES, type Article, type Word } from "@/data/words";
import { recordAnswer } from "@/lib/progress";
import { ArticleBadge } from "./ArticleBadge";

type Mode = null | "flash" | "speed" | "fill";

const ARTICLES: Article[] = ["der", "die", "das"];

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function fireConfetti() {
  confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, scalar: 0.8 });
}

function ArticleButtons({ onPick, disabled, correctReveal }: {
  onPick: (a: Article) => void;
  disabled?: boolean;
  correctReveal?: Article | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ARTICLES.map(a => {
        const m = ARTICLE_META[a];
        const isCorrect = correctReveal === a;
        return (
          <motion.button
            key={a}
            disabled={disabled}
            onClick={() => onPick(a)}
            whileTap={{ scale: 0.94 }}
            className="rounded-2xl py-4 text-lg font-extrabold uppercase tracking-wider text-white shadow-md disabled:opacity-60"
            style={{
              backgroundColor: `var(--${m.color})`,
              outline: isCorrect ? "4px solid var(--success)" : undefined,
            }}
          >
            <span className="mr-1">{m.icon}</span>{a}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ---------- FLASHCARDS ---------- */
function Flashcards({ onExit, exceptionsOnly }: { onExit: () => void; exceptionsOnly: boolean }) {
  const deck = useMemo(
    () => shuffle(exceptionsOnly ? SUFFIX_EXCEPTION_WORDS : PRACTICE_WORDS).slice(0, 10),
    [exceptionsOnly],
  );
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"right" | "wrong" | null>(null);
  const [reveal, setReveal] = useState<Article | null>(null);
  const word = deck[i];
  const done = i >= deck.length;

  const pick = (a: Article) => {
    if (feedback) return;
    const correct = a === word.article;
    setFeedback(correct ? "right" : "wrong");
    setReveal(word.article);
    recordAnswer(word.article, word.word, correct);
    if (correct) { setScore(s => s + 1); fireConfetti(); }
    setTimeout(() => {
      setFeedback(null); setReveal(null); setI(n => n + 1);
    }, correct ? 900 : 1600);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center px-6 pt-10 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="mt-3 text-2xl font-extrabold">Round complete!</h2>
        <p className="mt-2 text-muted-foreground">You got <b>{score}</b> / {deck.length} correct.</p>
        <button onClick={onExit} className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-md">
          Back to practice
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <div className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground">
        <button onClick={onExit}>← Exit</button>
        <span>{i + 1} / {deck.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="relative h-72 w-full" style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={feedback === "wrong"
              ? { rotateY: 0, opacity: 1, x: [0, -12, 12, -8, 8, 0] }
              : { rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border bg-card p-6 shadow-xl"
            style={{
              borderColor: reveal ? `var(--${ARTICLE_META[reveal].color})` : undefined,
              backgroundColor: reveal ? `var(--${ARTICLE_META[reveal].soft})` : undefined,
            }}
          >
            <div className="text-7xl">{word.emoji ?? "📘"}</div>
            <div className="mt-3 text-3xl font-extrabold">
              {reveal && <span style={{ color: `var(--${ARTICLE_META[reveal].color})` }}>{reveal} </span>}
              {word.word}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{word.english}</div>
            {feedback === "right" && <div className="mt-3 text-3xl">✓</div>}
            {feedback === "wrong" && (
              <div className="mt-2 text-xs font-semibold text-destructive">Correct: {word.article}</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ArticleButtons onPick={pick} disabled={!!feedback} correctReveal={reveal} />
    </div>
  );
}

/* ---------- SPEED ROUND ---------- */
function SpeedRound({ onExit }: { onExit: () => void }) {
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [word, setWord] = useState<Word>(() => PRACTICE_WORDS[Math.floor(Math.random() * PRACTICE_WORDS.length)]);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setTime(t => {
        if (t <= 1) { if (tickRef.current) clearInterval(tickRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  const next = () => setWord(PRACTICE_WORDS[Math.floor(Math.random() * PRACTICE_WORDS.length)]);

  const pick = (a: Article) => {
    if (time === 0) return;
    const correct = a === word.article;
    recordAnswer(word.article, word.word, correct);
    if (correct) {
      const newStreak = streak + 1;
      const mult = 1 + Math.floor(newStreak / 5);
      setScore(s => s + 10 * mult);
      setStreak(newStreak);
      setFlash("good");
    } else {
      setStreak(0); setFlash("bad");
    }
    setTimeout(() => setFlash(null), 200);
    next();
  };

  if (time === 0) {
    return (
      <div className="flex flex-col items-center px-6 pt-10 text-center">
        <div className="text-6xl">⚡</div>
        <h2 className="mt-3 text-2xl font-extrabold">Time's up!</h2>
        <p className="mt-2 text-muted-foreground">Final score: <b className="text-2xl">{score}</b></p>
        <button onClick={onExit} className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-md">
          Back to practice
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <div className="flex w-full items-center justify-between text-sm font-bold">
        <button onClick={onExit} className="text-xs font-semibold text-muted-foreground">← Exit</button>
        <div className="rounded-full bg-muted px-3 py-1">⏱ {time}s</div>
        <div>{score} pts {streak >= 3 && <span className="text-orange-500">🔥{streak}</span>}</div>
      </div>

      <div
        className="relative h-56 w-full overflow-hidden rounded-3xl border bg-card shadow-xl transition-colors"
        style={{
          backgroundColor: flash === "good" ? "var(--success)" : flash === "bad" ? "var(--destructive)" : undefined,
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={word.word + word.article}
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="text-6xl">{word.emoji ?? "📘"}</div>
            <div className="mt-2 text-3xl font-extrabold">{word.word}</div>
            <div className="text-xs text-muted-foreground">{word.english}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <ArticleButtons onPick={pick} />
    </div>
  );
}

/* ---------- FILL THE GAP ---------- */
function FillGap({ onExit }: { onExit: () => void }) {
  const sents = useMemo(() => shuffle(FILL_SENTENCES), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [reveal, setReveal] = useState<Article | null>(null);
  const s = sents[i];
  const done = i >= sents.length;

  const pick = (a: Article) => {
    if (reveal) return;
    const correct = a === s.word.article;
    recordAnswer(s.word.article, s.word.word, correct);
    setReveal(s.word.article);
    if (correct) { setScore(x => x + 1); fireConfetti(); }
    setTimeout(() => { setReveal(null); setI(n => n + 1); }, correct ? 900 : 1500);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center px-6 pt-10 text-center">
        <div className="text-6xl">🧩</div>
        <h2 className="mt-3 text-2xl font-extrabold">Done!</h2>
        <p className="mt-2 text-muted-foreground">{score} / {sents.length} correct.</p>
        <button onClick={onExit} className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-md">
          Back to practice
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <div className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground">
        <button onClick={onExit}>← Exit</button>
        <span>{i + 1} / {sents.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-3xl border bg-card p-6 text-center shadow-xl">
        <div className="text-5xl">{s.word.emoji ?? "📘"}</div>
        <div className="text-2xl font-bold leading-snug">
          {s.before}
          <span
            className="mx-1 inline-block min-w-[3.5rem] rounded-md border-2 border-dashed px-2 py-0.5 align-middle"
            style={{
              borderColor: reveal ? `var(--${ARTICLE_META[reveal].color})` : undefined,
              color: reveal ? `var(--${ARTICLE_META[reveal].color})` : "var(--muted-foreground)",
            }}
          >
            {reveal ?? "___"}
          </span>
          {" "}{s.word.word}{s.after}
        </div>
        <div className="text-xs text-muted-foreground">({s.word.english})</div>
      </div>

      <ArticleButtons onPick={pick} disabled={!!reveal} correctReveal={reveal} />
    </div>
  );
}

/* ---------- MENU ---------- */
export function PracticeView() {
  const [mode, setMode] = useState<Mode>(null);

  if (mode === "flash") return <Wrap><Flashcards onExit={() => setMode(null)} /></Wrap>;
  if (mode === "speed") return <Wrap><SpeedRound onExit={() => setMode(null)} /></Wrap>;
  if (mode === "fill") return <Wrap><FillGap onExit={() => setMode(null)} /></Wrap>;

  const tiles: { id: Exclude<Mode, null>; emoji: string; title: string; sub: string; bg: string }[] = [
    { id: "flash", emoji: "🃏", title: "Flashcards", sub: "10 words · tap the article", bg: "var(--der-soft)" },
    { id: "speed", emoji: "⚡", title: "Speed Round", sub: "30 seconds · go fast", bg: "var(--die-soft)" },
    { id: "fill", emoji: "🧩", title: "Fill the Gap", sub: "15 sentences", bg: "var(--das-soft)" },
  ];

  return (
    <div className="px-4 pb-8 pt-6">
      <h1 className="text-3xl font-extrabold">Practice</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pick a game and get those genders right.</p>

      <div className="mt-5 space-y-3">
        {tiles.map(t => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode(t.id)}
            className="flex w-full items-center gap-4 rounded-3xl border bg-card p-5 text-left shadow-md"
            style={{ backgroundColor: t.bg }}
          >
            <span className="text-5xl">{t.emoji}</span>
            <span>
              <span className="block text-xl font-extrabold">{t.title}</span>
              <span className="block text-sm text-muted-foreground">{t.sub}</span>
            </span>
            <span className="ml-auto text-2xl">›</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-muted p-4 text-xs text-muted-foreground">
        Every answer updates your <b>Progress</b> tab — including which article gives you the most trouble.
      </div>
    </div>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="pb-10 pt-4">{children}</div>;
}
