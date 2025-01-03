'use client';

import { useState, useEffect } from 'react';
import { TimerTask } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Filter,
  Trash2,
  Archive,
  MoreVertical,
  History,
  CalendarClock,
  Pencil,
  Undo,
  Circle,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { undoLastAction } from "@/lib/task-utils";

interface TasksSectionProps {
  tasks: TimerTask[];
  onUpdateTasks?: (tasks: TimerTask[]) => void;
}

export function TasksSection({ tasks, onUpdateTasks }: TasksSectionProps) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [view, setView] = useState<'current' | 'archived'>('current');
  const [editingTask, setEditingTask] = useState<TimerTask | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    duration: 0
  });
  const { toast } = useToast();

  const updateTasks = (newTasks: TimerTask[]) => {
    localStorage.setItem('timerTasks', JSON.stringify(newTasks));
    onUpdateTasks?.(newTasks);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const getProgress = (task: TimerTask) => {
    return ((task.duration - task.timeLeft) / task.duration) * 100;
  };

  const startTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          isRunning: true, 
          lastRunAt: new Date().toISOString() 
        };
      } else if (task.isRunning) {
        return { ...task, isRunning: false };
      }
      return task;
    });
    setActiveTaskId(taskId);
    updateTasks(updatedTasks);
  };

  const stopTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, isRunning: false } : task
    );
    setActiveTaskId(null);
    updateTasks(updatedTasks);
  };

  const resetTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, timeLeft: task.duration } : task
    );
    updateTasks(updatedTasks);
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed, isRunning: false } : t
    );
    updateTasks(updatedTasks);

    toast({
      title: task.completed ? "Task Uncompleted" : "Task Completed",
      description: `"${task.title}" has been ${task.completed ? 'marked as not done' : 'marked as done'}`,
    });
  };

  const archiveTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, archived: true } : task
    );
    updateTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    updateTasks(updatedTasks);
  };

  const startEditingTask = (task: TimerTask) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      duration: Math.floor(task.duration / 60)
    });
    setIsEditDialogOpen(true);
  };

  const saveTaskEdit = () => {
    if (editingTask) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              title: editForm.title,
              duration: editForm.duration * 60,
              timeLeft: editForm.duration * 60
            }
          : task
      );
      updateTasks(updatedTasks);
    }
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const unarchiveTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, archived: false } : task
    );
    updateTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (view === 'archived') return task.archived;
    if (!task.archived) {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    }
    return false;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed && !t.archived).length,
    completed: tasks.filter(t => t.completed && !t.archived).length,
    archived: tasks.filter(t => t.archived).length,
  };

  if (tasks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Tasks</h2>
            <p className="text-sm text-muted-foreground">
              No tasks yet. Create your first task to get started!
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tasks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first task to start tracking your time
            </p>
            <Button onClick={() => {
              const newTask: TimerTask = {
                id: String(Date.now()),
                title: "New Task",
                duration: 25 * 60, // 25 minutes in seconds
                timeLeft: 25 * 60,
                completed: false,
                isRunning: false,
                createdAt: new Date().toISOString(),
                lastRunAt: null,
                archived: false,
                source: 'manual'
              };
              updateTasks([newTask]);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tasks</h2>
            <p className="text-sm text-muted-foreground">
              {stats.total} tasks • {stats.active} active • {stats.completed} completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('active')}>
                  Active Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('completed')}>
                  Completed Tasks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newTask: TimerTask = {
                id: String(Date.now()),
                title: "New Task",
                duration: 25 * 60,
                timeLeft: 25 * 60,
                completed: false,
                isRunning: false,
                createdAt: new Date().toISOString(),
                lastRunAt: null,
                archived: false,
                source: 'manual'
              };
              updateTasks([...tasks, newTask]);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const undoneAction = undoLastAction();
              if (undoneAction) {
                toast({
                  title: "Action Undone",
                  description: `Undid ${undoneAction.type} action for task: ${undoneAction.task.title}`,
                });
              } else {
                toast({
                  title: "Nothing to Undo",
                  description: "No recent actions to undo",
                  variant: "default"
                });
              }
            }}
          >
            <Undo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Card className="w-full">
        <CardContent>
          <Tabs value={view} onValueChange={(v) => setView(v as 'current' | 'archived')}>
            <TabsList className="mb-4">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <div
                      key={task.id}
                      className={cn(
                        "group relative rounded-lg border bg-card transition-all",
                        task.completed && "bg-muted",
                        task.isRunning && "border-primary shadow-sm"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              task.completed ? "bg-green-500" : 
                              task.isRunning ? "bg-primary animate-pulse" : 
                              "bg-gray-300"
                            )} />
                            <h4 className={cn(
                              "font-medium",
                              task.completed && "text-muted-foreground line-through"
                            )}>
                              {task.title}
                            </h4>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => startEditingTask(task)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => archiveTask(task.id)}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteTask(task.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {formatTime(task.timeLeft)} remaining of {formatTime(task.duration)}
                            </div>
                            <div className="flex items-center gap-2">
                              <History className="h-4 w-4" />
                              Started {formatDate(task.createdAt)}
                            </div>
                          </div>

                          <Progress value={getProgress(task)} className="h-2" />

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarClock className="h-3 w-3" />
                              {task.lastRunAt ? `Last run ${formatDate(task.lastRunAt)}` : 'Not started'}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant={task.isRunning ? "destructive" : "secondary"}
                                size="sm"
                                onClick={() => task.isRunning ? stopTask(task.id) : startTask(task.id)}
                              >
                                {task.isRunning ? (
                                  <Square className="h-4 w-4 mr-2" />
                                ) : (
                                  <Play className="h-4 w-4 mr-2" />
                                )}
                                {task.isRunning ? 'Stop' : 'Start'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => resetTask(task.id)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => completeTask(task.id)}
                                className={task.completed ? "text-green-500" : ""}
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <Circle className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="archived">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <div
                      key={task.id}
                      className="group relative rounded-lg border bg-muted p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-muted-foreground">
                            {task.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(task.duration)} • Completed {task.completed ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => unarchiveTask(task.id)}
                          >
                            Unarchive
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>Task Title</label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <label>Duration (minutes)</label>
                <Input
                  type="number"
                  value={editForm.duration}
                  onChange={(e) => setEditForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  min={1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveTaskEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
