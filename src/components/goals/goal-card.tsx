'use client';

import { useState } from 'react';
import { Goal, Widget, WidgetType } from '@/types';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, Plus, CheckCircle2, Edit2, Trash2, FileText, ChevronDown, ChevronUp, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { DailyEntryForm } from "./daily-entry-form";
import { motion, AnimatePresence } from "framer-motion";
import { StreakCounter } from "./streak-counter";
import { PomodoroWidget } from '@/components/widgets/pomodoro';
import { CounterWidget } from '@/components/widgets/counter';
import { Notes } from '@/components/widgets/notes';
import { Checklist } from '@/components/widgets/checklist';
import { ProgressChart } from '@/components/widgets/progress-chart';
import { WidgetPicker } from '@/components/widgets/widget-picker';

interface GoalCardProps {
  goal: Goal;
  onUpdate?: (updatedGoal: Goal) => void;
  onDelete?: (goalId: number) => void;
  onAddWidget?: (goalId: number, widget: Widget) => void;
  onRemoveWidget?: (goalId: number, widgetId: number) => void;
}

export function GoalCard({
  goal,
  onUpdate,
  onDelete,
  onAddWidget,
  onRemoveWidget,
}: GoalCardProps) {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  
  const daysRemaining = differenceInDays(new Date(goal.endDate), new Date());
  const progress = Math.min(Math.round((goal.entries?.length || 0) / goal.target * 100), 100);
  const isCompleted = goal.status === 'completed';

  const handleAddEntry = (entry: any) => {
    const updatedGoal: Goal = {
      ...goal,
      entries: [...(goal.entries || []), entry],
      streak: {
        currentStreak: (goal.streak?.currentStreak || 0) + 1,
        longestStreak: Math.max((goal.streak?.longestStreak || 0), (goal.streak?.currentStreak || 0) + 1),
        lastUpdated: new Date().toISOString()
      }
    };
    onUpdate?.(updatedGoal);
  };

  const handleMarkComplete = () => {
    const updatedGoal: Goal = {
      ...goal,
      status: 'completed' as const
    };
    onUpdate?.(updatedGoal);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddWidget = (type: WidgetType) => {
    if (!onAddWidget) return

    const newWidget: Widget = {
      id: Number(Date.now()),
      type,
      settings: {}
    }

    onAddWidget(goal.id, newWidget)
  };

  const handleRemoveWidget = (widgetId: number) => {
    if (!onRemoveWidget) return
    onRemoveWidget(goal.id, widgetId)
  };

  const renderWidget = (widget: Widget, index: number) => {
    switch (widget.type) {
      case 'pomodoro':
        return (
          <div key={widget.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleRemoveWidget(Number(widget.id))}
            >
              <X className="h-4 w-4" />
            </Button>
            <PomodoroWidget settings={widget.settings} />
          </div>
        )
      case 'counter':
        return (
          <div key={widget.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleRemoveWidget(Number(widget.id))}
            >
              <X className="h-4 w-4" />
            </Button>
            <CounterWidget settings={widget.settings} />
          </div>
        )
      default:
        return null
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
          isCompleted && "bg-muted",
          goal.type === 'do' && "border-l-4 border-l-green-500 dark:border-l-green-600",
          goal.type === 'dont' && "border-l-4 border-l-red-500 dark:border-l-red-600",
          goal.type === 'dont' && "bg-red-50/50 dark:bg-red-950/10",
          goal.type === 'do' && "bg-green-50/50 dark:bg-green-950/10"
        )}
        onClick={handleToggleExpand}
      >
        <CardHeader className="space-y-2 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-semibold tracking-tight text-lg",
                  goal.type === 'do' && "text-green-700 dark:text-green-400",
                  goal.type === 'dont' && "text-red-700 dark:text-red-400"
                )}>
                  {goal.title}
                </h3>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  goal.type === 'do' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  goal.type === 'dont' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {goal.type === 'do' ? 'Do' : "Don't"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  // onEditGoal?.(goal);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this goal?')) {
                    onDelete?.(goal.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className={cn(
                "text-muted-foreground",
                goal.type === 'do' && "text-green-700 dark:text-green-400",
                goal.type === 'dont' && "text-red-700 dark:text-red-400"
              )}>Progress</span>
              <span className={cn(
                "font-medium",
                goal.type === 'do' && "text-green-700 dark:text-green-400",
                goal.type === 'dont' && "text-red-700 dark:text-red-400"
              )}>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                "h-2",
                goal.type === 'do' && "[&>div]:bg-green-500 dark:[&>div]:bg-green-600",
                goal.type === 'dont' && "[&>div]:bg-red-500 dark:[&>div]:bg-red-600"
              )} 
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Target className="mr-1 h-4 w-4" />
                Target
              </div>
              <p className="font-medium">{goal.target} entries</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="mr-1 h-4 w-4" />
                Time Left
              </div>
              <p className="font-medium">{daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="mr-1 h-4 w-4" />
                Streak
              </div>
              <p className="font-medium">{goal.streak?.currentStreak || 0} days</p>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 pt-4"
              >
                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <p className="text-sm font-medium">
                      {format(new Date(goal.startDate), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <p className="text-sm font-medium">
                      {format(new Date(goal.endDate), 'PPP')}
                    </p>
                  </div>
                </div>

                {/* Milestones */}
                {goal.milestones.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Milestones</h4>
                    <div className="space-y-2">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between p-3 bg-background rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={milestone.completed}
                              onChange={(e) => {
                                e.stopPropagation();
                                onUpdate?.({
                                  ...goal,
                                  milestones: goal.milestones.map(m => 
                                    m.id === milestone.id ? { ...m, completed: e.target.checked } : m
                                  ),
                                  progress: Math.round(
                                    (goal.milestones.filter(m => m.completed).length / goal.milestones.length) * 100
                                  ),
                                  lastUpdated: new Date().toISOString()
                                });
                              }}
                              className="h-4 w-4"
                            />
                            <div>
                              <p className="text-sm font-medium">{milestone.title}</p>
                              {milestone.dueDate && (
                                <p className="text-xs text-muted-foreground">
                                  Due {format(new Date(milestone.dueDate), 'PPP')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Widgets Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Widgets</h4>
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
                  </div>
                  <WidgetPicker 
                    open={showWidgetPicker}
                    onOpenChange={setShowWidgetPicker}
                    onSelectWidget={handleAddWidget}
                  />
                  {goal.widgets?.map((widget, index) => (
                    <div key={widget.id} className="mb-4">
                      {renderWidget(widget, index)}
                    </div>
                  ))}
                </div>

                {/* Recent Entries */}
                {goal.entries && goal.entries.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Entries</h4>
                    <div className="space-y-2">
                      {goal.entries.slice(-5).map((entry) => (
                        <div key={entry.id} className="bg-background p-3 rounded-lg border">
                          <div className="flex justify-between items-start">
                            <div className="text-sm">
                              {entry.contents.map((content, i) => (
                                <div key={i} className="mt-1">
                                  {content.type === 'text' && content.data.text}
                                  {content.type === 'checklist' && (
                                    <div className="space-y-1">
                                      {content.data.items?.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-2">
                                          <input
                                            type="checkbox"
                                            checked={item.completed}
                                            readOnly
                                            className="h-4 w-4"
                                          />
                                          <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                                            {item.text}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(entry.date), 'PP')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="pt-4">
          <div className="flex w-full gap-2">
            <Button 
              className={cn(
                "flex-1",
                goal.type === 'do' && "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
                goal.type === 'dont' && "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              )}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowEntryForm(true);
              }}
              disabled={isCompleted}
            >
              <FileText className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
            <Button 
              className={cn(
                "flex-1",
                isCompleted && "bg-green-600 hover:bg-green-700",
                !isCompleted && goal.type === 'do' && "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
                !isCompleted && goal.type === 'dont' && "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              )}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkComplete();
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isCompleted ? "Mark In Progress" : "Mark Complete"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DailyEntryForm
        isOpen={showEntryForm}
        onClose={() => setShowEntryForm(false)}
        goalId={goal.id}
        onSave={handleAddEntry}
      />
    </>
  );
}
