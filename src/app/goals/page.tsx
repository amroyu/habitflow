'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { mockGoals } from '@/lib/mock-data'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Goal } from '@/types'
import { GoalForm } from '@/components/goals/goal-form'
import { GoalFilters, type GoalFiltersType, type SortOption, type SortDirection } from '@/components/goals/goal-filters'
import { FilterPreferencesMenu } from '@/components/goals/filter-preferences-menu'
import { useFilterPreferences } from '@/hooks/use-filter-preferences'

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

export default function GoalsPage() {
  const [filters, setFilters] = useState<GoalFiltersType>(DEFAULT_FILTERS)
  const [sort, setSort] = useState(DEFAULT_SORT)
  const [showCreateForm, setShowCreateForm] = useState(false)

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
    let result = [...mockGoals]

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
  }, [filters, sort])

  const categories = useMemo(() => {
    const uniqueCategories = new Set(mockGoals.map((goal) => goal.category))
    return Array.from(uniqueCategories)
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Goals
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              Track and manage your goals to build better habits
            </p>
          </div>
          <div className="flex items-center gap-4 self-stretch sm:self-auto">
            <FilterPreferencesMenu
              preferences={preferences}
              activePreference={activePreference}
              currentFilters={filters}
              currentSort={sort}
              onSavePreference={handleSavePreference}
              onLoadPreference={handleLoadPreference}
              onDeletePreference={deletePreference}
              onClearPreference={handleClearPreference}
            />
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create New Goal
                </button>
              </div>
            </div>
          ) : (
            filteredGoals.map((goal) => (
              <div
                key={goal.id}
                className="group bg-white dark:bg-gray-800 shadow hover:shadow-md rounded-lg overflow-hidden transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          goal.type === 'do'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-100'
                        }`}
                      >
                        {goal.type === 'do' ? 'DO' : "DON'T"}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                        {goal.category}
                      </span>
                    </div>
                    <Link
                      href={`/goals/${goal.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {goal.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${
                          goal.type === 'do'
                            ? 'bg-primary-600 dark:bg-primary-500'
                            : 'bg-red-600 dark:bg-red-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {goal.milestones.filter((m) => m.completed).length} of {goal.milestones.length} milestones
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <GoalForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />
    </DashboardLayout>
  )
}
