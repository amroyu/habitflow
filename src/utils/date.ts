export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateRelative(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0 && diffDays >= -7) return `${-diffDays} days ago`

  return formatDateShort(dateStr)
}

export function getDaysRemaining(endDateStr: string): number {
  const endDate = new Date(endDateStr)
  const now = new Date()
  const diffTime = endDate.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getDateStatus(startDateStr: string, endDateStr: string): 'upcoming' | 'active' | 'completed' {
  const now = new Date()
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  if (now < startDate) return 'upcoming'
  if (now > endDate) return 'completed'
  return 'active'
}

export function getDefaultEndDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 30) // Default to 30 days from now
  return date.toISOString().split('T')[0]
}

export function isValidDateRange(startDate: string, endDate: string): boolean {
  return new Date(startDate) <= new Date(endDate)
}
