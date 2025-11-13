"use client";

import { motion } from "framer-motion";

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-gradient-aurora-soft px-4 py-1.5 text-xs text-white/70 shadow-accent-glow backdrop-blur-md"
  >
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="block h-1.5 w-1.5 rounded-full bg-white"
          animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
    <span className="tracking-[0.35em] text-[0.6rem] uppercase text-white/60">Synapse typing</span>
  </motion.div>
);

export default TypingIndicator;
