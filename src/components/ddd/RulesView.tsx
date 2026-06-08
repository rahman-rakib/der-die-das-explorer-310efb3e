import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import rulesData from "@/data/rules.json";
import { ARTICLE_META, RULES as THEMATIC_RULES, type Article } from "@/data/words";
import { ArticleBadge } from "./ArticleBadge";

type Tier = "ironclad" | "strong" | "weak";

interface Exception {
  noun: string;
  article: Article;
}

interface Rule {
  suffix: string;
  article: Article;
  accuracy: number;
  rawAccuracy: number;
  tier: Tier;
  count: number;
  smallSample: boolean;
  exceptionCount: number;
  note: string;
  examples: string[];
  exceptions: Exception[];
}

const RULES = (rulesData as { rules: Rule[] }).rules;

const TABS: Article[] = ["der", "die", "das"];

const TIER_STYLE: Record<Tier, { label: string; icon: string; bg: string; fg: string; bar: string; barBg: string }> = {
  ironclad: {
    label: "Ironclad",
    icon: "🔒",
    bg: "bg-emerald-100",
    fg: "text-emerald-700",
    bar: "bg-emerald-500",
    barBg: "bg-emerald-100",
  },
  strong: {
    label: "Strong",
    icon: "💪",
    bg: "bg-amber-100",
    fg: "text-amber-800",
    bar: "bg-amber-500",
    barBg: "bg-amber-100",
  },
  weak: {
    label: "Weak",
    icon: "⚠️",
    bg: "bg-rose-100",
    fg: "text-rose-700",
    bar: "bg-rose-500",
    barBg: "bg-rose-100",
  },
};

export function RulesView() {
  const [tab, setTab] = useState<Article>("der");
  const meta = ARTICLE_META[tab];
  const rules = RULES.filter(r => r.article === tab).slice().sort((a, b) => b.accuracy - a.accuracy);

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
                style={{ color: active ? `var(--${m.fg})` : undefined }}
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
          {meta.icon} {meta.label.toUpperCase()} — suffix rules, strongest first
        </p>
      </div>

      <div className="mt-4 space-y-3 px-4">
        {rules.map((r, i) => (
          <motion.div
            key={r.suffix}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <RuleCard rule={r} />
          </motion.div>
        ))}
        {rules.length === 0 && (
          <p className="rounded-2xl border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
            No suffix rules in dataset for this gender.
          </p>
        )}
      </div>
    </div>
  );
}

function RuleCard({ rule }: { rule: Rule }) {
  const [open, setOpen] = useState(false);
  const meta = ARTICLE_META[rule.article];
  const tier = TIER_STYLE[rule.tier];
  const showTier = !rule.smallSample;
  const pct = Math.max(0, Math.min(100, rule.accuracy));

  return (
    <div
      className="overflow-hidden rounded-3xl border bg-card shadow-sm"
      style={{ borderColor: `var(--${meta.color})` }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-lg font-extrabold"
            style={{ backgroundColor: `var(--${meta.color})`, color: `var(--${meta.fg})` }}
          >
            {rule.suffix}
          </span>
          <ArticleBadge article={rule.article} size="sm" />
        </div>
        {showTier ? (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tier.bg} ${tier.fg}`}>
            <span aria-hidden>{tier.icon}</span>{tier.label}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            limited data (n={rule.count})
          </span>
        )}
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span>{rule.accuracy.toFixed(1)}% accuracy</span>
          <span>n={rule.count} · {rule.exceptionCount} exception{rule.exceptionCount === 1 ? "" : "s"}</span>
        </div>
        {showTier && (
          <div className={`mt-1.5 h-1.5 w-full overflow-hidden rounded-full ${tier.barBg}`}>
            <div className={`h-full ${tier.bar}`} style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>

      {rule.note && (
        <p className="mx-4 mt-3 rounded-xl bg-muted px-3 py-2 text-xs italic leading-relaxed">
          💡 {rule.note}
        </p>
      )}

      {rule.examples.length > 0 && (
        <div className="px-4 pt-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Examples
          </div>
          <div className="flex flex-wrap gap-1.5">
            {rule.examples.slice(0, 12).map(w => (
              <span
                key={w}
                className="inline-flex items-center gap-1 rounded-full border bg-card px-2 py-1 text-xs shadow-sm"
                style={{ borderColor: `var(--${meta.color})` }}
              >
                <span className="text-[10px] font-bold uppercase" style={{ color: `var(--${meta.color})` }}>
                  {rule.article}
                </span>
                <span className="font-semibold">{w}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {rule.exceptions.length > 0 ? (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            className="mt-3 flex w-full items-center justify-between border-t bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
          >
            <span>⚠️ Exceptions ({rule.exceptions.length})</span>
            <span className="text-base">{open ? "▴" : "▾"}</span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden bg-amber-50/60"
              >
                <div className="space-y-2.5 px-4 py-3">
                  {(["der", "die", "das"] as Article[]).map(a => {
                    const items = rule.exceptions.filter(e => e.article === a);
                    if (items.length === 0) return null;
                    return (
                      <div key={a}>
                        <div className="mb-1.5 flex items-center gap-2">
                          <ArticleBadge article={a} size="sm" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {items.length} exception{items.length === 1 ? "" : "s"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map(ex => (
                            <span
                              key={ex.noun}
                              className="inline-flex items-center gap-1 rounded-full border bg-card px-2 py-1 text-xs shadow-sm"
                              style={{ borderColor: `var(--${ARTICLE_META[a].color})` }}
                            >
                              <span
                                className="text-[10px] font-bold uppercase"
                                style={{ color: `var(--${ARTICLE_META[a].color})` }}
                              >
                                {a}
                              </span>
                              <span className="font-semibold">{ex.noun}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="mt-3 border-t bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
          ✅ No exceptions — this rule is rock solid!
        </div>
      )}
    </div>
  );
}
