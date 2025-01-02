"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { HabitForm } from "@/components/habits/habit-form";
import { HabitCard } from "@/components/habits/habit-card";
import type { Habit } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function HabitsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("habits");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const { toast } = useToast();

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: Date.now(),
      title: habitData.title!,
      description: habitData.description || "",
      frequency: habitData.frequency!,
      type: habitData.type || "good",
      category: habitData.category,
      streak: 0,
      progress: 0,
      completedCount: 0,
      startDate: new Date().toISOString(),
      widgets: [],
    };

    setHabits((currentHabits) => {
      const updated = [...currentHabits, newHabit];
      localStorage.setItem("habits", JSON.stringify(updated));
      return updated;
    });

    setIsFormOpen(false);
    toast({
      title: "Habit Created",
      description: `Successfully created habit: ${newHabit.title}`,
    });
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits((currentHabits) => {
      const updated = currentHabits.map((h) =>
        h.id === updatedHabit.id ? updatedHabit : h
      );
      localStorage.setItem("habits", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    // Convert habitId to number since our IDs are stored as numbers
    const numericId = Number(habitId);
    const habitToDelete = habits.find((h) => h.id === numericId);
    if (!habitToDelete) return;

    setHabits((currentHabits) => {
      const updated = currentHabits.filter((h) => h.id !== numericId);
      localStorage.setItem("habits", JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Habit Deleted",
      description: `Successfully deleted habit: ${habitToDelete.title}`,
      variant: "destructive",
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Habits"
          description="Track and manage your daily habits"
        />
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => (
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
            startDate={habit.startDate}
            completedCount={habit.completedCount}
            target={habit.target}
            widgets={habit.widgets}
            category={habit.category || ""}
            onComplete={() => {
              const updatedHabit = {
                ...habit,
                completedCount: (habit.completedCount || 0) + 1,
                lastCompleted: new Date().toISOString(),
              };
              handleUpdateHabit(updatedHabit);
            }}
            onUpdateHabit={handleUpdateHabit}
            onDelete={handleDeleteHabit}
          />
        ))}
      </div>

      <HabitForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveHabit}
      />
    </div>
  );
}
