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
  XCircleIcon
} from '@heroicons/react/20/solid'
import Link from 'next/link'
import { DailyEntryForm } from './daily-entry-form'
import { format, formatDistanceToNow, isPast, startOfWeek, startOfDay, endOfDay, isWithinInterval, Interval } from 'date-fns'
import { Button } from '@/components/ui/button'

interface GoalCardProps {
  goal: Goal
  onUpdateGoal: (goal: Goal) => void
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

export function GoalCard({ goal, onUpdateGoal }: GoalCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(100)
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null)

  useEffect(() => {
    const calculateRemaining = () => {
      const endDate = new Date(goal.endDate)
      const startDate = new Date(goal.startDate)
      const now = new Date()
      
      const totalDuration = endDate.getTime() - startDate.getTime()
      const elapsed = now.getTime() - startDate.getTime()
      return Math.max(0, Math.min(100, ((totalDuration - elapsed) / totalDuration) * 100))
    }
    
    setTimeRemaining(calculateRemaining())
  }, [goal.startDate, goal.endDate])

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
          <button
            onClick={() => setIsEntryFormOpen(true)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Entry
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">Progress</div>
            <div className="font-medium text-gray-900">{goal.progress}%</div>
          </div>
          <div className="overflow-hidden bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">Time Remaining</div>
            <div className="font-medium text-gray-900">{Math.round(timeRemaining)}%</div>
          </div>
          <div className="overflow-hidden bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getTimeRemainingColor(timeRemaining)}`}
              style={{ width: `${timeRemaining}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Streak: {goal.streak.currentStreak} days
          </div>
          <div className="flex items-center text-gray-500">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Best: {goal.streak.longestStreak} days
          </div>
        </div>

        {goal.entries && goal.entries.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-900">Daily Entries</h4>
              <span className="text-xs text-gray-500">{goal.entries.length} entries</span>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {goal.entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <div key={entry.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          title="Edit entry"
                        >
                          <PencilIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          title="Delete entry"
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {entry.contents.map((content, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-gray-700 mb-1">
                            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                          </div>
                          {renderEntryContent(content)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {goal.milestones.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Milestones</h4>
            <div className="space-y-2">
              {goal.milestones.map((milestone) => {
                const isRecurring = milestone.frequency !== 'one-time'
                const lastCompleted = milestone.lastCompleted ? new Date(milestone.lastCompleted) : null
                const isCompletedInCurrentPeriod = lastCompleted ? isWithinCurrentPeriod(lastCompleted, milestone.frequency) : false
                const displayCompleted = isRecurring ? isCompletedInCurrentPeriod : milestone.completed
                const timeRemaining = getTimeRemaining(milestone.dueDate, milestone.frequency)

                return (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 rounded-md bg-gray-50"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={displayCompleted}
                        onChange={() => handleToggleMilestone(milestone)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${displayCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {milestone.title}
                          </p>
                          <span className={`text-xs ${timeRemaining.color}`}>
                            {timeRemaining.text}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{format(new Date(milestone.dueDate), 'MMM d, yyyy')}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                            {milestone.frequency.charAt(0).toUpperCase() + milestone.frequency.slice(1)}
                          </span>
                          {lastCompleted && (
                            <span>Last completed: {format(lastCompleted, 'MMM d')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setIsEntryFormOpen(true)
                          setEditingEntry({
                            id: crypto.randomUUID(),
                            goalId: goal.id,
                            date: new Date().toISOString(),
                            contents: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            milestoneId: milestone.id
                          })
                        }}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title="Add entry for this milestone"
                      >
                        <PlusIcon className="h-5 w-5 text-indigo-600" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>

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
    </>
  )
}
