import { motion } from "framer-motion";
import type { TabId } from "./BottomNav";

/**
 * Landing page: a large logo and big tappable cards into each section. Shown as
 * the initial view (tab "home"); the header and bottom nav are hidden here so
 * the logo gets a clean, uncluttered stage. Each card switches to its tab.
 */
const SECTIONS: { id: TabId; label: string; icon: string; desc: string; accent: string }[] = [
  { id: "rules", label: "Rules", icon: "📖", desc: "Themes, compounds & endings — when each article applies", accent: "var(--der)" },
  { id: "scenes", label: "Memory Scenes", icon: "🎨", desc: "Picture stories that lock in genders", accent: "var(--die)" },
  { id: "special", label: "Special Cases", icon: "🎭", desc: "Tricky words and exceptions", accent: "var(--das)" },
  { id: "practice", label: "Practice", icon: "🎯", desc: "Quick games to test yourself", accent: "var(--der)" },
  { id: "progress", label: "Progress", icon: "📊", desc: "See what you've mastered", accent: "var(--die)" },
];

export function HomeView({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 pb-12 pt-10">
      <motion.img
        src="/der_die_das_logo.png"
        alt="Der Die Das"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="w-60 max-w-[72%] rounded-3xl object-contain drop-shadow-xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-5 max-w-[420px] text-center"
      >
        <p className="text-base font-bold leading-snug">
          Master the one thing every German learner dreads —{" "}
          <span style={{ color: "var(--der)" }}>der</span>,{" "}
          <span style={{ color: "var(--die)" }}>die</span>,{" "}
          <span style={{ color: "var(--das)" }}>das</span>.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Spot the patterns, lock them in with vivid picture stories, then drill
          them — so gender feels like something you can reason about, not just memorise.
        </p>
      </motion.div>

      <nav className="mt-8 grid w-full max-w-[420px] gap-3">
        {SECTIONS.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="flex items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm transition active:scale-[0.98]"
            style={{ borderLeftWidth: 4, borderLeftColor: s.accent }}
          >
            <span className="text-3xl">{s.icon}</span>
            <span className="flex-1">
              <span className="block font-extrabold">{s.label}</span>
              <span className="block text-xs text-muted-foreground">{s.desc}</span>
            </span>
            <span aria-hidden className="text-lg text-muted-foreground">→</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
}
