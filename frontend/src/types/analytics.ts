export interface AnalyticsOverview {
  total_meetings: number;
  positive_meetings: number;
  neutral_meetings: number;
  negative_meetings: number;
}

export interface MeetingTypesData {
  [key: string]: number;
}

export interface ActionItemsStats {
  total_action_items: number;
  meetings_with_action_items: number;
}

export interface TopicCount {
  [key: string]: number;
}

export interface RecentMeeting {
  meeting_id: number;
  filename: string;
  meeting_type: string;
  sentiment: string;
}

export interface ProcessingStats {
  avg_processing_time_seconds: number;
  total_processing_jobs: number;
}