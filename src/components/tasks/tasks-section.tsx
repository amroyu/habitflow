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
  Circle
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

export function TasksSection() {
  const [tasks, setTasks] = useState<TimerTask[]>([]);
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

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem('timerTasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          setTasks(parsedTasks);
        } catch (error) {
          console.error('Error parsing tasks:', error);
        }
      }
    };

    loadTasks();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'timerTasks') {
        loadTasks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('taskAdded', loadTasks);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('taskAdded', loadTasks);
    };
  }, []);

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
    setTasks(tasks.map(task => {
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
    }));
    setActiveTaskId(taskId);
    localStorage.setItem('timerTasks', JSON.stringify(tasks));
  };

  const stopTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isRunning: false } : task
    ));
    setActiveTaskId(null);
    localStorage.setItem('timerTasks', JSON.stringify(tasks));
  };

  const resetTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, timeLeft: task.duration } : task
    ));
    localStorage.setItem('timerTasks', JSON.stringify(tasks));
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed, isRunning: false } : t
    ));
    localStorage.setItem('timerTasks', JSON.stringify(tasks));

    toast({
      title: task.completed ? "Task Uncompleted" : "Task Completed",
      description: `"${task.title}" has been ${task.completed ? 'marked as not done' : 'marked as done'}`,
    });
  };

  const archiveTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, archived: true } : task
    ));
    localStorage.setItem('timerTasks', JSON.stringify(tasks));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    localStorage.setItem('timerTasks', JSON.stringify(tasks));
  };

  const startEditingTask = (task: TimerTask) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      duration: Math.floor(task.duration / 60) // Convert seconds to minutes for editing
    });
    setIsEditDialogOpen(true);
  };

  const saveTaskEdit = () => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              title: editForm.title,
              duration: editForm.duration * 60, // Convert minutes back to seconds
              timeLeft: editForm.duration * 60 // Reset timeLeft to new duration
            }
          : task
      ));
      localStorage.setItem('timerTasks', JSON.stringify(tasks));
    }
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const unarchiveTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, archived: false } : task
    ));
    localStorage.setItem('timerTasks', JSON.stringify(tasks));
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
    return null;
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
