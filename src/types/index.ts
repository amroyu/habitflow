export type MilestoneFrequency = 'daily' | 'weekly' | 'monthly';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  status: 'pending' | 'in-progress' | 'completed';
  progress?: number;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

export interface RoadMap {
  id: string;
  title: string;
  description: string;
  finalTarget: string;
  milestones: Milestone[];
  status: 'draft' | 'active' | 'completed' | 'not_started';
  progress: number;
  createdAt: string;
  updatedAt: string;
  targetDate?: string;
}

export interface RoadMapTemplate {
  id: string;
  title: string;
  description: string;
  finalTarget: string;
  category: string;
  milestones: Milestone[];
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastUpdated: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface EntryContent {
  type: 'text' | 'checklist' | 'link' | 'file';
  data: {
    text?: string;
    items?: ChecklistItem[];
    url?: string;
    fileUrl?: string;
    fileName?: string;
  };
}

export type WidgetType = 'pomodoro' | 'counter' | 'notes' | 'checklist' | 'progress-chart';

export interface WidgetSettings {
  // Pomodoro settings
  workDuration?: number;
  breakDuration?: number;
  longBreakDuration?: number;
  sessionsBeforeLongBreak?: number;

  // Counter settings
  initialValue?: number;
  increment?: number;
  target?: number;

  // Notes settings
  notes?: string[];

  // Checklist settings
  items?: Array<{
    id: number;
    text: string;
    completed: boolean;
  }>;

  // Progress Chart settings
  data?: Array<{
    date: string;
    value: number;
  }>;
}

export interface Widget {
  id: number;
  type: WidgetType;
  settings?: WidgetSettings;
}

export interface DailyEntry {
  id: number;
  date: string;
  value: number;
  notes?: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  target: number;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  type?: 'do' | 'dont';
  category?: string;
  entries?: DailyEntry[];
  streak?: Streak;
  widgets?: Widget[];
  milestones?: Milestone[];
}

export interface Habit {
  id: number;
  title: string;
  description: string;
  frequency: string;
  type: 'good' | 'bad';
  streak: number;
  progress: number;
  lastCompleted?: string;
  startDate?: string;
  completedCount?: number;
  target?: number;
  widgets?: Widget[];
}
