'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white">
        <div className="mx-auto px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="text-base text-gray-900">
              Goal Manager
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-900">
                Profile
              </Link>
              <Link href="/settings" className="text-sm text-gray-500 hover:text-gray-900">
                Settings
              </Link>
              <button className="text-sm text-gray-500 hover:text-gray-900">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-screen bg-white">
          <nav className="py-6 px-3">
            <div className="space-y-0.5">
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm text-gray-900 rounded-lg bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                href="/goals"
                className="flex items-center px-3 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50"
              >
                Goals
              </Link>
              <Link
                href="/habits"
                className="flex items-center px-3 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50"
              >
                Habits
              </Link>
              <Link
                href="/analytics"
                className="flex items-center px-3 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50"
              >
                Analytics
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
