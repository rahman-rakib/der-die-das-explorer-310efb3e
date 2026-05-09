import { motion } from "framer-motion";
import { ARTICLE_META, RULES, type Article } from "@/data/words";
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
                <div className="grid grid-cols-2 gap-2">
                  {g.suffixes.map(s => (
                    <div key={s.suffix} className="rounded-xl border bg-muted/30 p-2">
                      <div
                        className="inline-block rounded-md px-2 py-0.5 text-xs font-extrabold"
                        style={{ backgroundColor: `var(--${meta.color})`, color: `var(--${meta.fg})` }}
                      >
                        {s.suffix}
                      </div>
                      <div className="mt-1.5">
                        <WordPill article={s.example.article} word={s.example.word} english={s.example.english} />
                      </div>
                    </div>
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
