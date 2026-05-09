import { motion } from "framer-motion";
import { ARTICLE_META, SCENES } from "@/data/words";
import { WordPill } from "./ArticleBadge";

export function MnemonicsView() {
  return (
    <div className="px-4 pb-8 pt-6">
      <h1 className="text-3xl font-extrabold">Mnemonics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tricky exceptions, told as little visual stories.
      </p>

      <div className="mt-5 space-y-5">
        {SCENES.map((s, i) => {
          const m = ARTICLE_META[s.tone];
          return (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-3xl border bg-card shadow-md"
              style={{ borderColor: `var(--${m.color})` }}
            >
              <div className="px-5 pt-4">
                <h2 className="text-xl font-extrabold leading-tight">{s.title}</h2>
              </div>

              <div
                className="mx-5 mt-3 flex justify-center gap-1 rounded-2xl py-5"
                style={{ backgroundColor: `var(--${m.soft})` }}
              >
                {s.illustration.map((e, idx) => (
                  <motion.span
                    key={idx}
                    className="scene-emoji"
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + idx * 0.06, type: "spring" }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>

              <p className="px-5 pt-4 text-sm font-semibold italic" style={{ color: `var(--${m.color})` }}>
                “{s.mnemonic}”
              </p>

              <div className="flex flex-wrap gap-2 px-5 pt-3">
                {s.words.map(w => (
                  <WordPill key={w.article + w.word} article={w.article} word={w.word} english={w.english} />
                ))}
              </div>

              {s.note && (
                <p className="mx-5 my-4 rounded-xl bg-muted px-3 py-2 text-xs italic">
                  💡 {s.note}
                </p>
              )}
              {!s.note && <div className="h-5" />}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
