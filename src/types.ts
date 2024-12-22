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

export interface Milestone {
  id: string
  title: string
  dueDate: string
  completed: boolean
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
