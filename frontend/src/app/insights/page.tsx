/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateInsight } from "@/lib/api";
import { Loader2, Send, Lightbulb } from "lucide-react";
import AuthGuard from "@/components/auth-guard";

export default function InsightsPage() {
  const [question, setQuestion] = useState("");
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-white">Insights</h1>
            <p className="text-slate-400 mt-2">
              Get AI-powered insights across all meetings
            </p>
          </div>

          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Generate Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What are the most common customer pain points discussed?"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Generate Insight
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {insight && (
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Main Insight</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {insight.main_insight}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant="outline" className="text-xs">
                      Confidence: {insight.confidence_score}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Sentiment: {insight.overall_sentiment}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Meetings Analyzed: {insight.meeting_count}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {insight.top_topics && insight.top_topics.length > 0 && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Top Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {insight.top_topics.map(
                        (topic: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {topic}
                          </Badge>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {insight.recommendations &&
                insight.recommendations.length > 0 && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {insight.recommendations.map(
                          (rec: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-slate-300">
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-green-400 shrink-0" />
                              {rec}
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}

              {insight.sources && insight.sources.length > 0 && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insight.sources
                        .slice(0, 5)
                        .map((source: any, index: number) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-slate-900 border border-slate-700">
                            <p className="text-xs text-slate-400 mb-1">
                              Meeting ID: {source.meeting_id}
                            </p>
                            <p className="text-slate-300 text-sm line-clamp-2">
                              {source.chunk_text}
                            </p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!insight && !loading && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-400 mb-4">
                  Try asking insights like:
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li>• What are the key trends across all meetings?</li>
                  <li>• How has customer sentiment changed over time?</li>
                  <li>• What are the most recurring action items?</li>
                  <li>• Which meeting types are most productive?</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
