'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface GoalsOverviewChartProps {
  completedGoals: number
  inProgressGoals: number
  notStartedGoals: number
}

export function GoalsOverviewChart({
  completedGoals,
  inProgressGoals,
  notStartedGoals,
}: GoalsOverviewChartProps) {
  const data = [
    { name: 'Completed Goals', value: completedGoals, color: '#4ade80' },
    { name: 'In Progress Goals', value: inProgressGoals, color: '#60a5fa' },
    { name: 'Not Started', value: notStartedGoals, color: '#94a3b8' },
  ]

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
