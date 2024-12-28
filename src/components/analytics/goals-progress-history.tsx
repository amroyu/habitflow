'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { format } from 'date-fns'

interface ProgressDataPoint {
  date: string
  progress: number
}

interface GoalsProgressHistoryProps {
  data: ProgressDataPoint[]
}

export function GoalsProgressHistory({ data }: GoalsProgressHistoryProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), 'MMM dd')}
            stroke="#94a3b8"
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            stroke="#94a3b8"
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Progress']}
            labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
          />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
