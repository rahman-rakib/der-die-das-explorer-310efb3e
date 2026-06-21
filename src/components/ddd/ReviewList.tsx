import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { filterReview, reviewStats, type ReviewItem } from "@/lib/review";

/**
 * Collapsible "Review answers" block for the end of a practice session. Lists
 * each question with the learner's answer vs the correct one and a mistakes-only
 * filter. Reused by every quiz/game so review looks the same everywhere.
 */
export function ReviewList({ items }: { items: ReviewItem[] }) {
  const [open, setOpen] = useState(false);
  const [mistakesOnly, setMistakesOnly] = useState(false);

  if (items.length === 0) return null;
  const { correct, wrong } = reviewStats(items);
  const shown = filterReview(items, mistakesOnly);

  return (
    <div className="mx-auto mt-5 w-full max-w-[440px] text-left">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between rounded-2xl border bg-card px-4 py-3 text-sm font-bold shadow-sm"
      >
        <span>📋 Review answers</span>
        <span className="text-xs font-semibold text-muted-foreground">
          {correct}✓ · {wrong}✗ {open ? "▲" : "▼"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {wrong > 0 && (
              <label className="mt-2 flex cursor-pointer items-center gap-2 px-1 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={mistakesOnly}
                  onChange={e => setMistakesOnly(e.target.checked)}
                />
                Show mistakes only ({wrong})
              </label>
            )}
            <ul className="mt-2 space-y-1.5">
              {shown.map((it, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2 text-sm"
                  style={{ borderColor: it.isCorrect ? undefined : "var(--destructive)" }}
                >
                  <span className="text-lg">{it.isCorrect ? "✅" : "❌"}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {it.emoji && <span className="mr-1">{it.emoji}</span>}
                    <span className="font-bold">{it.prompt}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-right text-xs">
                    {!it.isCorrect && (
                      <span className="mr-2 line-through" style={{ color: "var(--destructive)" }}>
                        {it.picked || "—"}
                      </span>
                    )}
                    <span className="font-bold" style={{ color: "var(--success)" }}>
                      {it.correct}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
