"use client"

import { useEffect } from "react";
import { Timeline } from "@/components/timeline/timeline";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Goal, Habit, Note } from "@/types";
import { addDays, subDays } from "date-fns";

export default function TimelinePage() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("goals", []);
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", []);
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);

  const generateMockData = () => {
    const baseDate = new Date("2025-01-03T11:26:24+03:00");
    
    // Generate mock goals
    const mockGoals: Goal[] = [
      {
        id: "g1",
        title: "Learn TypeScript",
        description: "Master TypeScript fundamentals",
        progress: 75,
        createdAt: subDays(baseDate, 5).toISOString(),
        updatedAt: baseDate.toISOString(),
      },
      {
        id: "g2",
        title: "Complete Project",
        description: "Finish the timeline feature",
        progress: 90,
        createdAt: subDays(baseDate, 2).toISOString(),
        updatedAt: baseDate.toISOString(),
      },
      {
        id: "g3",
        title: "Read Programming Books",
        description: "Read 3 programming books",
        progress: 30,
        createdAt: baseDate.toISOString(),
        updatedAt: baseDate.toISOString(),
      },
    ];

    // Generate mock habits
    const mockHabits: Habit[] = [
      {
        id: "h1",
        title: "Daily Coding",
        description: "Code for at least 1 hour",
        dates: [
          subDays(baseDate, 4).toISOString(),
          subDays(baseDate, 3).toISOString(),
          subDays(baseDate, 2).toISOString(),
          subDays(baseDate, 1).toISOString(),
          baseDate.toISOString(),
        ],
        createdAt: subDays(baseDate, 5).toISOString(),
        updatedAt: baseDate.toISOString(),
      },
      {
        id: "h2",
        title: "Exercise",
        description: "30 minutes workout",
        dates: [
          subDays(baseDate, 3).toISOString(),
          subDays(baseDate, 1).toISOString(),
          baseDate.toISOString(),
        ],
        createdAt: subDays(baseDate, 4).toISOString(),
        updatedAt: baseDate.toISOString(),
      },
    ];

    // Generate mock notes
    const mockNotes: Note[] = [
      {
        id: "n1",
        title: "Project Ideas",
        content: "Build a habit tracking app with modern UI",
        createdAt: subDays(baseDate, 4).toISOString(),
        updatedAt: baseDate.toISOString(),
      },
      {
        id: "n2",
        title: "Learning Progress",
        content: "Completed React hooks tutorial",
        createdAt: subDays(baseDate, 2).toISOString(),
        updatedAt: baseDate.toISOString(),
      },
      {
        id: "n3",
        title: "Daily Reflection",
        content: "Great progress on the timeline feature",
        createdAt: baseDate.toISOString(),
        updatedAt: baseDate.toISOString(),
      },
    ];

    setGoals(mockGoals);
    setHabits(mockHabits);
    setNotes(mockNotes);
  };

  return (
    <Shell>
      <div className="flex flex-col space-y-4 p-4">
        <h1 className="text-2xl font-bold">Timeline</h1>
        <Timeline />
      </div>
    </Shell>
  );
}
