"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { semanticSearch } from "@/lib/api";
import { Search, FileText, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { chunk_id: number; meeting_id: number; chunk_text: string; distance: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
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
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white">Search</h1>
          <p className="text-slate-400 mt-2">
            Search across all meeting transcripts using semantic search
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Semantic Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your search query..."
                    className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    disabled={loading}
                  />
                </div>
                <Button type="submit" disabled={loading || !query.trim()}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Found {results.length} results
            </h2>
            {results.map((result) => (
              <Card
                key={result.chunk_id}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-slate-400">
                            Meeting #{result.meeting_id}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          Relevance: {(1 - result.distance).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed line-clamp-4">
                        {result.chunk_text}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/meetings/${result.meeting_id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400">No results found for "{query}"</p>
              <p className="text-sm text-slate-500 mt-1">
                Try a different search query
              </p>
            </CardContent>
          </Card>
        )}

        {!query && !loading && results.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400 mb-4">
                Search tips:
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>• Use natural language queries for best results</li>
                <li>• Try searching for topics, decisions, or action items</li>
                <li>• The search uses AI to understand the meaning of your query</li>
                <li>• Results are ranked by relevance</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
