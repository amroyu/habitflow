"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HabitForm } from "@/components/habits/habit-form";
import { GoalForm } from "@/components/goals/goal-form";
import { TrackerGrid } from "@/components/tracker/tracker-grid";
import type { Habit, Goal, Widget, Streak } from "@/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TrackerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHabits = localStorage.getItem('habits');
      const savedGoals = localStorage.getItem('goals');
      setHabits(savedHabits ? JSON.parse(savedHabits) : []);
      setGoals(savedGoals ? JSON.parse(savedGoals) : []);
      setIsLoading(false);
    }
  }, []);

  const [createType, setCreateType] = useState<"habit" | "goal" | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "streak">("recent");
  const { toast } = useToast();

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: String(Date.now()),
      title: habitData.title || '',
      description: habitData.description || '',
      frequency: habitData.frequency || 'daily',
      type: habitData.type || 'good',
      category: habitData.category || '',
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastUpdated: new Date().toISOString()
      },
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

    setIsDialogOpen(false);
    setCreateType(null);
    toast({
      title: "Habit Created",
      description: `Successfully created habit: ${newHabit.title}`,
    });
  };

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: String(Date.now()),
      title: goalData.title || '',
      description: goalData.description || '',
      targets: goalData.targets || [],
      endDate: goalData.endDate || new Date().toISOString(),
      type: goalData.type || 'do',
      category: goalData.category || '',
      status: 'active',
      progress: 0,
      entries: [],
      widgets: [],
      milestones: []
    };

    setGoals(currentGoals => {
      const updated = [...currentGoals, newGoal];
      localStorage.setItem('goals', JSON.stringify(updated));
      return updated;
    });

    setIsDialogOpen(false);
    setCreateType(null);
    toast({
      title: "Goal Created",
      description: `Successfully created goal: ${newGoal.title}`,
    });
  };

  const handleUpdateHabit = (habit: Habit) => {
    setHabits(currentHabits => {
      const updated = currentHabits.map(h => h.id === habit.id ? habit : h);
      localStorage.setItem('habits', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateGoal = (goal: Goal) => {
    setGoals(currentGoals => {
      const updated = currentGoals.map(g => g.id === goal.id ? goal : g);
      localStorage.setItem('goals', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddWidget = (goalId: string, widget: Widget) => {
    setGoals(currentGoals => {
      const updated = currentGoals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            widgets: [...goal.widgets, widget]
          };
        }
        return goal;
      });
      localStorage.setItem('goals', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveWidget = (goalId: string, widgetId: string) => {
    setGoals(currentGoals => {
      const updated = currentGoals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            widgets: goal.widgets.filter(w => w.id !== widgetId)
          };
        }
        return goal;
      });
      localStorage.setItem('goals', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(currentHabits => {
      const updated = currentHabits.filter(habit => habit.id !== habitId);
      localStorage.setItem('habits', JSON.stringify(updated));
      return updated;
    });
    toast({
      title: "Habit Deleted",
      description: "The habit has been successfully deleted.",
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(currentGoals => {
      const updated = currentGoals.filter(goal => goal.id !== goalId);
      localStorage.setItem('goals', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCreateType(null);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setCreateType(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search habits and goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setView("grid")}>
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("list")}>
                List View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("recent")}>
                Sort by Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("progress")}>
                Sort by Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("streak")}>
                Sort by Streak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {!isLoading && (
          <TrackerGrid
            habits={habits}
            goals={goals}
            searchQuery={searchQuery}
            view={view}
            sortBy={sortBy}
            onUpdateHabit={handleUpdateHabit}
            onUpdateGoal={handleUpdateGoal}
            onDeleteHabit={handleDeleteHabit}
            onDeleteGoal={handleDeleteGoal}
            onAddWidget={handleAddWidget}
            onRemoveWidget={handleRemoveWidget}
          />
        )}
      </Suspense>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {createType ? `Create New ${createType === 'habit' ? 'Habit' : 'Goal'}` : 'Create New'}
            </DialogTitle>
          </DialogHeader>
          {!createType ? (
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => setCreateType("habit")}
                className="w-full py-8 text-lg"
                variant="outline"
              >
                Create New Habit
              </Button>
              <Button
                onClick={() => setCreateType("goal")}
                className="w-full py-8 text-lg"
                variant="outline"
              >
                Create New Goal
              </Button>
            </div>
          ) : createType === "habit" ? (
            <HabitForm
              onClose={handleCloseDialog}
              onSave={handleSaveHabit}
            />
          ) : (
            <GoalForm
              onClose={handleCloseDialog}
              onSave={handleSaveGoal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
