"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { semanticSearch } from "@/lib/api";
import {
  Search,
  FileText,
  ExternalLink,
  Radar,
  Target,
  Sparkles,
  Terminal,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/auth-guard";
import { cn } from "@/lib/utils";

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

// --- Helper Component for Relevance Badge ---
function RelevanceBadge({ distance }: { distance: number }) {
  const relevance = (1 - distance) * 100;

  let colorClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";
  let iconColor = "text-slate-400";

  if (relevance >= 80) {
    colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    iconColor = "text-emerald-400";
  } else if (relevance >= 60) {
    colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    iconColor = "text-amber-400";
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium backdrop-blur-sm",
        colorClass,
      )}>
      <Target className={cn("w-3.5 h-3.5", iconColor)} />
      {relevance.toFixed(1)}% Match
    </div>
  );
}

// --- Main Page Component ---
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    {
      chunk_id: number;
      meeting_id: number;
      chunk_text: string;
      distance: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const data = await semanticSearch(query);
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <Radar className="w-7 h-7 text-cyan-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                Deep Search
              </h1>
            </div>
            <p className="text-slate-400 mt-2 text-lg font-light ml-14">
              Query your meeting vector database using semantic meaning.
            </p>
          </motion.div>

          {/* Search Interface Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 relative">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none" />

            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-2xl shadow-2xl relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search
                          className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            loading
                              ? "text-cyan-400 animate-pulse"
                              : "text-slate-500 group-focus-within:text-cyan-400",
                          )}
                        />
                      </div>
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'When did we discuss the new API pricing?'"
                        className="w-full h-14 pl-14 bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-base lg:text-lg shadow-inner"
                        disabled={loading}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !query.trim()}
                      className="h-14 px-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 transition-all text-base font-medium min-w-[140px]">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Scanning...</span>
                        </div>
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Area */}
          <div className="min-h-[400px] relative">
            <AnimatePresence mode="wait">
              {/* Loading Skeletons */}
              {loading && (
                <motion.div
                  key="loading"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-4">
                  <div className="h-6 w-48 bg-white/5 rounded-md animate-pulse mb-6" />
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-32 animate-pulse flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="h-5 w-32 bg-white/10 rounded" />
                        <div className="h-6 w-24 bg-white/10 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-white/5 rounded" />
                        <div className="h-4 w-3/4 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Populated Results */}
              {!loading && results.length > 0 && (
                <motion.div
                  key="results"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-5">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2 px-1">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-semibold text-white">
                      Found {results.length} neural matches
                    </h2>
                  </motion.div>

                  {results.map((result) => (
                    <motion.div key={result.chunk_id} variants={itemVariants}>
                      <Card className="group bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                                  <FileText className="w-4 h-4 text-cyan-400" />
                                  <span className="text-sm font-medium text-slate-300">
                                    Meeting Archive #{result.meeting_id}
                                  </span>
                                </div>
                                <RelevanceBadge distance={result.distance} />
                              </div>

                              <div className="relative pl-4 border-l-2 border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
                                <p className="text-slate-300 text-[15px] leading-relaxed line-clamp-4 font-light italic">
                                  "{result.chunk_text}"
                                </p>
                              </div>
                            </div>

                            <Button
                              asChild
                              variant="ghost"
                              className="w-full sm:w-auto mt-2 sm:mt-0 bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 transition-all rounded-xl h-11 px-5">
                              <Link
                                href={`/meetings/${result.meeting_id}`}
                                className="flex items-center justify-center gap-2">
                                View Context
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* No Results State */}
              {!loading && hasSearched && results.length === 0 && (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pt-10">
                  <Card className="bg-transparent border-dashed border-white/20 backdrop-blur-sm">
                    <CardContent className="py-20 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Search className="w-10 h-10 text-slate-500" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        Zero matches found
                      </h3>
                      <p className="text-slate-400 max-w-md mx-auto">
                        The neural network couldn't find any relevant context
                        for "{query}". Try rephrasing your search using
                        different keywords.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Initial Tips State */}
              {!loading && !hasSearched && (
                <motion.div
                  key="tips"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <Card className="bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 backdrop-blur-md">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/20">
                          <Terminal className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-white font-medium text-lg">
                          How it works
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          "Searches by meaning, not just exact keywords",
                          "Matches concepts contextually across all data",
                          "Ranks results instantly by cosine similarity",
                        ].map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-400">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-bl from-white/[0.05] to-transparent border-white/10 backdrop-blur-md">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                          <Target className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-white font-medium text-lg">
                          Search Tips
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          "Ask natural questions (e.g., 'What was the Q3 budget?')",
                          "Search for specific decisions or action items",
                          "Try searching for project names or client feedback",
                        ].map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-400">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500/50 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
