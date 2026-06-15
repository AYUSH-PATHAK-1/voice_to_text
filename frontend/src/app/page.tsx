"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import AudioWave from "@/components/audio-wave";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Activity, 
  Zap, 
  FileAudio, 
  Brain,
  Clock,
  TrendingUp
} from "lucide-react";
import { getAnalyticsOverview, getProcessingStats } from "@/lib/analytics";

export default function HomePage() {
  const [analyticsData, setAnalyticsData] = useState<{
    total_meetings: number;
    positive_meetings: number;
    neutral_meetings: number;
    negative_meetings: number;
  } | null>(null);
  const [processingStats, setProcessingStats] = useState<{
    avg_processing_time_seconds: number;
    total_processing_jobs: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [analytics, stats] = await Promise.all([
          getAnalyticsOverview(),
          getProcessingStats()
        ]);
        setAnalyticsData(analytics);
        setProcessingStats(stats);
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <DashboardLayout>
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold">
          <span className="gradient-text">AI Audio Intelligence</span>
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Professional-grade MP3-to-text transcription & analysis</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Total Meetings</p>
                  <motion.p 
                    className="text-3xl font-bold text-white mt-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    {analyticsData ? analyticsData.total_meetings.toLocaleString() : "..."}
                  </motion.p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50 text-purple-400">
                  <FileAudio className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Live</span>
                <span className="text-xs text-slate-500">real-time data</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">AI Accuracy</p>
                  <motion.p 
                    className="text-3xl font-bold text-white mt-1 gradient-text"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    98.4%
                  </motion.p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50 text-cyan-400">
                  <Brain className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">+2.1%</span>
                <span className="text-xs text-slate-500">from last week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Avg Processing</p>
                  <motion.p 
                    className="text-3xl font-bold text-white mt-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    {processingStats ? `${processingStats.avg_processing_time_seconds}s` : "..."}
                  </motion.p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50 text-yellow-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">-8%</span>
                <span className="text-xs text-slate-500">faster than before</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Languages</p>
                  <motion.p 
                    className="text-3xl font-bold text-white mt-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  >
                    50+
                  </motion.p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50 text-green-400">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Available</span>
                <span className="text-xs text-slate-500">multilingual support</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card h-80 relative overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Transcription Analysis</h3>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Live Audio Stream</span>
                </div>
              </div>
              
              <AudioWave isPlaying={true} barCount={60} className="flex-1" />
              
              <div className="mt-6 space-y-3">
                <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full animate-pulse" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold gradient-text">24x</p>
                    <p className="text-xs text-slate-400">Faster than manual</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold gradient-text">99%</p>
                    <p className="text-xs text-slate-400">Accuracy rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold gradient-text">50+</p>
                    <p className="text-xs text-slate-400">Languages</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card h-80 relative overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 animate-pulse" />
              </div>
              <p className="text-center text-slate-300 text-sm mt-4">
                AI Processing Core
                <br />
                <span className="text-slate-500">Neural transcription engine active</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 border-slate-700/50 glass-card">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to transcribe?</h3>
              <p className="text-slate-400">
                Upload your MP3 or WAV file and let AI transform audio into text instantly
              </p>
            </div>
            <Button asChild size="lg" className="mt-4 md:mt-0 bg-gradient-to-r from-purple-500 to-cyan-500 border-0">
              <Link href="/upload">Start Transcription</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}