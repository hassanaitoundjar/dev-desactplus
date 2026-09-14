/**
 * Format an ISO date string into a French-locale readable format.
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const defaults: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString('fr-FR', options ?? defaults)
}

/**
 * Relative time formatting (e.g., "il y a 3 jours").
 */
export function formatRelativeTime(dateString: string): string {
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'aujourd\'hui'
  if (diffDays < 7) return rtf.format(-diffDays, 'day')
  if (diffDays < 30) return rtf.format(-Math.floor(diffDays / 7), 'week')
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month')
  return rtf.format(-Math.floor(diffDays / 365), 'year')
}
