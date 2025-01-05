"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Habit, Goal, TimerTask, HabitCategory } from "@/types";

export function useTrackerData() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<TimerTask[]>([]);
  const [categories, setCategories] = useState<HabitCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitsRes, goalsRes, tasksRes, categoriesRes] =
          await Promise.all([
            supabase
              .from("habits")
              .select("*")
              .order("created_at", { ascending: false }),
            supabase
              .from("goals")
              .select("*")
              .order("created_at", { ascending: false }),
            supabase
              .from("timer_tasks")
              .select("*")
              .order("created_at", { ascending: false }),
            supabase
              .from("habit_categories")
              .select("*")
              .order("name", { ascending: true }),
          ]);

        if (habitsRes.error) throw habitsRes.error;
        if (goalsRes.error) throw goalsRes.error;
        if (tasksRes.error) throw tasksRes.error;
        if (categoriesRes.error) throw categoriesRes.error;

        console.log("Categories fetched:", categoriesRes.data);

        setHabits(habitsRes.data || []);
        setGoals(goalsRes.data || []);
        setTasks(tasksRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const habitsSubscription = supabase
      .channel("habits-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "habits" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setHabits((current) => [payload.new as Habit, ...current]);
          } else if (payload.eventType === "UPDATE") {
            setHabits((current) =>
              current.map((habit) =>
                habit.id === payload.new.id ? (payload.new as Habit) : habit
              )
            );
          } else if (payload.eventType === "DELETE") {
            setHabits((current) =>
              current.filter((habit) => habit.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    const goalsSubscription = supabase
      .channel("goals-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "goals" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setGoals((current) => [payload.new as Goal, ...current]);
          } else if (payload.eventType === "UPDATE") {
            setGoals((current) =>
              current.map((goal) =>
                goal.id === payload.new.id ? (payload.new as Goal) : goal
              )
            );
          } else if (payload.eventType === "DELETE") {
            setGoals((current) =>
              current.filter((goal) => goal.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    const tasksSubscription = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "timer_tasks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((current) => [payload.new as TimerTask, ...current]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((current) =>
              current.map((task) =>
                task.id === payload.new.id ? (payload.new as TimerTask) : task
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((current) =>
              current.filter((task) => task.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    fetchData();

    return () => {
      habitsSubscription.unsubscribe();
      goalsSubscription.unsubscribe();
      tasksSubscription.unsubscribe();
    };
  }, [supabase]);

  const saveHabit = async (habitData: Partial<Habit>) => {
    try {
      // Check authentication
      console.log("Checking authentication...");
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error("Authentication failed");
      }
      if (!user) {
        throw new Error("User not authenticated");
      }
      console.log("User authenticated:", user.id);

      // Validate required fields
      console.log("Validating fields...", habitData);
      if (!habitData.title?.trim()) {
        throw new Error("Title is required");
      }
      if (!habitData.type) {
        throw new Error("Type is required");
      }
      if (!habitData.frequency) {
        throw new Error("Frequency is required");
      }
      console.log("All fields validated");

      // First, try to get the default category if none is provided
      let categoryId = habitData.category_id;
      if (!categoryId) {
        console.log("No category provided, fetching default category...");
        const { data: categories, error: categoryError } = await supabase
          .from("habit_categories")
          .select("id")
          .eq("name", "Other")
          .single();

        if (categoryError) {
          console.error("Error fetching default category:", categoryError);
          throw new Error("Failed to fetch default category");
        }

        if (!categories) {
          console.error("No default category found");
          throw new Error("No default category available");
        }

        categoryId = categories.id;
        console.log("Using default category:", categoryId);
      }

      const now = new Date().toISOString();
      const habitPayload = {
        title: habitData.title.trim(),
        description: habitData.description?.trim() || null,
        type: habitData.type || "good",
        category_id: categoryId,
        frequency: habitData.frequency || "daily",
        user_id: user.id,
        progress: 0,
        streak: 0,
        last_completed: null,
        updated_at: now,
        created_at: now,
      };

      console.log(
        "Prepared habit payload:",
        JSON.stringify(habitPayload, null, 2)
      );

      try {
        const { data, error } = await supabase
          .from("habits")
          .insert([habitPayload])
          .select("*")
          .single();

        console.log("Insert response:", { data, error });

        if (error) {
          console.error("Database error:", error);
          throw new Error(error.message || "Failed to create habit");
        }

        if (!data) {
          throw new Error("No data returned after insert");
        }

        console.log("Successfully created habit:", data);
        setHabits((current) => [data, ...current]);

        return data;
      } catch (insertError) {
        console.error("Exception during insert:", insertError);
        throw insertError;
      }
    } catch (error) {
      console.error("Error in saveHabit:", error);
      throw error;
    }
  };

  const saveGoal = async (goalData: Partial<Goal>) => {
    try {
      if (goalData.id) {
        const { data, error } = await supabase
          .from("goals")
          .update(goalData)
          .eq("id", goalData.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("goals")
          .insert(goalData)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error("Error saving goal:", error);
      throw error;
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting habit:", error);
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  };

  const updateTasks = async (updatedTasks: TimerTask[]) => {
    try {
      const { error } = await supabase.from("timer_tasks").upsert(updatedTasks);
      if (error) throw error;
    } catch (error) {
      console.error("Error updating tasks:", error);
      throw error;
    }
  };

  return {
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
  };
}
