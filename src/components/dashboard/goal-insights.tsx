import { Goal } from '@/types'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface GoalInsightsProps {
  goals: Goal[]
  currentDate: Date
}

export function GoalInsights({ goals, currentDate }: GoalInsightsProps) {
  // Find goals that need attention (low progress or approaching deadline)
  const needsAttention = goals.filter(goal => {
    const deadline = new Date(goal.endDate)
    const now = new Date(currentDate)
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    return (
      (daysUntilDeadline <= 7 && goal.progress < 70) || // Approaching deadline with low progress
      (daysUntilDeadline > 7 && goal.progress < 30)     // Early but very low progress
    )
  }).slice(0, 3)

  // Find goals that are doing well
  const doingWell = goals.filter(goal => {
    const deadline = new Date(goal.endDate)
    const now = new Date(currentDate)
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    return (
      (daysUntilDeadline <= 7 && goal.progress >= 80) || // Near deadline but almost done
      (daysUntilDeadline > 7 && goal.progress >= 50)     // Ahead of schedule
    )
  }).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Goals Needing Attention */}
      {needsAttention.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Needs Attention</h4>
          <div className="space-y-3">
            {needsAttention.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
              >
                <ExclamationCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                  <p className="text-sm text-red-600">
                    {new Date(goal.endDate) <= new Date(currentDate)
                      ? 'Past due'
                      : `${goal.progress}% complete - Due ${new Date(goal.endDate).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Doing Well */}
      {doingWell.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Doing Well</h4>
          <div className="space-y-3">
            {doingWell.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                  <p className="text-sm text-green-600">
                    {goal.progress}% complete - Great progress!
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
