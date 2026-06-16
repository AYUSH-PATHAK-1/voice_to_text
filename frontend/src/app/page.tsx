"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnalyticsCards from "@/components/analytics-cards";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AuthGuard from "@/components/auth-guard";
import {
  Activity,
  Brain,
  Mic,
  Zap,
  Search,
  Bot,
  Waves,
  Sparkles,
} from "lucide-react";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
} as const;

// --- Upgraded Audio Visualizer Component ---
function AIProcessingVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[160px]">
      {/* Background glowing orb */}
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.2, 1] : 1,
          opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.3,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="relative flex items-center gap-1.5 sm:gap-2">
        {[...Array(9)].map((_, i) => {
          // Create a symmetrical wave pattern (taller in the middle)
          const heightMultiplier = 1 - Math.abs(i - 4) * 0.15;

          return (
            <motion.div
              key={i}
              animate={{
                height: isPlaying
                  ? [
                      24 * heightMultiplier,
                      64 * heightMultiplier,
                      24 * heightMultiplier,
                    ]
                  : 16,
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
              className={cn(
                "w-2 sm:w-2.5 rounded-full bg-gradient-to-t shadow-[0_0_10px_rgba(99,102,241,0.5)]",
                i % 2 === 0
                  ? "from-indigo-500 to-purple-400"
                  : "from-blue-400 to-cyan-300",
              )}
            />
          );
        })}
      </div>

      {/* Floating particles */}
      {isPlaying &&
        [...Array(3)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [-20, -60],
              x: Math.sin(i) * 20,
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[1px]"
          />
        ))}
    </div>
  );
}

// --- Upgraded Feature Card Component ---
function AIFeatureCard({
  title,
  description,
  icon: Icon,
  gradient,
  accentColor,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
}) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card
        className={cn(
          "relative h-full bg-white/[0.02] backdrop-blur-xl border-white/10 overflow-hidden group",
          "hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50",
        )}>
        {/* Animated Gradient Border Top */}
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity duration-500",
            gradient,
          )}
        />

        {/* Subtle radial glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div
            className={cn(
              "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px]",
              accentColor,
            )}
          />
        </div>

        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-start sm:items-center gap-3 md:gap-4">
            <div
              className={cn(
                "p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500",
              )}>
              <Icon className="w-6 h-6 text-slate-200" />
            </div>
            <CardTitle className="text-xl font-semibold text-white tracking-wide">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pt-2">
          <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Main Page Component ---
export default function HomePage() {
  const features = [
    {
      icon: Activity,
      title: "Sentiment Analysis",
      description:
        "Real-time detection of meeting sentiment with 98% accuracy. Understand emotional tone and participant engagement levels instantly.",
      gradient: "from-emerald-400 to-teal-500",
      accentColor: "bg-emerald-500/20",
    },
    {
      icon: Mic,
      title: "Audio Transcription",
      description:
        "High-fidelity speech-to-text conversion supporting 25+ languages. Get precise transcripts with speaker identification.",
      gradient: "from-blue-400 to-cyan-500",
      accentColor: "bg-blue-500/20",
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description:
        "AI-generated action items, key decisions, and meeting summaries delivered within seconds of upload completion.",
      gradient: "from-purple-400 to-violet-500",
      accentColor: "bg-purple-500/20",
    },
    {
      icon: Search,
      title: "Semantic Search",
      description:
        "Find any conversation moment using natural language queries. Search across all your meetings with contextual understanding.",
      gradient: "from-orange-400 to-amber-500",
      accentColor: "bg-orange-500/20",
    },
    {
      icon: Bot,
      title: "Smart Assistant",
      description:
        "Interactive AI chat for asking questions about meeting content. Get answers, summaries, and insights on-demand.",
      gradient: "from-pink-400 to-rose-500",
      accentColor: "bg-pink-500/20",
    },
  ];

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <Brain className="w-7 h-7 text-blue-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Command Center
              </h1>
            </div>
            <p className="text-slate-400 mt-2 text-lg font-light ml-14">
              Your AI-powered meeting intelligence overview
            </p>
          </motion.div>

          {/* Top Grid: Analytics & Visualizer */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="xl:col-span-2">
              {/* Assuming AnalyticsCards handles its own dark/glass styling natively or fits the theme */}
              <AnalyticsCards />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full">
              <Card className="h-full bg-white/[0.02] backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-indigo-400" />
                    <CardTitle className="text-xl text-white font-semibold">
                      Neural Processing
                    </CardTitle>
                  </div>
                  <p className="text-sm text-slate-400 font-light mt-1">
                    Real-time acoustic analysis engine active
                  </p>
                </CardHeader>

                <CardContent className="flex-1 flex items-center justify-center relative z-10 py-8">
                  <AIProcessingVisualizer />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* AI Capabilities Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Engine Capabilities
              </h2>
            </div>
            <p className="text-slate-400 text-base font-light">
              Powered by advanced machine learning models
            </p>
          </motion.div>

          {/* Capabilities Bento Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  index > 2 &&
                    features.length % 3 !== 0 &&
                    index === features.length - 1
                    ? "md:col-span-2 lg:col-span-1"
                    : "",
                )}>
                <AIFeatureCard {...feature} />
              </div>
            ))}
          </motion.div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
