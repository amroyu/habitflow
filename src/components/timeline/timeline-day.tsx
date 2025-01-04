"use client"

import { format, isValid } from "date-fns";
import { Badge } from "../ui/badge";
import { Circle, CheckCircle2, Target, StickyNote, Activity, File, Link, Image, Calendar, Layout, Clock, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Progress } from "../ui/progress";
import cn from "classnames";

interface TimelineDayProps {
  activities: Array<{
    type: "goal" | "habit" | "note" | "milestone" | "files" | "links" | "gallery" | "calendar" | "kanban" | "task";
    title?: string;
    goalTitle?: string;
    content?: string;
    value?: string | number;
    notes?: string;
    time: Date;
    completed?: boolean;
    category?: string;
    items?: any[];
    duration?: number;
    fileType?: string;
    filePath?: string;
    tags?: string[];
    url?: string;
    thumbnailUrl?: string;
  }>;
}

export function TimelineDay({ activities }: TimelineDayProps) {
  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'focus':
        return 'bg-purple-500/10 text-purple-500 border-purple-200';
      case 'work':
        return 'bg-blue-500/10 text-blue-500 border-blue-200';
      case 'learning':
        return 'bg-green-500/10 text-green-500 border-green-200';
      case 'wellness':
        return 'bg-rose-500/10 text-rose-500 border-rose-200';
      case 'personal':
        return 'bg-orange-500/10 text-orange-500 border-orange-200';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "habit":
        return <Activity className="h-4 w-4 text-green-500" />;
      case "milestone":
        return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      case "note":
        return <StickyNote className="h-4 w-4 text-yellow-500" />;
      case "files":
        return <File className="h-4 w-4 text-gray-500" />;
      case "links":
        return <Link className="h-4 w-4 text-blue-400" />;
      case "gallery":
        return <Image className="h-4 w-4 text-pink-500" />;
      case "calendar":
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      case "task":
        return <Clock className="h-4 w-4 text-rose-500" />;
      case "kanban":
        return <Layout className="h-4 w-4 text-orange-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityContent = (activity: TimelineDayProps["activities"][0]) => {
    switch (activity.type) {
      case "task":
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              <Badge variant={activity.completed ? "default" : "secondary"} className="bg-rose-500">
                {activity.duration} minutes
              </Badge>
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
              {activity.completed && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                  Completed
                </Badge>
              )}
            </div>
            {activity.notes && (
              <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
            )}
          </>
        );
      case "goal":
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
            </div>
            <div className="space-y-2 mt-2">
              <div className="text-sm text-muted-foreground">{activity.content}</div>
              {typeof activity.value === 'number' && (
                <div className="space-y-1">
                  <Progress value={activity.value} className="h-2" indicatorColor="bg-blue-500" />
                  <p className="text-xs text-blue-500 text-right">{activity.value}%</p>
                </div>
              )}
            </div>
          </>
        );
      case "habit":
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              <Badge variant={activity.completed ? "default" : "destructive"} className={activity.completed ? "bg-green-500" : ""}>
                {activity.completed ? "Completed" : "Missed"}
              </Badge>
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
            </div>
            {activity.content && (
              <p className="text-sm text-muted-foreground mt-1">{activity.content}</p>
            )}
          </>
        );
      case "note":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground p-2 rounded-md bg-muted/50 mt-2">
              {activity.content}
            </div>
          </div>
        );
      case "files":
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              {activity.fileType && (
                <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-200 uppercase text-xs">
                  {activity.fileType}
                </Badge>
              )}
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
            </div>
            {activity.content && (
              <p className="text-sm text-muted-foreground mt-1">{activity.content}</p>
            )}
            {activity.filePath && (
              <div className="text-xs text-blue-500 mt-2 flex items-center gap-1 hover:underline cursor-pointer">
                <File className="h-3 w-3" />
                {activity.filePath}
              </div>
            )}
          </>
        );
      case "links":
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
              {activity.tags && activity.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
            {activity.content && (
              <p className="text-sm text-muted-foreground mt-1">{activity.content}</p>
            )}
            {activity.url && (
              <div className="text-xs text-blue-500 mt-2 flex items-center gap-1 hover:underline cursor-pointer">
                <Link className="h-3 w-3" />
                {activity.url}
              </div>
            )}
          </>
        );
      case "gallery":
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
            </div>
            {activity.content && (
              <p className="text-sm text-muted-foreground mt-1">{activity.content}</p>
            )}
            {activity.thumbnailUrl && (
              <div className="mt-2 relative rounded-md overflow-hidden">
                <img 
                  src={activity.thumbnailUrl} 
                  alt={activity.title || 'Gallery image'}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
            )}
          </>
        );
      case "calendar":
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              {activity.duration && (
                <Badge variant="secondary" className="bg-indigo-500">
                  {activity.duration} minutes
                </Badge>
              )}
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
            </div>
            {activity.content && (
              <p className="text-sm text-muted-foreground mt-1">{activity.content}</p>
            )}
            {activity.notes && (
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <StickyNote className="h-3 w-3" />
                {activity.notes}
              </div>
            )}
          </>
        );
      case "kanban":
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{activity.title}</span>
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
            </div>
            {activity.content && (
              <div className="text-sm text-muted-foreground mt-1 p-2 rounded-md bg-orange-500/5 border border-orange-200">
                {activity.content}
              </div>
            )}
            {activity.notes && (
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <StickyNote className="h-3 w-3" />
                {activity.notes}
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const getActivityDialog = (activity: TimelineDayProps["activities"][0]) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getTypeIcon(activity.type)}
              <span>{activity.title}</span>
            </DialogTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {activity.category && (
                <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </Badge>
              )}
              {activity.type === 'task' && (
                <Badge variant={activity.completed ? "default" : "secondary"} className="bg-rose-500">
                  {activity.duration} minutes
                </Badge>
              )}
              {activity.type === 'habit' && (
                <Badge variant={activity.completed ? "default" : "destructive"} className={activity.completed ? "bg-green-500" : ""}>
                  {activity.completed ? "Completed" : "Missed"}
                </Badge>
              )}
            </div>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {activity.content && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Description</h4>
                <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted">
                  {activity.content}
                </div>
              </div>
            )}
            {activity.notes && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Notes</h4>
                <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted">
                  {activity.notes}
                </div>
              </div>
            )}
            {typeof activity.value === 'number' && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Progress</h4>
                <Progress value={activity.value} className="h-2" indicatorColor="bg-blue-500" />
                <p className="text-sm text-blue-500 text-right font-medium">{activity.value}%</p>
              </div>
            )}
            <div className="text-xs text-muted-foreground pt-2 border-t">
              {activity.time ? (
                isValid(activity.time) ? 
                  format(activity.time, "PPpp") : 
                  "Invalid time"
              ) : "No time specified"}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
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
        <HoverCard key={index}>
          <HoverCardTrigger asChild>
            <div 
              className={cn(
                "group relative flex items-start gap-3 rounded-lg border p-4 bg-card hover:bg-accent/5 transition-all hover:shadow-md",
                {
                  'hover:border-rose-200': activity.type === 'task',
                  'hover:border-blue-200': activity.type === 'goal',
                  'hover:border-green-200': activity.type === 'habit',
                  'hover:border-yellow-200': activity.type === 'note',
                  'hover:border-gray-200': activity.type === 'files',
                  'hover:border-blue-200': activity.type === 'links',
                  'hover:border-pink-200': activity.type === 'gallery',
                  'hover:border-indigo-200': activity.type === 'calendar',
                  'hover:border-orange-200': activity.type === 'kanban'
                }
              )}
            >
              <div className={cn(
                "mt-1",
                {
                  'text-rose-500': activity.type === 'task',
                  'text-blue-500': activity.type === 'goal',
                  'text-green-500': activity.type === 'habit',
                  'text-yellow-500': activity.type === 'note',
                  'text-gray-500': activity.type === 'files',
                  'text-blue-400': activity.type === 'links',
                  'text-pink-500': activity.type === 'gallery',
                  'text-indigo-500': activity.type === 'calendar',
                  'text-orange-500': activity.type === 'kanban'
                }
              )}>
                {getTypeIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1 min-h-[2.5rem]">
                {getActivityContent(activity)}
                {activity.time && isValid(activity.time) ? (
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(activity.time, "h:mm a")}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Invalid time
                  </div>
                )}
              </div>
              {getActivityDialog(activity)}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(activity.type)}
                <span className="font-medium">{activity.title}</span>
              </div>
              {activity.content && (
                <p className="text-sm text-muted-foreground">{activity.content}</p>
              )}
              {typeof activity.value === 'number' && (
                <div className="space-y-1">
                  <Progress value={activity.value} className="h-2" indicatorColor="bg-blue-500" />
                  <p className="text-xs text-blue-500 text-right">{activity.value}%</p>
                </div>
              )}
              {activity.notes && (
                <div className="text-sm text-muted-foreground p-2 rounded-md bg-muted">
                  {activity.notes}
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
