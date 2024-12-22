import { Goal } from '@/types'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface GoalSummaryProps {
  goals: Goal[]
}

export function GoalSummary({ goals }: GoalSummaryProps) {
  const sortedGoals = [...goals].sort((a, b) => b.progress - a.progress)
  const topGoals = sortedGoals.slice(0, 5)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Goals</h3>
        <Link 
          href="/goals" 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {topGoals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-700">
                {index + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <Link 
                href={`/goals/${goal.id}`}
                className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
              >
                {goal.title}
              </Link>
              <div className="flex items-center mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-primary-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {goal.progress}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        {goals.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No goals created yet</p>
            <Link
              href="/goals/new"
              className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Create your first goal
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
