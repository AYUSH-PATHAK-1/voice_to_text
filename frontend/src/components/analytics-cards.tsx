"use client";

import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "@/lib/analytics";
import { AnalyticsOverview } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle>Total Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{data.total_meetings}</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle>Positive</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-400">
            {data.positive_meetings}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle>Neutral</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-400">
            {data.neutral_meetings}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle>Negative</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-red-400">
            {data.negative_meetings}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
