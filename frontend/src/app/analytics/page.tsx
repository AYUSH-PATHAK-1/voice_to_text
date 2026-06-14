"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  PieChart,
  ListChecks,
  TrendingUp,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function SentimentChart({
  overview,
}: {
  overview: AnalyticsOverview | null;
}) {
  if (!overview) return null;

  const total = overview.total_meetings || 1;
  const positivePct = (overview.positive_meetings / total) * 100;
  const neutralPct = (overview.neutral_meetings / total) * 100;
  const negativePct = (overview.negative_meetings / total) * 100;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Sentiment Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex h-3 rounded-full overflow-hidden bg-slate-700">
            {positivePct > 0 && (
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${positivePct}%` }}
                title="Positive"
              />
            )}
            {neutralPct > 0 && (
              <div
                className="bg-blue-500 transition-all"
                style={{ width: `${neutralPct}%` }}
                title="Neutral"
              />
            )}
            {negativePct > 0 && (
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${negativePct}%` }}
                title="Negative"
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">
                {overview.positive_meetings}
              </p>
              <p className="text-xs text-slate-400 mt-1">Positive</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {overview.neutral_meetings}
              </p>
              <p className="text-xs text-slate-400 mt-1">Neutral</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {overview.negative_meetings}
              </p>
              <p className="text-xs text-slate-400 mt-1">Negative</p>
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
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Meeting Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map(([type, count]) => {
            const maxCount = entries[0]?.[1] || 1;
            const widthPct = (count / maxCount) * 100;

            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 truncate">{type}</span>
                  <span className="text-slate-400 ml-2">{count}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
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
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="w-5 h-5" />
          Action Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-bold text-white">
            {data.total_action_items}
          </p>
          <p className="text-sm text-slate-400">Total Action Items</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-400">
            {data.meetings_with_action_items}
          </p>
          <p className="text-sm text-slate-400">Meetings with Action Items</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TopicsCard({ data }: { data: TopicCount | null }) {
  if (!data) return null;

  const entries = Object.entries(data).slice(0, 10);

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Top Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {entries.map(([topic, count]) => (
            <span
              key={topic}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300"
            >
              {topic} ({count})
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentMeetingsCard({ data }: { data: RecentMeeting[] | null }) {
  if (!data) return null;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Meetings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 5).map((meeting) => (
            <Link
              key={meeting.meeting_id}
              href={`/meetings/${meeting.meeting_id}`}
              className="block p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <p className="text-sm text-white truncate">
                {meeting.filename}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  {meeting.meeting_type}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  {meeting.sentiment}
                </span>
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
  const [meetingTypes, setMeetingTypes] = useState<MeetingTypesData | null>(null);
  const [actionItems, setActionItems] = useState<ActionItemsStats | null>(null);
  const [topics, setTopics] = useState<TopicCount | null>(null);
  const [recentMeetings, setRecentMeetings] = useState<RecentMeeting[] | null>(
    null
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-2">
            Insights and statistics from your meetings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SentimentChart overview={overview} />
            <MeetingTypesChart data={meetingTypes} />
            <TopicsCard data={topics} />
          </div>

          <div className="space-y-6">
            <ActionItemsCard data={actionItems} />
            <RecentMeetingsCard data={recentMeetings} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
