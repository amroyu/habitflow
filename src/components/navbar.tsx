'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { 
  Menu, 
  Search, 
  Bell, 
  User,
  PlusCircle,
  Calendar,
  BarChart2,
  Settings,
  HelpCircle,
  Trophy,
  Target,
  Users
} from 'lucide-react'

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white"
            >
              <svg
                className="h-6 w-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              HabitFlow
            </Link>

            {/* Quick Action Button */}
            <div className="relative">
              <button
                onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                className="ml-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <PlusCircle size={16} />
                <span>Quick Actions</span>
              </button>

              {/* Quick Actions Dropdown */}
              {isQuickActionsOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <Link
                    href="/goals/new"
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Target size={16} />
                    New Goal
                  </Link>
                  <Link
                    href="/calendar"
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Calendar size={16} />
                    Schedule Check-in
                  </Link>
                  <Link
                    href="/challenges"
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Trophy size={16} />
                    Join Challenge
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Center section - Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <BarChart2 size={16} />
              Dashboard
            </Link>
            <Link
              href="/goals"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Target size={16} />
              Goals
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <BarChart2 size={16} />
              Analytics
            </Link>
            <Link
              href="/community"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Users size={16} />
              Community
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
            )}

            <Link
              href="/help"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Help"
            >
              <HelpCircle size={20} />
            </Link>

            <button
              className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <Link
              href="/settings"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Settings"
            >
              <Settings size={20} />
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white lg:block"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-16 border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="container mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search goals, habits, or milestones..."
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Press <kbd className="rounded border border-gray-300 bg-gray-100 px-1 dark:border-gray-700 dark:bg-gray-800">⌘</kbd> + <kbd className="rounded border border-gray-300 bg-gray-100 px-1 dark:border-gray-700 dark:bg-gray-800">K</kbd> to search
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
