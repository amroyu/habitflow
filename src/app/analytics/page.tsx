'use client'

import { mockGoals } from '@/lib/mock-data'
import { useState } from 'react'
import { GoalChart } from '@/components/analytics/goal-chart'
import { GoalSelector } from '@/components/analytics/goal-selector'
import { DateRangeSelector } from '@/components/analytics/date-range-selector'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  const currentDate = new Date('2024-12-23T01:22:25+03:00')
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([])
  const [startDate, setStartDate] = useState(() => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - 29) // Default to last 30 days
    return date
  })
  const [endDate, setEndDate] = useState(currentDate)

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-50 rounded-lg">
          <ChartBarIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goal Analytics</h1>
          <p className="mt-1 text-gray-500">
            Compare and analyze your goals over time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goal Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Select Goals to Compare
            </h3>
            <GoalSelector
              goals={mockGoals}
              selectedGoalIds={selectedGoalIds}
              onSelectionChange={setSelectedGoalIds}
            />
          </motion.div>

          {/* Date Range Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Select Time Range
            </h3>
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onRangeChange={handleDateRangeChange}
              minDate={new Date('2024-01-01')}
              maxDate={currentDate}
            />
          </motion.div>
        </div>

        {/* Chart Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Progress Over Time
          </h3>
          {selectedGoalIds.length > 0 ? (
            <GoalChart
              goals={mockGoals}
              selectedGoalIds={selectedGoalIds}
              startDate={startDate}
              endDate={endDate}
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              Select goals to view their progress chart
            </div>
          )}
        </motion.div>
      </div>

      {/* Stats Grid */}
      {selectedGoalIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {selectedGoalIds.map(goalId => {
            const goal = mockGoals.find(g => g.id === goalId)
            if (!goal) return null

            // Calculate average daily progress
            const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
            const avgDailyProgress = (goal.progress / totalDays).toFixed(1)

            return (
              <div
                key={goalId}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Progress</p>
                    <p className="text-2xl font-semibold text-primary-600">
                      {goal.progress}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Daily Progress</p>
                    <p className="text-2xl font-semibold text-primary-600">
                      {avgDailyProgress}%
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
