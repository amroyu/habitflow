import { Fragment, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { XMarkIcon, PlusIcon, TrashIcon, PaperClipIcon, LinkIcon, ListBulletIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { DailyEntry, EntryContent, EntryContentType, ChecklistItem } from '@/types'
import { format } from 'date-fns'

interface DailyEntryFormProps {
  isOpen: boolean
  onClose: () => void
  goalId: string
  onSave: (entry: DailyEntry) => void
  initialData?: DailyEntry | null
}

export function DailyEntryForm({ isOpen, onClose, onSave, goalId, initialData }: DailyEntryFormProps) {
  const [contents, setContents] = useState<EntryContent[]>([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (initialData) {
      setContents(initialData.contents)
      setDate(initialData.date)
    } else {
      setContents([])
      setDate(new Date().toISOString().split('T')[0])
    }
  }, [initialData, isOpen])

  const handleAddContent = (type: EntryContent['type']) => {
    const newContent: EntryContent = {
      type,
      data: type === 'checklist' ? { items: [] } : {}
    }
    setContents([...contents, newContent])
  }

  const handleUpdateContent = (index: number, content: EntryContent) => {
    const newContents = [...contents]
    newContents[index] = content
    setContents(newContents)
  }

  const handleRemoveContent = (index: number) => {
    setContents(contents.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const entry: DailyEntry = {
      id: initialData?.id || crypto.randomUUID(),
      goalId,
      date,
      contents,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    onSave(entry)
  }

  const renderContentEditor = (content: EntryContent, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text
            </label>
            <textarea
              value={content.data.text || ''}
              onChange={(e) => handleUpdateContent(index, {
                ...content,
                data: { ...content.data, text: e.target.value }
              })}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        )
      case 'checklist':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Checklist
            </label>
            {(content.data.items || []).map((item, itemIndex) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => {
                    const newItems = [...(content.data.items || [])]
                    newItems[itemIndex] = {
                      ...item,
                      completed: e.target.checked
                    }
                    handleUpdateContent(index, {
                      ...content,
                      data: { ...content.data, items: newItems }
                    })
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...(content.data.items || [])]
                    newItems[itemIndex] = {
                      ...item,
                      text: e.target.value
                    }
                    handleUpdateContent(index, {
                      ...content,
                      data: { ...content.data, items: newItems }
                    })
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = (content.data.items || []).filter((_, i) => i !== itemIndex)
                    handleUpdateContent(index, {
                      ...content,
                      data: { ...content.data, items: newItems }
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [
                  ...(content.data.items || []),
                  { id: crypto.randomUUID(), text: '', completed: false }
                ]
                handleUpdateContent(index, {
                  ...content,
                  data: { ...content.data, items: newItems }
                })
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>
        )
      case 'link':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link URL
            </label>
            <input
              type="url"
              value={content.data.url || ''}
              onChange={(e) => handleUpdateContent(index, {
                ...content,
                data: { ...content.data, url: e.target.value }
              })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        )
      case 'file':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              File
            </label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // Here you would typically upload the file to your storage service
                  // and get back a URL. For now, we'll just store the file name
                  handleUpdateContent(index, {
                    ...content,
                    data: {
                      fileName: file.name,
                      fileUrl: URL.createObjectURL(file)
                    }
                  })
                }
              }}
            />
            {content.data.fileName && (
              <div className="text-sm text-gray-600">
                Current file: {content.data.fileName}
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Entry' : 'Add Daily Entry'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="space-y-4">
            {contents.map((content, index) => (
              <div key={index} className="relative bg-gray-50 rounded-lg p-4">
                <button
                  type="button"
                  onClick={() => handleRemoveContent(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                {renderContentEditor(content, index)}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAddContent('text')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Text
            </button>
            <button
              type="button"
              onClick={() => handleAddContent('checklist')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Checklist
            </button>
            <button
              type="button"
              onClick={() => handleAddContent('link')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Link
            </button>
            <button
              type="button"
              onClick={() => handleAddContent('file')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add File
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {initialData ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
