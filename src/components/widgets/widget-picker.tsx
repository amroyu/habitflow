'use client';

import { useState } from 'react';
import type { Widget, WidgetType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Timer, Hash, StickyNote, CheckSquare, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface WidgetPickerProps {
  onSelect: (type: WidgetType) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

const widgetTypes: { 
  type: WidgetType; 
  icon: React.ReactNode; 
  label: string;
  description: string;
  color: string;
}[] = [
  { 
    type: 'pomodoro-timer', 
    icon: <Timer className="h-6 w-6" />, 
    label: 'Pomodoro Timer',
    description: 'Focus timer with work and break intervals',
    color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
  },
  { 
    type: 'counter', 
    icon: <Hash className="h-6 w-6" />, 
    label: 'Counter',
    description: 'Track numbers and counts',
    color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
  },
  { 
    type: 'notes', 
    icon: <StickyNote className="h-6 w-6" />, 
    label: 'Notes',
    description: 'Quick notes and reminders',
    color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
  },
  { 
    type: 'checklist', 
    icon: <CheckSquare className="h-6 w-6" />, 
    label: 'Checklist',
    description: 'Track subtasks and to-dos',
    color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
  },
  { 
    type: 'progress-chart', 
    icon: <LineChart className="h-6 w-6" />, 
    label: 'Progress Chart',
    description: 'Visualize your progress',
    color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
  },
];

export function WidgetPicker({ onSelect, onOpenChange, open }: WidgetPickerProps) {
  const [selectedType, setSelectedType] = useState<WidgetType | null>(null);

  const handleSelect = (type: WidgetType) => {
    setSelectedType(type);
    onSelect(type);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Widget</DialogTitle>
          <DialogDescription>
            Choose a widget to add to your habit or goal. Each widget helps you track different aspects of your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <AnimatePresence>
            {widgetTypes.map(({ type, icon, label, description, color }) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-auto p-4 flex flex-col items-center gap-3',
                    'hover:shadow-md transition-all duration-200',
                    'group relative overflow-hidden',
                    selectedType === type && 'ring-2 ring-primary'
                  )}
                  onClick={() => handleSelect(type)}
                >
                  <div className={cn('p-3 rounded-lg', color)}>{icon}</div>
                  <div className="text-center">
                    <h3 className="font-medium">{label}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
