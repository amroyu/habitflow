"use client";

import { Button } from "@/components/ui/button";
import { HabitCard } from "./habit-card";
import { useState, useEffect } from 'react';
import { useRewards } from '@/context/rewards-context'
import { POINTS } from '@/types/rewards'

const INITIAL_HABITS: Habit[] = [
  {
    id: 1,
    title: 'Morning Exercise',
    description: 'Start the day with a 30-minute workout',
    frequency: 'Daily',
    type: 'good',
    streak: 5,
    progress: 75,
    lastCompleted: new Date().toISOString(),
    completedCount: 0,
    widgets: []
  },
  {
    id: 2,
    title: 'Read Books',
    description: 'Read for at least 30 minutes',
    frequency: 'Daily',
    type: 'good',
    streak: 3,
    progress: 60,
    lastCompleted: new Date().toISOString(),
    completedCount: 0,
    widgets: []
  },
  {
    id: 3,
    title: 'Late Night Snacking',
    description: 'Avoid eating after 9 PM',
    frequency: 'Daily',
    type: 'bad',
    streak: 2,
    progress: 40,
    lastCompleted: new Date().toISOString(),
    completedCount: 0,
    widgets: []
  },
  {
    id: 4,
    title: 'Procrastination',
    description: 'Putting off important tasks',
    frequency: 'Daily',
    type: 'bad',
    streak: 0,
    progress: 25,
    lastCompleted: new Date().toISOString(),
    completedCount: 0,
    widgets: []
  }
];

export interface Habit {
  id: number;
  title: string;
  description: string;
  frequency: string;
  type: 'good' | 'bad';
  streak: number;
  progress: number;
  lastCompleted: string;
  completedCount: number;
  widgets: any[];
  category?: string;
}

interface HabitListProps {
  habits?: Habit[];
  onAddHabit?: (habit: Habit) => void;
  onUpdateHabit?: (habits: Habit[]) => void;
  onDeleteHabit?: (habitId: string) => void;
}

export default function HabitList({ 
  habits = INITIAL_HABITS, 
  onAddHabit, 
  onUpdateHabit,
  onDeleteHabit 
}: HabitListProps) {
  const { addPoints } = useRewards();
  const [localHabits, setLocalHabits] = useState(habits);

  useEffect(() => {
    setLocalHabits(habits);
  }, [habits]);

  const handleComplete = (habitId: number) => {
    const updatedHabits = localHabits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          completedCount: (habit.completedCount || 0) + 1,
          lastCompleted: new Date().toISOString()
        };
      }
      return habit;
    });

    setLocalHabits(updatedHabits);
    onUpdateHabit?.(updatedHabits);
    addPoints(POINTS.COMPLETE_HABIT);
  };

  const handleDelete = (habitId: string) => {
    onDeleteHabit?.(habitId);
  };

  return (
    <div className="space-y-4">
      {localHabits.map((habit) => (
        <HabitCard
          key={habit.id}
          id={String(habit.id)}
          title={habit.title}
          description={habit.description}
          frequency={habit.frequency}
          type={habit.type}
          streak={habit.streak}
          progress={habit.progress}
          lastCompleted={habit.lastCompleted}
          completedCount={habit.completedCount}
          widgets={habit.widgets}
          category={habit.category || ''}
          onComplete={() => handleComplete(habit.id)}
          onUpdateHabit={(updatedHabit) => {
            const updatedHabits = localHabits.map(h => 
              h.id === habit.id ? { ...updatedHabit, id: habit.id } : h
            );
            setLocalHabits(updatedHabits);
            onUpdateHabit?.(updatedHabits);
          }}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
