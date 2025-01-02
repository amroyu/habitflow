'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { RoadMapForm } from '@/components/roadmap/roadmap-form'
import { MilestoneForm } from '@/components/roadmap/milestone-form'
import { RoadMapTimeline } from '@/components/roadmap/roadmap-timeline'
import { RoadMapTemplates } from '@/components/roadmap/roadmap-templates'
import { RoadMapCard } from '@/components/roadmap/roadmap-card'
import { RoadMap, RoadMapMilestone, RoadMapTemplate } from '@/types'
import { PlusIcon } from '@heroicons/react/24/outline'
import { mockGoals, mockHabits } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function RoadMapPage() {
  const [roadMaps, setRoadMaps] = useState<RoadMap[]>([])
  const [selectedRoadMap, setSelectedRoadMap] = useState<RoadMap | null>(null)
  const [isRoadMapFormOpen, setIsRoadMapFormOpen] = useState(false)
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const [customTemplates, setCustomTemplates] = useState<RoadMapTemplate[]>([])

  const handleCreateRoadMap = (data: Partial<RoadMap>, status: 'draft' | 'active' = 'active') => {
    const newRoadMap: RoadMap = {
      id: Math.random().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: data.milestones || [],
      status: status,
      progress: 0,
    } as RoadMap

    setRoadMaps([...roadMaps, newRoadMap])
    setSelectedRoadMap(newRoadMap)
    setIsRoadMapFormOpen(false)
  }

  const handleSelectTemplate = (template: RoadMapTemplate, status: 'draft' | 'active' = 'active') => {
    const newRoadMap: RoadMap = {
      id: Math.random().toString(),
      title: template.title,
      description: template.description,
      finalTarget: template.finalTarget,
      milestones: template.milestones,
      status: status,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setRoadMaps([...roadMaps, newRoadMap])
    setSelectedRoadMap(newRoadMap)
    setIsTemplatesOpen(false)
  }

  const handleActivateRoadMap = (roadMap: RoadMap) => {
    const updatedRoadMaps = roadMaps.map(rm => 
      rm.id === roadMap.id 
        ? { ...rm, status: 'active' as const, updatedAt: new Date().toISOString() }
        : rm
    )
    setRoadMaps(updatedRoadMaps)
    setSelectedRoadMap(updatedRoadMaps.find(rm => rm.id === roadMap.id) || null)
  }

  const handleUpdateTemplate = (updatedTemplate: RoadMapTemplate) => {
    setCustomTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    )
  }

  const handleSaveAsTemplate = (roadMap: RoadMap) => {
    const newTemplate: RoadMapTemplate = {
      id: `custom-${Math.random().toString(36).substr(2, 9)}`,
      title: roadMap.title,
      description: roadMap.description,
      finalTarget: roadMap.finalTarget,
      category: 'Customized',
      milestones: roadMap.milestones,
    }
    setCustomTemplates([...customTemplates, newTemplate])
  }

  const handleAddMilestone = (data: Partial<RoadMapMilestone>) => {
    if (!selectedRoadMap) return

    const newMilestone: RoadMapMilestone = {
      id: Math.random().toString(),
      ...data,
      order: selectedRoadMap.milestones.length,
      status: 'not_started',
      progress: 0,
    } as RoadMapMilestone

    const updatedRoadMap = {
      ...selectedRoadMap,
      milestones: [...selectedRoadMap.milestones, newMilestone],
    }

    setRoadMaps(roadMaps.map(rm => 
      rm.id === selectedRoadMap.id ? updatedRoadMap : rm
    ))
    setSelectedRoadMap(updatedRoadMap)
    setIsMilestoneFormOpen(false)
  }

  const handleUpdateRoadMap = (updatedRoadMap: RoadMap) => {
    const updatedRoadMaps = roadMaps.map(rm =>
      rm.id === updatedRoadMap.id ? { ...updatedRoadMap, updatedAt: new Date().toISOString() } : rm
    )
    setRoadMaps(updatedRoadMaps)
    setSelectedRoadMap(updatedRoadMap)
  }

  const handleDeleteRoadMap = (roadMapToDelete: RoadMap) => {
    setRoadMaps(roadMaps.filter(rm => rm.id !== roadMapToDelete.id))
    if (selectedRoadMap?.id === roadMapToDelete.id) {
      setSelectedRoadMap(null)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Road Maps</h1>
        <div className="flex gap-2">
          <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Choose from Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <RoadMapTemplates
                onSelectTemplate={(template) => handleSelectTemplate(template)}
                onSaveAsTemplate={handleSaveAsTemplate}
                onUpdateTemplate={handleUpdateTemplate}
                customTemplates={customTemplates}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isRoadMapFormOpen} onOpenChange={setIsRoadMapFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Create Road Map
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Create New Road Map</h2>
                <RoadMapForm
                  onSubmit={(data, status) => handleCreateRoadMap(data, status)}
                  initialData={undefined}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List of Roadmaps */}
      {roadMaps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No roadmaps yet. Create one or choose from templates to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {roadMaps.map((roadMap) => (
            <RoadMapCard
              key={roadMap.id}
              roadMap={roadMap}
              onSelect={setSelectedRoadMap}
              onEdit={handleUpdateRoadMap}
              onDelete={handleDeleteRoadMap}
            />
          ))}
        </div>
      )}

      {/* Selected Roadmap View */}
      {selectedRoadMap && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{selectedRoadMap.title}</h2>
              <p className="text-gray-500">{selectedRoadMap.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedRoadMap.status === 'draft' && (
                <Button onClick={() => handleActivateRoadMap(selectedRoadMap)}>
                  Activate Roadmap
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsMilestoneFormOpen(true)}>
                Add Milestone
              </Button>
              <Button variant="outline" onClick={() => handleSaveAsTemplate(selectedRoadMap)}>
                Save as Template
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <RoadMapTimeline 
              roadMap={selectedRoadMap} 
              onMilestoneClick={() => {}}
              onEditRoadMap={handleUpdateRoadMap}
              onDeleteRoadMap={handleDeleteRoadMap}
            />
          </div>
        </div>
      )}
    </div>
  )
}
