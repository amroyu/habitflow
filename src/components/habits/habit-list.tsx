"use client";

import { Button } from "@/components/ui/button";
import { HabitCard } from "./habit-card";
import { useState } from 'react';

const INITIAL_HABITS = [
  {
    id: 1,
    title: 'Morning Exercise',
    description: 'Start the day with a 30-minute workout',
    frequency: 'Daily',
    type: 'good' as const,
    streak: 5,
    progress: 75,
    lastCompleted: new Date(),
  },
  {
    id: 2,
    title: 'Read Books',
    description: 'Read for at least 30 minutes',
    frequency: 'Daily',
    type: 'good' as const,
    streak: 3,
    progress: 60,
    lastCompleted: new Date(),
  },
  {
    id: 3,
    title: 'Late Night Snacking',
    description: 'Avoid eating after 9 PM',
    frequency: 'Daily',
    type: 'bad' as const,
    streak: 2,
    progress: 40,
    lastCompleted: new Date(),
  },
  {
    id: 4,
    title: 'Procrastination',
    description: 'Putting off important tasks',
    frequency: 'Daily',
    type: 'bad' as const,
    streak: 0,
    progress: 25,
    lastCompleted: new Date(),
  }
];

export type Habit = typeof INITIAL_HABITS[0];

interface HabitListProps {
  habits?: Habit[];
  onAddHabit?: (habit: Habit) => void;
}

export default function HabitList({ habits = INITIAL_HABITS, onAddHabit }: HabitListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          title={habit.title}
          description={habit.description}
          frequency={habit.frequency}
          type={habit.type}
          streak={habit.streak}
          progress={habit.progress}
          lastCompleted={habit.lastCompleted}
          onComplete={() => console.log('Completed:', habit.title)}
        />
      ))}
    </div>
  );
}
