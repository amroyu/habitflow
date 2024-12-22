import { useState, useEffect } from 'react'
import { GoalFiltersType, SortOption, SortDirection } from '@/components/goals/goal-filters'

const STORAGE_KEY = 'habitflow_filter_preferences'

export interface FilterPreference {
  id: string
  name: string
  filters: GoalFiltersType
  sort: {
    field: SortOption
    direction: SortDirection
  }
}

interface UseFilterPreferences {
  preferences: FilterPreference[]
  activePreference: string | null
  savePreference: (name: string, filters: GoalFiltersType, sort: { field: SortOption; direction: SortDirection }) => void
  loadPreference: (id: string) => FilterPreference | null
  deletePreference: (id: string) => void
  clearPreference: () => void
}

export function useFilterPreferences(): UseFilterPreferences {
  const [preferences, setPreferences] = useState<FilterPreference[]>([])
  const [activePreference, setActivePreference] = useState<string | null>(null)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY)
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed.preferences || [])
        setActivePreference(parsed.activePreference || null)
      } catch (error) {
        console.error('Error loading filter preferences:', error)
      }
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        preferences,
        activePreference,
      })
    )
  }, [preferences, activePreference])

  const savePreference = (
    name: string,
    filters: GoalFiltersType,
    sort: { field: SortOption; direction: SortDirection }
  ) => {
    const newPreference: FilterPreference = {
      id: Date.now().toString(),
      name,
      filters,
      sort,
    }
    setPreferences((prev) => [...prev, newPreference])
    setActivePreference(newPreference.id)
  }

  const loadPreference = (id: string) => {
    const preference = preferences.find((p) => p.id === id)
    if (preference) {
      setActivePreference(id)
      return preference
    }
    return null
  }

  const deletePreference = (id: string) => {
    setPreferences((prev) => prev.filter((p) => p.id !== id))
    if (activePreference === id) {
      setActivePreference(null)
    }
  }

  const clearPreference = () => {
    setActivePreference(null)
  }

  return {
    preferences,
    activePreference,
    savePreference,
    loadPreference,
    deletePreference,
    clearPreference,
  }
}
