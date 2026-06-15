/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("firebase_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function uploadAudio(file: File): Promise<{
  message: string;
  job_id: string;
  meeting_id: number;
  status: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Upload failed" }));
    throw new Error(error.detail || "Upload failed");
  }
  return response.json();
}

export async function getMeetings(params?: {
  page?: number;
  limit?: number;
  sentiment?: string;
  meeting_type?: string;
  search?: string;
}): Promise<{ total: number; page: number; limit: number; data: any[] }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.sentiment) queryParams.set("sentiment", params.sentiment);
  if (params?.meeting_type)
    queryParams.set("meeting_type", params.meeting_type);
  if (params?.search) queryParams.set("search", params.search);

  const url = `${API_BASE_URL}/meetings${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch meetings");
  return response.json();
}

export async function getMeeting(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/meetings/${id}`);
  if (!response.ok) throw new Error("Failed to fetch meeting");
  return response.json();
}

export async function getJobStatus(jobId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
  if (!response.ok) throw new Error("Failed to fetch job status");
  return response.json();
}

export async function getJobStatuses(jobIds: string[]): Promise<any[]> {
  return Promise.all(jobIds.map(getJobStatus));
}

export async function getAnalyticsOverview(): Promise<{
  total_meetings: number;
  positive_meetings: number;
  neutral_meetings: number;
  negative_meetings: number;
}> {
  const response = await fetch(`${API_BASE_URL}/analytics/overview`);
  if (!response.ok) throw new Error("Failed to fetch analytics overview");
  return response.json();
}

export async function getMeetingTypes(): Promise<{ [key: string]: number }> {
  const response = await fetch(`${API_BASE_URL}/analytics/meeting-types`);
  if (!response.ok) throw new Error("Failed to fetch meeting types");
  return response.json();
}

export async function getActionItems(): Promise<{
  total_action_items: number;
  meetings_with_action_items: number;
}> {
  const response = await fetch(`${API_BASE_URL}/analytics/action-items`);
  if (!response.ok) throw new Error("Failed to fetch action items");
  return response.json();
}

export async function getTopics(): Promise<{ [key: string]: number }> {
  const response = await fetch(`${API_BASE_URL}/analytics/topics`);
  if (!response.ok) throw new Error("Failed to fetch topics");
  return response.json();
}

export async function getRecentMeetings(): Promise<
  {
    meeting_id: number;
    filename: string;
    meeting_type: string;
    sentiment: string;
  }[]
> {
  const response = await fetch(`${API_BASE_URL}/analytics/recent-meetings`);
  if (!response.ok) throw new Error("Failed to fetch recent meetings");
  return response.json();
}

export async function chatGlobal(question: string): Promise<{
  answer: string;
  sources: { meeting_id: number; chunk_id: number }[];
}> {
  const response = await fetch(`${API_BASE_URL}/chat/global`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new Error("Failed to chat");
  return response.json();
}

export async function chatWithMeeting(
  meetingId: number,
  question: string,
): Promise<{
  answer: string;
  sources: { meeting_id: number; chunk_id: number }[];
}> {
  const response = await fetch(`${API_BASE_URL}/chat/meeting/${meetingId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new Error("Failed to chat with meeting");
  return response.json();
}

export async function semanticSearch(query: string): Promise<
  {
    chunk_id: number;
    meeting_id: number;
    chunk_text: string;
    distance: number;
  }[]
> {
  const response = await fetch(`${API_BASE_URL}/search/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error("Failed to search");
  return response.json();
}

export async function generateInsight(question: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/insights/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new Error("Failed to generate insight");
  return response.json();
}
