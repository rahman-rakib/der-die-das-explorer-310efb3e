import { AnimatePresence, motion } from "framer-motion";
import { ARTICLE_META, RULES, type Article, type SuffixEntry } from "@/data/words";
import { ArticleBadge, WordPill } from "./ArticleBadge";
import { useState } from "react";

const TABS: Article[] = ["der", "die", "das"];

export function RulesView() {
  const [tab, setTab] = useState<Article>("der");
  const groups = RULES.filter(r => r.article === tab);
  const meta = ARTICLE_META[tab];

  return (
    <div className="pb-8">
      <div className="px-4 pt-6">
        <h1 className="text-3xl font-extrabold">Rules</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a gender to start learning! 🇩🇪
        </p>
      </div>

      <div className="sticky top-0 z-20 mt-4 bg-background/85 px-4 py-3 backdrop-blur">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted p-1">
          {TABS.map(t => {
            const active = t === tab;
            const m = ARTICLE_META[t];
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative rounded-xl px-3 py-2.5 text-sm font-bold uppercase tracking-wider transition"
                style={{
                  color: active ? `var(--${m.fg})` : undefined,
                }}
              >
                {active && (
                  <motion.div
                    layoutId="rulesTabPill"
                    className="absolute inset-0 rounded-xl shadow-md"
                    style={{ backgroundColor: `var(--${m.color})` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-1.5">
                  <span>{m.icon}</span>{t}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mx-4 mt-4 rounded-3xl px-4 py-3"
        style={{ backgroundColor: `var(--${meta.soft})` }}
      >
        <p className="text-sm font-semibold" style={{ color: `var(--${meta.color})` }}>
          {meta.icon} {meta.label.toUpperCase()} — use <em className="font-extrabold">{tab}</em> for these:
        </p>
      </div>

      <div className="mt-4 space-y-4 px-4">
        {groups.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="overflow-hidden rounded-3xl border bg-card shadow-sm"
            style={{ borderColor: `var(--${meta.color})` }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ backgroundColor: `var(--${meta.soft})` }}
            >
              <span className="text-3xl">{g.emoji}</span>
              <h3 className="text-base font-bold leading-tight">{g.title}</h3>
            </div>
            <div className="p-4">
              {g.note && (
                <p className="mb-3 rounded-xl bg-muted px-3 py-2 text-xs italic">
                  💡 {g.note}
                </p>
              )}
              {g.words.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {g.words.map(word => (
                    <div key={word.word} className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2">
                      <span className="text-2xl">{word.emoji ?? meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <ArticleBadge article={word.article} size="sm" />
                          <span className="truncate font-bold">{word.word}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{word.english}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {g.suffixes && (
                <div className="grid grid-cols-1 gap-2">
                  {g.suffixes.map(s => (
                    <SuffixCard key={s.suffix} entry={s} parentArticle={g.article} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SuffixCard({ entry, parentArticle }: { entry: SuffixEntry; parentArticle: Article }) {
  const [open, setOpen] = useState(false);
  const meta = ARTICLE_META[parentArticle];
  const ex = entry.exceptions;
  const ironclad = ex?.ironclad;
  const exceptionWords = ex?.words ?? [];
  const exCount = exceptionWords.length;
  const examples = entry.examples ?? [entry.example];

  // Group exception words by article
  const grouped: Record<Article, typeof exceptionWords> = { der: [], die: [], das: [] };
  exceptionWords.forEach(w => grouped[w.article].push(w));

  return (
    <div className="overflow-hidden rounded-2xl border bg-muted/30">
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className="inline-block rounded-md px-2 py-0.5 text-sm font-extrabold"
            style={{ backgroundColor: `var(--${meta.color})`, color: `var(--${meta.fg})` }}
          >
            {entry.suffix}
          </div>
          {ironclad ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              🔒 Ironclad
            </span>
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {exCount > 0 ? `~${exCount} exception${exCount === 1 ? "" : "s"}` : "0 exceptions 🔒"}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {examples.map(w => (
            <WordPill key={w.word} article={w.article} word={w.word} english={w.english} />
          ))}
        </div>

        {ironclad && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
            <div className="h-full w-full bg-emerald-500" />
          </div>
        )}
      </div>

      {ironclad ? (
        <div className="border-t bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          ✅ No exceptions — this rule is rock solid!
          {ex?.note && <div className="mt-1 font-normal italic text-emerald-900/80">⚠️ {ex.note}</div>}
        </div>
      ) : ex && (exceptionWords.length > 0 || ex.mnemonic) ? (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex w-full items-center justify-between border-t bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
          >
            <span>⚠️ Exceptions {exCount > 0 && `(${exCount})`}</span>
            <span className="text-base">{open ? "▴" : "▾"}</span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden bg-amber-50/70"
              >
                <div className="space-y-3 px-3 py-3">
                  {ex.illustration && (
                    <div className="flex justify-center gap-2 text-3xl" aria-hidden>
                      {ex.illustration.map((e, i) => <span key={i}>{e}</span>)}
                    </div>
                  )}
                  {ex.mnemonic && (
                    <p className="text-xs italic leading-relaxed text-amber-950">{ex.mnemonic}</p>
                  )}
                  {(["der","die","das"] as Article[]).map(a => grouped[a].length > 0 && (
                    <div key={a}>
                      <div className="mb-1.5 flex items-center gap-2">
                        <ArticleBadge article={a} size="sm" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          exceptions
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {grouped[a].map(w => (
                          <WordPill key={w.word} article={w.article} word={w.word} english={w.english} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {ex.note && (
                    <div
                      className="rounded-xl border-l-4 px-3 py-2 text-xs font-medium"
                      style={{
                        borderColor: `var(--${ARTICLE_META[ex.noteTone ?? "das"].color})`,
                        backgroundColor: `var(--${ARTICLE_META[ex.noteTone ?? "das"].soft})`,
                      }}
                    >
                      💡 {ex.note}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="border-t bg-muted/40 px-3 py-2 text-[11px] italic text-muted-foreground">
          A few exceptions exist — learn this one mostly by feel.
        </div>
      )}
    </div>
  );
}
