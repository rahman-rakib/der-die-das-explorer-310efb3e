import { useEffect, useState } from "react";
import { ARTICLE_META, MEMORY_SCENES, PRACTICE_WORDS, type Article } from "@/data/words";
import { loadProgress, resetProgress, type Progress } from "@/lib/progress";
import { ArticleBadge } from "./ArticleBadge";

function Ring({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, pct)) / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} stroke="var(--muted)" strokeWidth="10" fill="none" />
          <circle
            cx="50" cy="50" r={r}
            stroke={`var(--${color})`} strokeWidth="10" fill="none"
            strokeDasharray={c} strokeDashoffset={off}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-extrabold" style={{ color: `var(--${color})` }}>{value}</span>
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export function ProgressView() {
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => { setP(loadProgress()); }, []);
  if (!p) return null;

  const accuracy = (a: Article) => {
    const s = p.perArticle[a];
    const t = s.right + s.wrong;
    return t === 0 ? 0 : Math.round((s.right / t) * 100);
  };
  const learned = Object.values(p.perWord).filter(s => s.right >= 2 && s.right > s.wrong).length;

  const weakest = Object.entries(p.perWord)
    .map(([k, s]) => ({ k, ...s }))
    .filter(x => x.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 5);

  const findWord = (key: string) => {
    const [art, word] = key.split(":");
    return PRACTICE_WORDS.find(w => w.article === art && w.word === word);
  };

  const milestones = [10, 25, 50, 100, 250];
  const nextMilestone = milestones.find(m => m > learned) ?? null;

  return (
    <div className="px-4 pb-10 pt-6">
      <h1 className="text-3xl font-extrabold">Progress</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your journey to gender mastery.</p>

      <div className="mt-5 grid grid-cols-3 gap-3 rounded-3xl border bg-card p-4 shadow-sm">
        {(["der","die","das"] as Article[]).map(a => (
          <Ring key={a} pct={accuracy(a)} color={ARTICLE_META[a].color} label={a} value={`${accuracy(a)}%`} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="text-3xl">🔥</div>
          <div className="mt-1 text-2xl font-extrabold">{p.streak}</div>
          <div className="text-xs text-muted-foreground">day streak</div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="text-3xl">🎓</div>
          <div className="mt-1 text-2xl font-extrabold">{learned}</div>
          <div className="text-xs text-muted-foreground">
            words learned{nextMilestone && ` · next 🎉 at ${nextMilestone}`}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Accuracy bar</h3>
        <div className="mt-3 space-y-3">
          {(["der","die","das"] as Article[]).map(a => {
            const acc = accuracy(a);
            return (
              <div key={a}>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2"><ArticleBadge article={a} size="sm" /></span>
                  <span>{acc}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${acc}%`, backgroundColor: `var(--${ARTICLE_META[a].color})` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Weakest words</h3>
        {weakest.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No mistakes yet — go practise something!</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {weakest.map(item => {
              const word = findWord(item.k);
              if (!word) return null;
              return (
                <li key={item.k} className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
                  <span className="text-2xl">{word.emoji ?? "📘"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <ArticleBadge article={word.article} size="sm" />
                      <span className="truncate font-bold">{word.word}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{word.english}</div>
                  </div>
                  <span className="text-xs font-bold text-destructive">×{item.wrong}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        onClick={() => { resetProgress(); setP(loadProgress()); }}
        className="mt-6 w-full rounded-full border bg-card py-3 text-sm font-semibold text-muted-foreground"
      >
        Reset progress
      </button>
    </div>
  );
}
