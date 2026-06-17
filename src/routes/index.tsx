import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BottomNav, type TabId } from "@/components/ddd/BottomNav";
import { HomeView } from "@/components/ddd/HomeView";
import { RulesView } from "@/components/ddd/RulesView";
import { PracticeView } from "@/components/ddd/PracticeView";
import { ProgressView } from "@/components/ddd/ProgressView";
import { MemoryScenesView } from "@/components/ddd/MemoryScenesView";
import { SpecialCasesView } from "@/components/ddd/SpecialCasesView";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Der Die Das — Master German Articles" },
      { name: "description", content: "A fun, pictorial app to learn when to use der, die, and das. Rules, mnemonics, and practice games — all mobile-first." },
      { property: "og:title", content: "Der Die Das — Master German Articles" },
      { property: "og:description", content: "Learn German articles with illustrated rules, mnemonic scenes, and quick practice games." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@500;600;700&display=swap" },
      { rel: "icon", type: "image/png", href: "/logo-icon.png" },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<TabId>("home");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("ddd-onboarded")) {
      setShowOnboarding(true);
      localStorage.setItem("ddd-onboarded", "1");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-background shadow-[0_0_60px_rgba(0,0,0,0.04)]">
        {tab !== "home" && (
          <header className="px-4 pt-5">
            <div className="flex items-center justify-between gap-2">
              {/* Logo doubles as a "back to landing" button. */}
              <button
                onClick={() => setTab("home")}
                className="flex items-center gap-2 rounded-md transition active:scale-95"
                title="Back to home"
              >
                <img src="/logo-icon.png" alt="Der Die Das — home" className="h-8 w-8 rounded-md object-contain" />
                <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                  Der · Die · Das
                </span>
              </button>
              <Link
                to="/claude-prompt"
                className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted"
                title="Generate Claude prompt from thematic rules"
              >
                📋 Prompt
              </Link>
            </div>
          </header>
        )}

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {tab === "home" && <HomeView onNavigate={setTab} />}
              {tab === "rules" && <RulesView />}
              {tab === "scenes" && <MemoryScenesView />}
              {tab === "special" && <SpecialCasesView />}
              {tab === "practice" && <PracticeView />}
              {tab === "progress" && <ProgressView />}
            </motion.div>
          </AnimatePresence>
        </main>

        {tab !== "home" && <BottomNav active={tab} onChange={setTab} />}
      </div>

      <AnimatePresence>
        {showOnboarding && tab === "rules" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4"
            onClick={() => setShowOnboarding(false)}
          >
            <motion.div
              initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              className="w-full max-w-[440px] rounded-3xl bg-card p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl">👋</div>
              <h2 className="mt-2 text-2xl font-extrabold">Welcome!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick a gender — <b style={{ color: "var(--der)" }}>der</b>,{" "}
                <b style={{ color: "var(--die)" }}>die</b>, or{" "}
                <b style={{ color: "var(--das)" }}>das</b> — to start learning.
                Then try the practice games to lock it in.
              </p>
              <button
                onClick={() => setShowOnboarding(false)}
                className="mt-5 w-full rounded-full bg-primary py-3 font-bold text-primary-foreground shadow-md"
              >
                Let's go
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
