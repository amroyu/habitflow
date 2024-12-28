'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface PomodoroProps {
  className?: string;
  onRemove?: () => void;
  workDuration?: number; // in seconds
  breakDuration?: number; // in seconds
  longBreakDuration?: number; // in seconds
  sessionsBeforeLongBreak?: number;
}

type PomodoroState = 'work' | 'break' | 'longBreak';

export function Pomodoro({
  className,
  onRemove,
  workDuration = 25 * 60,
  breakDuration = 5 * 60,
  longBreakDuration = 15 * 60,
  sessionsBeforeLongBreak = 4,
}: PomodoroProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [sessions, setSessions] = useState(0);
  const [state, setState] = useState<PomodoroState>('work');
  const { toast } = useToast();

  const currentDuration = state === 'work' 
    ? workDuration 
    : state === 'break' 
      ? breakDuration 
      : longBreakDuration;

  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextSession = useCallback(() => {
    if (state === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      
      if (newSessions % sessionsBeforeLongBreak === 0) {
        setState('longBreak');
        setTimeLeft(longBreakDuration);
        toast({
          title: "Time for a long break!",
          description: "Great job! Take a well-deserved long break.",
        });
      } else {
        setState('break');
        setTimeLeft(breakDuration);
        toast({
          title: "Break time!",
          description: "Take a short break to recharge.",
        });
      }
    } else {
      setState('work');
      setTimeLeft(workDuration);
      toast({
        title: "Back to work!",
        description: "Let's focus and get things done.",
      });
    }
  }, [state, sessions, sessionsBeforeLongBreak, breakDuration, longBreakDuration, workDuration, toast]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      nextSession();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, nextSession]);

  const handleReset = () => {
    setIsRunning(false);
    setState('work');
    setTimeLeft(workDuration);
    setSessions(0);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Pomodoro Timer</h3>
          <p className="text-xs text-muted-foreground">
            {state === 'work' ? 'Focus Time' : state === 'break' ? 'Short Break' : 'Long Break'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{formatTime(timeLeft)}</span>
          <span className="text-muted-foreground">Session {sessions + 1}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Coffee className="mr-1 h-3 w-3" />
          {state === 'work' ? 'Next: Break' : 'Next: Focus'}
        </div>
        <span>Total: {sessions} completed</span>
      </div>
    </div>
  );
}
