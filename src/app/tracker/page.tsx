"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HabitForm } from "@/components/habits/habit-form";
import { GoalForm } from "@/components/goals/goal-form";
import { TrackerGrid } from "@/components/tracker/tracker-grid";
import type { Habit, Goal } from "@/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TrackerPage() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('habits');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('goals');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [createType, setCreateType] = useState<"habit" | "goal" | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "streak">("recent");
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

    setIsDialogOpen(false);
    setCreateType(null);
    toast({
      title: "Habit Created",
      description: `Successfully created habit: ${newHabit.title}`,
    });
  };

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: Date.now(),
      title: goalData.title!,
      description: goalData.description || '',
      startDate: new Date().toISOString(),
      endDate: goalData.endDate!,
      target: goalData.target || 0,
      status: 'active',
      entries: [],
      widgets: [],
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCreateType(null);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setCreateType(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tracker</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
          <Button onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

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

      <TrackerGrid
        habits={habits}
        goals={goals}
        searchQuery={searchQuery}
        sortBy={sortBy}
        view={view}
      />
    </div>
  );
}
