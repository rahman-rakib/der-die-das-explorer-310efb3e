import { motion } from "framer-motion";

/**
 * Landing page: a full-width logo and a crisp description. Navigation is the
 * normal bottom nav bar (shown by the route), so the sections appear here exactly
 * as they do inside the app — no separate landing cards.
 */
export function HomeView() {
  return (
    <div className="flex flex-1 flex-col items-center pt-8 pb-6">
      <motion.img
        src="/der_die_das_logo.png"
        alt="Der Die Das"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full object-contain"
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 max-w-[420px] px-6 text-center"
      >
        <p className="text-base font-bold leading-snug">
          Master the one thing every German learner dreads — der, die, das.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Spot the patterns, lock them in with vivid picture stories, then drill
          them — so gender feels like something you can reason about, not just memorise.
        </p>
      </motion.div>
    </div>
  );
}
