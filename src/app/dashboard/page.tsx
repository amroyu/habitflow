'use client'

import { mockGoals } from '@/lib/mock-data'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ProgressRing } from '@/components/dashboard/progress-ring'
import { GoalSummary } from '@/components/dashboard/goal-summary'
import { StreakCalendar } from '@/components/dashboard/streak-calendar'
import { GoalInsights } from '@/components/dashboard/goal-insights'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  FlagIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  BoltIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { useMemo, useState, useCallback } from 'react'

export default function DashboardPage() {
  const currentDate = new Date('2024-12-23T01:20:08+03:00')
  const [localGoals, setLocalGoals] = useState(mockGoals)

  const stats = useMemo(() => {
    const now = currentDate
    const activeGoals = localGoals.length
    const completedGoals = localGoals.filter(goal => goal.progress === 100).length
    const inProgressGoals = localGoals.filter(goal => goal.progress > 0 && goal.progress < 100).length
    const upcomingGoals = localGoals.filter(goal => new Date(goal.startDate) > now).length
    
    const totalProgress = localGoals.reduce((sum, goal) => sum + goal.progress, 0)
    const averageProgress = activeGoals > 0 ? Math.round(totalProgress / activeGoals) : 0
    
    // Calculate weekly progress trend
    const lastWeekProgress = 65 // Mock data - replace with actual calculation
    const progressTrend = averageProgress - lastWeekProgress
    
    // Calculate milestone completion rate
    const totalMilestones = localGoals.reduce((sum, goal) => sum + goal.milestones.length, 0)
    const completedMilestones = localGoals.reduce(
      (sum, goal) => sum + goal.milestones.filter(m => m.completed).length,
      0
    )
    const milestoneRate = totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0

    // Calculate current streak
    let streak = 0
    for (let i = 0; i < 7; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const hadProgress = localGoals.some(goal => {
        return goal.milestones.some(m => 
          m.completed && new Date(m.dueDate).toDateString() === date.toDateString()
        )
      })
      if (hadProgress) streak++
      else break
    }

    return {
      activeGoals,
      completedGoals,
      inProgressGoals,
      upcomingGoals,
      averageProgress,
      progressTrend,
      milestoneRate,
      streak
    }
  }, [localGoals, currentDate])

  const categories = useMemo(() => {
    const categoryCounts = localGoals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }, [localGoals])

  const handleMarkComplete = useCallback((goalId: string) => {
    setLocalGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: 100 } 
        : goal
    ))
  }, [])

  const handleUpdateProgress = useCallback((goalId: string, progress: number) => {
    setLocalGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress } 
        : goal
    ))
  }, [])

  return (
    <DashboardLayout>
      <div className="px-8 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-500">Track your progress and manage your goals</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/analytics"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50"
            >
              <ChartBarIcon className="w-5 h-5 mr-2" />
              View Analytics
            </Link>
            <Link
              href="/goals/new"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
            >
              <FlagIcon className="w-5 h-5 mr-2" />
              New Goal
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Goals"
            value={stats.activeGoals}
            description="Total goals being tracked"
            icon={<FlagIcon className="w-6 h-6 text-primary-600" />}
          />
          <StatsCard
            title="Current Streak"
            value={`${stats.streak} days`}
            description="Keep it going!"
            icon={<FireIcon className="w-6 h-6 text-orange-600" />}
            trend={{
              value: stats.streak,
              isPositive: true
            }}
          />
          <StatsCard
            title="Milestone Rate"
            value={`${stats.milestoneRate}%`}
            description="Milestone completion rate"
            icon={<BoltIcon className="w-6 h-6 text-yellow-600" />}
          />
          <StatsCard
            title="Upcoming Goals"
            value={stats.upcomingGoals}
            description="Goals starting soon"
            icon={<CalendarIcon className="w-6 h-6 text-blue-600" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <ProgressRing 
                    progress={stats.averageProgress}
                    color={stats.progressTrend >= 0 ? '#16A34A' : '#DC2626'}
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <ArrowTrendingUpIcon 
                      className={`w-5 h-5 ${
                        stats.progressTrend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`} 
                    />
                    <span className={`text-sm font-medium ${
                      stats.progressTrend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats.progressTrend >= 0 ? '+' : ''}{stats.progressTrend}% from last week
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Daily Activity</h4>
                  <StreakCalendar goals={localGoals} currentDate={currentDate} />
                </div>
              </div>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Categories</h3>
              <div className="space-y-4">
                {categories.map(([category, count], index) => (
                  <div key={category} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary-600" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-500">{count} goals</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / stats.activeGoals) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full bg-primary-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Goals</h3>
              <GoalSummary goals={localGoals} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <QuickActions 
                goals={localGoals}
                onMarkComplete={handleMarkComplete}
                onUpdateProgress={handleUpdateProgress}
              />
            </motion.div>

            {/* Goal Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights</h3>
              <GoalInsights goals={localGoals} currentDate={currentDate} />
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link 
              href="/activity" 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-6">
            {localGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <FlagIcon className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Updated goal progress
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500 truncate">
                    {goal.title}
                  </p>
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(currentDate).toLocaleDateString()}
                </time>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
