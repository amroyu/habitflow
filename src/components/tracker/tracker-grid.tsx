"use client";

import { useState, useEffect } from 'react';
import { HabitCard } from "@/components/habits/habit-card";
import { GoalCard } from "@/components/goals/goal-card";
import { Goal } from '@/types';
import type { Habit } from '@/types';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrackerGridProps {
  view?: "grid" | "list";
  sortBy?: "recent" | "progress" | "streak";
  searchQuery?: string;
  habits: Habit[];
  goals: Goal[];
  onUpdateHabit?: (habit: Habit) => void;
  onUpdateGoal?: (goal: Goal) => void;
  onDeleteHabit?: (habitId: string) => void;
  onDeleteGoal?: (goalId: string) => void;
  onAddWidget?: (goalId: number, widget: any) => void;
  onRemoveWidget?: (goalId: number, widgetId: number) => void;
}

export function TrackerGrid({ 
  view = "grid",
  sortBy = "recent",
  searchQuery = "",
  habits,
  goals,
  onUpdateHabit,
  onUpdateGoal,
  onDeleteHabit,
  onDeleteGoal,
  onAddWidget,
  onRemoveWidget
}: TrackerGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter items based on search query
  const filteredHabits = habits.filter(habit => 
    habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (habit.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const filteredGoals = goals.filter(goal =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (goal.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // Sort items based on sortBy
  const sortedHabits = [...filteredHabits].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return (b.progress || 0) - (a.progress || 0);
      case "streak":
        return (b.streak?.current || 0) - (a.streak?.current || 0);
      case "recent":
      default:
        return new Date(b.lastCompleted || 0).getTime() - new Date(a.lastCompleted || 0).getTime();
    }
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return (b.progress || 0) - (a.progress || 0);
      case "streak":
        return (b.streak?.current || 0) - (a.streak?.current || 0);
      case "recent":
      default:
        return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
    }
  });

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-10">
      {/* Habits Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Habits</h2>
          <Badge variant="secondary" className="rounded-md px-2 py-0.5">
            {sortedHabits.length}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {sortedHabits.map((habit) => (
            <div key={habit.id} className="group">
              <div className="relative transition-all duration-200 hover:shadow-md">
                <HabitCard
                  {...habit}
                  onUpdateHabit={onUpdateHabit}
                  onDelete={onDeleteHabit}
                />
              </div>
            </div>
          ))}
          {sortedHabits.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No habits found
            </div>
          )}
        </div>
      </section>

      {/* Goals Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Goals</h2>
          <Badge variant="secondary" className="rounded-md px-2 py-0.5">
            {sortedGoals.length}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {sortedGoals.map((goal) => (
            <div key={goal.id} className="group">
              <div className="relative transition-all duration-200 hover:shadow-md">
                <GoalCard
                  goal={goal}
                  onUpdate={onUpdateGoal}
                  onDelete={onDeleteGoal}
                  onAddWidget={onAddWidget}
                  onRemoveWidget={onRemoveWidget}
                />
              </div>
            </div>
          ))}
          {sortedGoals.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No goals found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
