"use client"

import { useState, useEffect } from "react";
import { format, isToday, isSameDay, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimelineDay } from "./timeline-day";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Goal, Habit, Note, TimerTask, Resource } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SnakeTimeline } from "./snake-timeline";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar as CalendarIcon, GitBranch, Group, X, Layers, Target, Flag, Activity, Clock, StickyNote, BookOpen, File, Link, Image, Layout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TypeFilter } from "@/components/widgets/type-filter";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "goal":
      return <Target className="h-4 w-4 mr-2" />;
    case "milestone":
      return <Flag className="h-4 w-4 mr-2" />;
    case "habit":
      return <Activity className="h-4 w-4 mr-2" />;
    case "task":
      return <Clock className="h-4 w-4 mr-2" />;
    case "note":
      return <StickyNote className="h-4 w-4 mr-2" />;
    case "resource":
      return <BookOpen className="h-4 w-4 mr-2" />;
    case "files":
      return <File className="h-4 w-4 mr-2" />;
    case "links":
      return <Link className="h-4 w-4 mr-2" />;
    case "gallery":
      return <Image className="h-4 w-4 mr-2" />;
    case "calendar":
      return <Calendar className="h-4 w-4 mr-2" />;
    case "kanban":
      return <Layout className="h-4 w-4 mr-2" />;
    default:
      return <Layers className="h-4 w-4 mr-2" />;
  }
};

const formatFilterType = (type: string) => {
  switch (type) {
    case "goal":
      return "Goals";
    case "milestone":
      return "Milestones";
    case "habit":
      return "Habits";
    case "task":
      return "Tasks";
    case "note":
      return "Notes";
    case "resource":
      return "Resources";
    default:
      return "All Types";
  }
};

export function Timeline() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [view, setView] = useState<"calendar" | "snake">("calendar");
  const [sortBy, setSortBy] = useState<"date" | "type" | "title">("date");
  const [groupBy, setGroupBy] = useState<"date" | "title" | "type">("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [goals] = useLocalStorage<Goal[]>("goals", []);
  const [habits] = useLocalStorage<Habit[]>("habits", []);
  const [notes] = useLocalStorage<Note[]>("notes", []);

  useEffect(() => {
    setDate(new Date());
  }, []);

  const getAllActivities = () => {
    const allActivities = [
      // Goals and their milestones
      ...goals.map((goal) => ([
        {
          type: "goal" as const,
          title: goal.title,
          content: goal.description,
          value: goal.progress,
          time: goal.createdAt ? new Date(goal.createdAt) : null,
          category: "goal",
          status: goal.status
        },
        ...(goal.milestones || []).map(milestone => ({
          type: "milestone" as const,
          title: milestone.title,
          content: milestone.description || "",
          value: milestone.progress || 0,
          time: milestone.dueDate ? new Date(milestone.dueDate) : null,
          category: "milestone",
          status: milestone.status,
          parentTitle: goal.title
        }))
      ])).flat(),

      // Habits and their entries
      ...habits.map((habit) => 
        (habit.dates || []).map((date) => ({
          type: "habit" as const,
          title: habit.title,
          time: date ? new Date(date) : null,
          category: "habit",
          habitType: habit.type
        }))
      ).flat(),

      // Notes
      ...notes.map((note) => ({
        type: "note" as const,
        title: note.title,
        content: note.content,
        time: note.createdAt ? new Date(note.createdAt) : null,
        category: "note"
      })),

      // Timer Tasks
      ...(JSON.parse(localStorage.getItem('timerTasks') || '[]') as TimerTask[]).map(task => ({
        type: "task" as const,
        title: task.title,
        content: `${Math.floor(task.duration / 60)} minutes`,
        time: task.createdAt ? new Date(task.createdAt) : null,
        category: "task",
        completed: task.completed,
        archived: task.archived
      })),

      // Resources
      ...(JSON.parse(localStorage.getItem('resources') || '[]') as Resource[]).map(resource => ({
        type: "resource" as const,
        title: resource.title,
        content: resource.description,
        time: resource.dateAdded ? new Date(resource.dateAdded) : null,
        category: "resource",
        resourceType: resource.type
      }))
    ];

    const filteredActivities = searchTerm 
      ? allActivities.filter(activity => 
          activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.content?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allActivities;

    const sortedActivities = [...filteredActivities].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (b.time?.getTime() ?? 0) - (a.time?.getTime() ?? 0);
        case "type":
          return a.category.localeCompare(b.category);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    // Group activities based on the selected grouping option
    const groupedActivities = sortedActivities.reduce((groups, activity) => {
      let groupKey;
      let includeGroup = true;
      
      switch (groupBy) {
        case "title":
          groupKey = activity.title || "Untitled";
          if (groupFilter) {
            includeGroup = groupKey.toLowerCase().includes(groupFilter.toLowerCase());
          }
          break;
        case "type":
          groupKey = activity.type.charAt(0).toUpperCase() + activity.type.slice(1);
          if (groupFilter) {
            includeGroup = groupKey.toLowerCase() === groupFilter.toLowerCase();
          }
          break;
        case "date":
        default:
          if (!activity.time || !isValid(activity.time)) {
            groupKey = "No Date";
            includeGroup = !groupFilter; // Only show "No Date" if no date filter
          } else {
            groupKey = format(activity.time, "yyyy-MM-dd");
            if (dateRange.from || dateRange.to) {
              const activityDate = activity.time;
              includeGroup = (!dateRange.from || activityDate >= dateRange.from) &&
                           (!dateRange.to || activityDate <= dateRange.to);
            }
          }
          break;
      }
      
      if (includeGroup) {
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(activity);
      }
      return groups;
    }, {} as Record<string, typeof sortedActivities>);

    return groupedActivities;
  };

  const renderGroupHeader = (groupKey: string, activities: any[]) => {
    switch (groupBy) {
      case "title":
        return (
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {groupKey}
              <Badge variant="secondary">{activities[0].type}</Badge>
            </h3>
            <Badge variant="outline">
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
            </Badge>
          </div>
        );
      case "type":
        return (
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">{groupKey}s</h3>
            <Badge variant="outline">
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
            </Badge>
          </div>
        );
      case "date":
      default:
        return (
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">
              {groupKey === "No Date" ? groupKey : format(new Date(groupKey), "MMMM d, yyyy")}
            </h3>
            <Badge variant="outline">
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
            </Badge>
          </div>
        );
    }
  };

  const renderGroupFilter = () => {
    switch (groupBy) {
      case "title":
        return (
          <div className="relative">
            <Input
              type="text"
              placeholder="Filter by title..."
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-[200px]"
            />
            {groupFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setGroupFilter("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      case "type":
        return (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-[200px] justify-between">
                  <span className="flex items-center gap-2">
                    {getTypeIcon(groupFilter || "all")}
                    {formatFilterType(groupFilter || "all")}
                  </span>
                  {groupFilter ? (
                    <X className="h-4 w-4" onClick={(e) => {
                      e.stopPropagation();
                      setGroupFilter("");
                    }} />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px] p-0" align="start">
                <TypeFilter
                  selectedType={groupFilter}
                  onTypeChange={setGroupFilter}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      case "date":
        return (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn(
                  "justify-start text-left font-normal w-[200px]",
                  !dateRange.from && !dateRange.to && "text-muted-foreground"
                )}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Filter by date..."
                  )}
                  {(dateRange.from || dateRange.to) && (
                    <X
                      className="ml-auto h-4 w-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDateRange({ from: undefined, to: undefined });
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        );
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Timeline</h2>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as "calendar" | "snake")}>
            <ToggleGroupItem value="calendar" aria-label="Calendar View">
              <CalendarIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="snake" aria-label="Snake View">
              <GitBranch className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Group className="h-4 w-4 mr-2" />
                  Group by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Group Activities</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setGroupBy("date");
                  setGroupFilter("");
                  setDateRange({ from: undefined, to: undefined });
                }}>
                  By Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setGroupBy("title");
                  setGroupFilter("");
                  setDateRange({ from: undefined, to: undefined });
                }}>
                  By Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setGroupBy("type");
                  setGroupFilter("");
                  setDateRange({ from: undefined, to: undefined });
                }}>
                  By Type
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {renderGroupFilter()}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search all activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px]"
          />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "type" | "title")}
            className="px-3 py-1 border rounded-md"
          >
            <option value="date">Sort by Date</option>
            <option value="type">Sort by Type</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-4">
        {view === "calendar" ? (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="md:col-span-5">
              <div className="grid gap-6">
                {Object.entries(getAllActivities()).map(([groupKey, activities]) => (
                  <Card key={groupKey}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {renderGroupHeader(groupKey, activities)}
                        <TimelineDay activities={activities} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <Card className="md:col-span-2">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <SnakeTimeline 
            activities={Object.values(getAllActivities()).flat()} 
            groupBy={groupBy}
          />
        )}
      </div>
    </div>
  );
}
