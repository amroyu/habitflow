"use client"

import { format, isValid, isSameDay } from "date-fns";
import { Activity, CheckCircle2, Circle, StickyNote, Target, File, Link, Image, Calendar, Layout } from "lucide-react";
import { Goal, Habit, Note } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SnakeTimelineProps {
  activities: Array<{
    type: "goal" | "habit" | "note" | "milestone" | "files" | "links" | "gallery" | "calendar" | "kanban";
    title?: string;
    goalTitle?: string;
    content?: string;
    value?: string | number;
    time: Date | null;
    category?: string;
    completed?: boolean;
    items?: any[];
  }>;
  groupBy: "date" | "title" | "type";
}

export function SnakeTimeline({ activities, groupBy }: SnakeTimelineProps) {
  const getIcon = (type: string, completed?: boolean) => {
    switch (type) {
      case "goal":
        return <Target className="h-4 w-4" />;
      case "habit":
        return completed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" />
        );
      case "note":
        return <StickyNote className="h-4 w-4" />;
      case "milestone":
        return <Activity className="h-4 w-4" />;
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
        return null;
    }
  };

  const formatDate = (date: Date | null) => {
    return date && isValid(date) ? format(date, "h:mm a") : "No time";
  };

  // Group activities based on the selected grouping option
  const groupedActivities = activities.reduce((groups, activity) => {
    let groupKey;
    
    switch (groupBy) {
      case "title":
        groupKey = activity.title || activity.goalTitle || "Untitled";
        break;
      case "type":
        groupKey = activity.type.charAt(0).toUpperCase() + activity.type.slice(1);
        break;
      case "date":
      default:
        if (!activity.time || !isValid(activity.time)) {
          groupKey = "No Date";
        } else {
          groupKey = format(activity.time, "yyyy-MM-dd");
        }
        break;
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(activity);
    return groups;
  }, {} as Record<string, typeof activities>);

  const renderGroupHeader = (groupKey: string, groupActivities: typeof activities) => {
    switch (groupBy) {
      case "title":
        return (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold">{groupKey}</span>
            <Badge variant="secondary">{groupActivities[0].type}</Badge>
            <Badge variant="outline">
              {groupActivities.length} {groupActivities.length === 1 ? 'activity' : 'activities'}
            </Badge>
          </div>
        );
      case "type":
        return (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold">{groupKey}s</span>
            <Badge variant="outline">
              {groupActivities.length} {groupActivities.length === 1 ? 'activity' : 'activities'}
            </Badge>
          </div>
        );
      case "date":
      default:
        return (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold">
              {groupKey === "No Date" ? groupKey : format(new Date(groupKey), "MMMM d, yyyy")}
            </span>
            <Badge variant="outline">
              {groupActivities.length} {groupActivities.length === 1 ? 'activity' : 'activities'}
            </Badge>
          </div>
        );
    }
  };

  return (
    <ScrollArea className="h-full pr-6">
      <div className="space-y-8">
        {Object.entries(groupedActivities).map(([groupKey, groupActivities]) => (
          <Card key={groupKey} className="relative overflow-visible">
            <CardContent className="p-6">
              {renderGroupHeader(groupKey, groupActivities)}
              <div className="space-y-4">
                {groupActivities.map((activity, index) => (
                  <div
                    key={`${activity.title}-${activity.time?.getTime()}-${index}`}
                    className={cn(
                      "relative pl-6 pb-4",
                      index !== groupActivities.length - 1 && "border-l border-border"
                    )}
                  >
                    <div className="absolute left-0 top-0 -translate-x-1/2 p-1 bg-background">
                      {getIcon(activity.type, activity.completed)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.title || activity.goalTitle}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(activity.time)}
                        </span>
                      </div>
                      {activity.content && (
                        <p className="text-sm text-muted-foreground">{activity.content}</p>
                      )}
                      {activity.value !== undefined && (
                        <p className="text-sm">Progress: {activity.value}%</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
