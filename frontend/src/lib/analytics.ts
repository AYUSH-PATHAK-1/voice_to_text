import { AnalyticsOverview, ProcessingStats } from "@/types/analytics";
import { getAnalyticsOverview as fetchAnalyticsOverview, getMeetings } from "./api";

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  return fetchAnalyticsOverview();
}

export async function getProcessingStats(): Promise<ProcessingStats> {
  const result = await getMeetings({ limit: 100 });
  const meetings = result.data;
  
  if (!meetings || meetings.length === 0) {
    return { avg_processing_time_seconds: 45, total_processing_jobs: 0 };
  }
  
  const totalSeconds = meetings.reduce((acc: number, m: { duration_seconds?: number }) => {
    return acc + (m.duration_seconds || 45);
  }, 0);
  
  return {
    avg_processing_time_seconds: Math.round(totalSeconds / meetings.length),
    total_processing_jobs: result.total
  };
}