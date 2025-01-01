'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Goal, GoalType } from '@/types'
import { GoalForm } from '@/components/goals/goal-form'
import { 
  GoalFilters, 
  type GoalFiltersType, 
  type SortOption, 
  type SortDirection 
} from '@/components/goals/goal-filters'
import { FilterPreferencesMenu } from '@/components/goals/filter-preferences-menu'
import { useFilterPreferences } from '@/hooks/use-filter-preferences'
import { GoalCard } from '@/components/goals/goal-card'
import { DailyEntries } from '@/components/goals/daily-entries'
import { GoalCompare } from '@/components/goals/goal-compare'

const DEFAULT_FILTERS: GoalFiltersType = {
  type: 'all',
  category: 'all',
  search: '',
  dateRange: {
    start: null,
    end: null,
  },
  progressRange: {
    min: 0,
    max: 100,
  },
  milestoneStatus: 'all',
}

const DEFAULT_SORT = {
  field: 'title' as SortOption,
  direction: 'asc' as SortDirection,
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Learn TypeScript',
    description: 'Master TypeScript and its advanced features',
    type: 'do',
    category: 'Education',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    progress: 25,
    milestones: [],
    streak: {
      currentStreak: 5,
      longestStreak: 7,
      lastUpdated: new Date().toISOString()
    },
    entries: [],
    completed: false,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Exercise Daily',
    description: 'Maintain a healthy exercise routine',
    type: 'do',
    category: 'Physical Health',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    progress: 60,
    milestones: [],
    streak: {
      currentStreak: 3,
      longestStreak: 10,
      lastUpdated: new Date().toISOString()
    },
    entries: [],
    completed: false,
    lastUpdated: new Date().toISOString()
  }
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCompareForm, setShowCompareForm] = useState(false)
  const [filters, setFilters] = useState<GoalFiltersType>(DEFAULT_FILTERS)
  const [sort, setSort] = useState(DEFAULT_SORT)

  const {
    preferences,
    activePreference,
    savePreference,
    loadPreference,
    deletePreference,
    clearPreference,
  } = useFilterPreferences()

  const handleFilterChange = (newFilters: GoalFiltersType) => {
    setFilters(newFilters)
  }

  const handleSortChange = (newSort: { field: SortOption; direction: SortDirection }) => {
    setSort(newSort)
  }

  const handleSavePreference = (name: string) => {
    savePreference(name, filters, sort)
  }

  const handleLoadPreference = (id: string) => {
    const preference = loadPreference(id)
    if (preference) {
      setFilters(preference.filters)
      setSort(preference.sort)
    }
  }

  const handleClearPreference = () => {
    clearPreference()
    setFilters(DEFAULT_FILTERS)
    setSort(DEFAULT_SORT)
  }

  const filteredGoals = useMemo(() => {
    let result = [...goals]

    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter((goal) => goal.type === filters.type)
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter((goal) => goal.category === filters.category)
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (goal) =>
          goal.title.toLowerCase().includes(searchLower) ||
          goal.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply date range filter
    if (filters.dateRange.start) {
      result = result.filter((goal) => new Date(goal.startDate) >= new Date(filters.dateRange.start!))
    }
    if (filters.dateRange.end) {
      result = result.filter((goal) => new Date(goal.endDate) <= new Date(filters.dateRange.end!))
    }

    // Apply progress range filter
    result = result.filter(
      (goal) => goal.progress >= filters.progressRange.min && goal.progress <= filters.progressRange.max
    )

    // Apply milestone status filter
    if (filters.milestoneStatus !== 'all') {
      switch (filters.milestoneStatus) {
        case 'hasMilestones':
          result = result.filter((goal) => goal.milestones && goal.milestones.length > 0)
          break
        case 'noMilestones':
          result = result.filter((goal) => !goal.milestones || goal.milestones.length === 0)
          break
        case 'completedMilestones':
          result = result.filter(
            (goal) => goal.milestones && goal.milestones.some((m) => m.completed)
          )
          break
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sort.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'progress':
          comparison = a.progress - b.progress
          break
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          break
        case 'endDate':
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          break
      }
      return sort.direction === 'asc' ? comparison : -comparison
    })

    return result
  }, [filters, sort, goals])

  const categories = useMemo(() => {
    const uniqueCategories = new Set(goals.map((goal) => goal.category))
    return Array.from(uniqueCategories)
  }, [goals])

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal)
  }

  const handleUpdateGoal = (updatedGoal: Goal) => {
    const newGoals = goals.map(g => g.id === updatedGoal.id ? updatedGoal : g)
    setGoals(newGoals)
    setSelectedGoal(updatedGoal)
  }

  const handleUpdateWidget = (goalId: string, widgetId: string, settings: any) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          widgets: (goal.widgets || []).map(widget =>
            widget.id === widgetId
              ? { ...widget, settings }
              : widget
          )
        };
      }
      return goal;
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Goals</h1>
        <p className="text-muted-foreground">Track and manage your goals</p>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCompareForm(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Compare Goals
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Goal
          </button>
        </div>
      </div>

      {/* Filters */}
      <GoalFilters
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        categories={categories}
        currentFilters={filters}
        currentSort={sort}
      />

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No goals found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your filters or create a new goal to get started.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Goal
              </button>
            </div>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onUpdateWidget={handleUpdateWidget}
            />
          ))
        )}
      </div>

      <div className="space-y-4">
        {selectedGoal && (
          <>
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {selectedGoal.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedGoal.description}
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <DailyEntries
                  goal={selectedGoal}
                  onUpdateGoal={handleUpdateGoal}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <GoalForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={(newGoal) => {
          setGoals(prevGoals => [...prevGoals, { ...newGoal, id: String(Date.now()) }])
          setShowCreateForm(false)
        }}
      />

      <GoalCompare
        isOpen={showCompareForm}
        onClose={() => setShowCompareForm(false)}
        goals={goals}
      />
    </div>
  )
}
