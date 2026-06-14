const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, "").replace(/:\d+/, "") ||
  "localhost:8000";

export function connectWebSocket(jobId: string): WebSocket | null {
  const wsUrl = `ws://${apiBase}/ws/${jobId}`;

  try {
    return new WebSocket(wsUrl);
  } catch (error) {
    console.error("Failed to create WebSocket:", error);
    return null;
  }
}
