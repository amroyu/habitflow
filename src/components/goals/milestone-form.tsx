import { Milestone } from '@/types'
import { formatDateRelative } from '@/utils/date'
import { PlusIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface MilestoneFormProps {
  milestones: Milestone[]
  onChange: (milestones: Milestone[]) => void
  startDate: string
  endDate: string
}

export function MilestoneForm({ milestones, onChange, startDate, endDate }: MilestoneFormProps) {
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    dueDate: '',
  })

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.dueDate) return

    const milestone: Milestone = {
      id: Math.random().toString(36).substr(2, 9),
      title: newMilestone.title,
      dueDate: newMilestone.dueDate,
      completed: false,
    }

    onChange([...milestones, milestone])
    setNewMilestone({ title: '', dueDate: '' })
  }

  const handleRemoveMilestone = (id: string) => {
    onChange(milestones.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <input
            type="text"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
            placeholder="Enter milestone title"
          />
        </div>
        <div className="col-span-4">
          <div className="relative">
            <input
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              min={startDate}
              max={endDate}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base pr-10"
            />
            <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div className="col-span-2">
          <button
            type="button"
            onClick={handleAddMilestone}
            disabled={!newMilestone.title || !newMilestone.dueDate}
            className="w-full h-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="ml-1">Add</span>
          </button>
        </div>
      </div>

      {milestones.length > 0 && (
        <div className="mt-4 border dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          {milestones
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => {
                      const updatedMilestones = milestones.map((m) =>
                        m.id === milestone.id ? { ...m, completed: !m.completed } : m
                      )
                      onChange(updatedMilestones)
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due {formatDateRelative(milestone.dueDate)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(milestone.id)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
