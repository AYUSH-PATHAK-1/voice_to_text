"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, TrendingUp, Clock, FileText, ListChecks, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  getAnalyticsOverview,
  getMeetingTypes,
  getActionItems,
  getTopics,
  getRecentMeetings,
} from "@/lib/api";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<{
    total_meetings: number;
    positive_meetings: number;
    neutral_meetings: number;
    negative_meetings: number;
  } | null>(null);
  const [meetingTypes, setMeetingTypes] = useState<{ [key: string]: number } | null>(null);
  const [actionItems, setActionItems] = useState<{
    total_action_items: number;
    meetings_with_action_items: number;
  } | null>(null);
  const [topics, setTopics] = useState<{ [key: string]: number } | null>(null);
  const [recentMeetings, setRecentMeetings] = useState<
    { meeting_id: number; filename: string; meeting_type: string; sentiment: string }[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
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
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Insights and statistics from your meetings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {overview && (
              <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-400" />
                      Sentiment Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex h-3 rounded-full overflow-hidden bg-slate-700">
                        {overview.positive_meetings > 0 && (
                          <div
                            className="bg-green-500 transition-all"
                            style={{ width: `${(overview.positive_meetings / overview.total_meetings) * 100}%` }}
                          />
                        )}
                        {overview.neutral_meetings > 0 && (
                          <div
                            className="bg-blue-500 transition-all"
                            style={{ width: `${(overview.neutral_meetings / overview.total_meetings) * 100}%` }}
                          />
                        )}
                        {overview.negative_meetings > 0 && (
                          <div
                            className="bg-red-500 transition-all"
                            style={{ width: `${(overview.negative_meetings / overview.total_meetings) * 100}%` }}
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-400">{overview.positive_meetings}</p>
                          <p className="text-xs text-slate-400 mt-1">Positive</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-400">{overview.neutral_meetings}</p>
                          <p className="text-xs text-slate-400 mt-1">Neutral</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-400">{overview.negative_meetings}</p>
                          <p className="text-xs text-slate-400 mt-1">Negative</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {meetingTypes && (
              <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      Meeting Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(meetingTypes)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, count]) => {
                          const maxCount = Math.max(...Object.values(meetingTypes));
                          return (
                            <div key={type} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-300 truncate">{type}</span>
                                <span className="text-slate-400 ml-2">{count}</span>
                              </div>
                              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                                  style={{ width: `${(count / maxCount) * 100}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {topics && (
              <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      Top Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(topics)
                        .slice(0, 10)
                        .map(([topic, count]) => (
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
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            {actionItems && (
              <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-cyan-400" />
                      Action Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{actionItems.total_action_items}</p>
                      <p className="text-sm text-slate-400">Total Action Items</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{actionItems.meetings_with_action_items}</p>
                      <p className="text-sm text-slate-400">Meetings with Action Items</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {recentMeetings && (
              <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      Recent Meetings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentMeetings.slice(0, 5).map((meeting) => (
                        <Link
                          key={meeting.meeting_id}
                          href={`/meetings/${meeting.meeting_id}`}
                          className="block p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          <p className="text-sm text-white truncate">{meeting.filename}</p>
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
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}