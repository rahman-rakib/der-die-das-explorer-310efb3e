import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RULES, type RuleGroup } from "@/data/words";

export const Route = createFileRoute("/claude-prompt")({
  head: () => ({
    meta: [
      { title: "Claude Prompt — Thematic Rules" },
      { name: "description", content: "Generate a clean, copy-paste prompt of all thematic der/die/das rules for Claude." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClaudePromptPage,
});

function buildPrompt(): string {
  // Thematic rules = rule groups with words, excluding the suffix-only groups.
  const thematic = RULES.filter(r => !r.suffixes && r.words.length > 0);

  const byArticle: Record<"der" | "die" | "das", RuleGroup[]> = {
    der: thematic.filter(r => r.article === "der"),
    die: thematic.filter(r => r.article === "die"),
    das: thematic.filter(r => r.article === "das"),
  };

  const header = [
    "# German Article Rules — Thematic (Semantic) Categories",
    "",
    "Below are the thematic rules that determine whether a German noun takes",
    "der (masculine), die (feminine), or das (neuter), based on MEANING",
    "(not word ending and not compound-head). For each rule: the rule itself,",
    "example nouns, and notable exceptions (if any).",
    "",
    "Notes:",
    "- Suffix/ending rules (e.g. -ung, -chen, -tion) are a SEPARATE system.",
    "- Compound-head rules (a German compound takes the gender of its LAST",
    "  noun, e.g. die Autobahn = die Bahn) are ALSO separate.",
    "- The rules below are semantic only.",
    "",
  ].join("\n");

  const renderGroup = (g: RuleGroup): string => {
    const lines: string[] = [];
    lines.push(`### ${g.title}`);
    if (g.note) lines.push(g.note);
    const examples = g.words.map(w => `${w.article} ${w.word} (${w.english})`).join(", ");
    lines.push(`Examples: ${examples}.`);
    if (g.exceptions) lines.push(`Exceptions: ${g.exceptions}.`);
    return lines.join("\n");
  };

  const section = (label: string, article: "der" | "die" | "das") => {
    const groups = byArticle[article];
    return [
      `## ${label} (${article}) — ${groups.length} thematic rule${groups.length === 1 ? "" : "s"}`,
      "",
      groups.map(renderGroup).join("\n\n"),
    ].join("\n");
  };

  return [
    header,
    section("MASCULINE", "der"),
    "",
    section("FEMININE", "die"),
    "",
    section("NEUTER", "das"),
    "",
  ].join("\n");
}

function ClaudePromptPage() {
  const prompt = useMemo(buildPrompt, []);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const download = () => {
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "thematic-rules-prompt.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const thematicCount = RULES.filter(r => !r.suffixes && r.words.length > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">Claude prompt — thematic rules</h1>
            <p className="text-sm text-muted-foreground">
              {thematicCount} thematic rules · {prompt.length.toLocaleString()} chars
            </p>
          </div>
          <Link to="/" className="rounded-full border px-3 py-1.5 text-sm font-semibold hover:bg-muted">
            ← Back
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={copy}
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md"
          >
            {copied ? "✓ Copied" : "📋 Copy prompt"}
          </button>
          <button
            onClick={download}
            className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            ⬇ Download .txt
          </button>
        </div>

        <textarea
          readOnly
          value={prompt}
          className="mt-4 h-[70vh] w-full resize-y rounded-2xl border bg-card p-4 font-mono text-xs leading-relaxed shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}
