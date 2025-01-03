'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Target,
  BarChart2,
  Users,
  Search,
  Moon,
  HelpCircle,
  Bell,
  Settings,
  Plus,
  ListPlus,
  Timer,
  TrendingUp,
  ChevronRight,
  Map,
  History
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GoalForm } from '@/components/goals/goal-form'
import { HabitForm } from '@/components/habits/habit-form'
import { QuickTimer } from '@/components/quick-timer'
import { useToast } from '@/components/ui/use-toast'
import type { Goal, Habit } from '@/types'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tracker',
    href: '/tracker',
    icon: Target,
  },
  {
    title: 'Timeline',
    href: '/timeline',
    icon: History,
  },
  {
    title: 'Roadmap',
    href: '/roadmap',
    icon: Map,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart2,
  },
  {
    title: 'Community',
    href: '/community',
    icon: Users,
  },
]

export default function Navbar() {
  const router = useRouter()
  const { toast } = useToast()
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [isHabitDialogOpen, setIsHabitDialogOpen] = useState(false)
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false)

  const quickActions = [
    {
      title: 'New Goal',
      description: 'Create a new goal to track',
      icon: Target,
      action: () => setIsGoalDialogOpen(true),
    },
    {
      title: 'New Habit',
      description: 'Start tracking a new habit',
      icon: ListPlus,
      action: () => setIsHabitDialogOpen(true),
    },
    {
      title: 'Quick Timer',
      description: 'Start a focus timer session',
      icon: Timer,
      action: () => setIsTimerDialogOpen(true),
    },
    {
      title: 'Track Progress',
      description: 'Log your daily progress',
      icon: TrendingUp,
      href: '/progress',
    },
  ]

  const handleQuickAction = (action: (() => void) | string) => {
    if (typeof action === 'string') {
      router.push(action)
    } else {
      action()
    }
  }

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: String(Date.now()),
      title: goalData.title || '',
      description: goalData.description || '',
      targets: goalData.targets || [],
      endDate: goalData.endDate || new Date().toISOString(),
      type: goalData.type || 'do',
      category: goalData.category || '',
      status: 'active',
      progress: 0,
      entries: [],
      widgets: [],
      milestones: []
    };

    // Get existing goals from localStorage
    const existingGoals = localStorage.getItem('goals')
    const goals = existingGoals ? JSON.parse(existingGoals) : []
    
    // Add new goal and save back to localStorage
    const updatedGoals = [...goals, newGoal]
    localStorage.setItem('goals', JSON.stringify(updatedGoals))

    setIsGoalDialogOpen(false)
    toast({
      title: "Goal Created",
      description: `Successfully created goal: ${newGoal.title}`,
    })

    // Refresh the tracker page if we're on it
    if (window.location.pathname === '/tracker') {
      router.refresh()
    }
  }

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: String(Date.now()),
      title: habitData.title || '',
      description: habitData.description || '',
      frequency: habitData.frequency || 'daily',
      type: habitData.type || 'good',
      category: habitData.category || '',
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastUpdated: new Date().toISOString()
      },
      progress: 0,
      completedCount: 0,
      startDate: new Date().toISOString(),
      widgets: [],
    };

    // Get existing habits from localStorage
    const existingHabits = localStorage.getItem('habits')
    const habits = existingHabits ? JSON.parse(existingHabits) : []
    
    // Add new habit and save back to localStorage
    const updatedHabits = [...habits, newHabit]
    localStorage.setItem('habits', JSON.stringify(updatedHabits))

    setIsHabitDialogOpen(false)
    toast({
      title: "Habit Created",
      description: `Successfully created habit: ${newHabit.title}`,
    })

    // Refresh the tracker page if we're on it
    if (window.location.pathname === '/tracker') {
      router.refresh()
    }
  }

  return (
    <>
      <nav className="border-b bg-background">
        <div className="flex h-16 items-center px-4">
          {/* Left section - Logo */}
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Image
              src="/logos/icon-light.svg"
              alt="HabitFlow Icon"
              width={36}
              height={36}
              className="dark:hidden"
            />
            <Image
              src="/logos/icon-dark.svg"
              alt="HabitFlow Icon"
              width={36}
              height={36}
              className="hidden dark:block"
            />
            <span className="text-xl font-bold">HabitFlow</span>
          </Link>

          {/* Center section - Main navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            ))}
          </div>

          {/* Right section - Quick actions and user menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="default" size="sm" className="bg-primary/90 hover:bg-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Action
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[240px] p-3">
                <div className="grid gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.title}
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                      onClick={() => handleQuickAction(action.action || action.href)}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary/10">
                        <action.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{action.title}</span>
                        <span className="text-xs text-muted-foreground">{action.description}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          <GoalForm
            onSave={handleSaveGoal}
            onClose={() => setIsGoalDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isHabitDialogOpen} onOpenChange={setIsHabitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
          </DialogHeader>
          <HabitForm
            onSave={handleSaveHabit}
            onClose={() => setIsHabitDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isTimerDialogOpen} onOpenChange={setIsTimerDialogOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader>
            <DialogTitle className="sr-only">Quick Timer</DialogTitle>
          </DialogHeader>
          <QuickTimer onClose={() => setIsTimerDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
