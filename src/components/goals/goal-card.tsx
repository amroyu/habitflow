'use client';

import { useState } from 'react';
import type { Goal, Widget, WidgetType, WidgetSettings } from '@/types';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, Plus, CheckCircle2, Edit2, Trash2, FileText, ChevronDown, ChevronUp, X, CalendarDays, Flag, Layout, RotateCcw, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { DailyEntryForm } from "./daily-entry-form";
import { motion, AnimatePresence } from "framer-motion";
import { StreakCounter } from "./streak-counter";
import { PomodoroTimer } from '@/components/widgets/pomodoro-timer';
import { Counter } from '@/components/widgets/counter';
import { Notes } from '@/components/widgets/notes';
import { Checklist } from '@/components/widgets/checklist';
import { ProgressChart } from '@/components/widgets/progress-chart';
import { WidgetPicker } from '@/components/widgets/widget-picker';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { WidgetSettingsDialog } from "@/components/widgets/widget-settings-dialog";
import { GoalEditDialog } from './goal-edit-dialog';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

interface GoalCardProps {
  goal: Goal;
  onUpdate?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onAddWidget?: (goalId: string, widget: Widget) => void;
  onRemoveWidget?: (goalId: string, widgetId: string) => void;
  onUpdateWidget?: (goalId: string, widgetId: string, settings: WidgetSettings) => void;
}

export function GoalCard({ goal, onUpdate, onDelete, onAddWidget, onRemoveWidget, onUpdateWidget }: GoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const daysRemaining = differenceInDays(new Date(goal.endDate), new Date());
  const completedTargets = goal.targets.filter(t => t.completed).length;
  const progress = goal.targets.length > 0 
    ? Math.min(Math.round((completedTargets / goal.targets.length) * 100), 100)
    : 0;
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
    if (onAddWidget) {
      const newWidget: Widget = {
        id: String(Date.now()),
        type,
        settings: {}
      };
      onAddWidget(goal.id, newWidget);
    }
    setShowWidgetPicker(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (onRemoveWidget) {
      onRemoveWidget(goal.id, widgetId);
    }
  };

  const handleEditWidget = (widgetId: string) => {
    const widget = goal.widgets?.find(w => w.id === widgetId);
    if (widget) {
      setEditingWidget(widget);
    }
  };

  const handleSaveWidgetSettings = (settings: WidgetSettings) => {
    if (editingWidget && onUpdateWidget) {
      onUpdateWidget(goal.id, editingWidget.id, settings);
    }
    setEditingWidget(null);
  };

  const handleToggleTarget = (targetId: string) => {
    if (onUpdate) {
      const updatedGoal: Goal = {
        ...goal,
        targets: goal.targets.map(target =>
          target.id === targetId
            ? { ...target, completed: !target.completed }
            : target
        )
      };
      onUpdate(updatedGoal);
    }
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'pomodoro-timer':
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
      case 'counter':
        return (
          <Counter 
            key={widget.id}
            initialValue={widget.settings?.initialValue}
            increment={widget.settings?.increment}
            target={widget.settings?.target}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      case 'notes':
        return (
          <Notes 
            key={widget.id}
            text={widget.settings?.text}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      case 'checklist':
        return (
          <Checklist 
            key={widget.id}
            items={widget.settings?.items}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      case 'progress-chart':
        return (
          <ProgressChart 
            key={widget.id}
            data={widget.settings?.data}
            onRemove={() => handleRemoveWidget(widget.id)}
            onEdit={() => handleEditWidget(widget.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "group relative overflow-hidden transition-all duration-200",
          isCompleted 
            ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
            : goal.type === 'dont'
              ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] border-destructive/40"
              : "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]",
          isExpanded && "shadow-lg"
        )}
      >
        {/* Status indicator line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
          isCompleted 
            ? "bg-gradient-to-r from-green-500 to-emerald-500" 
            : goal.type === 'dont'
              ? "bg-gradient-to-r from-red-500 to-rose-500"
              : "bg-gradient-to-r from-green-500 to-emerald-500"
        )} />

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
                    isCompleted 
                      ? "text-green-700 dark:text-green-400" 
                      : goal.type === 'dont'
                        ? "text-red-700 dark:text-red-400"
                        : "text-green-700 dark:text-green-400"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  {goal.title}
                </motion.h3>
                <Badge 
                  variant={goal.type === 'dont' ? 'destructive' : 'default'}
                  className="animate-in fade-in duration-500"
                >
                  {goal.type === 'dont' ? "Don't" : 'Do'}
                </Badge>
                <Badge 
                  variant={isCompleted ? "default" : "outline"}
                  className="animate-in fade-in duration-500"
                >
                  {goal.status}
                </Badge>
              </div>
              {goal.description && (
                <motion.p 
                  className={cn(
                    "text-sm",
                    isCompleted 
                      ? "text-green-600/80 dark:text-green-400/80" 
                      : goal.type === 'dont'
                        ? "text-red-600/80 dark:text-red-400/80"
                        : "text-green-600/80 dark:text-green-400/80"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {goal.description}
                </motion.p>
              )}
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CalendarDays className="h-4 w-4" />
                <span>{format(new Date(goal.endDate), 'PP')}</span>
                {goal.category && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                  </>
                )}
              </motion.div>
            </div>
            <div className="flex gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 flex items-center gap-1.5 px-2.5 rounded-full transition-colors",
                    isCompleted 
                      ? "hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400" 
                      : goal.type === 'dont'
                        ? "hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400"
                        : "hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400"
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
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 flex items-center gap-1.5 px-2.5 rounded-full transition-colors",
                    isCompleted 
                      ? "hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400" 
                      : goal.type === 'dont'
                        ? "hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400"
                        : "hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400"
                  )}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </motion.div>
                  <span className="text-sm">{isExpanded ? 'Less' : 'More'}</span>
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
                    isCompleted 
                      ? "[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500" 
                      : goal.type === 'dont'
                        ? "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-rose-500"
                        : "[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500"
                  )} 
                />
              </motion.div>
            </div>

            {/* Milestones Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Milestones
              </h4>
              <div className="space-y-2">
                {goal.milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-2"
                  >
                    <Checkbox
                      checked={milestone.completed}
                      onCheckedChange={() => {
                        const updatedMilestones = [...goal.milestones];
                        updatedMilestones[index] = {
                          ...milestone,
                          completed: !milestone.completed,
                        };
                        onUpdate?.({
                          ...goal,
                          milestones: updatedMilestones,
                        });
                      }}
                      className={cn(
                        isCompleted 
                          ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" 
                          : goal.type === 'dont'
                            ? "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                            : "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      )}
                    />
                    <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {milestone.title}
                    </label>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0 space-y-4">
                    {/* Daily Entry Form */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Daily Progress</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => setShowEntryForm(!showEntryForm)}
                        >
                          {showEntryForm ? (
                            <X className="h-4 w-4 mr-2" />
                          ) : (
                            <Plus className="h-4 w-4 mr-2" />
                          )}
                          {showEntryForm ? 'Cancel' : 'Add Entry'}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showEntryForm && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <DailyEntryForm onSubmit={handleAddEntry} onCancel={() => setShowEntryForm(false)} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Recent Entries */}
                      {goal.entries && goal.entries.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Recent Entries</h4>
                          <div className="space-y-2">
                            {goal.entries.slice(-3).map((entry, index) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {format(new Date(entry.date), 'MMM d, yyyy')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {entry.value} {entry.notes && '•'} 
                                  </span>
                                  {entry.notes && (
                                    <span className="text-sm text-muted-foreground">
                                      {entry.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Targets Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Targets</h3>
                      <div className="space-y-2">
                        {goal.targets.map((target) => (
                          <div
                            key={target.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={target.completed}
                                onCheckedChange={() => handleToggleTarget(target.id)}
                              />
                              <span className="text-sm">{target.description}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {target.value} {target.unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Widgets Section */}
                    {goal.widgets && goal.widgets.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Widgets</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowWidgetPicker(!showWidgetPicker)}
                          >
                            {showWidgetPicker ? (
                              <>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Widget
                              </>
                            )}
                          </Button>
                        </div>

                        <AnimatePresence>
                          {showWidgetPicker && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <WidgetPicker onSelect={handleAddWidget} />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 gap-4">
                          {goal.widgets.map((widget, index) => (
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
                      </div>
                    )}

                    {editingWidget && (
                      <WidgetSettingsDialog
                        widget={editingWidget}
                        open={true}
                        onOpenChange={(open) => !open && setEditingWidget(null)}
                        onSave={handleSaveWidgetSettings}
                      />
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>

        <CardFooter className="pt-6">
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleMarkComplete}
              disabled={isCompleted}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-none"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-none text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>

        <WidgetPicker
          open={showWidgetPicker}
          onOpenChange={setShowWidgetPicker}
          onSelect={handleAddWidget}
        />
        
        <GoalEditDialog
          goal={goal}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={onUpdate}
        />

        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => {
            onDelete?.(goal.id);
            setShowDeleteDialog(false);
          }}
          title={goal.title}
        />
      </Card>
    </motion.div>
  );
};
