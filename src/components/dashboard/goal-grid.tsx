import { Goal } from '@/types'
import Link from 'next/link'

interface GoalGridProps {
  goals: Goal[]
}

export function GoalGrid({ goals }: GoalGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <Link
          key={goal.id}
          href={`/goals/${goal.id}`}
          className="block group"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                goal.type === 'do'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {goal.type === 'do' ? 'DO' : "DON'T"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {goal.category}
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {goal.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {goal.description}
            </p>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{new Date(goal.startDate).toLocaleDateString()}</span>
              <span>{new Date(goal.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
