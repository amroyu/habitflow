import { Goal } from '@/types'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'

interface GoalSelectorProps {
  goals: Goal[]
  selectedGoalIds: string[]
  onSelectionChange: (goalIds: string[]) => void
  maxSelections?: number
}

export function GoalSelector({ 
  goals, 
  selectedGoalIds, 
  onSelectionChange,
  maxSelections = 5
}: GoalSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGoals = goals.filter(goal => 
    goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleGoal = (goalId: string) => {
    if (selectedGoalIds.includes(goalId)) {
      onSelectionChange(selectedGoalIds.filter(id => id !== goalId))
    } else if (selectedGoalIds.length < maxSelections) {
      onSelectionChange([...selectedGoalIds, goalId])
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search goals..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Goals List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredGoals.map((goal) => {
          const isSelected = selectedGoalIds.includes(goal.id)
          return (
            <button
              key={goal.id}
              onClick={() => handleToggleGoal(goal.id)}
              disabled={!isSelected && selectedGoalIds.length >= maxSelections}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              } ${
                !isSelected && selectedGoalIds.length >= maxSelections
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-primary-500' : 'border-gray-300'
                }`}>
                  {isSelected && <CheckIcon className="w-4 h-4 text-primary-500" />}
                </div>
                <div className="text-left">
                  <p className="font-medium">{goal.title}</p>
                  <p className="text-sm text-gray-500">{goal.category}</p>
                </div>
              </div>
              <span className="text-sm font-medium">
                {goal.progress}%
              </span>
            </button>
          )
        })}
      </div>

      {/* Selection Limit Notice */}
      <p className="text-sm text-gray-500 text-center">
        Select up to {maxSelections} goals to compare
        ({selectedGoalIds.length}/{maxSelections} selected)
      </p>
    </div>
  )
}
