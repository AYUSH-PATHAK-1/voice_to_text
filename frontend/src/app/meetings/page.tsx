/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard-layout";
import MeetingCardComponent from "@/components/meeting-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getMeetings } from "@/lib/api";
import { MeetingListItem } from "@/types/meeting";
import AuthGuard from "@/components/auth-guard";

const sentiments = ["all", "Positive", "Neutral", "Negative"];
const meetingTypes = [
  "all",
  "Sales Call",
  "Customer Support",
  "Team Meeting",
  "Product Discussion",
  "Interview",
  "Training Session",
  "General Discussion",
];

// Premium Animated Select Component
function NativeSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-[180px] appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 shadow-sm outline-none backdrop-blur-md transition-all duration-300 hover:bg-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
        <option value="all" disabled className="bg-slate-900 text-white">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className="bg-slate-900 text-white py-2">
            {opt === "all" ? `All ${placeholder}s` : opt}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y[-2px]">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-400">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
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

function MeetingsContent() {
  const searchParams = useSearchParams();
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState<string>("all");
  const [meetingType, setMeetingType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const limit = 10;

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (sentiment !== "all") params.sentiment = sentiment;
      if (meetingType !== "all") params.meeting_type = meetingType;
      if (searchQuery) params.search = searchQuery;

      const result = await getMeetings(params);
      setMeetings(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sentiment, meetingType, searchQuery]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMeetings();
  };

  const clearFilters = () => {
    setSentiment("all");
    setMeetingType("all");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-12 relative z-10">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6">
              <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  Meeting Intelligence
                </h1>
                <p className="text-slate-400 mt-2 text-lg font-light">
                  Search, filter, and analyze your processed conversations.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search & Filter Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8">
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden relative">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

              <CardContent className="p-6 relative z-10">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col lg:flex-row gap-5">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search meetings by keyword or filename..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all text-base"
                    />
                  </div>

                  <div className="flex gap-4 flex-wrap items-center">
                    <NativeSelect
                      value={sentiment}
                      onChange={setSentiment}
                      options={sentiments}
                      placeholder="Sentiment"
                    />

                    <NativeSelect
                      value={meetingType}
                      onChange={setMeetingType}
                      options={meetingTypes}
                      placeholder="Meeting Type"
                    />

                    <AnimatePresence>
                      {(sentiment !== "all" ||
                        meetingType !== "all" ||
                        searchQuery) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, width: 0 }}
                          animate={{ opacity: 1, scale: 1, width: "auto" }}
                          exit={{ opacity: 0, scale: 0.9, width: 0 }}>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={clearFilters}
                            className="h-11 px-4 text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all whitespace-nowrap gap-2">
                            <FilterX className="w-4 h-4" />
                            Clear
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Area */}
          <div className="min-h-[400px]">
            {loading ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="h-28 rounded-2xl bg-gradient-to-r from-white/[0.02] to-white/[0.05] border border-white/5 animate-pulse"
                  />
                ))}
              </motion.div>
            ) : meetings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-12">
                <Card className="bg-transparent border-dashed border-white/20 backdrop-blur-sm">
                  <CardContent className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center">
                      <Search className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      No meetings found
                    </h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-8">
                      We couldn&rsquo;t find any recordings matching your
                      current filters. Try adjusting your search parameters or
                      upload a new session.
                    </p>
                    <Button
                      asChild
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 h-12 text-base font-medium transition-all shadow-lg shadow-indigo-500/25">
                      <Link href="/upload">Upload Audio File</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-5">
                {meetings.map((meeting) => (
                  <motion.div key={meeting.id} variants={itemVariants}>
                    <div className="group transition-transform duration-300 hover:-translate-y-1">
                      <MeetingCardComponent meeting={meeting} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Pagination */}
          <AnimatePresence>
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-white/10">
                <p className="text-sm font-medium text-slate-400">
                  Showing{" "}
                  <span className="text-white">{(page - 1) * limit + 1}</span>{" "}
                  to{" "}
                  <span className="text-white">
                    {Math.min(page * limit, total)}
                  </span>{" "}
                  of <span className="text-white">{total}</span> meetings
                </p>
                <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all h-9 w-9">
                    <ChevronLeft className="w-5 h-5 text-slate-300" />
                  </Button>

                  <div className="px-4 py-1 flex items-center justify-center min-w-[100px]">
                    <span className="text-sm font-medium text-slate-300">
                      Page <span className="text-white">{page}</span> of{" "}
                      {totalPages}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all h-9 w-9">
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

export default function MeetingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      }>
      <MeetingsContent />
    </Suspense>
  );
}
