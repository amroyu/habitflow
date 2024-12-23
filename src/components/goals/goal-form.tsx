import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { CalendarIcon } from '@heroicons/react/20/solid'
import { Goal, Milestone, MilestoneFrequency } from '@/types'
import { format } from 'date-fns'

interface GoalFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (goal: Goal) => void
  initialData?: Goal
}

const POSITIVE_CATEGORIES = [
  // Personal Growth
  'Personal Development',
  'Education',
  'Learning',
  'Skills',
  'Career',
  'Professional',
  
  // Health & Wellness
  'Physical Health',
  'Mental Health',
  'Fitness',
  'Nutrition',
  'Sleep',
  'Meditation',
  'Wellness',
  
  // Relationships
  'Family',
  'Friends',
  'Relationships',
  'Social',
  'Parenting',
  'Marriage',
  
  // Finance
  'Finance',
  'Money',
  'Investment',
  'Savings',
  'Budgeting',
  'Business',
  'Entrepreneurship',
  
  // Lifestyle
  'Lifestyle',
  'Travel',
  'Hobbies',
  'Recreation',
  'Adventure',
  'Entertainment',
  
  // Productivity
  'Productivity',
  'Time Management',
  'Organization',
  'Goals',
  'Planning',
  'Habits',
  
  // Creativity
  'Creativity',
  'Art',
  'Music',
  'Writing',
  'Design',
  'Innovation',
  
  // Personal Care
  'Self-Care',
  'Grooming',
  'Fashion',
  'Beauty',
  
  // Home
  'Home',
  'Household',
  'Gardening',
  'Decoration',
  'DIY',
  
  // Technology
  'Technology',
  'Digital',
  'Coding',
  'Gaming',
  
  // Environment
  'Environment',
  'Sustainability',
  'Nature',
  'Conservation',
  
  // Community
  'Community',
  'Volunteering',
  'Charity',
  'Social Impact',
  
  // Spirituality
  'Spirituality',
  'Religion',
  'Faith',
  'Mindfulness'
].sort()

const NEGATIVE_CATEGORIES = [
  // Health
  'Smoking',
  'Alcohol',
  'Junk Food',
  'Overeating',
  'Drugs',
  
  // Technology
  'Social Media',
  'Gaming',
  'Phone Addiction',
  'TV',
  'Internet Addiction',
  
  // Behavior
  'Procrastination',
  'Laziness',
  'Negative Thinking',
  'Complaining',
  'Gossiping',
  'Lying',
  
  // Finance
  'Overspending',
  'Gambling',
  'Impulse Buying',
  
  // Lifestyle
  'Late Night',
  'Oversleeping',
  'Nail Biting',
  'Swearing',
  
  // Relationships
  'Toxic Relationships',
  'Drama',
  'Jealousy',
  
  // Work
  'Perfectionism',
  'Overworking',
  'Multitasking'
].sort()

interface MilestoneFormData {
  title: string
  dueDate: string
  frequency: MilestoneFrequency
}

export function GoalForm({ isOpen, onClose, onSave, initialData }: GoalFormProps) {
  const [formData, setFormData] = useState<Omit<Goal, 'id' | 'progress' | 'entries' | 'streak' | 'lastUpdated'>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'do',
    category: initialData?.category || '',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    milestones: initialData?.milestones || []
  })

  const [milestoneForm, setMilestoneForm] = useState<MilestoneFormData>({
    title: '',
    dueDate: '',
    frequency: 'one-time'
  })

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [newMilestone, setNewMilestone] = useState('')

  // Get categories based on goal type
  const currentCategories = formData.type === 'do' ? POSITIVE_CATEGORIES : NEGATIVE_CATEGORIES
  const allCategories = [...currentCategories, ...customCategories].filter((value, index, self) => self.indexOf(value) === index)

  useEffect(() => {
    const validCategories = formData.type === 'do' ? POSITIVE_CATEGORIES : NEGATIVE_CATEGORIES
    if (!validCategories.includes(formData.category) && !customCategories.includes(formData.category)) {
      setFormData(prev => ({ ...prev, category: '' }))
    }
  }, [formData.type])

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCustomCategories(prev => [...prev, newCategory.trim()])
      setFormData(prev => ({ ...prev, category: newCategory.trim() }))
      setNewCategory('')
      setIsAddingCategory(false)
    }
  }

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault()
    if (milestoneForm.title && milestoneForm.dueDate) {
      const newMilestone: Milestone = {
        id: crypto.randomUUID(),
        ...milestoneForm,
        completed: false
      }
      setFormData({
        ...formData,
        milestones: [...formData.milestones, newMilestone]
      })
      setMilestoneForm({
        title: '',
        dueDate: '',
        frequency: 'one-time'
      })
    }
  }

  const handleRemoveMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newGoal: Goal = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      progress: initialData?.progress || 0,
      entries: initialData?.entries || [],
      streak: initialData?.streak || {
        currentStreak: 0,
        longestStreak: 0,
        lastUpdated: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    }
    onSave(newGoal)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform rounded-lg bg-white shadow-xl transition-all">
                <div className="border-b border-border px-8 py-6">
                  <Dialog.Title className="text-lg font-semibold">
                    {initialData ? 'Edit Goal' : 'Create New Goal'}
                  </Dialog.Title>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="do"
                            checked={formData.type === 'do'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'do' | 'dont' })}
                            className="form-radio h-4 w-4 text-indigo-600"
                          />
                          <span className="ml-2">Do</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="dont"
                            checked={formData.type === 'dont'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'do' | 'dont' })}
                            className="form-radio h-4 w-4 text-indigo-600"
                          />
                          <span className="ml-2">Don't</span>
                        </label>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id="category"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a category</option>
                        {allCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          required
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          required
                          value={formData.endDate}
                          min={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
                        {formData.milestones.length > 0 && (
                          <span className="text-sm text-gray-500">
                            {formData.milestones.length} milestone{formData.milestones.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Existing Milestones */}
                      {formData.milestones.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                          {formData.milestones.map((milestone, index) => (
                            <div key={milestone.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                              <div className="flex-1 min-w-0 mr-4">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {milestone.title}
                                  </p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {milestone.frequency.split('-').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newMilestones = [...formData.milestones]
                                  newMilestones.splice(index, 1)
                                  setFormData({ ...formData, milestones: newMilestones })
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Milestone Form */}
                      <div className="border rounded-lg p-4 space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">Add New Milestone</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label htmlFor="milestone-title" className="block text-sm font-medium text-gray-700">
                              Title
                            </label>
                            <input
                              type="text"
                              id="milestone-title"
                              value={milestoneForm.title}
                              onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Enter milestone title"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="milestone-date" className="block text-sm font-medium text-gray-700">
                                Due Date
                              </label>
                              <input
                                type="date"
                                id="milestone-date"
                                value={milestoneForm.dueDate}
                                onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="milestone-frequency" className="block text-sm font-medium text-gray-700">
                                Frequency
                              </label>
                              <select
                                id="milestone-frequency"
                                value={milestoneForm.frequency}
                                onChange={(e) => setMilestoneForm({ 
                                  ...milestoneForm, 
                                  frequency: e.target.value as MilestoneFrequency 
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="one-time">One Time</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleAddMilestone}
                              disabled={!milestoneForm.title || !milestoneForm.dueDate}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <PlusIcon className="h-4 w-4 mr-1.5" />
                              Add Milestone
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-8 py-6 flex justify-end space-x-4">
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
                      {initialData ? 'Update Goal' : 'Create Goal'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
