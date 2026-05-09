import type { Article } from "@/data/words";

const KEY = "ddd-progress-v1";

export interface WordStat { right: number; wrong: number }
export interface Progress {
  perArticle: Record<Article, WordStat>;
  perWord: Record<string, WordStat>; // key = article:word
  totalSeen: number;
  streak: number;
  lastDay: string | null;
}

const empty = (): Progress => ({
  perArticle: { der: { right: 0, wrong: 0 }, die: { right: 0, wrong: 0 }, das: { right: 0, wrong: 0 } },
  perWord: {},
  totalSeen: 0,
  streak: 0,
  lastDay: null,
});

export function loadProgress(): Progress {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function recordAnswer(article: Article, word: string, correct: boolean) {
  const p = loadProgress();
  const k = `${article}:${word}`;
  const ws = p.perWord[k] ?? { right: 0, wrong: 0 };
  const as = p.perArticle[article];
  if (correct) { ws.right++; as.right++; } else { ws.wrong++; as.wrong++; }
  p.perWord[k] = ws;
  p.totalSeen++;

  const today = new Date().toISOString().slice(0, 10);
  if (p.lastDay !== today) {
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    p.streak = p.lastDay === yest ? p.streak + 1 : 1;
    p.lastDay = today;
  }
  saveProgress(p);
  return p;
}

export function resetProgress() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
