import { Progress } from '@/components/ui/progress'
import { useRewards } from '@/context/rewards-context'
import { LEVEL_THRESHOLDS } from '@/types/rewards'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Star, Zap, Target, Flag, CheckCircle } from 'lucide-react'

export function RewardsDisplay() {
  const { userRewards } = useRewards()
  const { 
    totalPoints, 
    level, 
    rewards, 
    streakCount, 
    completedGoals,
    completedHabits,
    completedMilestones 
  } = userRewards

  const currentLevelThreshold = LEVEL_THRESHOLDS[level - 1] || 0
  const nextLevelThreshold = LEVEL_THRESHOLDS[level] || currentLevelThreshold
  const pointsToNextLevel = nextLevelThreshold - currentLevelThreshold
  const currentLevelPoints = totalPoints - currentLevelThreshold
  const progress = (currentLevelPoints / pointsToNextLevel) * 100

  const stats = [
    { icon: Flag, value: completedGoals, label: 'Goals', color: 'text-blue-500' },
    { icon: Target, value: completedHabits, label: 'Habits', color: 'text-green-500' },
    { icon: CheckCircle, value: completedMilestones, label: 'Milestones', color: 'text-purple-500' },
  ]

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 font-semibold">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Rewards & Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Level {level}</h3>
                <p className="text-xs text-gray-500">Keep pushing forward!</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {totalPoints} points
              </span>
              <div className="flex items-center gap-1 mt-1">
                <Zap className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-gray-500">
                  {streakCount} day streak
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <Progress value={progress} className="h-full" />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{currentLevelPoints} / {pointsToNextLevel} to next level</span>
              <span className="text-xs font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map(({ icon: Icon, value, label, color }) => (
              <div
                key={label}
                className="flex flex-col items-center p-2 rounded-lg bg-gray-50/80"
              >
                <Icon className={`h-4 w-4 ${color} mb-1`} />
                <span className="font-semibold text-sm">{value}</span>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>

          {rewards.length > 0 && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Latest Achievement</span>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50/80 rounded-lg p-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{rewards[rewards.length - 1]?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{rewards[rewards.length - 1]?.title}</p>
                    <p className="text-xs text-gray-500">+{rewards[rewards.length - 1]?.points} points</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
