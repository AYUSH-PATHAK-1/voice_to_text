"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAnalyticsOverview,
  getMeetingTypes,
  getActionItems,
  getTopics,
  getRecentMeetings,
} from "@/lib/api";
import {
  AnalyticsOverview,
  MeetingTypesData,
  ActionItemsStats,
  TopicCount,
  RecentMeeting,
} from "@/types/analytics";
import {
  PieChart,
  ListChecks,
  TrendingUp,
  Clock,
  FileText,
  Loader2,
  Activity,
  ChevronRight,
  Target,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/auth-guard";

function SentimentChart({ overview }: { overview: AnalyticsOverview | null }) {
  if (!overview) return null;

  const total = overview.total_meetings || 1;
  const positivePct = (overview.positive_meetings / total) * 100;
  const neutralPct = (overview.neutral_meetings / total) * 100;
  const negativePct = (overview.negative_meetings / total) * 100;

  return (
    <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-rose-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white font-semibold">
          <Activity className="w-5 h-5 text-indigo-400" />
          Sentiment Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex h-4 rounded-full overflow-hidden bg-white/5 border border-white/10 shadow-inner">
            {positivePct > 0 && (
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out"
                style={{ width: `${positivePct}%` }}
                title={`Positive: ${Math.round(positivePct)}%`}
              />
            )}
            {neutralPct > 0 && (
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out border-l border-black/20"
                style={{ width: `${neutralPct}%` }}
                title={`Neutral: ${Math.round(neutralPct)}%`}
              />
            )}
            {negativePct > 0 && (
              <div
                className="bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-1000 ease-out border-l border-black/20"
                style={{ width: `${negativePct}%` }}
                title={`Negative: ${Math.round(negativePct)}%`}
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <p className="text-3xl font-bold text-emerald-400 mb-1">
                {overview.positive_meetings}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                Positive
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <p className="text-3xl font-bold text-blue-400 mb-1">
                {overview.neutral_meetings}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                Neutral
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <p className="text-3xl font-bold text-rose-400 mb-1">
                {overview.negative_meetings}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                Negative
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MeetingTypesChart({ data }: { data: MeetingTypesData | null }) {
  if (!data) return null;
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);

  return (
    <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white font-semibold">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Meeting Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {entries.map(([type, count], index) => {
            const maxCount = entries[0]?.[1] || 1;
            const widthPct = (count / maxCount) * 100;

            return (
              <div
                key={type}
                className="space-y-2 group animate-in slide-in-from-right-4 fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                    {type}
                  </span>
                  <span className="text-slate-400 bg-white/5 px-2 py-0.5 rounded-md text-xs">
                    {count}
                  </span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionItemsCard({ data }: { data: ActionItemsStats | null }) {
  if (!data) return null;

  return (
    <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white font-semibold relative z-10">
          <ListChecks className="w-5 h-5 text-emerald-400" />
          Action Item Extraction
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 flex flex-col justify-center">
            <Target className="w-5 h-5 text-indigo-400 mb-3 opacity-50" />
            <p className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
              {data.total_action_items}
            </p>
            <p className="text-sm text-slate-400 font-medium">Total Actions</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 flex flex-col justify-center">
            <PieChart className="w-5 h-5 text-blue-400 mb-3 opacity-50" />
            <p className="text-4xl lg:text-5xl font-extrabold text-blue-400 mb-2">
              {data.meetings_with_action_items}
            </p>
            <p className="text-sm text-slate-400 font-medium">
              Meetings w/ Actions
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TopicsCard({ data }: { data: TopicCount | null }) {
  if (!data) return null;
  const entries = Object.entries(data).slice(0, 30);

  return (
    <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white font-semibold">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-wrap gap-2.5 max-h-[220px] overflow-y-auto pr-2 pb-1
            [&::-webkit-scrollbar]:w-1.5 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-white/10 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          {entries.map(([topic, count]) => (
            <div
              key={topic}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-default">
              <span className="text-sm font-medium text-slate-300 group-hover:text-indigo-300 transition-colors">
                {topic}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                {count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentMeetingsCard({ data }: { data: RecentMeeting[] | null }) {
  if (!data) return null;

  return (
    <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white font-semibold">
          <Clock className="w-5 h-5 text-sky-400" />
          Recent Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 5).map((meeting, idx) => (
            <Link
              key={meeting.meeting_id}
              href={`/meetings/${meeting.meeting_id}`}
              className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors shrink-0" />
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                    {meeting.filename}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-slate-400 bg-black/20">
                    {meeting.meeting_type}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border bg-black/20 ${
                      meeting.sentiment === "Positive"
                        ? "text-emerald-400 border-emerald-500/20"
                        : meeting.sentiment === "Negative"
                          ? "text-rose-400 border-rose-500/20"
                          : "text-blue-400 border-blue-500/20"
                    }`}>
                    {meeting.sentiment}
                  </span>
                </div>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors text-slate-500">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [meetingTypes, setMeetingTypes] = useState<MeetingTypesData | null>(
    null,
  );
  const [actionItems, setActionItems] = useState<ActionItemsStats | null>(null);
  const [topics, setTopics] = useState<TopicCount | null>(null);
  const [recentMeetings, setRecentMeetings] = useState<RecentMeeting[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [
          overviewData,
          meetingTypesData,
          actionItemsData,
          topicsData,
          recentMeetingsData,
        ] = await Promise.all([
          getAnalyticsOverview(),
          getMeetingTypes(),
          getActionItems(),
          getTopics(),
          getRecentMeetings(),
        ]);

        setOverview(overviewData);
        setMeetingTypes(meetingTypesData);
        setActionItems(actionItemsData);
        setTopics(topicsData);
        setRecentMeetings(recentMeetingsData);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full" />
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400 relative z-10" />
            </div>
            <p className="text-slate-400 font-medium animate-pulse">
              Aggregating Intelligence...
            </p>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 pt-4 pb-20">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              Real-time Metrics
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
              Data Analytics
            </h1>
            <p className="text-slate-400 mt-3 text-lg">
              Macro-level intelligence and statistical patterns across your
              entire meeting database.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-700">
            <div className="space-y-6">
              <SentimentChart overview={overview} />
              <ActionItemsCard data={actionItems} />
              <TopicsCard data={topics} />
            </div>
            <div className="space-y-6">
              <MeetingTypesChart data={meetingTypes} />
              <RecentMeetingsCard data={recentMeetings} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
