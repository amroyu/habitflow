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
} from 'lucide-react'

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
  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            {/* Icon */}
            <Image
              src="/logos/icon-light.svg"
              alt="HabitFlow Icon"
              width={32}
              height={32}
              priority
              className="dark:hidden"
            />
            <Image
              src="/logos/icon-dark.svg"
              alt="HabitFlow Icon"
              width={32}
              height={32}
              priority
              className="hidden dark:block"
            />
            {/* Text */}
            <Image
              src="/logos/text-light.svg"
              alt="HabitFlow"
              width={120}
              height={24}
              priority
              className="dark:hidden"
            />
            <Image
              src="/logos/text-dark.svg"
              alt="HabitFlow"
              width={120}
              height={24}
              priority
              className="hidden dark:block"
            />
          </Link>
          <Button variant="default" size="sm" className="bg-primary/90 hover:bg-primary text-white gap-2">
            <span>Quick Actions</span>
          </Button>
        </div>

        {/* Center section */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.title}
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
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
