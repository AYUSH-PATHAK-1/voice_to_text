"use client";

import { useEffect, useState } from "react";
import AnalyticsCards from "@/components/analytics-cards";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AuthGuard from "@/components/auth-guard";

function MP3PlaybackIndicator() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
      <div
        className={cn(
          "relative flex items-center gap-0.5 sm:gap-1 transition-all duration-300",
          isPlaying ? "scale-110" : "scale-100",
        )}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 sm:w-2 rounded-full bg-gradient-to-t from-blue-400 to-cyan-300 transition-all",
              isPlaying ? "h-6 sm:h-8 animate-bounce" : "h-3 sm:h-4",
            )}
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-ping" />
    </div>
  );
}

function FeatureBanner({
  title,
  description,
  icon,
  gradient,
}: {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}) {
  return (
    <Card
      className={cn(
        "bg-slate-800/50 backdrop-blur-xl border-slate-700/50 overflow-hidden",
        "hover:scale-[1.02] transition-transform duration-300 active:scale-[0.98]",
      )}>
      <div
        className={cn(
          "absolute top-0 left-0 w-1 h-full bg-gradient-to-b",
          gradient,
        )}
      />
      <CardHeader>
        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl mt-0.5 sm:mt-0">{icon}</span>
          <CardTitle className="text-lg sm:text-xl text-white leading-tight">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="mb-6 sm:mb-8 px-1 sm:px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1.5 sm:mt-2 text-base sm:text-lg">
            AI Meeting Intelligence Overview
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <AnalyticsCards />

          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-white">
                Smarter Insights, Faster Decisions 😎
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8 sm:py-12">
              <MP3PlaybackIndicator />
            </CardContent>
          </Card>
        </div>

        <div className="mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1.5 sm:mb-2">
            AI Capabilities
          </h2>
          <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Powered by advanced machine learning models
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <FeatureBanner
            icon="🎯"
            title="Sentiment Analysis"
            description="Real-time detection of meeting sentiment with 98% accuracy. Understand emotional tone and participant engagement levels instantly."
            gradient="from-green-400 to-emerald-500"
          />
          <FeatureBanner
            icon="🔊"
            title="Audio Transcription"
            description="High-fidelity speech-to-text conversion supporting 25+ languages. Get precise transcripts with speaker identification."
            gradient="from-blue-400 to-cyan-500"
          />
          <FeatureBanner
            icon="⚡"
            title="Instant Insights"
            description="AI-generated action items, key decisions, and meeting summaries delivered within seconds of upload completion."
            gradient="from-purple-400 to-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <FeatureBanner
            icon="🔍"
            title="Semantic Search"
            description="Find any conversation moment using natural language queries. Search across all your meetings with contextual understanding."
            gradient="from-orange-400 to-amber-500"
          />
          <FeatureBanner
            icon="🤖"
            title="Smart Assistant"
            description="Interactive AI chat for asking questions about meeting content. Get answers, summaries, and insights on-demand."
            gradient="from-pink-400 to-rose-500"
          />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
