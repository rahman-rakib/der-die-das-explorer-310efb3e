import { ARTICLE_META, type Article } from "@/data/words";
import { cn } from "@/lib/utils";

export function ArticleBadge({ article, size = "md" }: { article: Article; size?: "sm" | "md" | "lg" }) {
  const m = ARTICLE_META[article];
  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-base px-3 py-1.5",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider text-white shadow-sm",
        sizes[size],
      )}
      style={{ backgroundColor: `var(--${m.color})`, color: `var(--${m.fg})` }}
    >
      <span aria-hidden>{m.icon}</span>
      {article}
    </span>
  );
}

export function WordPill({ article, word, english }: { article: Article; word: string; english?: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border bg-card px-2 py-1 text-sm shadow-sm"
      style={{ borderColor: `var(--${ARTICLE_META[article].color})` }}
    >
      <ArticleBadge article={article} size="sm" />
      <span className="font-semibold">{word}</span>
      {english && <span className="text-xs text-muted-foreground">{english}</span>}
    </span>
  );
}
