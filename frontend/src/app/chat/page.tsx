"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatGlobal, semanticSearch } from "@/lib/api";
import { Loader2, Send, Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AuthGuard from "@/components/auth-guard";

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
      setAnswer("Sorry, I couldn't get a response. Please try again.");
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-white">Global Chat</h1>
            <p className="text-slate-400 mt-2">
              Ask questions about all meetings
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Ask a Question
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., What were the main topics discussed across meetings?"
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
                          Send Question
                        </>
                      )}
                    </Button>
                  </form>

                  {answer && (
                    <div className="mt-6 p-4 rounded-lg bg-slate-900 border border-slate-700">
                      <p className="text-sm text-slate-400 mb-2">Answer:</p>
                      <p className="text-white whitespace-pre-wrap leading-relaxed">
                        {answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowSearch(!showSearch)}>
                    <Search className="w-5 h-5" />
                    Semantic Search
                    <span className="text-xs text-slate-400 ml-auto">
                      {showSearch ? "Hide" : "Show"}
                    </span>
                  </CardTitle>
                </CardHeader>
                {showSearch && (
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search across all meetings..."
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                      />
                      <Button type="submit" disabled={!searchQuery.trim()}>
                        Search
                      </Button>
                    </form>

                    {searchResults.length > 0 && (
                      <div className="space-y-3">
                        {searchResults.map((result, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-slate-900 border border-slate-700">
                            <p className="text-xs text-slate-400 mb-1">
                              Meeting ID: {result.meeting_id}
                            </p>
                            <p className="text-slate-300 text-sm line-clamp-3">
                              {result.chunk_text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              {sources.length > 0 && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sources.map((source, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg bg-slate-900 border border-slate-700">
                          <p className="text-xs text-slate-400 mb-1">
                            Meeting #{source.meeting_id}
                          </p>
                          <Link
                            href={`/meetings/${source.meeting_id}`}
                            className="text-sm text-blue-400 hover:underline">
                            View Meeting
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!answer && !loading && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <p className="text-sm text-slate-400 mb-4">
                      Try asking questions like:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-500">
                      <li>• What were the key themes across all meetings?</li>
                      <li>• Which meetings had the most action items?</li>
                      <li>• Summarize the customer feedback discussions.</li>
                      <li>• What decisions were made in recent meetings?</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
