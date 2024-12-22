import { Goal } from '@/types'
import { formatDateRelative } from '@/utils/date'
import { useState, useEffect } from 'react'
import { StreakCounter } from './streak-counter'
import { GoalCelebration } from './goal-celebration'
import { motion } from 'framer-motion'

interface GoalDetailProps {
  goal: Goal
  onProgressUpdate: (progress: number) => void
}

export function GoalDetail({ goal, onProgressUpdate }: GoalDetailProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [prevProgress, setPrevProgress] = useState(goal.progress)

  useEffect(() => {
    if (goal.progress === 100 && prevProgress < 100) {
      setShowCelebration(true)
    }
    setPrevProgress(goal.progress)
  }, [goal.progress, prevProgress])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{goal.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{goal.description}</p>
        </div>
        <StreakCounter streak={goal.streak} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{goal.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Start Date</span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDateRelative(goal.startDate)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">End Date</span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDateRelative(goal.endDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {goal.milestones.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Milestones</h3>
          <div className="space-y-2">
            {goal.milestones.map((milestone) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => {
                      const updatedMilestones = goal.milestones.map((m) =>
                        m.id === milestone.id ? { ...m, completed: !m.completed } : m
                      )
                      const progress = Math.round(
                        (updatedMilestones.filter((m) => m.completed).length / updatedMilestones.length) * 100
                      )
                      onProgressUpdate(progress)
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due {formatDateRelative(milestone.dueDate)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <GoalCelebration
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  )
}
