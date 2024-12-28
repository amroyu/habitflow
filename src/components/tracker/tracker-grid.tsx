"use client";

import { useState } from 'react';
import { HabitCard } from "@/components/habits/habit-card";
import { GoalCard } from "@/components/goals/goal-card";
import { mockHabits, mockGoals } from '@/lib/mock-data';
import { Goal } from '@/types';
import type { MockHabit } from '@/lib/mock-data';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrackerGridProps {
  view?: "grid" | "list";
  sortBy?: "recent" | "progress" | "streak";
  searchQuery?: string;
}

export function TrackerGrid({ 
  view = "grid",
  sortBy = "recent",
  searchQuery = ""
}: TrackerGridProps) {
  const [habits] = useState<MockHabit[]>(mockHabits);
  const [goals] = useState<Goal[]>(mockGoals);

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
        <div className={cn(
          "grid gap-6",
          view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {sortedHabits.map((habit) => (
            <div key={habit.id} className="group">
              <div className="relative transition-all duration-200 hover:shadow-md">
                <Badge 
                  className="absolute -top-2 -right-2 z-10 shadow-sm" 
                  variant={habit.type === 'good' ? 'default' : 'destructive'}
                >
                  {habit.type === 'good' ? 'Build' : 'Break'}
                </Badge>
                <HabitCard
                  title={habit.title}
                  description={habit.description || ""}
                  frequency={habit.frequency}
                  type={habit.type}
                  streak={habit.streak}
                  progress={habit.progress}
                  lastCompleted={habit.lastCompleted}
                  onComplete={() => {}}
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
        <div className={cn(
          "grid gap-6",
          view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {sortedGoals.map((goal) => (
            <div key={goal.id} className="group">
              <div className="relative transition-all duration-200 hover:shadow-md">
                <Badge 
                  className="absolute -top-2 -right-2 z-10 shadow-sm" 
                  variant={goal.type === 'do' ? 'default' : 'destructive'}
                >
                  {goal.type === 'do' ? 'Achieve' : 'Avoid'}
                </Badge>
                <GoalCard
                  goal={goal}
                  onUpdateGoal={() => {}}
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
