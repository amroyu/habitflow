'use client'

import { Goal } from '@/types'

export type GoalType = 'do' | 'dont' | 'all'
export type SortOption = 'progress' | 'startDate' | 'endDate' | 'title'
export type SortDirection = 'asc' | 'desc'
export type MilestoneStatus = 'all' | 'hasMilestones' | 'noMilestones' | 'completedMilestones'

export interface GoalFiltersType {
  type: GoalType
  category: string
  search: string
  dateRange: {
    start: string | null
    end: string | null
  }
  progressRange: {
    min: number
    max: number
  }
  milestoneStatus: MilestoneStatus
}

interface GoalFiltersProps {
  onFilterChange: (filters: GoalFiltersType) => void
  onSortChange: (sort: { field: SortOption; direction: SortDirection }) => void
  categories: string[]
  currentFilters: GoalFiltersType
  currentSort: {
    field: SortOption
    direction: SortDirection
  }
}

export function GoalFilters({
  onFilterChange,
  onSortChange,
  categories,
  currentFilters,
  currentSort,
}: GoalFiltersProps) {
  const handleProgressChange = (key: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0
    onFilterChange({
      ...currentFilters,
      progressRange: {
        ...currentFilters.progressRange,
        [key]: Math.min(Math.max(numValue, 0), 100),
      },
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 space-y-6">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Search */}
        <div className="space-y-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={currentFilters.search}
              onChange={(e) => onFilterChange({ ...currentFilters, search: e.target.value })}
              placeholder="Search goals..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <select
            id="type"
            value={currentFilters.type}
            onChange={(e) => onFilterChange({ ...currentFilters, type: e.target.value as GoalType })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="do">DO (Positive Goals)</option>
            <option value="dont">DON'T (Bad Habits)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            id="category"
            value={currentFilters.category}
            onChange={(e) => onFilterChange({ ...currentFilters, category: e.target.value })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              id="sort"
              value={currentSort.field}
              onChange={(e) => onSortChange({ ...currentSort, field: e.target.value as SortOption })}
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="title">Title</option>
              <option value="progress">Progress</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
            </select>
            <button
              onClick={() =>
                onSortChange({
                  ...currentSort,
                  direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
                })
              }
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={`Sort ${currentSort.direction === 'asc' ? 'ascending' : 'descending'}`}
            >
              {currentSort.direction === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                value={currentFilters.dateRange.start || ''}
                onChange={(e) =>
                  onFilterChange({
                    ...currentFilters,
                    dateRange: { ...currentFilters.dateRange, start: e.target.value || null },
                  })
                }
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <input
                type="date"
                value={currentFilters.dateRange.end || ''}
                onChange={(e) =>
                  onFilterChange({
                    ...currentFilters,
                    dateRange: { ...currentFilters.dateRange, end: e.target.value || null },
                  })
                }
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Progress Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Progress Range (%)</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                min="0"
                max="100"
                value={currentFilters.progressRange.min}
                onChange={(e) => handleProgressChange('min', e.target.value)}
                placeholder="Min"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="100"
                value={currentFilters.progressRange.max}
                onChange={(e) => handleProgressChange('max', e.target.value)}
                placeholder="Max"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Milestone Status */}
        <div className="space-y-2">
          <label htmlFor="milestoneStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Milestone Status
          </label>
          <select
            id="milestoneStatus"
            value={currentFilters.milestoneStatus}
            onChange={(e) => onFilterChange({ ...currentFilters, milestoneStatus: e.target.value as MilestoneStatus })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Goals</option>
            <option value="hasMilestones">Has Milestones</option>
            <option value="noMilestones">No Milestones</option>
            <option value="completedMilestones">Has Completed Milestones</option>
          </select>
        </div>
      </div>
    </div>
  )
}
