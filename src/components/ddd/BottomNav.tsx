import { motion } from "framer-motion";

export type TabId = "rules" | "scenes" | "mnemonics" | "special" | "practice" | "progress";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "rules",     label: "Rules",     icon: "📖" },
  { id: "scenes",    label: "Scenes",    icon: "🎨" },
  { id: "mnemonics", label: "Stories",   icon: "✨" },
  { id: "special",   label: "Special",   icon: "🎭" },
  { id: "practice",  label: "Practice",  icon: "🎯" },
  { id: "progress",  label: "Progress",  icon: "📊" },
];

export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="sticky bottom-0 z-30 border-t bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-[480px] grid-cols-6">
        {TABS.map(t => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold"
              style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              {isActive && (
                <motion.span
                  layoutId="navDot"
                  className="absolute -top-px h-1 w-8 rounded-b-full bg-primary"
                />
              )}
              <span className={`text-2xl transition-transform ${isActive ? "scale-110" : ""}`}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
