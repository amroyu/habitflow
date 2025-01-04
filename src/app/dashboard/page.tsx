'use client'

import { mockGoals } from '@/lib/mock-data'
import Link from 'next/link'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ProgressRing } from '@/components/dashboard/progress-ring'
import { GoalSummary } from '@/components/dashboard/goal-summary'
import { StreakCalendar } from '@/components/dashboard/streak-calendar'
import { GoalInsights } from '@/components/dashboard/goal-insights'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { WidgetDetails } from '@/components/dashboard/widget-details'
import { RewardsDisplay } from '@/components/rewards/rewards-display'
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
import { useMemo, useState, useCallback, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [localGoals, setLocalGoals] = useState(mockGoals)
  const [selectedWidget, setSelectedWidget] = useState<{
    type: 'active' | 'streak' | 'milestone' | 'upcoming' | 'progress' | 'categories';
    data: any;
  } | null>(null);

  const stats = useMemo(() => {
    if (!currentDate) return null;
    
    const now = currentDate;
    const activeGoals = localGoals.length;
    const completedGoals = localGoals.filter(goal => goal.progress === 100).length;
    const totalProgress = localGoals.reduce((acc, goal) => acc + goal.progress, 0) / localGoals.length;
    
    return {
      activeGoals,
      completedGoals,
      totalProgress,
      currentStreak: 5,
      longestStreak: 10,
      totalMilestones: 15
    };
  }, [currentDate, localGoals]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      // Set the date only after we confirm the session
      setCurrentDate(new Date());
      setIsLoading(false);
    };

    checkSession();
  }, [supabase, router]);

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

  // Don't render anything until we have confirmed the session and set the date
  if (isLoading || !currentDate || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Active Goals</h3>
          <p className="text-3xl font-bold">{stats.activeGoals}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Completed Goals</h3>
          <p className="text-3xl font-bold">{stats.completedGoals}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Overall Progress</h3>
          <p className="text-3xl font-bold">{Math.round(stats.totalProgress)}%</p>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <QuickActions 
            goals={localGoals}
            onMarkComplete={handleMarkComplete}
            onUpdateProgress={handleUpdateProgress}
          />
        </div>
        <div className="md:col-span-4">
          <RewardsDisplay />
        </div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <ProgressRing 
              progress={stats.totalProgress}
              color="#16A34A"
            />
            <div className="mt-4 flex items-center gap-2">
              <ArrowTrendingUpIcon 
                className="w-5 h-5 text-green-600" 
              />
              <span className="text-sm font-medium text-green-600">
                +0% from last week
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
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Categories</h3>
        <div className="space-y-4">
          {localGoals.map(goal => (
            <div key={goal.id} className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{goal.category}</span>
                  <span className="text-sm text-gray-500">1 goal</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `100%` }}
                    transition={{ duration: 0.5 }}
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
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Goals</h3>
        <GoalSummary goals={localGoals} />
      </motion.div>

      {/* Goal Insights */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights</h3>
        <GoalInsights goals={localGoals} currentDate={currentDate} />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column - Main content */}
        <div className="md:col-span-8 space-y-6">
          <GoalSummary goals={localGoals} />
          <GoalInsights goals={localGoals} currentDate={currentDate} />
        </div>
        
        {/* Right column - Stats and widgets */}
        <div className="md:col-span-4 space-y-6">
          <StreakCalendar goals={localGoals} currentDate={currentDate} />
          {selectedWidget && (
            <WidgetDetails
              isOpen={!!selectedWidget}
              onClose={() => setSelectedWidget(null)}
              type={selectedWidget.type}
              data={selectedWidget.data}
            />
          )}
        </div>
      </div>

    </div>
  )
}
