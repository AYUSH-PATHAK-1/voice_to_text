import { AnalyticsOverview } from "@/types/analytics";
import { getAnalyticsOverview as fetchAnalyticsOverview } from "./api";

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  return fetchAnalyticsOverview();
}
