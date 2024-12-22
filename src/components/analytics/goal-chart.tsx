import { Goal } from '@/types'
import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts'

interface GoalChartProps {
  goals: Goal[]
  selectedGoalIds: string[]
  startDate: Date
  endDate: Date
}

interface DataPoint {
  date: string
  [key: string]: number | string
}

export function GoalChart({ goals, selectedGoalIds, startDate, endDate }: GoalChartProps) {
  const chartData = useMemo(() => {
    const selectedGoals = goals.filter(goal => selectedGoalIds.includes(goal.id))
    const dateRange: DataPoint[] = []
    
    // Create date points from start to end
    const current = new Date(startDate)
    while (current <= endDate) {
      const point: DataPoint = {
        date: current.toISOString().split('T')[0]
      }
      
      // Add progress for each selected goal
      selectedGoals.forEach(goal => {
        // Mock progress data - replace with actual historical data
        const daysSinceStart = Math.floor((current.getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24))
        const totalDays = Math.floor((new Date(goal.endDate).getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24))
        const progress = Math.min(100, Math.max(0, (daysSinceStart / totalDays) * goal.progress))
        
        point[goal.id] = Math.round(progress)
      })
      
      dateRange.push(point)
      current.setDate(current.getDate() + 1)
    }
    
    return dateRange
  }, [goals, selectedGoalIds, startDate, endDate])

  const colors = ['#4F46E5', '#16A34A', '#DC2626', '#F59E0B', '#6366F1']

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value: string) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value: number) => `${value}%`}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem'
            }}
            formatter={(value: number, name: string) => {
              const goal = goals.find(g => g.id === name)
              return [`${value}%`, goal?.title || name]
            }}
            labelFormatter={(label: string) => new Date(label).toLocaleDateString()}
          />
          <Legend 
            formatter={(value: string) => {
              const goal = goals.find(g => g.id === value)
              return goal?.title || value
            }}
          />
          {selectedGoalIds.map((goalId, index) => (
            <Line
              key={goalId}
              type="monotone"
              dataKey={goalId}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
