import { Goal, RoadMapTemplate, Milestone } from "@/types";

const today = new Date().toISOString().split("T")[0];

export interface MockHabit {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  type: "good" | "bad";
  streak: number;
  progress: number;
  lastCompleted?: string;
}

export const mockHabits: MockHabit[] = [
  {
    id: "1",
    title: "Morning Meditation",
    description: "Start each day with 10 minutes of meditation",
    frequency: "daily",
    type: "good",
    streak: 5,
    progress: 80,
    lastCompleted: today,
  },
  {
    id: "2",
    title: "Read Books",
    description: "Read for at least 30 minutes",
    frequency: "daily",
    type: "good",
    streak: 3,
    progress: 60,
    lastCompleted: today,
  },
  {
    id: "3",
    title: "Late Night Snacking",
    description: "Avoid eating after 8 PM",
    frequency: "daily",
    type: "bad",
    streak: 2,
    progress: 40,
    lastCompleted: today,
  },
];

export const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Learn TypeScript",
    description: "Master TypeScript fundamentals and advanced concepts",
    type: "do",
    category: "Learning",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    progress: 75,
    lastUpdated: today,
    completed: false,
    streak: {
      currentStreak: 5,
      longestStreak: 7,
      lastUpdated: today,
    },
    entries: [],
    milestones: [
      {
        id: "1-1",
        title: "Complete TypeScript Basics",
        description: "Learn basic TypeScript concepts",
        dueDate: "2024-01-15",
        status: "completed",
        frequency: "daily",
      } as Milestone,
      {
        id: "1-2",
        title: "Build a TypeScript Project",
        description: "Create a project using TypeScript",
        dueDate: "2024-02-15",
        status: "completed",
        frequency: "daily",
      } as Milestone,
    ],
  },
  {
    id: "2",
    title: "Stop Procrastinating",
    description: "Break the habit of procrastination",
    type: "dont",
    category: "Productivity",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    progress: 60,
    lastUpdated: today,
    completed: false,
    streak: {
      currentStreak: 3,
      longestStreak: 5,
      lastUpdated: today,
    },
    entries: [],
    milestones: [
      {
        id: "2-1",
        title: "Track Daily Productivity",
        description: "Log productive hours each day",
        dueDate: "2024-01-31",
        status: "in-progress",
        frequency: "daily",
      } as Milestone,
    ],
  },
];

export const mockRoadmapTemplates: RoadMapTemplate[] = [
  {
    id: "1",
    title: "Learn a New Programming Language",
    description: "Step-by-step guide to master a programming language",
    finalTarget: "Build a full-stack application",
    category: "Programming",
    milestones: [
      {
        id: "1",
        title: "Learn the Basics",
        description: "Master the fundamental concepts",
        status: "pending",
        frequency: "daily",
      } as Milestone,
      {
        id: "2",
        title: "Build Small Projects",
        description: "Create simple applications",
        status: "pending",
        frequency: "weekly",
      } as Milestone,
    ],
  },
  {
    id: "2",
    title: "Get Fit",
    description: "Achieve your fitness goals",
    finalTarget: "Run a marathon",
    category: "Fitness",
    milestones: [
      {
        id: "1",
        title: "Start Running",
        description: "Begin with short distances",
        status: "pending",
        frequency: "daily",
      } as Milestone,
      {
        id: "2",
        title: "Increase Distance",
        description: "Gradually increase running distance",
        status: "pending",
        frequency: "weekly",
      } as Milestone,
    ],
  },
];
