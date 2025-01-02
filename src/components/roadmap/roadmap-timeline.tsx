'use client'

import { RoadMap, RoadMapMilestone } from '@/types'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { RoadMapActions } from './roadmap-actions'

interface RoadMapTimelineProps {
  roadMap: RoadMap
  onMilestoneClick?: (milestone: RoadMapMilestone) => void
  onEditRoadMap?: (updatedRoadMap: RoadMap) => void
  onDeleteRoadMap?: (roadMap: RoadMap) => void
}

export function RoadMapTimeline({ 
  roadMap, 
  onMilestoneClick,
  onEditRoadMap,
  onDeleteRoadMap 
}: RoadMapTimelineProps) {
  const sortedMilestones = [...roadMap.milestones].sort((a, b) => a.order - b.order)

  return (
    <div className="relative group">
      {/* Add RoadMap Actions */}
      {onEditRoadMap && onDeleteRoadMap && (
        <RoadMapActions
          roadMap={roadMap}
          onEdit={onEditRoadMap}
          onDelete={onDeleteRoadMap}
        />
      )}

      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Milestones */}
      <div className="space-y-8">
        {sortedMilestones.map((milestone, index) => {
          const isBlocked = milestone.dependsOn?.some(
            id => roadMap.milestones.find(m => m.id === id)?.status !== 'completed'
          )

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                'relative pl-10 cursor-pointer',
                isBlocked && 'opacity-50'
              )}
              onClick={() => onMilestoneClick?.(milestone)}
            >
              {/* Timeline dot */}
              <div 
                className={cn(
                  'absolute left-2.5 w-3 h-3 rounded-full border-2',
                  milestone.status === 'completed' 
                    ? 'bg-green-500 border-green-500' 
                    : milestone.status === 'in_progress'
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300'
                )}
                style={{
                  transform: 'translateX(-50%)',
                }}
              />

              <div className={cn(
                'bg-white p-4 rounded-lg border',
                milestone.status === 'completed' 
                  ? 'border-green-200'
                  : milestone.status === 'in_progress'
                  ? 'border-blue-200'
                  : 'border-gray-200'
              )}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{milestone.title}</h3>
                  {milestone.status === 'completed' ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-2">{milestone.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                    {milestone.type === 'goal' ? 'Goal' : 'Habit'}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full',
                        milestone.status === 'completed'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      )}
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>

                {isBlocked && (
                  <div className="mt-2 text-xs text-red-500">
                    Blocked: Complete previous milestones first
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}

        {/* Final target */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: sortedMilestones.length * 0.1 }}
          className="relative pl-10"
        >
          <div 
            className="absolute left-2.5 w-3 h-3 rounded-full border-2 border-primary-500 bg-primary-500"
            style={{
              transform: 'translateX(-50%)',
            }}
          />
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
            <h3 className="font-medium text-primary-700">Final Target</h3>
            <p className="text-sm text-primary-600">{roadMap.finalTarget}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
