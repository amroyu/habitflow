'use client'

import { useState } from 'react'
import { RoadMap } from '@/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { RoadMapForm } from './roadmap-form'
import { Progress } from '@/components/ui/progress'

interface RoadMapCardProps {
  roadMap: RoadMap
  onSelect: (roadMap: RoadMap) => void
  onEdit: (updatedRoadMap: RoadMap) => void
  onDelete: (roadMap: RoadMap) => void
}

export function RoadMapCard({ roadMap, onSelect, onEdit, onDelete }: RoadMapCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const completedMilestones = roadMap.milestones.filter(m => m.status === 'completed').length
  const totalMilestones = roadMap.milestones.length
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  return (
    <div className="group relative border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Card Content */}
      <div className="cursor-pointer" onClick={() => onSelect(roadMap)}>
        <h3 className="font-semibold mb-2">{roadMap.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{roadMap.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedMilestones} of {totalMilestones} milestones</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            roadMap.status === 'active' 
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {roadMap.status === 'active' ? 'Active' : 'Draft'}
          </span>
          <span className="text-xs text-gray-500">
            Updated {new Date(roadMap.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditDialogOpen(true)
          }}
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation()
            setIsDeleteDialogOpen(true)
          }}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Roadmap</DialogTitle>
          </DialogHeader>
          <RoadMapForm
            initialData={roadMap}
            onSubmit={(updatedData) => {
              onEdit({ ...roadMap, ...updatedData })
              setIsEditDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Roadmap</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{roadMap.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(roadMap)
                setIsDeleteDialogOpen(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
