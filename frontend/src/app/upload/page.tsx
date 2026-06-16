/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadAudio, getJobStatus } from "@/lib/api";
import { ProcessingJobResponse, JobStatus } from "@/types/meeting";
import { cn } from "@/lib/utils";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FileAudio,
  Sparkles,
  AudioLines,
  Wand2,
  ArrowRight,
  Music,
} from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/auth-guard";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobResponse, setJobResponse] = useState<ProcessingJobResponse | null>(
    null,
  );
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) {
        const ext = selected.name
          .toLowerCase()
          .slice(selected.name.lastIndexOf("."));
        if (![".mp3", ".wav"].includes(ext)) {
          setError("Only .mp3 and .wav files are allowed");
          setFile(null);
          return;
        }
        setError(null);
        setFile(selected);
      }
    },
    [],
  );

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError(null);
    setJobResponse(null);
    setJobStatus(null);

    try {
      const result = await uploadAudio(file);
      setJobResponse(result);
      pollJobStatus(result.job_id);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setIsUploading(false);
    }
  }, [file]);

  const pollJobStatus = useCallback(async (jobId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const interval = setInterval(async () => {
      try {
        const status = await getJobStatus(jobId);
        setJobStatus(status);

        if (status.status === "completed" || status.status === "failed") {
          clearInterval(interval);
          setIsUploading(false);
        }
      } catch (err) {
        console.error("Failed to poll job status:", err);
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 2000);
  }, []);

  const getStatusVisuals = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "text-amber-400",
          border: "border-amber-500/30",
          bg: "bg-amber-500/10",
          glow: "shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]",
          icon: <Loader2 className="w-8 h-8 animate-spin text-amber-400" />,
          text: "Initializing AI Engine...",
        };
      case "processing":
        return {
          color: "text-indigo-400",
          border: "border-indigo-500/30",
          bg: "bg-indigo-500/10",
          glow: "shadow-[0_0_40px_-5px_rgba(99,102,241,0.4)]",
          icon: (
            <AudioLines className="w-8 h-8 animate-pulse text-indigo-400" />
          ),
          text: "Analyzing Neural Audio Patterns...",
        };
      case "completed":
        return {
          color: "text-emerald-400",
          border: "border-emerald-500/30",
          bg: "bg-emerald-500/10",
          glow: "shadow-[0_0_40px_-5px_rgba(16,185,129,0.3)]",
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
          text: "Intelligence Extraction Complete",
        };
      case "failed":
        return {
          color: "text-rose-400",
          border: "border-rose-500/30",
          bg: "bg-rose-500/10",
          glow: "shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]",
          icon: <AlertCircle className="w-8 h-8 text-rose-400" />,
          text: "Analysis Failed",
        };
      default:
        return {
          color: "text-slate-400",
          border: "border-slate-500/30",
          bg: "bg-slate-500/10",
          glow: "",
          icon: <Loader2 className="w-8 h-8 animate-spin text-slate-400" />,
          text: "Processing...",
        };
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Background Ambient Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Widened to max-w-4xl to match the Meetings page layout */}
        <div className="max-w-4xl mx-auto relative z-10 pt-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Styled exactly like your screenshot: Circular icon box, clean text */}
          <div className="mb-8 flex justify-start">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Dashboard
            </Link>
          </div>

          {/* Left-aligned Header matching the Meetings page structure */}
          <div className="mb-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-4 mb-3">
              {/* Square Glowing Icon Box */}
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]">
                <Wand2 className="w-7 h-7 text-indigo-400" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3" />
                  AI Pipeline
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-300 tracking-tight">
                  Audio Intelligence Hub
                </h1>
              </div>
            </div>

            <p className="text-slate-400 text-lg max-w-2xl pl-[4.5rem]">
              Upload your raw meeting audio and let our AI extract sentiments,
              action items, and structural insights.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
              <Card className="bg-rose-500/10 border-rose-500/20 backdrop-blur-md">
                <CardContent className="py-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <p className="text-rose-200 font-medium">{error}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upload State */}
          {!jobResponse && (
            // ... The rest of your code (Card, File Upload, etc.) stays exactly the same!
            <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden group">
              {/* Subtle hover gradient sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

              <CardContent className="p-8">
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ease-out",
                    file
                      ? "border-indigo-500/50 bg-indigo-500/5"
                      : "border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.02]",
                  )}>
                  <input
                    type="file"
                    accept=".mp3,.wav"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />

                  <div className="flex flex-col items-center gap-4 relative z-0">
                    {!file ? (
                      <>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <Upload className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">
                            Drag & drop your audio
                          </p>
                          <p className="text-sm text-slate-400">
                            or click anywhere to browse your files
                          </p>
                        </div>
                        <div className="flex gap-3 mt-2">
                          <span className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-slate-400 font-medium border border-white/5">
                            .MP3
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-slate-400 font-medium border border-white/5">
                            .WAV
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full max-w-sm animate-in zoom-in-95 duration-300">
                        <div className="bg-[#0A0A0B] border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-lg">
                          <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <FileAudio className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-semibold text-white truncate mb-1">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div className="shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 italic">
                          Click anywhere in the box to change file
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={cn(
                      "w-full h-14 text-base font-semibold transition-all duration-500",
                      file && !isUploading
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] border-0"
                        : "bg-white/5 text-slate-400 border border-white/10",
                    )}>
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-indigo-400" />
                        Initializing AI Pipeline...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Analyze Recording
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing / Result State */}
          {jobResponse && jobStatus && (
            <Card className="bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
              <CardContent className="p-10">
                {/* Visual Status Indicator */}
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div
                    className={cn(
                      "w-24 h-24 rounded-full flex items-center justify-center mb-6 border-2 transition-all duration-700",
                      getStatusVisuals(jobStatus.status).bg,
                      getStatusVisuals(jobStatus.status).border,
                      getStatusVisuals(jobStatus.status).glow,
                    )}>
                    {getStatusVisuals(jobStatus.status).icon}
                  </div>

                  <h3
                    className={cn(
                      "text-2xl font-bold mb-2",
                      getStatusVisuals(jobStatus.status).color,
                    )}>
                    {getStatusVisuals(jobStatus.status).text}
                  </h3>

                  <div className="flex items-center gap-3 text-sm text-slate-400 mt-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono">
                      ID: {jobResponse.job_id.substring(0, 8)}
                    </span>
                    {(jobStatus.status === "pending" ||
                      jobStatus.status === "processing") && (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Awaiting server
                      </span>
                    )}
                  </div>
                </div>

                {/* Simulated Waveform while processing */}
                {(jobStatus.status === "pending" ||
                  jobStatus.status === "processing") && (
                  <div className="flex items-center justify-center gap-1 h-12 mb-8 opacity-70">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-indigo-500 rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(20, Math.random() * 100)}%`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: "0.8s",
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Error Box */}
                {jobStatus.error && (
                  <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-200 text-sm mb-8 text-center">
                    {jobStatus.error}
                  </div>
                )}

                {/* Action Buttons based on state */}
                <div className="pt-6 border-t border-white/10">
                  {jobStatus.status === "completed" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setJobResponse(null);
                          setJobStatus(null);
                          setFile(null);
                        }}
                        className="h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white">
                        Upload Another
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/meetings/${jobResponse.meeting_id}`)
                        }
                        className="h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] border-0">
                        View Insights
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ) : jobStatus.status === "failed" ? (
                    <Button
                      onClick={() => {
                        setJobResponse(null);
                        setJobStatus(null);
                        setFile(null);
                      }}
                      className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                      Reset & Try Again
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                      <Music className="w-4 h-4" />
                      Feel free to grab a coffee, this page will update
                      automatically.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
