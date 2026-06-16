"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getMeeting, chatWithMeeting } from "@/lib/api";
import { MeetingDetail } from "@/types/meeting";
import {
  ArrowLeft,
  Loader2,
  Send,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  Bot,
  User,
  Activity,
} from "lucide-react";

// Helper for premium badge styling
function PremiumBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: string;
}) {
  const styles: Record<string, string> = {
    default: "bg-white/5 text-slate-300 border-white/10",
    Positive:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    Neutral:
      "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    Negative:
      "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
  };

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 font-medium backdrop-blur-sm ${styles[variant] || styles.default}`}>
      {children}
    </Badge>
  );
}

export default function MeetingDetailPage() {
  const params = useParams();
  const meetingId = Number(params.id);

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatLoading]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMeeting(meetingId);
        setMeeting(data);
      } catch (err: any) {
        setError(err.message || "Failed to load meeting");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [meetingId]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setChatLoading(true);
    setChatHistory((prev) => [...prev, { role: "user", content: question }]);
    const currentQ = question;
    setQuestion("");

    try {
      const result = await chatWithMeeting(meetingId, currentQ);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: result.answer },
      ]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try asking again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 animate-pulse" />
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 relative z-10" />
          </div>
          <p className="text-slate-400 font-medium animate-pulse">
            Analyzing meeting contents...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !meeting) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
          <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20">
            <AlertCircle className="w-10 h-10 text-rose-400" />
          </div>
          <p className="text-rose-400 font-medium text-lg">
            {error || "Meeting not found"}
          </p>
          <Button
            asChild
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
            <Link href="/meetings">Return to Meetings</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const analysis = meeting.analysis;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header Section */}
        <div className="mb-12">
          <Link
            href="/meetings"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6">
            <div className="p-1.5 rounded-md bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 break-words mb-6">
            {meeting.original_filename}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium">
              <Calendar className="w-4 h-4" />
              {new Date(meeting.created_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
            {analysis && (
              <>
                <PremiumBadge variant={analysis.sentiment}>
                  {analysis.sentiment} Vibe
                </PremiumBadge>
                <PremiumBadge>{analysis.meeting_type}</PremiumBadge>
              </>
            )}
          </div>
        </div>

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Analysis & Transcript */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {analysis && (
              <Card className="bg-white/[0.02] border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold text-white">
                    <Activity className="w-6 h-6 text-blue-400" />
                    AI Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-10">
                  {/* Summary */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Executive Summary
                    </h3>
                    <p className="text-slate-200 leading-relaxed text-lg font-light">
                      {analysis.summary}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Key Points */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">
                        <Sparkles className="w-4 h-4" />
                        Key Takeaways
                      </h3>
                      <ul className="space-y-4">
                        {analysis.key_points.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-slate-300">
                            <div className="mt-1.5 p-1 rounded-full bg-indigo-500/20 text-indigo-400 shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            </div>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Items */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                        <Target className="w-4 h-4" />
                        Action Items
                      </h3>
                      <ul className="space-y-4">
                        {analysis.action_items.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-medium">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transcript Card */}
            <Card className="bg-white/[0.02] border-white/10 shadow-xl backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-white">
                  <FileText className="w-5 h-5 text-slate-400" />
                  Full Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meeting.transcript ? (
                  <div className="bg-[#0f111a]/50 rounded-2xl p-6 max-h-[500px] overflow-y-auto border border-white/5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <p className="text-slate-400 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                      {meeting.transcript}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <FileText className="w-12 h-12 mb-3 opacity-20" />
                    <p>No transcript available for this meeting</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AI Chat Interface (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
            <div className="flex flex-col h-[700px] bg-gradient-to-b from-slate-900 to-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Chat Header */}
              <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Meeting Co-Pilot
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ask anything about this call
                    </p>
                  </div>
                </div>
                <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                    <Bot className="w-12 h-12 text-slate-400" />
                    <p className="text-sm text-slate-400 max-w-[200px]">
                      Ask about specific decisions, requested metrics, or who
                      said what.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white/10 text-slate-300"
                        }`}>
                        {msg.role === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-900/20"
                            : "bg-white/5 text-slate-200 rounded-tl-none border border-white/10"
                        }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}

                {chatLoading && (
                  <div className="flex gap-3 flex-row">
                    <div className="w-8 h-8 rounded-full bg-white/10 text-slate-300 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-black/20 border-t border-white/5">
                <form
                  onSubmit={handleChat}
                  className="relative flex items-center">
                  <Input
                    value={question}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuestion(e.target.value)
                    }
                    placeholder="Ask a question..."
                    className="w-full bg-white/5 border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white placeholder:text-slate-500 rounded-xl pl-4 pr-12 py-6 transition-all"
                    disabled={chatLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg h-9 w-9 transition-all disabled:opacity-50"
                    disabled={chatLoading || !question.trim()}>
                    {chatLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 ml-0.5" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
