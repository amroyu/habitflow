import { Badge } from '@/types'
import { TrophyIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface BadgesShowcaseProps {
  badges: Badge[]
  onBadgeClick?: (badge: Badge) => void
}

export function BadgesShowcase({ badges, onBadgeClick }: BadgesShowcaseProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
        <TrophyIcon className="h-5 w-5 text-yellow-500" />
        Your Achievements
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <motion.button
            key={badge.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBadgeClick?.(badge)}
            className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <span className="text-2xl" role="img" aria-label={badge.name}>
                {badge.icon}
              </span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white text-center">
              {badge.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              {badge.description}
            </p>
            {badge.earnedAt && (
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">
                Earned {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
