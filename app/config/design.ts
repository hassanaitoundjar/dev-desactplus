/**
 * Design constants — values that are used in JS logic
 * (e.g., breakpoint checks, intersection observer thresholds).
 *
 * Visual tokens live in tokens.css; this file is for programmatic access.
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const

export const layout = {
  maxWidth: 1440,
  contentWidth: 1200,
  headerHeight: 72,
} as const

export const scrollRevealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px',
} as const
