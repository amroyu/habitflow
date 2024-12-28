'use client';

import { PageHeader } from '@/components/page-header'
import HabitList from '@/components/habits/habit-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { HabitForm } from '@/components/habits/habit-form'
import type { Habit } from '@/types'
import { useToast } from '@/components/ui/use-toast'

export default function HabitsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('habits');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const { toast } = useToast();

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: Date.now(),
      title: habitData.title!,
      description: habitData.description || '',
      frequency: habitData.frequency!,
      type: habitData.type || 'good',
      category: habitData.category,
      streak: 0,
      progress: 0,
      completedCount: 0,
      startDate: new Date().toISOString(),
      widgets: [],
    };

    setHabits(currentHabits => {
      const updated = [...currentHabits, newHabit];
      localStorage.setItem('habits', JSON.stringify(updated));
      return updated;
    });

    setIsFormOpen(false);
    toast({
      title: "Habit Created",
      description: `Successfully created habit: ${newHabit.title}`,
    });
  };

  const handleDeleteHabit = (habitId: number) => {
    setHabits(currentHabits => {
      const updated = currentHabits.filter(h => h.id !== habitId);
      localStorage.setItem('habits', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Habit Deleted",
      description: "The habit has been deleted.",
      variant: "destructive",
    });
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits(currentHabits => {
      const updated = currentHabits.map(h => 
        h.id === updatedHabit.id ? updatedHabit : h
      );
      localStorage.setItem('habits', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Habit Updated",
      description: `Successfully updated habit: ${updatedHabit.title}`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          heading="Habits"
          subheading="Track and manage your daily habits"
        />
        <div className="flex items-center gap-4">
          <Link href="/analytics/habits">
            <Button variant="outline">
              View Analytics
            </Button>
          </Link>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Habit
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <HabitList 
          habits={habits} 
          onUpdateHabit={handleUpdateHabit}
          onDeleteHabit={handleDeleteHabit}
        />
      </div>

      <HabitForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveHabit}
      />
    </div>
  );
}
