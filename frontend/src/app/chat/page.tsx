"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatGlobal, semanticSearch } from "@/lib/api";
import {
  Send,
  Search,
  MessageSquare,
  Sparkles,
  Bot,
  Database,
  ChevronDown,
  Lightbulb,
  ExternalLink,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AuthGuard from "@/components/auth-guard";

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

// --- Custom AI Loading Animation ---
function AILoadingPulse() {
  return (
    <div className="flex items-center gap-2 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl w-fit">
      <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
          />
        ))}
      </div>
      <span className="text-sm text-indigo-300 font-medium ml-2">
        Synthesizing response...
      </span>
    </div>
  );
}

const suggestedQuestions = [
  "What were the key themes across all meetings?",
  "Which meetings had the most action items?",
  "Summarize the customer feedback discussions.",
  "What decisions were made in recent meetings?",
];

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<
    { meeting_id: number; chunk_id: number }[]
  >([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { chunk_id: number; meeting_id: number; chunk_text: string }[]
  >([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);
    setSources([]);

    try {
      const result = await chatGlobal(question);
      setAnswer(result.answer);
      setSources(result.sources || []);
    } catch (error) {
      setAnswer(
        "An anomaly occurred in the neural network. I couldn't fetch a response. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const results = await semanticSearch(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30">
                <Sparkles className="w-7 h-7 text-indigo-400" />
              </div>
              <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                MeetingIQ
              </h1>
            </div>
            <p className="text-slate-400 mt-2 text-lg font-light ml-14">
              Query the collective intelligence of all your meetings.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Chat & Search */}
            <div className="lg:col-span-2 space-y-8">
              {/* Primary Chat Interface */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show">
                <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-white font-semibold">
                      <MessageSquare className="w-5 h-5 text-indigo-400" />
                      Ask the Engine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="relative group">
                      <div
                        className={cn(
                          "rounded-2xl transition-all duration-300 bg-black/20 border",
                          loading
                            ? "border-indigo-500/30"
                            : "border-white/10 group-focus-within:border-indigo-500/50 group-focus-within:ring-4 group-focus-within:ring-indigo-500/10",
                        )}>
                        <Textarea
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="e.g., What were the main topics discussed across all Q3 meetings?"
                          className="bg-transparent border-none text-white placeholder:text-slate-500 min-h-[120px] resize-none focus-visible:ring-0 p-4 text-base font-light"
                          disabled={loading}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmit(e);
                            }
                          }}
                        />
                        <div className="p-3 flex justify-between items-center border-t border-white/5 bg-white/[0.02] rounded-b-2xl">
                          <span className="text-xs text-slate-500 ml-2">
                            Press{" "}
                            <kbd className="font-sans px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300">
                              Enter
                            </kbd>{" "}
                            to send
                          </span>
                          <Button
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                            <Send className="w-4 h-4 mr-2" />
                            Send Query
                          </Button>
                        </div>
                      </div>
                    </form>

                    {/* Output Area */}
                    <AnimatePresence mode="wait">
                      {loading && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}>
                          <AILoadingPulse />
                        </motion.div>
                      )}

                      {answer && !loading && (
                        <motion.div
                          key="answer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-4 border-[#0f111a] shadow-lg">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed font-light text-[15px]">
                            {answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Semantic Search Interface */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show">
                <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
                  <CardHeader
                    className="cursor-pointer hover:bg-white/[0.02] transition-colors rounded-t-xl"
                    onClick={() => setShowSearch(!showSearch)}>
                    <CardTitle className="flex items-center text-white text-lg font-medium">
                      <div className="p-2 rounded-lg bg-emerald-500/20 mr-3">
                        <Database className="w-4 h-4 text-emerald-400" />
                      </div>
                      Knowledge Base Search
                      <motion.div
                        animate={{ rotate: showSearch ? 180 : 0 }}
                        className="ml-auto text-slate-500">
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </CardTitle>
                  </CardHeader>

                  <AnimatePresence>
                    {showSearch && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <CardContent className="pt-0 pb-6 space-y-6">
                          <form
                            onSubmit={handleSearch}
                            className="flex gap-3 relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <Input
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search exactly what was said..."
                              className="pl-11 h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 text-base"
                            />
                            <Button
                              type="submit"
                              disabled={!searchQuery.trim()}
                              className="h-12 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 transition-all">
                              Search
                            </Button>
                          </form>

                          {searchResults.length > 0 && (
                            <div className="space-y-4">
                              {searchResults.map((result, index) => (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  key={index}
                                  className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                                    <p className="text-xs text-slate-400 font-medium">
                                      Meeting Reference #{result.meeting_id}
                                    </p>
                                  </div>
                                  <p className="text-slate-300 text-sm leading-relaxed italic">
                                    "{result.chunk_text}"
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>

            {/* Right Column: Sources & Suggestions */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {/* Suggestions Card (Only shows when no answer is present) */}
                {!answer && !loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}>
                    <Card className="bg-gradient-to-b from-white/[0.05] to-transparent border-white/10 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          Suggested Queries
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2.5">
                          {suggestedQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => setQuestion(q)}
                              className="text-left p-3 rounded-lg bg-black/20 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-sm text-slate-400 hover:text-slate-200">
                              {q}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Sources Card (Shows up dynamically when an answer has sources) */}
                {sources.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}>
                    <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <Database className="w-4 h-4 text-indigo-400" />
                          Cited References
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-3">
                          {sources.map((source, index) => (
                            <Link
                              key={index}
                              href={`/meetings/${source.meeting_id}`}
                              className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all flex items-center justify-between">
                              <div>
                                <p className="text-xs text-slate-400 group-hover:text-indigo-300 transition-colors">
                                  Meeting Archive
                                </p>
                                <p className="text-sm font-medium text-slate-200">
                                  ID: {source.meeting_id}
                                </p>
                              </div>
                              <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-300" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
