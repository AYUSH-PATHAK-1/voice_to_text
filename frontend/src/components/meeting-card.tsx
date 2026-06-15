"use client";

import Link from "next/link";
import { MeetingListItem } from "@/types/meeting";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingCardProps {
  meeting: MeetingListItem;
}

export default function MeetingCardComponent({ meeting }: MeetingCardProps) {
  return (
    <Link href={`/meetings/${meeting.id}`}>
      <Card className="relative bg-slate-800/50 backdrop-blur-xl border-slate-700/50 overflow-hidden group transition-all duration-300 hover:bg-slate-800/70 hover:scale-[1.01]">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <CardContent className="p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-base truncate group-hover:text-blue-300 transition-colors">
                  {meeting.original_filename}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs font-medium border-0",
                    meeting.sentiment === "Positive" && "text-green-400 bg-green-500/10",
                    meeting.sentiment === "Neutral" && "text-blue-400 bg-blue-500/10",
                    meeting.sentiment === "Negative" && "text-red-400 bg-red-500/10"
                  )}
                >
                  <span className={cn(
                    "w-2 h-2 rounded-full mr-1.5",
                    meeting.sentiment === "Positive" ? "bg-green-400" :
                    meeting.sentiment === "Neutral" ? "bg-blue-400" :
                    meeting.sentiment === "Negative" ? "bg-red-400" : "bg-slate-400"
                  )} />
                  {meeting.sentiment}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300 border-0">
                  {meeting.meeting_type}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(meeting.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="text-slate-500 text-xs font-mono">
                #{meeting.id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}