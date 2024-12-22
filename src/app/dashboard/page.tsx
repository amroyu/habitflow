import { mockGoals } from '@/lib/mock-data'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/layout'

export default function DashboardPage() {
  const activeGoals = mockGoals.length
  const completedGoals = mockGoals.filter(goal => goal.progress === 100).length
  const inProgressGoals = mockGoals.filter(goal => goal.progress > 0 && goal.progress < 100).length

  return (
    <DashboardLayout>
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500">Track your progress and manage your goals</p>
          </div>
          <Link
            href="/goals/new"
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#0F172A] hover:bg-gray-800"
          >
            New Goal
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-xl">
            <h3 className="text-sm text-gray-500 mb-1">Active Goals</h3>
            <p className="text-2xl text-gray-900">{activeGoals}</p>
          </div>
          <div className="p-6 bg-white rounded-xl">
            <h3 className="text-sm text-gray-500 mb-1">Completed</h3>
            <p className="text-2xl text-[#0066FF]">{completedGoals}</p>
          </div>
          <div className="p-6 bg-white rounded-xl">
            <h3 className="text-sm text-gray-500 mb-1">In Progress</h3>
            <p className="text-2xl text-[#FF6B00]">{inProgressGoals}</p>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-3 gap-6">
          {mockGoals.map((goal) => (
            <Link
              key={goal.id}
              href={`/goals/${goal.id}`}
              className="block p-6 bg-white rounded-xl hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base text-gray-900 mb-1">{goal.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{goal.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  goal.type === 'do' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-red-50 text-red-600'
                }`}>
                  {goal.type === 'do' ? 'DO' : 'DONT'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0066FF] rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {goal.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
