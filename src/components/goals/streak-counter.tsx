import { Streak } from '@/types'
import { FireIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface StreakCounterProps {
  streak: Streak
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = (new Date().getTime() - new Date(streak.lastUpdated).getTime()) / (1000 * 60 * 60 * 24) < 1

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center space-x-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex-shrink-0">
        <motion.div
          animate={isActive ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <FireIcon className={`h-8 w-8 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
        </motion.div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Current Streak
          </p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {streak.currentStreak}
          </p>
        </div>
        <div className="flex justify-between items-baseline mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Longest Streak
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {streak.longestStreak}
          </p>
        </div>
        <div className="mt-2">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(streak.currentStreak / streak.longestStreak) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
