'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Play,
  RotateCcw,
  Volume2,
  Bell,
  X,
  Split,
  Plus,
  Check,
  Timer as TimerIcon,
  ListTodo,
  Pencil,
  Clock,
  Save,
  Square,
  BookmarkPlus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Goal, Target, TimerTask } from '@/types'
import { useToast } from '@/components/ui/use-toast'

interface QuickTimerProps {
  onClose: () => void
}

interface Split {
  time: number
  label: string
}

interface Task {
  id: string
  title: string
  completed: boolean
  duration: number
  timeLeft?: number
  editing?: boolean
  isRunning?: boolean
}

export function QuickTimer({ onClose }: QuickTimerProps) {
  const { toast } = useToast()
  const [duration, setDuration] = useState(25 * 60)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [sound, setSound] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [splits, setSplits] = useState<Split[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [newTaskDuration, setNewTaskDuration] = useState(25)
  const [showTasks, setShowTasks] = useState(false)
  const [intervalMode, setIntervalMode] = useState(false)
  const [intervals, setIntervals] = useState(1)
  const [currentInterval, setCurrentInterval] = useState(1)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout>()
  const audioRef = useRef<HTMLAudioElement>()

  const presetTimes = [
    { label: '5m', value: 5 * 60 },
    { label: '15m', value: 15 * 60 },
    { label: '25m', value: 25 * 60 },
    { label: '45m', value: 45 * 60 },
    { label: '60m', value: 60 * 60 },
  ]

  useEffect(() => {
    audioRef.current = new Audio('/sounds/timer-end.mp3')
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleIntervalComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])

  const handleIntervalComplete = () => {
    if (intervalMode && currentInterval < intervals) {
      setCurrentInterval(prev => prev + 1)
      setTimeLeft(duration)
      playSound()
      showNotification('Interval Complete', `Starting interval ${currentInterval + 1} of ${intervals}`)
    } else {
      handleTimerComplete()
    }
  }

  const handleTimerComplete = () => {
    setIsRunning(false)
    if (activeTaskId) {
      setTasks(tasks.map(t =>
        t.id === activeTaskId ? { ...t, isRunning: false, timeLeft: 0 } : t
      ))
      setActiveTaskId(null)
    }
    if (timerRef.current) clearInterval(timerRef.current)
    playSound()
    showNotification('Timer Complete!', 'Your focus session has ended.')
    if (intervalMode) {
      setCurrentInterval(1)
    }
  }

  const playSound = () => {
    if (sound && audioRef.current) {
      audioRef.current.play()
    }
  }

  const showNotification = (title: string, body: string) => {
    if (notifications) {
      new Notification(title, {
        body,
        icon: '/logos/icon-light.svg'
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(duration)
    }
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(duration)
    setSplits([])
    setCurrentInterval(1)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleSplit = () => {
    const splitTime = duration - timeLeft
    const splitNumber = splits.length + 1
    setSplits([...splits, { 
      time: splitTime,
      label: `Split ${splitNumber}`
    }])
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    setTimeLeft(newDuration)
    setIsRunning(false)
    setSplits([])
    setCurrentInterval(1)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask.trim(),
        completed: false,
        duration: newTaskDuration * 60,
        timeLeft: newTaskDuration * 60
      }])
      setNewTask('')
      setNewTaskDuration(25)
    }
  }

  const startTaskTimer = (taskId: string) => {
    // Stop any currently running task
    if (activeTaskId && activeTaskId !== taskId) {
      setTasks(tasks.map(t => 
        t.id === activeTaskId ? { ...t, isRunning: false, timeLeft: timeLeft } : t
      ))
    }

    const task = tasks.find(t => t.id === taskId)
    if (task) {
      if (task.isRunning) {
        // Stop the timer and save current time
        setIsRunning(false)
        setActiveTaskId(null)
        setTasks(tasks.map(t =>
          t.id === taskId ? { ...t, isRunning: false, timeLeft: timeLeft } : t
        ))
      } else {
        // Start the timer with saved time or initial duration
        const startTime = task.timeLeft || task.duration
        setDuration(task.duration)
        setTimeLeft(startTime)
        setIsRunning(true)
        setActiveTaskId(taskId)
        setTasks(tasks.map(t =>
          t.id === taskId ? { ...t, isRunning: true } : t
        ))
      }
    }
  }

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const startEditingTask = (taskId: string) => {
    setEditingTask(taskId)
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, editing: true } : task
    ))
  }

  const saveTaskEdit = (taskId: string, newTitle: string, newDuration: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            title: newTitle.trim() || task.title,
            duration: newDuration * 60,
            editing: false
          }
        : task
    ))
    setEditingTask(null)
  }

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const resetTaskTimer = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, timeLeft: t.duration } : t
    ))
    if (activeTaskId === taskId) {
      setTimeLeft(tasks.find(t => t.id === taskId)?.duration || 0)
    }
  }

  const formatMinutes = (seconds: number) => Math.floor(seconds / 60)

  const saveTask = (task: Task) => {
    const savedTasks = localStorage.getItem('timerTasks')
    const currentTasks: TimerTask[] = savedTasks ? JSON.parse(savedTasks) : []
    
    const newTask: TimerTask = {
      id: task.id,
      title: task.title,
      duration: task.duration,
      timeLeft: task.timeLeft || task.duration,
      completed: task.completed,
      isRunning: task.isRunning || false,
      createdAt: new Date().toISOString(),
    }

    const updatedTasks = [...currentTasks, newTask]
    localStorage.setItem('timerTasks', JSON.stringify(updatedTasks))
    
    toast({
      title: "Task Saved",
      description: `Successfully saved "${task.title}" to your tasks`,
    })
  }

  useEffect(() => {
    if (notifications) {
      Notification.requestPermission()
    }
  }, [notifications])

  return (
    <div className="w-full max-w-sm bg-background rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <TimerIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-medium">Quick Timer</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowTasks(!showTasks)}
          >
            <ListTodo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative mb-6">
        <div className="w-full h-2 bg-muted rounded-full mb-4">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(timeLeft / duration) * 100}%` }}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-mono tracking-wider">
            {formatTime(timeLeft)}
          </span>
          {intervalMode && (
            <span className="text-sm text-muted-foreground">
              Interval {currentInterval} of {intervals}
            </span>
          )}
        </div>
      </div>

      {/* Tasks Panel */}
      {showTasks && (
        <div className="mb-6 border rounded-lg p-3">
          <div className="space-y-3 mb-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add a task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="h-8"
              />
              <div className="flex items-center gap-2 min-w-[100px]">
                <Input
                  type="number"
                  value={newTaskDuration}
                  onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                  className="h-8 w-16"
                  min={1}
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addTask}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 group"
              >
                {editingTask === task.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={task.title}
                      onChange={(e) => setTasks(tasks.map(t =>
                        t.id === task.id ? { ...t, title: e.target.value } : t
                      ))}
                      className="h-8"
                      autoFocus
                    />
                    <Input
                      type="number"
                      value={formatMinutes(task.duration)}
                      onChange={(e) => setTasks(tasks.map(t =>
                        t.id === task.id ? { ...t, duration: Number(e.target.value) * 60 } : t
                      ))}
                      className="h-8 w-16"
                      min={1}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => saveTaskEdit(task.id, task.title, formatMinutes(task.duration))}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <span className={cn(
                      "text-sm flex-1",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        {formatMinutes(task.timeLeft ?? task.duration)}m
                      </span>
                      <Button
                        variant={task.isRunning ? "destructive" : "ghost"}
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => startTaskTimer(task.id)}
                      >
                        {task.isRunning ? (
                          <Square className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => resetTaskTimer(task.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => startEditingTask(task.id)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeTask(task.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => saveTask(task)}
                      >
                        <BookmarkPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Splits Display */}
      {splits.length > 0 && (
        <div className="mb-6 max-h-[120px] overflow-y-auto rounded-md border bg-muted/50 p-2">
          {splits.map((split, index) => (
            <div key={index} className="flex justify-between items-center py-1 px-2 text-sm">
              <span className="text-muted-foreground">{split.label}</span>
              <span className="font-mono">{formatTime(split.time)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Timer Settings */}
      <div className="space-y-4 mb-6">
        {/* Preset Times */}
        <div className="grid grid-cols-5 gap-2">
          {presetTimes.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleDurationChange(preset.value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                duration === preset.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Duration & Intervals */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs mb-2 block">Duration</Label>
            <Slider
              value={[duration]}
              min={60}
              max={7200}
              step={60}
              onValueChange={(values) => handleDurationChange(values[0])}
              className="mb-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1m</span>
              <span>2h</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={intervalMode}
                onCheckedChange={setIntervalMode}
                id="interval-mode"
              />
              <Label htmlFor="interval-mode" className="text-sm">Intervals</Label>
            </div>
            {intervalMode && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIntervals(Math.max(1, intervals - 1))}
                >
                  -
                </Button>
                <span className="text-sm w-4 text-center">{intervals}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIntervals(intervals + 1)}
                >
                  +
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          className={cn(
            'w-32 h-10',
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
          )}
          onClick={handleStart}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={handleSplit}
          disabled={!isRunning || timeLeft === duration}
        >
          <Split className="h-4 w-4" />
        </Button>
      </div>

      {/* Settings */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="sound" className="text-sm">Sound</Label>
          </div>
          <Switch
            id="sound"
            checked={sound}
            onCheckedChange={setSound}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="notifications" className="text-sm">Notifications</Label>
          </div>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
      </div>
    </div>
  )
}
