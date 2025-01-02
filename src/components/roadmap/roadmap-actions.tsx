'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { RoadMap } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { RoadMapForm } from './roadmap-form'

interface RoadMapActionsProps {
  roadMap: RoadMap
  onEdit: (updatedRoadMap: RoadMap) => void
  onDelete: (roadMap: RoadMap) => void
}

export function RoadMapActions({ roadMap, onEdit, onDelete }: RoadMapActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setIsEditDialogOpen(true)}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:text-red-500"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>

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
