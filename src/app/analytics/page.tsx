'use client'

import { mockGoals } from '@/lib/mock-data'
import { useState } from 'react'
import { GoalChart } from '@/components/analytics/goal-chart'
import { GoalSelector } from '@/components/analytics/goal-selector'
import { DateRangeSelector } from '@/components/analytics/date-range-selector'
import { ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HabitsOverviewChart } from '@/components/analytics/habits-overview-chart'
import { HabitsStreakChart } from '@/components/analytics/habits-streak-chart'
import { HabitsCompletionRate } from '@/components/analytics/habits-completion-rate'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GoalsOverviewChart } from '@/components/analytics/goals-overview-chart'
import { GoalsProgressHistory } from '@/components/analytics/goals-progress-history'
import Link from 'next/link'

const mockHabitsData = {
  goodHabits: 5,
  badHabits: 3,
  totalHabits: 8,
  averageStreak: 4.2,
  completionRate: 75,
  streakData: [
    { name: 'Morning Exercise', streak: 5 },
    { name: 'Reading', streak: 3 },
    { name: 'Meditation', streak: 7 },
    { name: 'No Late Snacks', streak: 2 },
  ],
  completionHistory: [
    { date: '2023-12-17', completed: 6, total: 8 },
    { date: '2023-12-18', completed: 7, total: 8 },
    { date: '2023-12-19', completed: 5, total: 8 },
    { date: '2023-12-20', completed: 8, total: 8 },
    { date: '2023-12-21', completed: 6, total: 8 },
    { date: '2023-12-22', completed: 7, total: 8 },
    { date: '2023-12-23', completed: 6, total: 8 },
  ],
};

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

  // Calculate goal statistics
  const totalGoals = mockGoals.length
  const completedGoals = mockGoals.filter(goal => goal.progress === 100).length
  const inProgressGoals = mockGoals.filter(goal => goal.progress > 0 && goal.progress < 100).length
  const notStartedGoals = mockGoals.filter(goal => goal.progress === 0).length
  const averageProgress = Math.round(mockGoals.reduce((acc, goal) => acc + goal.progress, 0) / totalGoals)

  // Mock progress history data
  const mockProgressHistory = [
    { date: '2023-12-17', progress: 75 },
    { date: '2023-12-18', progress: 82 },
    { date: '2023-12-19', progress: 88 },
    { date: '2023-12-20', progress: 65 },
    { date: '2023-12-21', progress: 95 },
    { date: '2023-12-22', progress: 78 },
    { date: '2023-12-23', progress: 85 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>
            <nav className="flex items-center gap-6">
              <Link 
                href="/goals" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Goals
              </Link>
              <Link 
                href="/habits" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Habits
              </Link>
              <Link 
                href="/settings" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-primary-100 rounded-xl">
            <ChartBarIcon className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-lg text-gray-600">
              Track and analyze your goals and habits
            </p>
          </div>
        </div>

        <Tabs defaultValue="goals" className="space-y-10">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 p-1.5 bg-gray-100/80 rounded-xl">
            <TabsTrigger 
              value="goals" 
              className="rounded-lg px-8 py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm transition-all"
            >
              Goals
            </TabsTrigger>
            <TabsTrigger 
              value="habits"
              className="rounded-lg px-8 py-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm transition-all"
            >
              Habits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-10">
            {/* Date Range Selection */}
            <Card className="border-none shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Time Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const end = new Date()
                      const start = new Date()
                      start.setDate(end.getDate() - 7)
                      handleDateRangeChange(start, end)
                    }}
                    className="flex-1 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => {
                      const end = new Date()
                      const start = new Date()
                      start.setDate(end.getDate() - 30)
                      handleDateRangeChange(start, end)
                    }}
                    className="flex-1 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => {
                      const end = new Date()
                      const start = new Date()
                      start.setDate(end.getDate() - 90)
                      handleDateRangeChange(start, end)
                    }}
                    className="flex-1 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    Last 90 Days
                  </button>
                  <button
                    onClick={() => {
                      // This will trigger the date range picker modal
                    }}
                    className="flex-1 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    Custom Range
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Goals Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-none shadow-sm bg-gradient-to-br from-white to-primary-50/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{totalGoals}</div>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {completedGoals} completed
                    </span>
                    <span className="mx-2">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {inProgressGoals} in progress
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-gradient-to-br from-white to-primary-50/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-500">Average Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{averageProgress}%</div>
                  <p className="mt-2 text-sm text-gray-600">across all goals</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-gradient-to-br from-white to-primary-50/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {Math.round((completedGoals / totalGoals) * 100)}%
                  </div>
                  <p className="mt-2 text-sm text-gray-600">goals achieved</p>
                </CardContent>
              </Card>
            </div>

            {/* Goals Charts */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-none shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">Goals Overview</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <GoalsOverviewChart
                    completedGoals={completedGoals}
                    inProgressGoals={inProgressGoals}
                    notStartedGoals={notStartedGoals}
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">Progress History</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <GoalsProgressHistory data={mockProgressHistory} />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-none shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">Goal Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    <GoalSelector
                      goals={mockGoals}
                      selectedGoalIds={selectedGoalIds}
                      onSelectionChange={setSelectedGoalIds}
                    />
                    {selectedGoalIds.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <GoalChart
                          goals={mockGoals}
                          selectedGoalIds={selectedGoalIds}
                          startDate={startDate}
                          endDate={endDate}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="habits" className="space-y-10">
            {/* Time Range Selection */}
            <Card className="border-none shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Time Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const end = new Date()
                      const start = new Date()
                      start.setDate(end.getDate() - 7)
                      handleDateRangeChange(start, end)
                    }}
                    className="flex-1 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => {
                      const end = new Date()
                      const start = new Date()
                      start.setDate(end.getDate() - 30)
                      handleDateRangeChange(start, end)
                    }}
                    className="flex-1 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => {
                      const end = new Date()
                      const start = new Date()
                      start.setDate(end.getDate() - 90)
                      handleDateRangeChange(start, end)
                    }}
                    className="flex-1 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    Last 90 Days
                  </button>
                  <button
                    onClick={() => {
                      // This will trigger the date range picker modal
                    }}
                    className="flex-1 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    Custom Range
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Habits Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-none shadow-sm bg-gradient-to-br from-white to-primary-50/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Habits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{mockHabitsData.totalHabits}</div>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {mockHabitsData.goodHabits} good
                    </span>
                    <span className="mx-2">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      {mockHabitsData.badHabits} bad
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-gradient-to-br from-white to-primary-50/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-500">Average Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{mockHabitsData.averageStreak}</div>
                  <p className="mt-2 text-sm text-gray-600">days per habit</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-gradient-to-br from-white to-primary-50/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{mockHabitsData.completionRate}%</div>
                  <p className="mt-2 text-sm text-gray-600">last 7 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Habits Charts */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-none shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">Habits Overview</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <HabitsOverviewChart data={mockHabitsData} />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">Completion History</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <HabitsCompletionRate data={mockHabitsData.completionHistory} />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-none shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">Current Streaks</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <HabitsStreakChart data={mockHabitsData.streakData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
