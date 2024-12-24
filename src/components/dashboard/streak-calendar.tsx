import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface StreakCalendarProps {
  dates?: Date[]
  currentDate?: Date
}

export function StreakCalendar({ dates = [], currentDate = new Date() }: StreakCalendarProps) {
  const calendar = useMemo(() => {
    const today = new Date(currentDate)
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      
      // Count completed activities for this day
      const completedCount = dates.filter(d => 
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      ).length

      days.push({
        date,
        count: completedCount
      })
    }
    return days
  }, [dates, currentDate])

  const maxCount = Math.max(...calendar.map(day => day.count), 1) // Ensure we don't divide by zero

  return (
    <div className="flex items-end gap-1 h-24">
      {calendar.map((day, index) => {
        const height = day.count > 0 ? (day.count / maxCount) * 100 : 10
        const isToday = day.date.getDate() === new Date(currentDate).getDate()
        
        return (
          <div 
            key={day.date.toISOString()} 
            className="flex-1 flex flex-col items-center gap-1"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`w-full rounded-sm ${
                isToday 
                  ? 'bg-primary-600' 
                  : day.count > 0 
                    ? 'bg-primary-400'
                    : 'bg-gray-200'
              }`}
              title={`${day.count} completion${day.count !== 1 ? 's' : ''}`}
            />
            <span className="text-xs text-gray-500">
              {day.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
