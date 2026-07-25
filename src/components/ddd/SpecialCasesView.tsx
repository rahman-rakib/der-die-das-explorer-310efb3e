import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArticleBadge } from "./ArticleBadge";
import { ReviewList } from "./ReviewList";
import type { Article } from "@/data/words";
import type { ReviewItem } from "@/lib/review";

interface MeaningRow {
  word: string;
  meanings: { article: Article; meaning: string; emoji: string; example: string; exampleEn: string }[];
}

const MEANING_ROWS: MeaningRow[] = [
  {
    word: "Band",
    meanings: [
      { article: "der", meaning: "volume / book", emoji: "📚", example: "Der Band steht im Regal.", exampleEn: "The volume is on the shelf." },
      { article: "die", meaning: "music group", emoji: "🎸", example: "Die Band spielt heute Abend.", exampleEn: "The band is playing tonight." },
      { article: "das", meaning: "ribbon / tape", emoji: "🎀", example: "Das Band ist rot.", exampleEn: "The ribbon is red." },
    ],
  },
  {
    word: "Leiter",
    meanings: [
      { article: "der", meaning: "male leader / manager / director", emoji: "👨‍💼", example: "Der Leiter trifft eine wichtige Entscheidung.", exampleEn: "The (male) director is making an important decision." },
      { article: "die", meaning: "ladder / female leader / manager / director", emoji: "🪜", example: "Die Leiter steht an der Wand.", exampleEn: "The ladder is leaning against the wall." },
    ],
  },
  {
    word: "See",
    meanings: [
      { article: "der", meaning: "lake", emoji: "🏞️", example: "Der See ist tief.", exampleEn: "The lake is deep." },
      { article: "die", meaning: "sea / ocean", emoji: "🌊", example: "Die See ist stürmisch.", exampleEn: "The sea is stormy." },
    ],
  },
  {
    word: "Gang",
    meanings: [
      { article: "der", meaning: "corridor / passage / walk", emoji: "🚶", example: "Der Gang ist sehr lang.", exampleEn: "The corridor is very long." },
      { article: "die", meaning: "gang (criminal group)", emoji: "🕵️", example: "Die Gang wurde verhaftet.", exampleEn: "The gang was arrested." },
    ],
  },
  {
    word: "Lama",
    meanings: [
      { article: "das", meaning: "llama (animal)", emoji: "🦙", example: "Das Lama spuckt!", exampleEn: "The llama spits!" },
      { article: "der", meaning: "Buddhist monk", emoji: "🧘", example: "Der Lama lebt im Kloster.", exampleEn: "The lama lives in the monastery." },
    ],
  },
  {
    word: "Kiwi",
    meanings: [
      { article: "die", meaning: "kiwi fruit", emoji: "🥝", example: "Die Kiwi schmeckt süß.", exampleEn: "The kiwi tastes sweet." },
      { article: "der", meaning: "kiwi bird", emoji: "🐤", example: "Der Kiwi lebt in Neuseeland.", exampleEn: "The kiwi lives in New Zealand." },
    ],
  },
  {
    word: "Teil",
    meanings: [
      { article: "der", meaning: "part / portion of a whole", emoji: "🧩", example: "Der erste Teil des Buches ist spannend.", exampleEn: "The first part of the book is exciting." },
      { article: "das", meaning: "piece / component / item", emoji: "⚙️", example: "Das Teil passt nicht in die Maschine.", exampleEn: "The part doesn't fit in the machine." },
    ],
  },
  {
    word: "Schild",
    meanings: [
      { article: "der", meaning: "shield", emoji: "🛡️", example: "Der Ritter hebt seinen Schild.", exampleEn: "The knight raises his shield." },
      { article: "das", meaning: "sign / nameplate", emoji: "🪧", example: "Das Schild zeigt zum Bahnhof.", exampleEn: "The sign points to the station." },
    ],
  },
  {
    word: "Kiefer",
    meanings: [
      { article: "der", meaning: "jaw / jawbone", emoji: "🦷", example: "Der Kiefer knackt beim Kauen.", exampleEn: "The jaw clicks when chewing." },
      // A tree, so this one follows the app's own "flowers, trees & plants → die" theme.
      { article: "die", meaning: "pine (tree)", emoji: "🌲", example: "Die Kiefer wächst im Sand.", exampleEn: "The pine grows in the sand." },
    ],
  },
  {
    word: "Tor",
    meanings: [
      // A person, so this follows the "male humans" theme — der Tor is literary
      // and weak-masculine (den Toren), which is why it feels unfamiliar.
      { article: "der", meaning: "fool", emoji: "🤡", example: "Der Tor glaubt jedes Wort.", exampleEn: "The fool believes every word." },
      { article: "das", meaning: "gate / goal", emoji: "🥅", example: "Das Tor ist weit offen.", exampleEn: "The gate is wide open." },
    ],
  },
];

const FLEXIBLE: { word: string; articles: Article[]; english: string; emoji: string; note?: string }[] = [
  { word: "Logo", articles: ["der", "das"], english: "logo", emoji: "🏷️" },
  { word: "Virus", articles: ["der", "das"], english: "virus", emoji: "🦠", note: "das Virus in science; der Virus in everyday speech." },
  { word: "Techno", articles: ["der", "das"], english: "techno (music)", emoji: "🎧" },
  { word: "Tunnel", articles: ["der", "das"], english: "tunnel", emoji: "🚇" },
  { word: "Keks", articles: ["der", "das"], english: "cookie", emoji: "🍪" },
];

interface Quiz {
  q: string;
  options: string[];
  answer: number;
  hint: string;
}

const QUIZ: Quiz[] = [
  { q: "Which Band means a music group?", options: ["der Band", "die Band", "das Band"], answer: 1, hint: "Bands are feminine — die Band 🎸" },
  { q: "Which article is most common with Virus in everyday German?", options: ["der Virus", "die Virus", "das Virus"], answer: 0, hint: "Scientists say das Virus, but most people say der Virus." },
  { q: "Which Joghurt is most common in Austria?", options: ["der Joghurt", "die Joghurt", "das Joghurt"], answer: 2, hint: "In Austria and southern Germany, it's das Joghurt 🥣" },
  { q: "Which Lama is the animal?", options: ["der Lama", "das Lama"], answer: 1, hint: "Das Lama spuckt! 🦙" },
  { q: "Which Kiwi is the fruit?", options: ["der Kiwi", "die Kiwi"], answer: 1, hint: "Die Kiwi — the fruit is feminine 🥝" },
  { q: "Which Teil means an individual piece or component?", options: ["der Teil", "das Teil"], answer: 1, hint: "das Teil = a single piece/component ⚙️; der Teil = a portion of a whole 🧩" },
  { q: "Which Schild is a road sign?", options: ["der Schild", "die Schild", "das Schild"], answer: 2, hint: "das Schild = sign/nameplate 🪧; der Schild is a knight's shield 🛡️" },
  // Both hints below name the rule behind the answer, so the "wrong-looking"
  // article turns out to be derivable rather than something to memorise.
  { q: "Which Kiefer is a tree?", options: ["der Kiefer", "die Kiefer", "das Kiefer"], answer: 1, hint: "die Kiefer = pine 🌲 — trees are die; der Kiefer is your jaw 🦷" },
  { q: "Which Tor is a gate or a goal?", options: ["der Tor", "die Tor", "das Tor"], answer: 2, hint: "das Tor = gate/goal 🥅; der Tor is a fool 🤡 — a person, so der" },
];

export function SpecialCasesView() {
  return (
    <div className="pb-8">
      <div className="px-4 pt-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--der-soft)] via-[var(--die-soft)] to-[var(--das-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/70">
          ✨ Special cases
        </div>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">
          More Than One Article
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Some German nouns are rebels — they accept more than one article. Let's meet them! 🎉
        </p>
      </div>

      {/* Intro */}
      <div className="mx-4 mt-5 rounded-3xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-[var(--der-soft)] via-card to-[var(--das-soft)] p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-3xl">💡</span>
          <p className="text-sm leading-relaxed">
            Most German nouns have <b>one</b> article: <b style={{ color: "var(--der)" }}>der</b>,{" "}
            <b style={{ color: "var(--die)" }}>die</b>, or <b style={{ color: "var(--das)" }}>das</b>.
            But a few special nouns can have <b>more than one</b>.
            Sometimes the article changes the <b>meaning</b>. Sometimes <b>multiple articles</b> are simply accepted.
          </p>
        </div>
      </div>

      {/* PART 1 */}
      <SectionHeader index={1} title="Different Article = Different Meaning" emoji="🎭" />
      <div className="mx-4 mt-3 space-y-3">
        {MEANING_ROWS.map((row, i) => (
          <motion.div
            key={row.word}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="overflow-hidden rounded-3xl border bg-card shadow-sm"
          >
            <div className="flex items-baseline justify-between bg-muted/50 px-4 py-2.5">
              <h3 className="text-lg font-extrabold">{row.word}</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {row.meanings.length} meanings
              </span>
            </div>
            <div className="divide-y">
              {row.meanings.map(m => (
                <div key={m.article} className="flex items-start gap-3 px-4 py-3">
                  <span className="text-3xl">{m.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <ArticleBadge article={m.article} size="sm" />
                      <span className="font-bold">{m.article} {row.word}</span>
                      <span className="text-xs text-muted-foreground">= {m.meaning}</span>
                    </div>
                    <p className="mt-1 text-sm italic">"{m.example}"</p>
                    <p className="text-xs text-muted-foreground">{m.exampleEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* PART 2 */}
      <SectionHeader index={2} title="Multiple Correct Articles" emoji="🤝" />
      <div className="mx-4 mt-3 rounded-2xl bg-muted/60 px-4 py-3 text-sm italic">
        💬 Some nouns can be used with more than one article. This usually depends on
        <b> region</b>, <b>tradition</b>, or <b>personal preference</b> — all are correct!
      </div>
      <div className="mx-4 mt-3 grid grid-cols-1 gap-2.5">
        {FLEXIBLE.map((f, i) => (
          <motion.div
            key={f.word}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 rounded-2xl border bg-card px-3 py-3 shadow-sm"
          >
            <span className="text-3xl">{f.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {f.articles.map(a => (
                  <ArticleBadge key={a} article={a} size="sm" />
                ))}
                <span className="font-bold">{f.word}</span>
                <span className="text-xs text-muted-foreground">— {f.english}</span>
              </div>
              {f.note && <p className="mt-1 text-xs text-muted-foreground">💡 {f.note}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* PART 3 — Joghurt */}
      <SectionHeader index={3} title="The Famous Joghurt" emoji="🥣" />
      <div className="mx-4 mt-3 overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-[var(--das-soft)] to-[var(--die-soft)] shadow-md"
        style={{ borderColor: "var(--das)" }}>
        <div className="px-5 pt-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/70 shadow-sm">
            ⭐ Star word
          </div>
          <h3 className="mt-2 text-2xl font-extrabold">Joghurt 🥣</h3>
          <p className="mt-1 text-sm">
            One of the rare German nouns that can use <b>all three</b> articles!
          </p>
        </div>
        <div className="space-y-2 p-5">
          {[
            { a: "der" as const, where: "Most common in Germany", emoji: "🥇" },
            { a: "das" as const, where: "Common in Austria 🇦🇹 & southern Germany", emoji: "🏔️" },
            { a: "die" as const, where: "Less common but accepted ✅", emoji: "💬" },
          ].map(item => (
            <div key={item.a} className="flex items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-sm">
              <span className="text-2xl">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <ArticleBadge article={item.a} size="sm" />
                  <span className="font-bold">{item.a} Joghurt</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.where}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUIZ */}
      <SectionHeader index={4} title="Mini Quiz" emoji="🎯" />
      <Quiz />
    </div>
  );
}

function SectionHeader({ index, title, emoji }: { index: number; title: string; emoji: string }) {
  return (
    <div className="mt-7 px-4">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow">
          {index}
        </span>
        <h2 className="text-lg font-extrabold leading-tight">
          <span className="mr-1">{emoji}</span>{title}
        </h2>
      </div>
    </div>
  );
}

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<ReviewItem[]>([]);
  const q = QUIZ[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    setLog(l => [...l, { prompt: q.q, picked: q.options[i], correct: q.options[q.answer], isCorrect: i === q.answer }]);
    if (i === q.answer) setScore(s => s + 1);
  }
  function next() {
    if (idx + 1 >= QUIZ.length) { setDone(true); return; }
    setIdx(idx + 1);
    setPicked(null);
  }
  function restart() {
    setIdx(0); setPicked(null); setScore(0); setDone(false); setLog([]);
  }

  if (done) {
    const perfect = score === QUIZ.length;
    return (
      <div className="mx-4 mt-3 rounded-3xl border-2 bg-gradient-to-br from-[var(--das-soft)] to-card p-6 text-center shadow-md"
        style={{ borderColor: "var(--das)" }}>
        <div className="text-5xl">{perfect ? "🏆" : score >= 3 ? "🎉" : "💪"}</div>
        <h3 className="mt-2 text-2xl font-extrabold">
          {perfect ? "Perfect!" : score >= 3 ? "Great job!" : "Keep going!"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You scored <b>{score}</b> / {QUIZ.length}
        </p>
        <ReviewList items={log} />
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition active:scale-95"
        >
          Try again ↻
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-3 rounded-3xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>Question {idx + 1} / {QUIZ.length}</span>
        <span>⭐ {score}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={false}
          animate={{ width: `${((idx + (picked !== null ? 1 : 0)) / QUIZ.length) * 100}%` }}
        />
      </div>

      <h3 className="mt-4 text-base font-extrabold leading-snug">{q.q}</h3>
      <div className="mt-3 space-y-2">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === picked;
          const reveal = picked !== null;
          const cls = reveal
            ? isAnswer
              ? "border-success bg-success/10"
              : isPicked
                ? "border-destructive bg-destructive/10"
                : "border-border bg-card opacity-60"
            : "border-border bg-card hover:border-primary";
          return (
            <button
              key={opt}
              onClick={() => pick(i)}
              disabled={reveal}
              className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left font-semibold transition active:scale-[0.98] ${cls}`}
            >
              <span>{opt}</span>
              {reveal && isAnswer && <span className="text-lg">✅</span>}
              {reveal && isPicked && !isAnswer && <span className="text-lg">❌</span>}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {picked !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-3 rounded-2xl px-4 py-3 text-sm ${
              picked === q.answer ? "bg-success/10 text-success-foreground" : "bg-muted"
            }`}
          >
            <p className="font-bold">
              {picked === q.answer ? "🎉 Nice!" : "💡 Almost!"}
            </p>
            <p className="mt-0.5 text-foreground/80">{q.hint}</p>
            <button
              onClick={next}
              className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-md transition active:scale-95"
            >
              {idx + 1 >= QUIZ.length ? "See results 🏁" : "Next question →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
