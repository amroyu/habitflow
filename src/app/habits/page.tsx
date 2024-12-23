'use client';

import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/page-header'
import HabitList, { Habit } from '@/components/habits/habit-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { HabitForm } from '@/components/habits/habit-form'

export default function HabitsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: Date.now(),
      title: habitData.title!,
      description: habitData.description || '',
      frequency: habitData.frequency!,
      type: habitData.type!,
      streak: 0,
      progress: 0,
      lastCompleted: null,
    };
    setHabits(currentHabits => [...currentHabits, newHabit]);
    setIsFormOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
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
          <HabitList habits={habits} onAddHabit={(habit) => setHabits(current => [...current, habit])} />
        </div>
      </div>

      <HabitForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveHabit}
      />
    </DashboardLayout>
  );
}
