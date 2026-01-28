"use client";

import { motion } from "framer-motion";

interface StatusIndicatorProps {
  isLive: boolean;
}

export function StatusIndicator({ isLive }: StatusIndicatorProps) {
  return (
    <div className="absolute -top-1 -right-1">
      {isLive ? (
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-4 h-4 rounded-full bg-terminal-accent" />
          <motion.div
            className="absolute inset-0 rounded-full bg-terminal-accent"
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      ) : (
        <div className="w-4 h-4 rounded-full bg-terminal-muted" />
      )}
    </div>
  );
}

