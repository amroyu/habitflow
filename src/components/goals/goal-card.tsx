'use client';

import { useEffect, useState } from 'react'
import { Goal, DailyEntry, Milestone, MilestoneFrequency } from '@/types'
import { motion } from 'framer-motion'
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/20/solid'
import Link from 'next/link'
import { DailyEntryForm } from './daily-entry-form'
import { ProgressVisualization } from './progress-visualization'
import { format, formatDistanceToNow, isPast, startOfWeek, startOfDay, endOfDay, isWithinInterval, Interval, differenceInDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRewards } from '@/context/rewards-context'
import { POINTS } from '@/types/rewards'

interface GoalCardProps {
  goal: Goal
  onUpdateGoal: (goal: Goal) => void
}

export function GoalCard({ goal, onUpdateGoal }: GoalCardProps) {
  const { addPoints, checkAchievements } = useRewards()
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const calculateTimeProgress = () => {
    const now = new Date()
    const startDate = new Date(goal.startDate)
    const endDate = new Date(goal.endDate)
    const totalDuration = differenceInDays(endDate, startDate)
    const elapsed = differenceInDays(now, startDate)
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
  }

  const timeProgress = calculateTimeProgress()
  const daysRemaining = differenceInDays(new Date(goal.endDate), new Date())

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updatedGoal = {
        ...goal,
        entries: goal.entries.filter(entry => entry.id !== entryId),
        lastUpdated: new Date().toISOString()
      }
      onUpdateGoal(updatedGoal)
    }
  }

  const handleEditEntry = (entry: DailyEntry) => {
    setEditingEntry(entry)
    setIsEntryFormOpen(true)
  }

  const handleSaveEntry = (entry: DailyEntry) => {
    let updatedGoal: Goal
    if (editingEntry) {
      // Update existing entry
      updatedGoal = {
        ...goal,
        entries: goal.entries.map(e => e.id === editingEntry.id ? entry : e),
        lastUpdated: new Date().toISOString()
      }
    } else {
      // Add new entry
      updatedGoal = {
        ...goal,
        entries: [...(goal.entries || []), entry],
        lastUpdated: new Date().toISOString()
      }
    }
    onUpdateGoal(updatedGoal)
    setIsEntryFormOpen(false)
    setEditingEntry(null)
  }

  const handleToggleMilestone = (milestone: Milestone) => {
    const now = new Date().toISOString()
    let updatedMilestone: Milestone

    if (milestone.frequency === 'one-time') {
      // For one-time milestones, just toggle the completed state
      updatedMilestone = {
        ...milestone,
        completed: !milestone.completed,
        lastCompleted: !milestone.completed ? now : undefined
      }
    } else {
      // For recurring milestones, check if it was completed within the current period
      const lastCompleted = milestone.lastCompleted ? new Date(milestone.lastCompleted) : null
      const isCompletedInCurrentPeriod = lastCompleted && isWithinCurrentPeriod(lastCompleted, milestone.frequency)

      updatedMilestone = {
        ...milestone,
        completed: !isCompletedInCurrentPeriod,
        lastCompleted: !isCompletedInCurrentPeriod ? now : undefined
      }
    }

    const updatedGoal = {
      ...goal,
      milestones: goal.milestones.map(m => 
        m.id === milestone.id ? updatedMilestone : m
      ),
      lastUpdated: now
    }

    onUpdateGoal(updatedGoal)
  }

  const isWithinCurrentPeriod = (date: Date, frequency: MilestoneFrequency): boolean => {
    const now = new Date()
    
    switch (frequency) {
      case 'daily':
        return date.getDate() === now.getDate() &&
               date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear()
      case 'weekly':
        const weekStart = startOfWeek(now)
        return date >= weekStart && date <= now
      case 'monthly':
        return date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear()
      case 'yearly':
        return date.getFullYear() === now.getFullYear()
      default:
        return false
    }
  }

  const formatTimeRemaining = () => {
    const endDate = new Date(goal.endDate)
    const now = new Date()
    
    const diff = endDate.getTime() - now.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Expired'
    if (days === 0) return 'Last day'
    return `${days} days left`
  }

  const renderEntryContent = (content: DailyEntry['contents'][0]) => {
    switch (content.type) {
      case 'text':
        return <p className="text-sm text-gray-700">{content.data.text}</p>
      case 'checklist':
        return (
          <div className="space-y-1">
            {(content.data.items || []).map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => {
                    const updatedGoal = {
                      ...goal,
                      entries: goal.entries.map(entry => {
                        if (entry.contents.some(c => c.data.items?.some(i => i.id === item.id))) {
                          return {
                            ...entry,
                            contents: entry.contents.map(c => {
                              if (c.type === 'checklist' && c.data.items?.some(i => i.id === item.id)) {
                                return {
                                  ...c,
                                  data: {
                                    ...c.data,
                                    items: c.data.items.map(i => 
                                      i.id === item.id ? { ...i, completed: e.target.checked } : i
                                    )
                                  }
                                }
                              }
                              return c
                            })
                          }
                        }
                        return entry
                      }),
                      lastUpdated: new Date().toISOString()
                    }
                    onUpdateGoal(updatedGoal)
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={false}
                />
                <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )
      case 'link':
        return (
          <a
            href={content.data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {content.data.url}
          </a>
        )
      case 'file':
        return (
          <div className="flex items-center space-x-2">
            <a
              href={content.data.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {content.data.fileName}
            </a>
          </div>
        )
      default:
        return null
    }
  }

  const getTimeRemaining = (dueDate: string, frequency: MilestoneFrequency) => {
    const now = new Date()
    const due = new Date(dueDate)
    
    if (isPast(due)) {
      return { text: 'Overdue', color: 'text-red-600' }
    }

    let interval: Interval
    switch (frequency) {
      case 'daily':
        interval = {
          start: startOfDay(now),
          end: endOfDay(now)
        }
        break
      case 'weekly':
        const weekStart = startOfWeek(now)
        interval = {
          start: weekStart,
          end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
        break
      case 'monthly':
        interval = {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        }
        break
      case 'yearly':
        interval = {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear(), 11, 31)
        }
        break
      default:
        // one-time
        return {
          text: formatDistanceToNow(due, { addSuffix: true }),
          color: 'text-gray-500'
        }
    }

    if (isWithinInterval(now, interval)) {
      return {
        text: `Due ${formatDistanceToNow(interval.end, { addSuffix: true })}`,
        color: 'text-orange-500'
      }
    }

    return {
      text: `Next ${frequency} period`,
      color: 'text-gray-500'
    }
  }

  const handleToggleCompletion = () => {
    const updatedGoal = {
      ...goal,
      completed: !goal.completed,
      completedAt: !goal.completed ? new Date().toISOString() : undefined,
      lastUpdated: new Date().toISOString()
    }
    onUpdateGoal(updatedGoal)
    addPoints(POINTS.COMPLETE_GOAL, 'Completed goal: ' + goal.title)
    checkAchievements()
  }

  const calculateProgress = (milestones: Milestone[]): number => {
    if (milestones.length === 0) return 0
    const completedCount = milestones.filter(m => m.status === 'completed').length
    return Math.round((completedCount / milestones.length) * 100)
  }

  const handleMilestoneComplete = (milestoneIndex: number) => {
    const updatedMilestones = [...goal.milestones].map((milestone, index) => {
      if (index === milestoneIndex) {
        const updatedMilestone: Milestone = {
          ...milestone,
          status: 'completed' as const,
          progress: 100
        }
        return updatedMilestone
      }
      return milestone
    })

    const updatedGoal = {
      ...goal,
      milestones: updatedMilestones,
      progress: calculateProgress(updatedMilestones),
      lastUpdated: new Date().toISOString()
    }

    onUpdateGoal(updatedGoal)
    addPoints(POINTS.COMPLETE_MILESTONE, 'Completed milestone: ' + updatedMilestones[milestoneIndex].title)
    checkAchievements()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-md p-6 mb-4"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
              <Button
                variant={goal.completed ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleCompletion}
                className="ml-2"
              >
                {goal.completed ? (
                  <XCircleIcon className="h-4 w-4 mr-1" />
                ) : (
                  <CheckIcon className="h-4 w-4 mr-1" />
                )}
                {goal.completed ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEntryFormOpen(true)}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Entry
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Progress</span>
              <div className="flex items-center space-x-2">
                <Progress value={goal.progress} className="flex-1" />
                <span className="text-sm font-medium">{goal.progress}%</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Time Elapsed</span>
              <div className="flex items-center space-x-2">
                <Progress 
                  value={timeProgress} 
                  className="flex-1 [&>div]:bg-amber-500" 
                />
                <span className="text-sm font-medium">{Math.round(timeProgress)}%</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Streak</span>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">{goal.streak.currentStreak} days</span>
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-6 pt-4">
              <ProgressVisualization goal={goal} />
            </div>
          )}
        </div>
      </motion.div>

      {isEntryFormOpen && (
        <DailyEntryForm
          isOpen={isEntryFormOpen}
          onClose={() => {
            setIsEntryFormOpen(false)
            setEditingEntry(null)
          }}
          goalId={goal.id}
          onSave={handleSaveEntry}
          initialData={editingEntry}
        />
      )}
    </>
  );
}
