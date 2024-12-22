import { useEffect, useState } from 'react'
import { Goal } from '@/types'
import { motion } from 'framer-motion'
import { CalendarIcon, CheckCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

interface GoalCardProps {
  goal: Goal
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-blue-500'
}

const getTimeRemainingColor = (percentage: number) => {
  if (percentage >= 70) return 'bg-green-500'
  if (percentage >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function GoalCard({ goal }: GoalCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(100)

  useEffect(() => {
    const calculateRemaining = () => {
      const endDate = new Date(goal.endDate)
      const startDate = new Date(goal.startDate)
      const now = new Date('2024-12-23T01:13:04+03:00') // Using provided time
      
      const totalDuration = endDate.getTime() - startDate.getTime()
      const elapsed = now.getTime() - startDate.getTime()
      return Math.max(0, Math.min(100, ((totalDuration - elapsed) / totalDuration) * 100))
    }
    
    setTimeRemaining(calculateRemaining())

    const timer = setInterval(() => {
      setTimeRemaining(calculateRemaining())
    }, 1000 * 60) // Update every minute

    return () => clearInterval(timer)
  }, [goal.startDate, goal.endDate])

  const formatTimeRemaining = () => {
    const endDate = new Date(goal.endDate)
    const now = new Date('2024-12-23T01:13:04+03:00') // Using provided time
    const diff = endDate.getTime() - now.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Expired'
    if (days === 0) return 'Last day'
    return `${days} days left`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-background rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      role="article"
      aria-label={`Goal: ${goal.title}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link 
              href={`/goals/${goal.id}`}
              className="group-hover:text-primary-600 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-foreground">{goal.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                goal.type === 'do' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
              role="status"
            >
              {goal.type === 'do' ? 'DO' : "DON'T"}
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              role="status"
            >
              {goal.category}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-foreground" aria-live="polite">{goal.progress}%</span>
          </div>
          <div 
            className="h-2 bg-secondary rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={goal.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${getProgressColor(goal.progress)}`}
            />
          </div>
        </div>

        {/* Time Remaining Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
            <span className="text-sm font-medium text-foreground" aria-live="polite">{formatTimeRemaining()}</span>
          </div>
          <div 
            className="h-2 bg-secondary rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={timeRemaining}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${timeRemaining}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${getTimeRemainingColor(timeRemaining)}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <CheckCircleIcon className="w-4 h-4" />
            <span role="status" aria-label="Milestone progress">
              {goal.milestones.filter(m => m.completed).length} / {goal.milestones.length} milestones
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
