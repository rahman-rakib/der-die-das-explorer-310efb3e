import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import rulesData from "@/data/rules.json";
import compoundData from "@/data/compound_heads.json";
import { ARTICLE_META, RULES as THEMATIC_RULES, type Article } from "@/data/words";
import { ArticleBadge } from "./ArticleBadge";

type Tier = "ironclad" | "strong" | "moderate" | "weak";

interface Exception {
  noun: string;
  article: Article;
  reason?: string | null;
}

interface Rule {
  suffix: string;
  article: Article;
  accuracy: number;
  rawAccuracy: number;
  tier: Tier;
  count: number;
  smallSample: boolean;
  overriddenBy: string[];
  exceptionCount: number;
  note: string;
  examples: string[];
  exceptions: Exception[];
}

const RAW_RULES = rulesData as { rules: Record<Article, Omit<Rule, "article">[]> };
const RULES: Rule[] = (["der", "die", "das"] as Article[]).flatMap(a =>
  (RAW_RULES.rules[a] ?? []).map(r => ({ ...r, article: a, tier: r.tier as Tier }))
).filter(r => r.examples.length >= 5);


interface CompoundExample {
  word: string;
  meaning: string;
}
interface CompoundHead {
  head: string;
  meaning?: string;
  accuracy: number;
  count: number;
  exceptions?: string;
  examples: CompoundExample[];
}
const COMPOUNDS = (compoundData as unknown as { rules: Record<Article, CompoundHead[]> }).rules;

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
  moderate: {
    label: "Moderate",
    icon: "🤔",
    bg: "bg-orange-100",
    fg: "text-orange-800",
    bar: "bg-orange-500",
    barBg: "bg-orange-100",
  },

};

export function RulesView() {
  const [tab, setTab] = useState<Article>("der");
  const [view, setView] = useState<"thematic" | "suffix" | "compound">("thematic");
  const meta = ARTICLE_META[tab];
  const rules = RULES.filter(r => r.article === tab).slice().sort((a, b) => b.accuracy - a.accuracy);
  const compounds = (COMPOUNDS[tab] ?? []).slice().sort((a, b) => b.count - a.count);

  return (
    <div className="pb-8">
      <div className="px-4 pt-6">
        <h1 className="text-3xl font-extrabold">Rules</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a gender to start learning! 🇩🇪
        </p>
      </div>

      <div className="sticky top-0 z-20 mt-4 space-y-2 bg-background/85 px-4 py-3 backdrop-blur">
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

        <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted p-1">
          {([
            { id: "thematic", label: "🎨 Thematic" },
            { id: "compound", label: "🧩 Compound" },
            { id: "suffix", label: "🔤 Suffix" },
          ] as const).map(v => {
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className="relative rounded-lg px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider transition"
                style={{ color: active ? `var(--${meta.fg})` : undefined }}
              >
                {active && (
                  <motion.div
                    layoutId="rulesViewPill"
                    className="absolute inset-0 rounded-lg shadow-sm"
                    style={{ backgroundColor: `var(--${meta.color})` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{v.label}</span>
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
          {meta.icon} {meta.label.toUpperCase()} —{" "}
          {view === "thematic"
            ? "thematic groups"
            : view === "compound"
              ? "compound heads — gender of the last noun wins"
              : "suffix rules, strongest first"}
        </p>
      </div>

      {view === "thematic" && <ThematicGroups article={tab} />}
      {view === "compound" && <CompoundHeads article={tab} heads={compounds} />}
      {view === "suffix" && <SuffixBubbles article={tab} rules={rules} />}

    </div>
  );
}

function ThematicGroups({ article }: { article: Article }) {
  const meta = ARTICLE_META[article];
  const groups = THEMATIC_RULES.filter(g => g.article === article && !g.suffixes);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  if (groups.length === 0) return null;
  const active = activeIdx !== null ? groups[activeIdx] : null;

  return (
    <div className="relative mt-5 px-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Thematic groups · tap to expand
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="relative grid grid-cols-2 gap-2.5">
        {groups.map((g, i) => {
          const isOrphanLast = i === groups.length - 1 && groups.length % 2 === 1;
          return (
          <motion.button
            key={g.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveIdx(i)}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border bg-card px-3 py-4 text-center shadow-sm ${isOrphanLast ? "col-span-2 mx-auto w-1/2" : ""}`}
            style={{ borderColor: `var(--${meta.color})`, backgroundColor: `var(--${meta.soft})` }}
          >
            <span className="text-3xl">{g.emoji}</span>
            <span className="text-sm font-bold leading-tight">{g.title}</span>
          </motion.button>
          );
        })}

        <AnimatePresence>
          {active && (
            <>
              <motion.div
                key="t-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveIdx(null)}
                className="fixed inset-0 z-40 bg-black/30"
              />
              <motion.div
                key={active.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 320, damping: 24 }}
                className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border bg-card shadow-2xl"
                style={{ borderColor: `var(--${meta.color})` }}
              >
                <div
                  className="flex items-center justify-between gap-2 px-4 py-3"
                  style={{ backgroundColor: `var(--${meta.soft})` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{active.emoji}</span>
                    <h3 className="text-base font-bold leading-tight">{active.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveIdx(null)}
                    className="rounded-full bg-card/70 px-2 py-0.5 text-xs font-bold text-muted-foreground hover:bg-card"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-[70vh] space-y-2 overflow-y-auto p-4">
                  {active.note && (
                    <p className="rounded-xl bg-muted px-3 py-2 text-xs italic">💡 {active.note}</p>
                  )}
                  {active.words.length > 0 && (
                    <div className="grid grid-cols-1 gap-2">
                      {active.words.map(word => (
                        <div key={word.word} className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2">
                          <span className="text-2xl">{word.emoji ?? meta.icon}</span>
                          <div className="min-w-0 flex-1">
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
                  {active.exceptions && (
                    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                      ⚠️ {active.exceptions}
                    </p>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RuleCard({ rule, embedded = false }: { rule: Rule; embedded?: boolean }) {
  const [open, setOpen] = useState(false);
  const meta = ARTICLE_META[rule.article];
  const tier = TIER_STYLE[rule.tier];
  const showTier = !rule.smallSample;
  const pct = Math.max(0, Math.min(100, rule.accuracy));

  return (
    <div
      className={embedded ? "bg-card" : "overflow-hidden rounded-3xl border bg-card shadow-sm"}
      style={embedded ? undefined : { borderColor: `var(--${meta.color})` }}
    >
      {!embedded && (
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
      )}

      <div className={embedded ? "px-4 pt-3" : "px-4"}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground">
            {rule.accuracy.toFixed(1)}% accuracy
          </span>
          {embedded && (
            showTier ? (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tier.bg} ${tier.fg}`}>
                <span aria-hidden>{tier.icon}</span>{tier.label}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                limited data (n={rule.count})
              </span>
            )
          )}
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

      {rule.overriddenBy && rule.overriddenBy.length > 0 && (
        <p className="mx-4 mt-2 rounded-xl bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-900">
          ↗️ Overridden by more specific:{" "}
          {rule.overriddenBy.map((s, i) => (
            <span key={s}>
              {i > 0 && ", "}
              <span className="font-bold">{s}</span>
            </span>
          ))}
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
            <span>⚠️ Exceptions</span>
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
                               {ex.reason && (
                                 <span className="text-[10px] text-muted-foreground">· {ex.reason}</span>
                               )}
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

const BUBBLE_PALETTE = [
  "#f87171", "#fb923c", "#facc15", "#a3e635", "#34d399",
  "#22d3ee", "#60a5fa", "#818cf8", "#c084fc", "#f472b6",
  "#fb7185", "#fdba74", "#fde047", "#86efac", "#67e8f9",
  "#93c5fd", "#a5b4fc", "#d8b4fe",
];

function CompoundHeads({ article, heads }: { article: Article; heads: CompoundHead[] }) {
  const meta = ARTICLE_META[article];
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (heads.length === 0) {
    return (
      <p className="mx-4 mt-4 rounded-2xl border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
        No compound heads for this gender.
      </p>
    );
  }

  const BUBBLE = 64;
  const SPACING = 0.54; // phyllotaxis scale factor (~0.5 = touching)
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const scale = BUBBLE * SPACING;
  const positions = heads.map((_, i) => {
    const r = scale * Math.sqrt(i + 0.5);
    const theta = i * GOLDEN;
    return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
  });
  const outerR = scale * Math.sqrt(heads.length) + BUBBLE / 2 + 6;
  const boxSize = Math.ceil(outerR * 2);

  const active = activeIdx !== null ? heads[activeIdx] : null;

  return (
    <div className="mt-5 px-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Compound heads · last noun wins
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <p className="mb-3 text-xs italic text-muted-foreground">
        Tap a bubble to see examples.
      </p>

      <div
        className="relative mx-auto"
        style={{ width: boxSize, height: boxSize, maxWidth: "100%" }}
      >
        <div
          className="absolute inset-0 rounded-full shadow-inner"
          style={{
            backgroundColor: `var(--${meta.soft})`,
            border: `2px dashed var(--${meta.color})`,
          }}
        />
        {heads.map((h, i) => {
          const color = BUBBLE_PALETTE[i % BUBBLE_PALETTE.length];
          const isActive = activeIdx === i;
          const { x, y } = positions[i];
          const lower = h.head.charAt(0).toLowerCase() + h.head.slice(1);
          return (
            <motion.button
              key={h.head}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.025, type: "spring", stiffness: 260, damping: 18 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(isActive ? null : i); }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: BUBBLE,
                height: BUBBLE,
                marginLeft: -BUBBLE / 2,
                marginTop: -BUBBLE / 2,
                x,
                y,
                backgroundColor: color,
                zIndex: isActive ? 5 : 1,
                boxShadow: isActive
                  ? `0 0 0 3px var(--${meta.color}), 0 8px 20px ${color}66`
                  : `0 3px 8px ${color}55, inset 0 -4px 8px rgba(0,0,0,0.12), inset 0 4px 8px rgba(255,255,255,0.35)`,
              }}
              className="flex items-center justify-center rounded-full text-center font-extrabold leading-tight text-white outline-none"
            >
              <span className="px-1" style={{ fontSize: 14 }}>
                -{lower}
              </span>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {active && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveIdx(null)}
                className="absolute inset-0 z-10 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
              />
              <motion.div
                key={active.head}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 320, damping: 24 }}
                className="absolute left-1/2 top-1/2 z-20 w-[90%] max-w-xs -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border bg-card shadow-2xl"
                style={{ borderColor: `var(--${meta.color})` }}
              >
                <div
                  className="flex items-center justify-between gap-2 px-4 py-2.5"
                  style={{ backgroundColor: `var(--${meta.soft})` }}
                >
                  <div className="flex items-center gap-2">
                    <ArticleBadge article={article} size="sm" />
                    <span className="text-base font-extrabold">{active.head}</span>
                    <span className="text-xs text-muted-foreground">· {active.meaning}</span>
                  </div>
                  <button
                    onClick={() => setActiveIdx(null)}
                    className="rounded-full bg-card/70 px-2 py-0.5 text-xs font-bold text-muted-foreground hover:bg-card"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {active.examples.map(ex => (
                      <span
                        key={ex.word}
                        className="inline-flex items-center gap-1 rounded-full border bg-card px-2 py-1 text-xs shadow-sm"
                        style={{ borderColor: `var(--${meta.color})` }}
                      >
                        <span className="text-[10px] font-bold uppercase" style={{ color: `var(--${meta.color})` }}>
                          {article}
                        </span>
                        <span className="font-semibold">{ex.word}</span>
                        <span className="text-[10px] text-muted-foreground">· {ex.meaning}</span>
                      </span>
                    ))}
                  </div>
                  {active.exceptions && (
                    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                      ⚠️ {active.exceptions}
                    </p>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SuffixBubbles({ article, rules }: { article: Article; rules: Rule[] }) {
  const meta = ARTICLE_META[article];
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (rules.length === 0) {
    return (
      <p className="mx-4 mt-4 rounded-2xl border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
        No suffix rules in dataset for this gender.
      </p>
    );
  }

  // Size bubbles by tier so ironclad reads as biggest/most-trustworthy.
  const tierSize: Record<Tier, number> = { ironclad: 76, strong: 66, moderate: 58, weak: 50 };
  const sizes = rules.map(r => tierSize[r.tier] ?? 58);
  const maxSize = Math.max(...sizes);
  const SPACING = 0.58;
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const scale = maxSize * SPACING;
  const positions = rules.map((_, i) => {
    const r = scale * Math.sqrt(i + 0.5);
    const theta = i * GOLDEN;
    return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
  });
  const outerR = scale * Math.sqrt(rules.length) + maxSize / 2 + 6;
  const boxSize = Math.ceil(outerR * 2);

  const active = activeIdx !== null ? rules[activeIdx] : null;

  return (
    <div className="mt-5 px-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Suffix rules · bigger = stronger
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <p className="mb-3 text-xs italic text-muted-foreground">
        Tap a bubble to see the rule, examples, and exceptions.
      </p>

      <div
        className="relative mx-auto"
        style={{ width: boxSize, height: boxSize, maxWidth: "100%" }}
      >
        <div
          className="absolute inset-0 rounded-full shadow-inner"
          style={{
            backgroundColor: `var(--${meta.soft})`,
            border: `2px dashed var(--${meta.color})`,
          }}
        />
        {rules.map((r, i) => {
          const color = BUBBLE_PALETTE[i % BUBBLE_PALETTE.length];
          const isActive = activeIdx === i;
          const { x, y } = positions[i];
          const size = sizes[i];
          return (
            <motion.button
              key={r.suffix}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.025, type: "spring", stiffness: 260, damping: 18 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(isActive ? null : i); }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                x,
                y,
                backgroundColor: color,
                zIndex: isActive ? 5 : 1,
                boxShadow: isActive
                  ? `0 0 0 3px var(--${meta.color}), 0 8px 20px ${color}66`
                  : `0 3px 8px ${color}55, inset 0 -4px 8px rgba(0,0,0,0.12), inset 0 4px 8px rgba(255,255,255,0.35)`,
              }}
              className="flex items-center justify-center rounded-full text-center font-extrabold leading-tight text-white outline-none"
            >
              <span className="px-1" style={{ fontSize: 14 }}>
                {r.suffix}
              </span>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {active && (
            <>
              <motion.div
                key="suffix-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveIdx(null)}
                className="fixed inset-0 z-40 bg-black/30"
              />
              <motion.div
                key={active.suffix}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 320, damping: 24 }}
                className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border bg-card shadow-2xl"
                style={{ borderColor: `var(--${meta.color})` }}
              >
                <div
                  className="flex items-center justify-between gap-2 px-4 py-2.5"
                  style={{ backgroundColor: `var(--${meta.soft})` }}
                >
                  <div className="flex items-center gap-2">
                    <ArticleBadge article={article} size="sm" />
                    <span className="text-base font-extrabold">{active.suffix}</span>
                  </div>
                  <button
                    onClick={() => setActiveIdx(null)}
                    className="rounded-full bg-card/70 px-2 py-0.5 text-xs font-bold text-muted-foreground hover:bg-card"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  <RuleCard rule={active} embedded />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
