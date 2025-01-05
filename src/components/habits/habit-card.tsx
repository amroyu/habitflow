"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
  AlertTriangle,
  CalendarDays,
  Flame,
  Layout,
  X,
  Check,
  Edit2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import { PomodoroTimer } from "@/components/widgets/pomodoro-timer";
import { Counter } from "@/components/widgets/counter";
import { Notes } from "@/components/widgets/notes";
import { Checklist } from "@/components/widgets/checklist";
import { ProgressChart } from "@/components/widgets/progress-chart";
import { Files } from "@/components/widgets/files";
import { Links } from "@/components/widgets/links";
import { Gallery } from "@/components/widgets/gallery";
import { Calendar as CalendarWidget } from "@/components/widgets/calendar";
import { Kanban } from "@/components/widgets/kanban";
import type { Habit, Widget, WidgetType, Streak } from "@/types";
import { WidgetPicker } from "@/components/widgets/widget-picker";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WidgetSettingsDialog } from "@/components/widgets/widget-settings-dialog";
import { HabitEditDialog } from "@/components/dialogs/habit-edit-dialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";

interface HabitCardProps extends Habit {
  onComplete?: (habit: Habit) => void;
  onUpdateHabit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
}

export function HabitCard({
  id,
  title,
  description,
  frequency,
  type,
  streak = { currentStreak: 0, longestStreak: 0, lastUpdated: null },
  progress,
  lastCompleted,
  startDate,
  completedCount,
  target,
  widgets = [],
  category,
  onComplete,
  onUpdateHabit,
  onDelete,
}: HabitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const lastCompletedDate = lastCompleted ? new Date(lastCompleted) : null;
  const lastCompletedText = lastCompletedDate
    ? formatDistanceToNow(lastCompletedDate, { addSuffix: true })
    : "Never";

  const habitAge = differenceInDays(new Date(), new Date(startDate));
  const successRate = target > 0 ? (completedCount / target) * 100 : 0;

  useEffect(() => {
    if (lastCompletedDate) {
      const daysSinceLastCompletion = differenceInDays(
        new Date(),
        lastCompletedDate
      );
      if (daysSinceLastCompletion > 2) {
        // setStreakStatus("at-risk");
      } else if (streak.currentStreak > 7) {
        // setStreakStatus("excellent");
      } else {
        // setStreakStatus("good");
      }
    }
  }, [lastCompleted, streak, lastCompletedDate]);

  const handleAddWidget = (widgetType: WidgetType) => {
    if (onUpdateHabit) {
      const newWidget: Widget = {
        id: String(Date.now()),
        type: widgetType,
        settings: {},
      };
      onUpdateHabit({
        id,
        title,
        description,
        frequency,
        type,
        streak,
        progress,
        lastCompleted,
        startDate,
        completedCount,
        target,
        category,
        widgets: [...widgets, newWidget],
      });
    }
    setShowWidgetPicker(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (onUpdateHabit) {
      onUpdateHabit({
        id,
        title,
        description,
        frequency,
        type,
        streak,
        progress,
        lastCompleted,
        startDate,
        completedCount,
        target,
        category,
        widgets: widgets.filter((w) => w.id !== widgetId),
      });
    }
  };

  const handleEditWidget = (widgetId: string) => {
    const widget = widgets.find((w) => w.id === widgetId);
    if (widget) {
      setSelectedWidget(widget);
    }
  };

  const handleSaveWidgetSettings = (settings: any) => {
    if (selectedWidget && onUpdateHabit) {
      onUpdateHabit({
        id,
        title,
        description,
        frequency,
        type,
        streak,
        progress,
        lastCompleted,
        startDate,
        completedCount,
        target,
        category,
        widgets: widgets.map((w) =>
          w.id === selectedWidget.id ? { ...w, settings } : w
        ),
      });
    }
    setSelectedWidget(null);
  };

  const handleComplete = () => {
    if (onComplete) {
      const updatedHabit: Habit = {
        id,
        title,
        description,
        frequency,
        type,
        streak: {
          currentStreak: streak.currentStreak + 1,
          longestStreak: Math.max(
            streak.longestStreak,
            streak.currentStreak + 1
          ),
          lastUpdated: new Date().toISOString(),
        },
        progress: Math.min(((completedCount + 1) / target) * 100, 100),
        lastCompleted: new Date().toISOString(),
        startDate,
        completedCount: completedCount + 1,
        target,
        widgets,
        category,
      };
      onComplete(updatedHabit);
    }
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "pomodoro-timer":
        return (
          <PomodoroTimer
            key={widget.id}
            workDuration={widget.settings?.workDuration}
            breakDuration={widget.settings?.breakDuration}
            longBreakDuration={widget.settings?.longBreakDuration}
            sessionsBeforeLongBreak={widget.settings?.sessionsBeforeLongBreak}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      case "counter":
        return (
          <Counter
            key={widget.id}
            initialValue={widget.settings?.initialValue || 0}
            increment={widget.settings?.increment || 1}
            target={widget.settings?.target}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      case "notes":
        return (
          <Notes
            key={widget.id}
            initialNotes={widget.settings?.notes || []}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      case "checklist":
        return (
          <Checklist
            key={widget.id}
            items={widget.settings?.items || []}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      case "progress-chart":
        return (
          <ProgressChart
            key={widget.id}
            data={widget.settings?.data || []}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      case "files":
        return (
          <Files
            key={widget.id}
            files={widget.settings?.files || []}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
            onChange={(files) =>
              handleSaveWidgetSettings({ ...widget.settings, files })
            }
          />
        );
      case "links":
        return (
          <Links
            key={widget.id}
            links={widget.settings?.links || []}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
            onChange={(links) =>
              handleSaveWidgetSettings({ ...widget.settings, links })
            }
          />
        );
      case "gallery":
        return (
          <Gallery
            key={widget.id}
            images={widget.settings?.images || []}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
            onChange={(images) =>
              handleSaveWidgetSettings({ ...widget.settings, images })
            }
          />
        );
      case "calendar":
        return (
          <CalendarWidget
            key={widget.id}
            events={widget.settings?.events || []}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
            onChange={(events) =>
              handleSaveWidgetSettings({ ...widget.settings, events })
            }
          />
        );
      case "kanban":
        return (
          <Kanban
            key={widget.id}
            columns={widget.settings?.columns || []}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
            onChange={(columns) =>
              handleSaveWidgetSettings({ ...widget.settings, columns })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200",
          type === "good" &&
            "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]",
          type === "bad" &&
            "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]",
          isExpanded && "shadow-lg"
        )}
      >
        {/* Status indicator line */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
            type === "good" && "bg-gradient-to-r from-green-500 to-emerald-500",
            type === "bad" && "bg-gradient-to-r from-red-500 to-rose-500"
          )}
        />

        <CardHeader className="relative pb-2 pt-6">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-start"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <motion.h3
                  className={cn(
                    "font-semibold text-lg",
                    type === "good"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  {title}
                </motion.h3>
                <Badge
                  variant={type === "good" ? "default" : "destructive"}
                  className="animate-in fade-in duration-500"
                >
                  {type === "good" ? "Build" : "Break"}
                </Badge>
              </div>
              {description && (
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {description}
                </motion.p>
              )}
              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CalendarDays className="h-4 w-4" />
                <span>{frequency}</span>
                {category && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  </>
                )}
              </motion.div>
            </div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 flex items-center gap-1.5 px-2.5 rounded-full transition-colors",
                    type === "good" &&
                      "hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400",
                    type === "bad" &&
                      "hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWidgetPicker(true);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="text-sm">Add Widget</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 flex items-center gap-1.5 px-2.5 rounded-full transition-colors",
                    type === "good" &&
                      "hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400",
                    type === "bad" &&
                      "hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400"
                  )}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </motion.div>
                  <span className="text-sm">
                    {isExpanded ? "Less" : "More"}
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Progress Section */}
            <div className="space-y-2">
              <motion.div
                className="flex justify-between text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Progress
                  value={progress}
                  className={cn(
                    "h-2",
                    type === "good" &&
                      "[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500",
                    type === "bad" &&
                      "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-rose-500"
                  )}
                />
              </motion.div>
            </div>

            {/* Streak Section */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <Flame
                    className={cn(
                      "h-5 w-5",
                      streak?.currentStreak > 0
                        ? "text-orange-500"
                        : "text-muted-foreground"
                    )}
                  />
                </motion.div>
                <div className="text-sm">
                  <span className="font-medium">
                    {streak.currentStreak} day streak
                  </span>
                  {streak.longestStreak > 0 && (
                    <span className="text-muted-foreground">
                      {" "}
                      • Best: {streak.longestStreak}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Widgets Section */}
                  {widgets && widgets.length > 0 && (
                    <motion.div
                      className="space-y-3 pt-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Layout className="h-4 w-4" />
                        Widgets
                      </h4>
                      <div className="grid gap-4">
                        {widgets.map((widget, index) => (
                          <motion.div
                            key={widget.id}
                            className="relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (index + 1) }}
                          >
                            {renderWidget(widget)}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {selectedWidget && (
                    <CardContent className="pt-0">
                      <WidgetSettingsDialog
                        widget={selectedWidget}
                        open={true}
                        onOpenChange={(open) =>
                          !open && setSelectedWidget(null)
                        }
                        onSave={handleSaveWidgetSettings}
                      />
                    </CardContent>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center p-2">
          <div className="flex gap-2 w-full">
            <Button
              className={cn(
                "flex-1 transition-all",
                type === "good" && "bg-green-500 hover:bg-green-600 text-white",
                type === "bad" && "bg-red-500 hover:bg-red-600 text-white"
              )}
              onClick={handleComplete}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark Complete
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardFooter>

        <WidgetPicker
          open={showWidgetPicker}
          onOpenChange={setShowWidgetPicker}
          onSelect={handleAddWidget}
        />

        <HabitEditDialog
          habit={{
            id,
            title,
            description,
            frequency,
            type,
            streak,
            progress,
            lastCompleted,
            startDate,
            completedCount,
            target,
            widgets,
            category,
          }}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={(updatedHabit) => {
            onUpdateHabit?.(updatedHabit);
            setShowEditDialog(false);
          }}
        />

        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => {
            onDelete?.(id);
            setShowDeleteDialog(false);
          }}
          title={title}
        />
      </Card>
    </motion.div>
  );
}
