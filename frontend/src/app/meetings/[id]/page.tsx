"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getMeeting, chatWithMeeting, getJobStatus } from "@/lib/api";
import { MeetingDetail, JobStatus } from "@/types/meeting";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  Send,
  FileText,
  Mic,
  Calendar,
  FileClock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Badge className={styles[status] || ""} variant="outline">
      {status}
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
  const [answer, setAnswer] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);

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
    setAnswer(null);
    setChatHistory((prev) => [...prev, { role: "user", content: question }]);

    try {
      const result = await chatWithMeeting(meetingId, question);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: result.answer },
      ]);
      setAnswer(result.answer);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't get a response. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
      setQuestion("");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !meeting) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-red-400">{error || "Meeting not found"}</p>
          <Button asChild>
            <Link href="/meetings">Back to Meetings</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const analysis = meeting.analysis;
  const sentimentColor: Record<string, string> = {
    Positive: "text-green-400",
    Neutral: "text-blue-400",
    Negative: "text-red-400",
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <Link
            href="/meetings"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Meetings
          </Link>
          <h1 className="text-5xl font-bold text-white break-words">
            {meeting.original_filename}
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-slate-400 text-sm">
              {new Date(meeting.created_at).toLocaleString()}
            </p>
            {analysis && (
              <>
                <Badge className={sentimentColor[analysis.sentiment] || ""}>
                  {analysis.sentiment}
                </Badge>
                <Badge variant="outline">{analysis.meeting_type}</Badge>
              </>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {analysis && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Summary
                  </h3>
                  <p className="text-slate-300">{analysis.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {analysis.key_points.map((point, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-slate-300"
                      >
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Action Items
                  </h3>
                  <ul className="space-y-2">
                    {analysis.action_items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-slate-300"
                      >
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-green-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              {meeting.transcript ? (
                <div className="bg-slate-900 rounded-lg p-6 max-h-[600px] overflow-y-auto">
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {meeting.transcript}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400">No transcript available</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat About This Meeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chatHistory.length > 0 && (
                <div className="space-y-4 max-h-[500px] overflow-y-auto rounded-lg bg-slate-900 p-4">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 rounded-2xl px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleChat} className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
                  placeholder="Ask a question about this meeting..."
                  className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={chatLoading}
                />
                <Button
                  type="submit"
                  disabled={chatLoading || !question.trim()}
                >
                  {chatLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
