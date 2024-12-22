import { Goal } from '@/types'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  PlusIcon, 
  CheckIcon, 
  PencilSquareIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface QuickActionsProps {
  goals: Goal[]
  onMarkComplete?: (goalId: string) => void
  onUpdateProgress?: (goalId: string, progress: number) => void
}

export function QuickActions({ goals, onMarkComplete, onUpdateProgress }: QuickActionsProps) {
  const inProgressGoals = goals.filter(goal => goal.progress > 0 && goal.progress < 100)
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/goals/new"
          className="flex items-center justify-center gap-2 p-4 bg-primary-50 rounded-lg text-primary-700 hover:bg-primary-100 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="text-sm font-medium">New Goal</span>
        </Link>
        <Link
          href="/goals"
          className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Update Progress</span>
        </Link>
      </div>

      {inProgressGoals.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Quick Updates</h4>
          <div className="space-y-3">
            {inProgressGoals.slice(0, 3).map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {goal.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{goal.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateProgress?.(goal.id, Math.min(100, goal.progress + 10))}
                    className="p-1 text-gray-400 hover:text-gray-500"
                    title="Increase progress by 10%"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onMarkComplete?.(goal.id)}
                    className="p-1 text-gray-400 hover:text-green-500"
                    title="Mark as complete"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
