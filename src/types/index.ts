export type MilestoneFrequency = 'daily' | 'weekly' | 'monthly'

export interface Milestone {
  id: string
  title: string
  description?: string
  dueDate?: string
  completed: boolean
  status: 'pending' | 'in-progress' | 'completed'
  progress?: number
  frequency?: MilestoneFrequency
}

export interface RoadMap {
  id: string
  title: string
  description: string
  finalTarget: string
  milestones: Milestone[]
  status: 'draft' | 'active' | 'completed' | 'not_started'
  progress: number
  createdAt: string
  updatedAt: string
  targetDate?: string
}

export interface RoadMapTemplate {
  id: string
  title: string
  description: string
  finalTarget: string
  category: string
  milestones: Milestone[]
}

export interface Goal {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  milestones: Milestone[]
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  lastUpdated?: string
  deleted?: boolean
}

export interface Habit {
  id: number
  title: string
  description: string
  frequency: string
  type: 'good' | 'bad'
  streak: number
  progress: number
  lastCompleted: string
  completedCount: number
}
