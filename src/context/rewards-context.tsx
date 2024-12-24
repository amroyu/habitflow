'use client';

import { createContext, useContext, useEffect, useState } from 'react'
import { Reward, UserRewards, POINTS, LEVEL_THRESHOLDS } from '@/types/rewards'
import { toast } from 'sonner'

interface RewardsContextType {
  userRewards: UserRewards
  addPoints: (points: number, reason: string) => void
  checkAchievements: () => void
  resetStreak: () => void
}

const defaultUserRewards: UserRewards = {
  totalPoints: 0,
  level: 1,
  rewards: [],
  streakCount: 0,
  completedGoals: 0,
  completedHabits: 0,
  completedMilestones: 0,
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined)

const ACHIEVEMENTS: Reward[] = [
  {
    id: 'first-goal',
    title: 'Goal Setter',
    description: 'Complete your first goal',
    points: 50,
    type: 'achievement',
    icon: '🎯',
    requiredProgress: 1,
  },
  {
    id: 'habit-master',
    title: 'Habit Master',
    description: 'Complete 10 habits',
    points: 100,
    type: 'achievement',
    icon: '⭐',
    requiredProgress: 10,
  },
  {
    id: 'milestone-hunter',
    title: 'Milestone Hunter',
    description: 'Complete 5 milestones',
    points: 75,
    type: 'achievement',
    icon: '🏆',
    requiredProgress: 5,
  },
  {
    id: 'streak-warrior',
    title: 'Streak Warrior',
    description: 'Maintain a 7-day streak',
    points: 150,
    type: 'achievement',
    icon: '🔥',
    requiredProgress: 7,
  },
]

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const [userRewards, setUserRewards] = useState<UserRewards>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userRewards')
      return saved ? JSON.parse(saved) : defaultUserRewards
    }
    return defaultUserRewards
  })

  useEffect(() => {
    localStorage.setItem('userRewards', JSON.stringify(userRewards))
  }, [userRewards])

  const calculateLevel = (points: number) => {
    let level = 1
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (points >= LEVEL_THRESHOLDS[i]) {
        level = i + 1
      } else {
        break
      }
    }
    return level
  }

  const addPoints = (points: number, reason: string) => {
    setUserRewards(prev => {
      const newPoints = prev.totalPoints + points
      const newLevel = calculateLevel(newPoints)
      
      if (newLevel > prev.level) {
        toast.success(`Level Up! 🎉 You're now level ${newLevel}!`)
      }
      
      toast.success(`+${points} points: ${reason}`)
      
      return {
        ...prev,
        totalPoints: newPoints,
        level: newLevel,
      }
    })
  }

  const checkAchievements = () => {
    setUserRewards(prev => {
      const unlockedRewards = [...prev.rewards]
      let pointsToAdd = 0

      ACHIEVEMENTS.forEach(achievement => {
        const alreadyUnlocked = unlockedRewards.some(r => r.id === achievement.id)
        if (!alreadyUnlocked) {
          let progress = 0
          
          switch (achievement.id) {
            case 'first-goal':
              progress = prev.completedGoals
              break
            case 'habit-master':
              progress = prev.completedHabits
              break
            case 'milestone-hunter':
              progress = prev.completedMilestones
              break
            case 'streak-warrior':
              progress = prev.streakCount
              break
          }

          if (progress >= (achievement.requiredProgress || 0)) {
            unlockedRewards.push({
              ...achievement,
              unlockedAt: new Date().toISOString(),
              progress: progress,
            })
            pointsToAdd += achievement.points
            toast.success(`Achievement Unlocked: ${achievement.title} 🎉`)
          }
        }
      })

      if (pointsToAdd > 0) {
        addPoints(pointsToAdd, 'Achievements unlocked')
      }

      return {
        ...prev,
        rewards: unlockedRewards,
      }
    })
  }

  const resetStreak = () => {
    setUserRewards(prev => ({
      ...prev,
      streakCount: 0,
    }))
  }

  return (
    <RewardsContext.Provider
      value={{
        userRewards,
        addPoints,
        checkAchievements,
        resetStreak,
      }}
    >
      {children}
    </RewardsContext.Provider>
  )
}

export function useRewards() {
  const context = useContext(RewardsContext)
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider')
  }
  return context
}
