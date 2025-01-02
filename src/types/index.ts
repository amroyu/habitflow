export type MilestoneFrequency = 'daily' | 'weekly' | 'monthly';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  status: 'pending' | 'in-progress' | 'completed';
  progress?: number;
  frequency?: MilestoneFrequency;
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

export interface Target {
  id: string;
  value: number;
  description: string;
  unit: string;
  completed: boolean;
}

export interface DailyEntry {
  id: string;
  date: string;
  value: number;
  notes?: string;
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

export type WidgetType = 'pomodoro-timer' | 'counter' | 'notes' | 'checklist' | 'progress-chart';

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
    id: string;
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
  id: string;
  type: WidgetType;
  settings?: WidgetSettings;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastUpdated: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targets: Target[];
  endDate: string;
  type: 'do' | 'dont';
  category: string;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  entries: DailyEntry[];
  widgets: Widget[];
  milestones: Milestone[];
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: string;
  type: 'good' | 'bad';
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastUpdated: string;
  };
  progress: number;
  lastCompleted: string;
  startDate: string;
  completedCount: number;
  target: number;
  widgets: Widget[];
  category: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'book' | 'tool' | 'course';
  url: string;
  author: string;
  thumbnail?: string;
  tags: string[];
  likes: number;
  saves: number;
  dateAdded: string;
  readTime?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
}

export interface TimerTask {
  id: string;
  title: string;
  duration: number;
  timeLeft: number;
  completed: boolean;
  isRunning: boolean;
  createdAt: string;
  lastRunAt: string | null;
  archived: boolean;
  source?: 'manual' | 'checklist' | 'quick-timer';
}
