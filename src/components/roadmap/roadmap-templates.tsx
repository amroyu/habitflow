'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RoadMapTemplate } from '@/types'
import { roadmapTemplates } from '@/lib/roadmap-templates'
import { roadmapImages } from '@/lib/roadmap-images'
import { RoadMapForm } from '@/components/roadmap/roadmap-form'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface RoadMapTemplatesProps {
  onSelectTemplate: (template: RoadMapTemplate) => void
  onSaveAsTemplate: (template: RoadMapTemplate) => void
  onUpdateTemplate: (template: RoadMapTemplate) => void
  customTemplates?: RoadMapTemplate[]
}

export function RoadMapTemplates({
  onSelectTemplate,
  onSaveAsTemplate,
  onUpdateTemplate,
  customTemplates = [],
}: RoadMapTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [editingTemplate, setEditingTemplate] = useState<RoadMapTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<RoadMapTemplate | null>(null)

  // Get unique categories and their counts
  const { categories, categoryCount, totalTemplates, templates } = useMemo(() => {
    const allTemplates = [...roadmapTemplates, ...customTemplates]
    const count: Record<string, number> = {}
    let total = 0
    
    allTemplates.forEach(template => {
      count[template.category] = (count[template.category] || 0) + 1
      total++
    })

    return {
      categories: ['All', 'Customized', ...new Set(roadmapTemplates.map(t => t.category))],
      categoryCount: {
        ...count,
        'Customized': customTemplates.length
      },
      totalTemplates: total,
      templates: allTemplates
    }
  }, [customTemplates])

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || 
                            (selectedCategory === 'Customized' && customTemplates.some(t => t.id === template.id)) ||
                            template.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, templates, customTemplates])

  const handlePreviewTemplate = (template: RoadMapTemplate) => {
    setPreviewTemplate({
      ...template,
      id: `preview-${template.id}`
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <Input
          type="search"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={category === 'Customized' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            >
              {category} ({category === 'All' ? totalTemplates : 
                         category === 'Customized' ? customTemplates.length : 
                         categoryCount[category] || 0})
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="relative group">
              <div className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow">
                <div className="relative h-40 w-full overflow-hidden rounded-md">
                  <Image
                    src={roadmapImages[template.id] || '/images/roadmaps/default.jpg'}
                    alt={template.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{template.title}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    Preview & Edit
                  </Button>
                  {customTemplates.some(t => t.id === template.id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      Edit Template
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Preview & Edit Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Preview & Edit Template</h2>
          {previewTemplate && (
            <>
              <RoadMapForm
                initialData={previewTemplate}
                onSubmit={(updatedTemplate) => {
                  onSelectTemplate(updatedTemplate)
                  setPreviewTemplate(null)
                }}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Cancel
                </Button>
                <Button type="submit" form="roadmap-form">
                  Use Template
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Edit Template</h2>
          {editingTemplate && (
            <>
              <RoadMapForm
                initialData={editingTemplate}
                onSubmit={(updatedTemplate) => {
                  onUpdateTemplate({ ...editingTemplate, ...updatedTemplate })
                  setEditingTemplate(null)
                }}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancel
                </Button>
                <Button type="submit" form="roadmap-form">
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
