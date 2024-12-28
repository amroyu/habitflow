'use client';

import { useState } from 'react';
import { Widget, WidgetType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Timer, Hash, StickyNote, CheckSquare, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WidgetPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWidget: (type: WidgetType) => void;
}

const WIDGETS = [
  {
    type: 'pomodoro' as WidgetType,
    icon: Timer,
    label: 'Pomodoro Timer',
    description: 'Track focused work sessions with breaks',
  },
  {
    type: 'counter' as WidgetType,
    icon: Hash,
    label: 'Counter',
    description: 'Count repetitions or track numbers',
  },
  {
    type: 'notes' as WidgetType,
    icon: StickyNote,
    label: 'Notes',
    description: 'Keep quick notes and reminders',
  },
  {
    type: 'checklist' as WidgetType,
    icon: CheckSquare,
    label: 'Checklist',
    description: 'Create a list of subtasks',
  },
  {
    type: 'progress-chart' as WidgetType,
    icon: LineChart,
    label: 'Progress Chart',
    description: 'Visualize your progress over time',
  },
];

export function WidgetPicker({ open, onOpenChange, onSelectWidget }: WidgetPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: WidgetType) => {
    const widget: Omit<Widget, 'id'> = {
      type,
      settings: {
        duration: type === 'countdown' ? 300 : undefined,
        autoStart: false,
        pomodoroSettings: type === 'pomodoro' ? {
          workDuration: 1500, // 25 minutes
          breakDuration: 300, // 5 minutes
          longBreakDuration: 900, // 15 minutes
          sessionsBeforeLongBreak: 4,
        } : undefined,
        counterSettings: type === 'counter' ? {
          value: 0,
          increment: 1,
        } : undefined,
        notes: type === 'notes' ? [] : undefined,
        checklist: type === 'checklist' ? {
          items: [],
        } : undefined,
        chartData: type === 'progress-chart' ? {
          labels: [],
          values: [],
        } : undefined,
      },
    };
    onSelectWidget(widget.type);
    setIsOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a Widget</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {WIDGETS.map((widget) => (
            <button
              key={widget.type}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-muted",
                "hover:border-primary transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              onClick={() => {
                handleSelect(widget.type);
              }}
            >
              <widget.icon className="h-6 w-6" />
              <span className="mt-2 text-sm font-medium">{widget.label}</span>
              <p className="mt-1 text-xs text-muted-foreground text-center">
                {widget.description}
              </p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
