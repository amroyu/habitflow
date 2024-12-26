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
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from 'next/navigation'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Goals',
    href: '/goals',
    icon: Target,
  },
  {
    title: 'Habits',
    href: '/habits',
    icon: BarChart2,
  },
  {
    title: 'Roadmap',
    href: '/roadmap',
    icon: null,
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

  const quickActions = [
    {
      title: 'New Goal',
      description: 'Create a new goal to track',
      icon: Target,
      href: '/goals/new',
    },
    {
      title: 'New Habit',
      description: 'Start tracking a new habit',
      icon: ListPlus,
      href: '/habits/new',
    },
    {
      title: 'Quick Timer',
      description: 'Start a focus timer session',
      icon: Timer,
      href: '/timer',
    },
    {
      title: 'Track Progress',
      description: 'Log your daily progress',
      icon: TrendingUp,
      href: '/progress',
    },
  ]

  const handleQuickAction = (href: string) => {
    router.push(href)
  }

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        {/* Left section - Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Image
            src="/logos/icon-light.svg"
            alt="HabitFlow Icon"
            width={36}
            height={36}
            priority
            className="dark:hidden"
          />
          <Image
            src="/logos/icon-dark.svg"
            alt="HabitFlow Icon"
            width={36}
            height={36}
            priority
            className="hidden dark:block"
          />
          <Image
            src="/logos/text-light.svg"
            alt="HabitFlow"
            width={130}
            height={26}
            priority
            className="dark:hidden"
          />
          <Image
            src="/logos/text-dark.svg"
            alt="HabitFlow"
            width={130}
            height={26}
            priority
            className="hidden dark:block"
          />
        </Link>

        {/* Center section - Navigation */}
        <div className="flex items-center gap-6 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.title}
            </Link>
          ))}
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" size="sm" className="bg-primary/90 hover:bg-primary text-white gap-2">
                <Plus className="h-5 w-5" />
                <span>Quick Actions</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="grid gap-1">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => handleQuickAction(action.href)}
                    className="group flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors rounded-lg"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary/10">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Moon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 ml-2 pl-2 border-l">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                Sign in
              </Button>
            </Link>
            <Button variant="default" className="bg-primary/90 hover:bg-primary font-medium">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
