"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard-layout";
import AudioWave from "@/components/audio-wave";
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
  Brain,
  Zap,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobResponse, setJobResponse] = useState<ProcessingJobResponse | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Upload failed");
      setIsUploading(false);
    }
  }, [file, pollJobStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "processing":
        return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold">
            <span className="gradient-text">Audio Transcription</span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Upload an audio recording to transcribe and analyze with AI
          </p>
        </motion.div>

        {error && (
          <motion.div {...fadeInUp} initial="initial" animate="animate">
            <Card className="mb-6 bg-red-950/20 border-red-900/30 backdrop-blur-xl">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400">{error}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!jobResponse ? (
            <motion.div
              key="upload"
              {...fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card overflow-hidden">
                <CardHeader className="border-b border-slate-700/30">
                  <CardTitle className="flex items-center gap-2">
                    <FileAudio className="w-5 h-5 text-purple-400" />
                    Select Audio File
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="relative">
                    <motion.div
                      className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center hover:border-purple-500/50 transition cursor-pointer group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        type="file"
                        accept=".mp3,.wav"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <div className="flex flex-col items-center gap-4">
                        <motion.div
                          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition"
                          whileHover={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Upload className="w-10 h-10 text-purple-400" />
                        </motion.div>
                        
                        <div>
                          <p className="text-white font-medium text-lg">
                            {file ? file.name : "Drop your audio file here"}
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            MP3 or WAV files only
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {file && (
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/30">
                          <FileAudio className="w-8 h-8 text-purple-400" />
                          <div className="flex-1">
                            <p className="text-sm text-slate-400">
                              <span className="font-medium text-slate-300">File:</span> {file.name}
                            </p>
                            <p className="text-sm text-slate-400">
                              <span className="font-medium text-slate-300">Size:</span>{" "}
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <Zap className="w-6 h-6 text-yellow-400 mx-auto" />
                      <p className="text-sm font-medium text-white">Fast Processing</p>
                      <p className="text-xs text-slate-400">Real-time AI analysis</p>
                    </div>
                    <div className="space-y-1">
                      <Brain className="w-6 h-6 text-cyan-400 mx-auto" />
                      <p className="text-sm font-medium text-white">Neural Accuracy</p>
                      <p className="text-xs text-slate-400">98%+ precision</p>
                    </div>
                    <div className="space-y-1">
                      <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
                      <p className="text-sm font-medium text-white">Smart Insights</p>
                      <p className="text-xs text-slate-400">AI-powered summaries</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    size="lg"
                    className="w-full h-14 text-base font-medium bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 hover:from-purple-600 hover:via-cyan-600 hover:to-purple-600 border-0 transition-all duration-300"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload & Process
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="status"
              {...fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 glass-card overflow-hidden">
                <CardHeader className="border-b border-slate-700/30">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400" />
                    Processing Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {jobStatus && (
                    <>
                      <div className="flex items-center gap-4 p-6 rounded-xl border border-slate-700/30 bg-slate-900/30">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                            <Loader2 
                              className={cn(
                                "w-6 h-6",
                                jobStatus.status === "completed" ? "hidden" : "animate-spin text-cyan-400"
                              )} 
                            />
                            {jobStatus.status === "completed" && (
                              <CheckCircle2 className="w-6 h-6 text-green-400" />
                            )}
                            {jobStatus.status === "failed" && (
                              <AlertCircle className="w-6 h-6 text-red-400" />
                            )}
                          </div>
                          {(jobStatus.status === "pending" || jobStatus.status === "processing") && (
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-cyan-400"
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0.8, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <motion.span
                            className={cn(
                              "text-sm font-medium px-3 py-1.5 rounded-full inline-block border",
                              getStatusColor(jobStatus.status)
                            )}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            {jobStatus.status.toUpperCase()}
                          </motion.span>
                          <p className="text-xs text-slate-400 mt-2">Job ID: {jobResponse.job_id}</p>
                          <p className="text-xs text-slate-400">Meeting ID: {jobResponse.meeting_id}</p>
                        </div>
                      </div>

                      {(jobStatus.status === "pending" || jobStatus.status === "processing") && (
                        <div className="space-y-4">
                          <p className="text-sm text-slate-400 text-center">
                            AI is analyzing your audio...
                          </p>
                          <AudioWave isPlaying={true} barCount={40} />
                        </div>
                      )}

                      {jobStatus.status === "completed" && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Processing complete!</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              onClick={() => router.push(`/meetings/${jobResponse.meeting_id}`)}
                              className="h-12 bg-gradient-to-r from-green-500 to-emerald-500 border-0"
                            >
                              View Results
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setJobResponse(null);
                                setJobStatus(null);
                                setFile(null);
                              }}
                              className="h-12"
                            >
                              Process Another
                            </Button>
                          </div>
                        </div>
                      )}

                      {jobStatus.status === "failed" && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-red-400">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-medium">Processing failed</span>
                          </div>
                          
                          {jobStatus.error && (
                            <Card className="bg-red-950/20 border-red-900/30">
                              <CardContent className="py-3">
                                <p className="text-red-400 text-sm">{jobStatus.error}</p>
                              </CardContent>
                            </Card>
                          )}
                          
                          <Button
                            variant="outline"
                            onClick={() => {
                              setJobResponse(null);
                              setJobStatus(null);
                              setFile(null);
                            }}
                            className="w-full h-12"
                          >
                            Try Again
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}