import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { CalendarIcon } from '@heroicons/react/20/solid'
import { Goal, Milestone } from '@/types'
import { format } from 'date-fns'

interface GoalFormProps {
  isOpen: boolean
  onClose: () => void
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

export function GoalForm({ isOpen, onClose, initialData }: GoalFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'do',
    category: initialData?.category || '',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    milestones: initialData?.milestones || []
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

  const handleAddMilestone = () => {
    if (!newMilestone.trim()) return

    const milestone: Milestone = {
      id: crypto.randomUUID(),
      title: newMilestone.trim(),
      dueDate: formData.endDate ? new Date(formData.endDate + 'T00:00:00').toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      completed: false,
    }

    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, milestone],
    }))
    setNewMilestone('')
  }

  const handleRemoveMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add form validation and submission logic
    onClose()
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
          <div className="fixed inset-0 bg-black bg-opacity-90" />
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
              <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-xl transition-all">
                <div className="border-b border-border px-8 py-6">
                  <Dialog.Title className="text-2xl font-semibold text-foreground">
                    {initialData ? 'Edit Goal' : 'Create New Goal'}
                  </Dialog.Title>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="w-full h-11 rounded-lg border border-input bg-background px-4 text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter your goal title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Describe your goal and what you want to achieve"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="type" className="block text-sm font-medium text-muted-foreground">
                        Goal Type
                      </label>
                      <select
                        id="type"
                        className="w-full h-11 rounded-lg border border-input bg-background px-4 text-foreground shadow-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'do' | 'dont' })}
                      >
                        <option value="do">DO (Positive Goal)</option>
                        <option value="dont">DON'T (Break Bad Habit)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-medium text-muted-foreground">
                        Category
                      </label>
                      {isAddingCategory ? (
                        <div className="mt-1 flex gap-2 relative">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="block flex-1 rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="New category name"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddCategory}
                            disabled={!newCategory.trim()}
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-50"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingCategory(false)
                              setNewCategory('')
                            }}
                            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <select
                            id="category"
                            className="w-full h-11 rounded-lg border border-input bg-background px-4 text-foreground shadow-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          >
                            <option value="">Select a category</option>
                            {allCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setIsAddingCategory(true)}
                            className="h-11 inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <PlusIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="block text-sm font-medium text-muted-foreground">
                        Start Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="startDate"
                          className="w-full h-11 rounded-lg border border-input bg-background px-4 text-foreground shadow-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={format(new Date(formData.startDate), 'yyyy-MM-dd')}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <CalendarIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="endDate" className="block text-sm font-medium text-muted-foreground">
                        End Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="endDate"
                          className="w-full h-11 rounded-lg border border-input bg-background px-4 text-foreground shadow-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={format(new Date(formData.endDate), 'yyyy-MM-dd')}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          min={format(new Date(formData.startDate), 'yyyy-MM-dd')}
                        />
                        <CalendarIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-muted-foreground">
                      Milestones
                    </label>
                    <div className="space-y-3">
                      {formData.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            className="w-full h-11 rounded-lg border border-input bg-background px-4 text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={milestone.title}
                            onChange={(e) => {
                              const newMilestones = [...formData.milestones]
                              newMilestones[index].title = e.target.value
                              setFormData({ ...formData, milestones: newMilestones })
                            }}
                            placeholder={`Milestone ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(milestone.id)}
                            className="h-11 inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="w-full h-11 rounded-lg border border-input bg-background px-4 text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={newMilestone}
                          onChange={(e) => setNewMilestone(e.target.value)}
                          placeholder="Add a milestone"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMilestone();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddMilestone}
                          disabled={!newMilestone}
                          className="h-11 inline-flex items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="border-t border-border px-8 py-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-11 inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-11 inline-flex items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {initialData ? 'Update Goal' : 'Create Goal'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
