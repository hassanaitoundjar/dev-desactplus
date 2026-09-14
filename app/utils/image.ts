/**
 * Generate a placeholder image URL (for development).
 */
export function placeholderImage(width: number, height: number, text?: string): string {
  const label = text ? `&text=${encodeURIComponent(text)}` : ''
  return `https://placehold.co/${width}x${height}/F3EDE4/8C8279?font=playfair-display${label}`
}

/**
 * Build an optimized image src set string.
 */
export function buildSrcSet(baseSrc: string, widths: number[]): string {
  return widths
    .map((w) => `${baseSrc}?w=${w} ${w}w`)
    .join(', ')
}
