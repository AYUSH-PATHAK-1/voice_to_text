/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import MeetingCardComponent from "@/components/meeting-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getMeetings } from "@/lib/api";
import { MeetingListItem } from "@/types/meeting";

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
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-[180px] appearance-none rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all" disabled className="bg-slate-800 text-white">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-800 text-white">
            {opt === "all" ? `All ${placeholder}s` : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
    </div>
  );
}

export default function MeetingsPage() {
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
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold text-white">Meetings</h1>
          <p className="text-slate-400 mt-2">
            Browse and search through all processed meetings
          </p>
        </div>

        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search meetings by filename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
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

                  {(sentiment !== "all" ||
                    meetingType !== "all" ||
                    searchQuery) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearFilters}
                      className="whitespace-nowrap">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400">No meetings found</p>
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your filters or upload a new audio file
              </p>
              <Button asChild className="mt-4">
                <Link href="/upload">Upload Audio</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
<div className="space-y-5">
             {meetings.map((meeting) => (
               <MeetingCardComponent key={meeting.id} meeting={meeting} />
             ))}
           </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-400">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} meetings
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 py-2 text-sm text-slate-300">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
