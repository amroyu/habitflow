"use client"

import { format, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle2, Target, StickyNote, Activity, File, Link, Image, Calendar, Layout } from "lucide-react";

interface TimelineDayProps {
  activities: Array<{
    type: "goal" | "habit" | "note" | "milestone" | "files" | "links" | "gallery" | "calendar" | "kanban";
    title?: string;
    goalTitle?: string;
    content?: string;
    value?: string | number;
    notes?: string;
    time: Date;
    completed?: boolean;
    category?: string;
    items?: any[];
  }>;
}

export function TimelineDay({ activities }: TimelineDayProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Target className="h-4 w-4" />;
      case "habit":
        return <Activity className="h-4 w-4" />;
      case "milestone":
        return <CheckCircle2 className="h-4 w-4" />;
      case "note":
        return <StickyNote className="h-4 w-4" />;
      case "files":
        return <File className="h-4 w-4" />;
      case "links":
        return <Link className="h-4 w-4" />;
      case "gallery":
        return <Image className="h-4 w-4" />;
      case "calendar":
        return <Calendar className="h-4 w-4" />;
      case "kanban":
        return <Layout className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getActivityContent = (activity: TimelineDayProps["activities"][0]) => {
    switch (activity.type) {
      case "goal":
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium">{activity.title}</span>
              {activity.category && (
                <Badge variant="outline" className="text-xs">
                  {activity.category}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Progress: {activity.value}</p>
              {activity.notes && <p>{activity.notes}</p>}
            </div>
          </>
        );
      case "habit":
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium">{activity.title}</span>
              <Badge variant={activity.completed ? "default" : "destructive"}>
                {activity.completed ? "Completed" : "Missed"}
              </Badge>
            </div>
            {activity.notes && (
              <p className="text-sm text-muted-foreground">{activity.notes}</p>
            )}
          </>
        );
      case "milestone":
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                Completed milestone for {activity.goalTitle}
              </span>
              {activity.category && (
                <Badge variant="outline" className="text-xs">
                  {activity.category}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{activity.title}</p>
          </>
        );
      case "note":
        return (
          <div className="space-y-1">
            <div className="font-medium">Added a note</div>
            <p className="text-sm text-muted-foreground">{activity.content}</p>
          </div>
        );
      case "files":
        return (
          <div className="space-y-1">
            <div className="font-medium">Updated files</div>
            <p className="text-sm text-muted-foreground">
              {activity.items?.length} file(s) {activity.content}
            </p>
          </div>
        );
      case "links":
        return (
          <div className="space-y-1">
            <div className="font-medium">Updated links</div>
            <p className="text-sm text-muted-foreground">
              {activity.items?.length} link(s) {activity.content}
            </p>
          </div>
        );
      case "gallery":
        return (
          <div className="space-y-1">
            <div className="font-medium">Updated gallery</div>
            <p className="text-sm text-muted-foreground">
              {activity.items?.length} image(s) {activity.content}
            </p>
          </div>
        );
      case "calendar":
        return (
          <div className="space-y-1">
            <div className="font-medium">Calendar event</div>
            <p className="text-sm text-muted-foreground">{activity.content}</p>
          </div>
        );
      case "kanban":
        return (
          <div className="space-y-1">
            <div className="font-medium">Updated kanban board</div>
            <p className="text-sm text-muted-foreground">
              {activity.content}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No activities recorded for this day
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border p-4 bg-card"
        >
          <div className="mt-1 text-muted-foreground">
            {getIcon(activity.type)}
          </div>
          <div className="flex-1 space-y-1">
            {getActivityContent(activity)}
            {activity.time && isValid(activity.time) && (
              <div className="text-xs text-muted-foreground">
                {format(activity.time, "h:mm a")}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
