'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  XCircle, 
  Calendar,
  Award,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import { Pomodoro } from "@/components/widgets/pomodoro";
import { Counter } from "@/components/widgets/counter";
import { Notes } from "@/components/widgets/notes";
import { Checklist } from "@/components/widgets/checklist";
import { ProgressChart } from "@/components/widgets/progress-chart";
import { Widget, WidgetType } from "@/types";
import { WidgetPicker } from "@/components/widgets/widget-picker";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HabitCardProps {
  id: number;
  title: string;
  description: string;
  frequency: string;
  type: 'good' | 'bad';
  streak: number;
  progress: number;
  lastCompleted?: string;
  startDate?: string;
  completedCount?: number;
  target?: number;
  widgets?: Widget[];
  onComplete?: () => void;
  onUpdateHabit?: (id: number, widgets: Widget[]) => void;
}

export function HabitCard({
  id,
  title,
  description,
  frequency,
  type,
  streak,
  progress,
  lastCompleted,
  startDate = new Date().toISOString(),
  completedCount = 0,
  target = 0,
  widgets = [],
  onComplete,
  onUpdateHabit,
}: HabitCardProps) {
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [streakStatus, setStreakStatus] = useState<'at-risk' | 'good' | 'excellent'>('good');
  const isGoodHabit = type === 'good';
  
  const lastCompletedDate = lastCompleted ? new Date(lastCompleted) : null;
  const lastCompletedText = lastCompletedDate
    ? formatDistanceToNow(lastCompletedDate, { addSuffix: true })
    : 'Never';
  
  const habitAge = differenceInDays(new Date(), new Date(startDate));
  const successRate = target > 0 ? (completedCount / target) * 100 : 0;
  
  useEffect(() => {
    if (lastCompletedDate) {
      const daysSinceLastCompletion = differenceInDays(new Date(), lastCompletedDate);
      if (daysSinceLastCompletion > 2) {
        setStreakStatus('at-risk');
      } else if (streak > 7) {
        setStreakStatus('excellent');
      } else {
        setStreakStatus('good');
      }
    }
  }, [lastCompleted, streak, lastCompletedDate]);

  const renderWidget = (widget: Widget) => {
    const widgetWrapper = (content: React.ReactNode) => (
      <div key={widget.id} className="relative group">
        {content}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveWidget(widget.id);
          }}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    );

    switch (widget.type) {
      case 'pomodoro':
        return widgetWrapper(
          <Pomodoro
            key={widget.id}
            className="w-full"
            workDuration={widget.settings?.workDuration}
            breakDuration={widget.settings?.breakDuration}
            longBreakDuration={widget.settings?.longBreakDuration}
            sessionsBeforeLongBreak={widget.settings?.sessionsBeforeLongBreak}
          />
        );
      case 'counter':
        return widgetWrapper(
          <Counter
            key={widget.id}
            className="w-full"
            initialValue={widget.settings?.initialValue}
            increment={widget.settings?.increment}
            target={widget.settings?.target}
          />
        );
      case 'notes':
        return widgetWrapper(
          <Notes
            key={widget.id}
            className="w-full"
            initialNotes={widget.settings?.notes || []}
          />
        );
      case 'checklist':
        return widgetWrapper(
          <Checklist
            key={widget.id}
            className="w-full"
            items={widget.settings?.items || []}
          />
        );
      case 'progress-chart':
        return widgetWrapper(
          <ProgressChart
            key={widget.id}
            className="w-full"
            data={widget.settings?.data || []}
          />
        );
      default:
        return null;
    }
  };

  const handleAddWidget = (widgetType: WidgetType) => {
    const newWidget: Widget = {
      id: Date.now(),
      type: widgetType,
      settings: {},
    };
    
    const updatedWidgets = [...widgets, newWidget];
    onUpdateHabit?.(id, updatedWidgets);
    setShowWidgetPicker(false);
  };

  const handleRemoveWidget = (widgetId: number) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    onUpdateHabit?.(id, updatedWidgets);
  };

  const getStreakStatusColor = () => {
    switch (streakStatus) {
      case 'at-risk':
        return 'text-red-500 dark:text-red-400';
      case 'excellent':
        return 'text-purple-500 dark:text-purple-400';
      default:
        return isGoodHabit ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center p-2 bg-background rounded-lg border cursor-pointer">
              <Calendar className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Age</span>
              <span className="font-medium">{habitAge} days</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Habit started on {format(new Date(startDate), 'PP')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center p-2 bg-background rounded-lg border cursor-pointer">
              <Award className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Success Rate</span>
              <span className="font-medium">{Math.round(successRate)}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Completed {completedCount} times out of {target} target</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center p-2 bg-background rounded-lg border cursor-pointer">
              <TrendingUp className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Streak</span>
              <span className={cn("font-medium", getStreakStatusColor())}>{streak} days</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Current streak status: {streakStatus}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center p-2 bg-background rounded-lg border cursor-pointer">
              <AlertTriangle className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Last Done</span>
              <span className="font-medium">{lastCompletedText}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last completed: {lastCompleted ? format(new Date(lastCompleted), 'PPp') : 'Never'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        isGoodHabit && "border-l-4 border-l-green-500 dark:border-l-green-600 bg-green-50/50 dark:bg-green-950/10",
        !isGoodHabit && "border-l-4 border-l-red-500 dark:border-l-red-600 bg-red-50/50 dark:bg-red-950/10"
      )}
    >
      <CardHeader 
        className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold tracking-tight text-lg",
              isGoodHabit && "text-green-700 dark:text-green-400",
              !isGoodHabit && "text-red-700 dark:text-red-400"
            )}>{title}</h3>
            <Badge variant={isGoodHabit ? "success" : "destructive"}>
              {isGoodHabit ? 'Good' : 'Bad'}
            </Badge>
            {streakStatus === 'excellent' && (
              <Badge variant="purple">🔥 On Fire!</Badge>
            )}
            {streakStatus === 'at-risk' && (
              <Badge variant="warning">⚠️ At Risk</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{frequency}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setShowWidgetPicker(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? "auto" : 0, 
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "overflow-hidden",
          !isExpanded && "pointer-events-none"
        )}
      >
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={cn(
                isGoodHabit && "text-green-700 dark:text-green-400",
                !isGoodHabit && "text-red-700 dark:text-red-400"
              )}>Progress</span>
              <span className={cn(
                "font-medium",
                isGoodHabit && "text-green-700 dark:text-green-400",
                !isGoodHabit && "text-red-700 dark:text-red-400"
              )}>{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                "h-2",
                isGoodHabit && "[&>div]:bg-green-500 dark:[&>div]:bg-green-600",
                !isGoodHabit && "[&>div]:bg-red-500 dark:[&>div]:bg-red-600"
              )} 
            />
          </div>

          {renderStats()}

          {/* Widgets Section */}
          {widgets.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-4">
                {widgets.map(renderWidget)}
              </div>
            </div>
          )}
        </CardContent>
      </motion.div>

      <CardFooter>
        <Button 
          className={cn(
            "w-full",
            isGoodHabit && "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
            !isGoodHabit && "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onComplete?.();
          }}
        >
          {isGoodHabit ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          {isGoodHabit ? 'Complete' : 'Avoid'}
        </Button>
      </CardFooter>

      <WidgetPicker 
        open={showWidgetPicker}
        onOpenChange={setShowWidgetPicker}
        onSelectWidget={handleAddWidget}
      />
    </Card>
  );
}
