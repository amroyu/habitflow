'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { RoadMap, RoadMapTemplate, Milestone } from '@/types'

interface RoadMapFormProps {
  onSubmit: (roadMap: Partial<RoadMap | RoadMapTemplate>, status?: 'draft' | 'active') => void
  initialData?: Partial<RoadMap | RoadMapTemplate>
}

export function RoadMapForm({ onSubmit, initialData }: RoadMapFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialData?.targetDate ? new Date(initialData.targetDate) : undefined
  )
  const [formData, setFormData] = useState<Partial<RoadMap | RoadMapTemplate>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    finalTarget: initialData?.finalTarget || '',
    milestones: initialData?.milestones || [],
    category: (initialData as RoadMapTemplate)?.category || ''
  })

  const [milestones, setMilestones] = useState<Milestone[]>(
    initialData?.milestones || []
  )

  const handleSubmit = (e: React.FormEvent, status?: 'draft' | 'active') => {
    e.preventDefault()
    onSubmit({
      ...formData,
      targetDate: date?.toISOString(),
      milestones
    }, status)
  }

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { title: '', description: '' }
    ])
  }

  const handleUpdateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const updatedMilestones = [...milestones]
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value
    }
    setMilestones(updatedMilestones)
  }

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  return (
    <form id="roadmap-form" className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter title"
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
          placeholder="Enter description"
          required
        />
      </div>

      <div>
        <label htmlFor="finalTarget" className="block text-sm font-medium text-gray-700">
          Final Target
        </label>
        <Input
          id="finalTarget"
          value={formData.finalTarget}
          onChange={(e) => setFormData({ ...formData, finalTarget: e.target.value })}
          placeholder="Enter final target"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => handleSubmit(e, 'draft')}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, 'active')}
        >
          Save & Activate
        </Button>
      </div>

      {(initialData as RoadMapTemplate)?.category && (
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Input
            id="category"
            value={(formData as RoadMapTemplate).category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Enter category"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Target Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Milestones
        </label>
        {milestones.map((milestone, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={milestone.title}
              onChange={(e) => handleUpdateMilestone(index, 'title', e.target.value)}
              placeholder="Milestone title"
              required
            />
            <Input
              value={milestone.description}
              onChange={(e) => handleUpdateMilestone(index, 'description', e.target.value)}
              placeholder="Milestone description"
              required
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveMilestone(index)}
            >
              ×
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddMilestone}
        >
          Add Milestone
        </Button>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Road Map' : 'Create Road Map'}
      </Button>
    </form>
  )
}
