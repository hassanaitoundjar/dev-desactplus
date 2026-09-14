import { siteConfig } from '~/config/site'

/**
 * Format a price value into a localized currency string.
 */
export function formatPrice(value: number, currency?: string): string {
  const cur = currency ?? siteConfig.currency
  return new Intl.NumberFormat(siteConfig.currencyLocale, {
    style: 'currency',
    currency: cur,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
