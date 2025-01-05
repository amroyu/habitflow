"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HabitForm } from "@/components/habits/habit-form";
import { GoalForm } from "@/components/goals/goal-form";
import { TrackerGrid } from "@/components/tracker/tracker-grid";
import { TasksSection } from "@/components/tasks/tasks-section";
import type { Habit, Goal, Widget, TimerTask } from "@/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useTrackerData } from '@/hooks/useTrackerData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TrackerPage() {
  const {
    habits,
    goals,
    tasks,
    categories,
    isLoading,
    saveHabit,
    saveGoal,
    deleteHabit,
    deleteGoal,
    updateTasks,
  } = useTrackerData();

  console.log('Categories in tracker page:', categories);

  const [createType, setCreateType] = useState<"habit" | "goal" | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "streak">("recent");
  const { toast } = useToast();

  const handleSaveHabit = async (habitData: Partial<Habit>) => {
    try {
      console.log('Attempting to save habit:', habitData);
      await saveHabit(habitData);
      toast({
        title: habitData.id ? "Habit updated" : "Habit created",
        description: "Your habit has been saved successfully.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error in handleSaveHabit:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save habit",
        variant: "destructive",
      });
    }
  };

  const handleSaveGoal = async (goalData: Partial<Goal>) => {
    try {
      await saveGoal(goalData);
      toast({
        title: goalData.id ? "Goal updated" : "Goal created",
        description: "Your goal has been saved successfully.",
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId);
      toast({
        title: "Habit deleted",
        description: "Your habit has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      toast({
        title: "Goal deleted",
        description: "Your goal has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTasks = async (updatedTasks: TimerTask[]) => {
    try {
      await updateTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating tasks:', error);
      toast({
        title: "Error",
        description: "Failed to update tasks. Please try again.",
        variant: "destructive",
      });
    }
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
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search habits and goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setView("grid")}>Grid View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("list")}>List View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("recent")}>Sort by Recent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("progress")}>Sort by Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("streak")}>Sort by Streak</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setCreateType("habit");
              setIsDialogOpen(true);
            }}>
              New Habit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setCreateType("goal");
              setIsDialogOpen(true);
            }}>
              New Goal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {createType === "habit" ? "Create New Habit" : "Create New Goal"}
            </DialogTitle>
          </DialogHeader>
          {createType === "habit" ? (
            <HabitForm
              onClose={handleCloseDialog}
              onSave={handleSaveHabit}
              categories={categories}
            />
          ) : createType === "goal" ? (
            <GoalForm
              onClose={handleCloseDialog}
              onSave={handleSaveGoal}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <section>
            <h2 className="text-2xl font-bold mb-4">Habits</h2>
            <TrackerGrid
              items={habits}
              onDelete={deleteHabit}
              onEdit={(habit) => {
                setCreateType("habit");
                setIsDialogOpen(true);
              }}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Goals</h2>
            <TrackerGrid
              items={goals}
              onDelete={deleteGoal}
              onEdit={(goal) => {
                setCreateType("goal");
                setIsDialogOpen(true);
              }}
            />
          </section>

          <TasksSection tasks={tasks} onUpdateTasks={updateTasks} />
        </>
      )}
    </div>
  );
}
