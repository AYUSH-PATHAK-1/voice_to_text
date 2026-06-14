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
  const sentimentColor: Record<string, string> = {
    Positive: "text-green-400",
    Neutral: "text-blue-400",
    Negative: "text-red-400",
  };

  const sentimentBg: Record<string, string> = {
    Positive: "bg-green-400/10 border-green-400/20",
    Neutral: "bg-blue-400/10 border-blue-400/20",
    Negative: "bg-red-400/10 border-red-400/20",
  };

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                <h3 className="text-white font-medium truncate">
                  {meeting.original_filename}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(meeting.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  sentimentBg[meeting.sentiment] || ""
                )}
              >
                <span className={cn(
                  "inline-block w-2 h-2 rounded-full mr-1.5",
                  sentimentColor[meeting.sentiment] || "bg-slate-400"
                ).replace("text-", "bg-")} />
                {meeting.sentiment}
              </Badge>
              
              <Badge variant="secondary" className="text-xs">
                {meeting.meeting_type}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
