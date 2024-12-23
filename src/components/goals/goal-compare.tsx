import { useState } from 'react'
import { Goal } from '@/types'
import { Dialog } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface GoalCompareProps {
  goals: Goal[]
  isOpen: boolean
  onClose: () => void
}

export function GoalCompare({ goals, isOpen, onClose }: GoalCompareProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([])

  const filteredGoals = goals.filter(goal => 
    goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleGoal = (goal: Goal) => {
    if (selectedGoals.find(g => g.id === goal.id)) {
      setSelectedGoals(selectedGoals.filter(g => g.id !== goal.id))
    } else if (selectedGoals.length < 5) {
      setSelectedGoals([...selectedGoals, goal])
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/25" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Select Goals to Compare
            </Dialog.Title>

            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredGoals.map((goal) => (
                <label
                  key={goal.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGoals.some(g => g.id === goal.id)}
                      onChange={() => handleToggleGoal(goal)}
                      disabled={selectedGoals.length >= 5 && !selectedGoals.some(g => g.id === goal.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <div className="font-medium">{goal.title}</div>
                      <div className="text-sm text-gray-500">{goal.category}</div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {goal.progress}%
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Select up to 5 goals to compare ({selectedGoals.length}/5 selected)
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Handle comparison
                  onClose()
                }}
                disabled={selectedGoals.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600"
              >
                Compare
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
