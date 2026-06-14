"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadAudio, getJobStatus } from "@/lib/api";
import { ProcessingJobResponse, JobStatus } from "@/types/meeting";
import { cn } from "@/lib/utils";
import { Upload, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobResponse, setJobResponse] = useState<ProcessingJobResponse | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const ext = selected.name.toLowerCase().slice(selected.name.lastIndexOf("."));
      if (![".mp3", ".wav"].includes(ext)) {
        setError("Only .mp3 and .wav files are allowed");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selected);
    }
  }, []);

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

  const pollJobStatus = useCallback(
    async (jobId: string) => {
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
    },
    []
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "processing":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold text-white">Upload Audio</h1>
          <p className="text-slate-400 mt-2">
            Upload an audio recording to transcribe and analyze
          </p>
        </div>

        {error && (
          <Card className="mb-6 bg-red-950/50 border-red-900/50">
            <CardContent className="py-4">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {!jobResponse && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Select Audio File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-slate-500 transition">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {file ? file.name : "Click to select or drag and drop"}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      MP3 or WAV files only
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".mp3,.wav"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {file && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">
                    <span className="font-medium text-slate-300">
                      Selected file:
                    </span>{" "}
                    {file.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="font-medium text-slate-300">
                      Size:
                    </span>{" "}
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Process
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {jobResponse && jobStatus && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Processing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-700">
                {getStatusIcon(jobStatus.status)}
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium px-2 py-1 rounded-full inline-block border",
                      getStatusColor(jobStatus.status)
                    )}
                  >
                    {jobStatus.status.toUpperCase()}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Job ID: {jobResponse.job_id}
                  </p>
                  <p className="text-sm text-slate-400">
                    Meeting ID: {jobResponse.meeting_id}
                  </p>
                </div>
              </div>

              {jobStatus.error && (
                <Card className="bg-red-950/50 border-red-900/50">
                  <CardContent className="py-4">
                    <p className="text-red-400 text-sm">{jobStatus.error}</p>
                  </CardContent>
                </Card>
              )}

              {jobStatus.status === "completed" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Processing complete!</span>
                  </div>

                  <Button
                    onClick={() => router.push(`/meetings/${jobResponse.meeting_id}`)}
                    className="w-full"
                  >
                    View Meeting Details
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setJobResponse(null);
                      setJobStatus(null);
                      setFile(null);
                    }}
                    className="w-full"
                  >
                    Upload Another File
                  </Button>
                </div>
              )}

              {jobStatus.status === "failed" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setJobResponse(null);
                    setJobStatus(null);
                    setFile(null);
                  }}
                  className="w-full"
                >
                  Try Again
                </Button>
              )}

              {(jobStatus.status === "pending" || jobStatus.status === "processing") && (
                <p className="text-sm text-slate-400 text-center">
                  This may take a few moments. Do not close this page.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
