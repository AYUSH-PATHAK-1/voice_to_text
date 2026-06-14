export type TranscriptionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface Transcription {
  id: string;
  filename: string;
  content?: string;
  status: TranscriptionStatus;
  duration: number; // in seconds
  createdAt: string;
  error?: string;
}

export interface WorkerStatus {
  active_tasks: number;
  worker_name: string;
}
