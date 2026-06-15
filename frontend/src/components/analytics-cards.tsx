"use client";

import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "@/lib/analytics";
import { AnalyticsOverview } from "@/types/analytics";
import { Card, CardContent } from "@/components/ui/card";

interface StatCard {
  title: string;
  value: number;
  icon: string;
  gradient: string;
  textColor?: string;
}

export default function AnalyticsCards() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getAnalyticsOverview();
        setData(result);
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  if (!data) {
    return <p className="text-slate-400">Loading...</p>;
  }

  const stats: StatCard[] = [
    {
      title: "Total Meetings",
      value: data.total_meetings,
      icon: "📊",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Positive",
      value: data.positive_meetings,
      icon: "👍",
      gradient: "from-green-500 to-emerald-500",
      textColor: "text-green-400",
    },
    {
      title: "Neutral",
      value: data.neutral_meetings,
      icon: "➖",
      gradient: "from-blue-500 to-sky-500",
      textColor: "text-blue-400",
    },
    {
      title: "Negative",
      value: data.negative_meetings,
      icon: "👎",
      gradient: "from-red-500 to-rose-500",
      textColor: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 overflow-hidden group transition-all duration-300 hover:bg-slate-800/80">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
          />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
<CardContent className="p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.gradient} animate-pulse`} />
            </div>
            <p className="text-xs text-slate-400 font-medium mb-1">{stat.title}</p>
            <p className={`text-3xl font-bold ${stat.textColor || "text-white"}`}>
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
