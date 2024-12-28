"use client";

import { Button } from "@/components/ui/button";
import { HabitCard } from "./habit-card";
import { useState } from 'react';
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
}

interface HabitListProps {
  habits?: Habit[];
  onAddHabit?: (habit: Habit) => void;
  onUpdateHabit?: (habit: Habit[]) => void;
}

export default function HabitList({ habits = INITIAL_HABITS, onAddHabit, onUpdateHabit }: HabitListProps) {
  const { addPoints, checkAchievements } = useRewards()

  const handleComplete = async (id: number) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const updatedHabits = habits.map(h => 
      h.id === id 
        ? { 
            ...h, 
            completedCount: (h.completedCount || 0) + 1,
            lastCompleted: new Date().toISOString()
          }
        : h
    );

    if (onUpdateHabit) {
      onUpdateHabit(updatedHabits);
      addPoints(POINTS.COMPLETE_HABIT, 'Completed habit: ' + habit.title);
      checkAchievements();
    }
  }

  const handleUpdateHabit = (id: number, widgets: any[]) => {
    const updatedHabits = habits.map(h => 
      h.id === id 
        ? { ...h, widgets }
        : h
    );
    
    if (onUpdateHabit) {
      onUpdateHabit(updatedHabits);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          {...habit}
          onComplete={() => handleComplete(habit.id)}
          onUpdateHabit={handleUpdateHabit}
        />
      ))}
    </div>
  );
}
