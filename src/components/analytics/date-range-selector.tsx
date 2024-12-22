import { useState } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface DateRangeSelectorProps {
  startDate: Date
  endDate: Date
  onRangeChange: (start: Date, end: Date) => void
  minDate?: Date
  maxDate?: Date
}

const PRESET_RANGES = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 }
]

export function DateRangeSelector({
  startDate,
  endDate,
  onRangeChange,
  minDate,
  maxDate
}: DateRangeSelectorProps) {
  const [isCustomRange, setIsCustomRange] = useState(false)

  const handlePresetClick = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days + 1)
    
    if (minDate && start < minDate) {
      start.setTime(minDate.getTime())
    }
    if (maxDate && end > maxDate) {
      end.setTime(maxDate.getTime())
    }
    
    onRangeChange(start, end)
    setIsCustomRange(false)
  }

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value)
    if (type === 'start') {
      onRangeChange(date, endDate)
    } else {
      onRangeChange(startDate, date)
    }
  }

  return (
    <div className="space-y-4">
      {/* Preset Ranges */}
      <div className="flex flex-wrap gap-2">
        {PRESET_RANGES.map(({ label, days }) => (
          <button
            key={label}
            onClick={() => handlePresetClick(days)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              !isCustomRange && 
              format(startDate, 'yyyy-MM-dd') === format(new Date(new Date().setDate(new Date().getDate() - days + 1)), 'yyyy-MM-dd')
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setIsCustomRange(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isCustomRange
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Custom Range
        </button>
      </div>

      {/* Custom Date Range */}
      {isCustomRange && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="start-date"
                value={format(startDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange('start', e.target.value)}
                min={minDate ? format(minDate, 'yyyy-MM-dd') : undefined}
                max={format(endDate, 'yyyy-MM-dd')}
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="end-date"
                value={format(endDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange('end', e.target.value)}
                min={format(startDate, 'yyyy-MM-dd')}
                max={maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined}
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
