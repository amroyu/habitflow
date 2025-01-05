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
  History,
  Brain
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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"

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
    title: 'Mindmap',
    href: '/mindmap',
    icon: Brain,
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
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      })
      router.push('/login')
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

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

  const handleSaveGoal = async (goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: String(Date.now()),
      title: goalData.title || '',
      description: goalData.description || '',
      endDate: goalData.endDate || new Date().toISOString(),
      type: goalData.type || 'do',
      category: goalData.category || '',
      status: 'active',
      progress: 0,
      entries: [],
      widgets: [],
      milestones: [],
      targets: []
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

  const handleSaveHabit = async (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: String(Date.now()),
      title: habitData.title || '',
      description: habitData.description || '',
      frequency: habitData.frequency || 'daily',
      type: habitData.type || 'good',
      category: habitData.category || 'general',
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastUpdated: new Date().toISOString()
      },
      progress: 0,
      completedCount: 0,
      target: 0,
      lastCompleted: new Date().toISOString(),
      startDate: new Date().toISOString(),
      widgets: []
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
            <Logo size="sm" />
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
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>

            {loading ? (
              <Button variant="ghost" disabled>Loading...</Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.user_metadata?.full_name}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn}>
                Sign In
              </Button>
            )}
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
