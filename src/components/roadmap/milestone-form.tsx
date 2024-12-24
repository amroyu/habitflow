'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoadMapMilestone, Goal, Habit } from '@/types'
import { MultiSelect } from '@/components/ui/multi-select'

interface MilestoneFormProps {
  onSubmit: (milestone: Partial<RoadMapMilestone>) => void
  initialData?: Partial<RoadMapMilestone>
  existingMilestones: RoadMapMilestone[]
  goals: Goal[]
  habits: Habit[]
}

export function MilestoneForm({ 
  onSubmit, 
  initialData, 
  existingMilestones,
  goals,
  habits 
}: MilestoneFormProps) {
  const [formData, setFormData] = useState<Partial<RoadMapMilestone>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'goal',
    referenceId: initialData?.referenceId || '',
    dependsOn: initialData?.dependsOn || [],
  })

  const [availableReferences, setAvailableReferences] = useState<Array<{ id: string; title: string }>>([])

  useEffect(() => {
    if (formData.type === 'goal' && goals?.length) {
      setAvailableReferences(goals.map(g => ({ id: g.id, title: g.title })))
    } else if (formData.type === 'habit' && habits?.length) {
      setAvailableReferences(habits.map(h => ({ id: h.id, title: h.title })))
    } else {
      setAvailableReferences([])
    }
  }, [formData.type, goals, habits])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Milestone Title
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter milestone title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this milestone"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <Select
          value={formData.type}
          onValueChange={(value: 'goal' | 'habit') => 
            setFormData({ ...formData, type: value, referenceId: '' })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="goal">Goal</SelectItem>
            <SelectItem value="habit">Habit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700">
          {formData.type === 'goal' ? 'Select Goal' : 'Select Habit'}
        </label>
        <Select
          value={formData.referenceId}
          onValueChange={(value) => setFormData({ ...formData, referenceId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${formData.type}`} />
          </SelectTrigger>
          <SelectContent>
            {availableReferences.map((ref) => (
              <SelectItem key={ref.id} value={ref.id}>
                {ref.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dependencies
        </label>
        <MultiSelect
          options={existingMilestones
            .filter(m => m.id !== initialData?.id)
            .map(m => ({
              label: m.title,
              value: m.id
            }))}
          value={formData.dependsOn?.map(id => ({
            label: existingMilestones.find(m => m.id === id)?.title || '',
            value: id
          })) || []}
          onChange={(selected) => 
            setFormData({ 
              ...formData, 
              dependsOn: selected.map(s => s.value)
            })
          }
          placeholder="Select dependencies"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Milestone' : 'Add Milestone'}
      </Button>
    </form>
  )
}
