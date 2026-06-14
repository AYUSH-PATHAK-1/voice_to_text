export interface AnalysisResponse {
  summary: string;
  sentiment: string;
  meeting_type: string;
  key_points: string[];
  action_items: string[];
}

export interface MeetingDetail {
  id: number;
  original_filename: string;
  saved_filename: string;
  created_at: string;
  transcript: string | null;
  analysis: AnalysisResponse | null;
}

export interface MeetingListItem {
  id: number;
  original_filename: string;
  sentiment: string;
  meeting_type: string;
  created_at: string;
}

export interface MeetingListResponse {
  total: number;
  page: number;
  limit: number;
  data: MeetingListItem[];
}

export interface ProcessingJobResponse {
  message: string;
  job_id: string;
  meeting_id: number;
  status: string;
}

export interface JobStatus {
  job_id: string;
  meeting_id: number;
  status: string;
  error: string | null;
}

export interface SearchResultItem {
  chunk_id: number;
  meeting_id: number;
  chunk_text: string;
  distance: number;
}

export interface ChatResponse {
  answer: string;
  sources: {
    meeting_id: number;
    chunk_id: number;
  }[];
}

export interface ChatHistoryItem {
  id: string;
  meeting_id: number | null;
  role: string;
  message: string;
  created_at: string;
}

export interface InsightResult {
  main_insight: string;
  top_topics: string[];
  recommendations: string[];
  confidence_score: number;
  overall_sentiment: string;
  meeting_count: number;
  sources: SearchResultItem[];
}

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
