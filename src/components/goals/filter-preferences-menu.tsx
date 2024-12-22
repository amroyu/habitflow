'use client'

import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { GoalFiltersType } from './goal-filters'
import type { SortOption, SortDirection } from './goal-filters'

interface FilterPreferencesMenuProps {
  preferences: Array<{
    id: string
    name: string
    filters: GoalFiltersType
    sort: { field: SortOption; direction: SortDirection }
  }>
  activePreference: string | null
  currentFilters: GoalFiltersType
  currentSort: { field: SortOption; direction: SortDirection }
  onSavePreference: (name: string, filters: GoalFiltersType, sort: { field: SortOption; direction: SortDirection }) => void
  onLoadPreference: (id: string) => void
  onDeletePreference: (id: string) => void
  onClearPreference: () => void
}

export function FilterPreferencesMenu({
  preferences,
  activePreference,
  currentFilters,
  currentSort,
  onSavePreference,
  onLoadPreference,
  onDeletePreference,
  onClearPreference,
}: FilterPreferencesMenuProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newPreferenceName, setNewPreferenceName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleSave = () => {
    if (newPreferenceName.trim()) {
      onSavePreference(newPreferenceName.trim(), currentFilters, currentSort)
      setNewPreferenceName('')
      setShowSaveDialog(false)
    }
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
        Filter Presets
        {activePreference && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-72 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none z-10">
          <div className="p-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                  } group flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-150`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Save Current Filters
                </button>
              )}
            </Menu.Item>
            {activePreference && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onClearPreference}
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                    } group flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-150`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Active Preset
                  </button>
                )}
              </Menu.Item>
            )}
          </div>

          {preferences.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Saved Presets
              </div>
              {preferences.map((pref) => (
                <Menu.Item key={pref.id}>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors duration-150`}
                    >
                      <button
                        onClick={() => onLoadPreference(pref.id)}
                        className={`flex items-center ${
                          pref.id === activePreference
                            ? 'text-primary-600 dark:text-primary-400 font-medium'
                            : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {pref.id === activePreference && (
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {pref.name}
                      </button>
                      {showDeleteConfirm === pref.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onDeletePreference(pref.id)
                              setShowDeleteConfirm(null)
                            }}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(pref.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-opacity duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
          )}
        </Menu.Items>
      </Transition>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Save Filter Preset</h3>
            <input
              type="text"
              value={newPreferenceName}
              onChange={(e) => setNewPreferenceName(e.target.value)}
              placeholder="Enter preset name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setNewPreferenceName('')
                  setShowSaveDialog(false)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!newPreferenceName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Menu>
  )
}
