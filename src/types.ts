export type GoalType = "do" | "dont";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastUpdated: string;
}

export type MilestoneFrequency =
  | "one-time"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  frequency: MilestoneFrequency;
  lastCompleted?: string;
}

export type EntryContentType =
  | "text"
  | "checklist"
  | "link"
  | "file"
  | "spreadsheet"
  | "note";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface EntryContent {
  type: EntryContentType;
  data: {
    text?: string;
    items?: ChecklistItem[];
    url?: string;
    fileUrl?: string;
    fileName?: string;
  };
}

export interface DailyEntry {
  id: string;
  goalId: string;
  date: string;
  contents: EntryContent[];
  createdAt: string;
  updatedAt: string;
  milestoneId?: string; // Optional field for entries linked to milestones
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  milestones: Milestone[];
  streak: Streak;
  lastUpdated: string;
  entries: DailyEntry[];
  completed: boolean;
  completedAt?: string;
}

export type HabitType = "good" | "bad";

export interface HabitCategory {
  id: string;
  name: string;
  type: "good" | "bad";
  color: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string | null;
  type: "good" | "bad";
  category_id: string;
  frequency: "daily" | "weekly" | "monthly";
  streak: number;
  progress: number;
  last_completed: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  categories: string[];
  badges: Badge[];
  totalGoalsCompleted: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RoadMap {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  finalTarget: string;
  createdAt: string;
  updatedAt: string;
  milestones: RoadMapMilestone[];
  status: "not_started" | "in_progress" | "completed";
  progress: number;
}

export interface RoadMapMilestone {
  id: string;
  title: string;
  description: string;
  type: "goal" | "habit";
  referenceId: string; // ID of the goal or habit
  order: number;
  dependsOn?: string[]; // IDs of milestones that must be completed before this one
  status: "not_started" | "in_progress" | "completed";
  progress: number;
}

export interface RoadMapTemplate
  extends Omit<RoadMap, "id" | "createdAt" | "updatedAt"> {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
