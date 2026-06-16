/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateInsight } from "@/lib/api";
import {
  Loader2,
  Send,
  Sparkles,
  BrainCircuit,
  Target,
  BarChart3,
  CheckCircle2,
  FileText,
  Activity,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";

// Quick suggestion prompts for the empty state
const SUGGESTIONS = [
  { icon: BarChart3, text: "What are the key trends across all meetings?" },
  { icon: Activity, text: "How has customer sentiment changed over time?" },
  { icon: Target, text: "What are the most recurring action items?" },
  { icon: BrainCircuit, text: "Which meeting types are most productive?" },
];

export default function InsightsPage() {
  const [question, setQuestion] = useState("");
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setInsight(null);

    try {
      const result = await generateInsight(question);
      setInsight(result);
    } catch (error) {
      console.error("Failed to generate insight:", error);
      setInsight({
        main_insight: "Failed to generate insight. Please try again.",
        top_topics: [],
        recommendations: [],
        confidence_score: 0,
        overall_sentiment: "Unknown",
        meeting_count: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setQuestion(text);
    // Optional: You can auto-submit here by calling handleSubmit()
    // after a brief timeout to allow state to update.
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 pt-8 pb-20">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
              Intelligence Engine
            </h1>
            <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
              Query your meeting data using natural language to uncover hidden
              patterns, sentiments, and actionable metrics.
            </p>
          </div>

          {/* Search / Prompt Section */}
          <div className="mb-12 relative group">
            {/* Animated Glow Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />

            <div className="relative bg-[#0A0A0B] border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about your meetings..."
                  className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-slate-500 min-h-[120px] resize-none text-lg p-4 shadow-none"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex justify-between items-center px-2 pb-2 pt-4 border-t border-white/5">
                  <div className="flex items-center text-xs text-slate-500 px-2">
                    Press{" "}
                    <kbd className="mx-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md">
                      Enter
                    </kbd>{" "}
                    to submit
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="bg-white text-black hover:bg-slate-200 rounded-xl px-6 font-medium transition-all">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-600" />
                        Analyzing Data...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Generate Insight
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Empty State / Suggestions */}
          {!insight && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {SUGGESTIONS.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="flex items-start gap-4 p-5 text-left rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 transition-all group">
                    <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                        {suggestion.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Results Section */}
          {insight && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              {/* Main Insight Card */}
              <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Key Insight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8">
                    {insight.main_insight}
                  </p>

                  {/* Metrics Row */}
                  <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-slate-300">
                        Confidence:{" "}
                        <strong className="text-white">
                          {insight.confidence_score}%
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-300">
                        Sentiment:{" "}
                        <strong className="text-white capitalize">
                          {insight.overall_sentiment}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-slate-300">
                        Sources:{" "}
                        <strong className="text-white">
                          {insight.meeting_count} meetings
                        </strong>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Topics & Recommendations */}
                <div className="md:col-span-2 space-y-6">
                  {insight.recommendations &&
                    insight.recommendations.length > 0 && (
                      <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Strategic Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            {insight.recommendations.map(
                              (rec: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3 text-slate-300 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                  <span className="leading-relaxed text-sm">
                                    {rec}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                  {insight.top_topics && insight.top_topics.length > 0 && (
                    <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5 text-purple-500" />
                          Detected Topics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {insight.top_topics.map(
                            (topic: string, index: number) => (
                              <Badge
                                key={index}
                                className="bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border-indigo-500/20 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors">
                                {topic}
                              </Badge>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column: Sources */}
                {insight.sources && insight.sources.length > 0 && (
                  <div className="md:col-span-1">
                    <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 h-full">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-slate-400" />
                          Source Citations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {insight.sources
                            .slice(0, 5)
                            .map((source: any, index: number) => (
                              <div
                                key={index}
                                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] uppercase tracking-wider border-white/10 text-slate-400">
                                    ID:{" "}
                                    {String(source.meeting_id).substring(0, 8)}
                                  </Badge>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 italic">
                                  &quot;{source.chunk_text}&quot;
                                </p>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
