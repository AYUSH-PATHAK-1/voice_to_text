"use client";

import { motion } from "framer-motion";

interface AudioWaveProps {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
}

export default function AudioWave({ isPlaying = false, barCount = 40, className }: AudioWaveProps) {
  const heights = isPlaying 
    ? Array.from({ length: barCount }, () => 
        0.2 + Math.random() * 0.6 + Math.sin(Math.random() * Math.PI) * 0.3
      )
    : Array(barCount).fill(0);

  const barVariants = {
    idle: { height: "4px", backgroundColor: "rgba(99, 102, 241, 0.3)" },
    active: (height: number) => ({
      height: `${height * 100}%`,
      backgroundColor: "rgba(139, 92, 246, 0.8)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <motion.div
      className={`flex items-center justify-center gap-1 h-20 ${className || ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {heights.map((height, index) => (
        <motion.div
          key={index}
          className="w-2 rounded-full bg-gradient-to-t from-purple-500 to-cyan-500"
          variants={barVariants}
          animate={isPlaying ? "active" : "idle"}
          custom={height}
          style={{
            minHeight: "4px",
            maxHeight: "100%",
          }}
        />
      ))}
    </motion.div>
  );
}