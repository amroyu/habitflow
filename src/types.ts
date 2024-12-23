export type GoalType = 'do' | 'dont'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt?: string
}

export interface Streak {
  currentStreak: number
  longestStreak: number
  lastUpdated: string
}

export type MilestoneFrequency = 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface Milestone {
  id: string
  title: string
  dueDate: string
  completed: boolean
  frequency: MilestoneFrequency
  lastCompleted?: string
}

export type EntryContentType = 
  | 'text' 
  | 'checklist' 
  | 'link' 
  | 'file' 
  | 'spreadsheet'
  | 'note'

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface EntryContent {
  type: EntryContentType
  data: {
    text?: string
    items?: ChecklistItem[]
    url?: string
    fileUrl?: string
    fileName?: string
  }
}

export interface DailyEntry {
  id: string
  goalId: string
  date: string
  contents: EntryContent[]
  createdAt: string
  updatedAt: string
  milestoneId?: string // Optional field for entries linked to milestones
}

export interface Goal {
  id: string
  title: string
  description: string
  type: GoalType
  category: string
  startDate: string
  endDate: string
  progress: number
  milestones: Milestone[]
  streak: Streak
  lastUpdated: string
  entries: DailyEntry[]
  completed: boolean
  completedAt?: string
}

export interface User {
  id: string
  email: string
  name: string
  categories: string[]
  badges: Badge[]
  totalGoalsCompleted: number
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}
