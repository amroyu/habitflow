import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Play, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PomodoroTimerProps {
  onRemove?: () => void;
  onEdit?: () => void;
  workDuration?: number;
  breakDuration?: number;
  longBreakDuration?: number;
  sessionsBeforeLongBreak?: number;
}

export const PomodoroTimer = ({ 
  onRemove, 
  onEdit,
  workDuration = 25,
  breakDuration = 5,
  longBreakDuration = 15,
  sessionsBeforeLongBreak = 4,
}: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsBreak(!isBreak);
      if (!isBreak) {
        setSessionCount((prev) => prev + 1);
        if (sessionCount + 1 >= sessionsBeforeLongBreak) {
          setTimeLeft(longBreakDuration * 60);
          setSessionCount(0);
        } else {
          setTimeLeft(breakDuration * 60);
        }
      } else {
        setTimeLeft(workDuration * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, sessionCount, workDuration, breakDuration, longBreakDuration, sessionsBeforeLongBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(workDuration * 60);
    setIsBreak(false);
    setIsRunning(false);
    setSessionCount(0);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const currentDuration = isBreak 
    ? (sessionCount >= sessionsBeforeLongBreak ? longBreakDuration : breakDuration)
    : workDuration;
  const progress = ((currentDuration * 60) - timeLeft) / (currentDuration * 60) * 100;

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Pomodoro Timer</h3>
          <p className="text-xs text-muted-foreground">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </p>
        </div>
      </div>

      <div className="text-center py-2">
        <span className="text-4xl font-semibold tabular-nums">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground pt-1.5">
          <span>Session {sessionCount + 1}</span>
          <span>Total: {sessionCount} completed</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTimer}
          >
            <Play className={isRunning ? "rotate-90" : ""} />
          </Button>
          <span>Next: {isBreak ? 'Focus Time' : 'Break'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-primary/10"
            onClick={onEdit}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
