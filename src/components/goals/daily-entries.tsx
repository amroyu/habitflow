import { useState } from 'react'
import { format } from 'date-fns'
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline'
import { DailyEntry, Goal } from '@/types'
import { DailyEntryForm } from './daily-entry-form'

interface DailyEntriesProps {
  goal: Goal
  onUpdateGoal: (goal: Goal) => void
}

export function DailyEntries({ goal, onUpdateGoal }: DailyEntriesProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | undefined>()

  const handleSaveEntry = (entry: DailyEntry) => {
    const existingEntryIndex = goal.entries.findIndex(e => e.id === entry.id)
    let newEntries: DailyEntry[]
    
    if (existingEntryIndex >= 0) {
      newEntries = [...goal.entries]
      newEntries[existingEntryIndex] = entry
    } else {
      newEntries = [...goal.entries, entry]
    }

    onUpdateGoal({
      ...goal,
      entries: newEntries,
      lastUpdated: new Date().toISOString()
    })
  }

  const renderContent = (content: DailyEntry['contents'][0]) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="text-gray-700 whitespace-pre-wrap">
            {content.data.text}
          </div>
        )
      case 'checklist':
        return (
          <div className="space-y-1">
            {content.data.items?.map(item => (
              <div key={item.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  readOnly
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className={item.completed ? 'line-through text-gray-500' : ''}>
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
            className="text-blue-600 hover:underline"
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Daily Entries</h3>
        <button
          onClick={() => {
            setSelectedEntry(undefined)
            setIsFormOpen(true)
          }}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Entry
        </button>
      </div>

      <div className="space-y-4">
        {(goal.entries || [])
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(entry => (
            <div
              key={entry.id}
              className="bg-white shadow rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {format(new Date(entry.date), 'MMMM d, yyyy')}
                </div>
                <button
                  onClick={() => {
                    setSelectedEntry(entry)
                    setIsFormOpen(true)
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {entry.contents.map((content, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">
                      {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                    </div>
                    {renderContent(content)}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <DailyEntryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        goalId={goal.id}
        onSave={handleSaveEntry}
        initialData={selectedEntry}
      />
    </div>
  )
}
