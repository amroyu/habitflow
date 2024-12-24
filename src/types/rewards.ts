export interface Reward {
  id: string
  title: string
  description: string
  points: number
  type: 'achievement' | 'badge' | 'milestone'
  icon: string
  unlockedAt?: string
  progress?: number
  requiredProgress?: number
}

export interface UserRewards {
  totalPoints: number
  level: number
  rewards: Reward[]
  streakCount: number
  completedGoals: number
  completedHabits: number
  completedMilestones: number
}

export const POINTS = {
  COMPLETE_HABIT: 10,
  COMPLETE_MILESTONE: 50,
  COMPLETE_GOAL: 100,
  DAILY_STREAK: 20,
  WEEKLY_STREAK: 100,
  MONTHLY_STREAK: 500,
} as const

export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2100,   // Level 7
  2800,   // Level 8
  3600,   // Level 9
  4500,   // Level 10
]
