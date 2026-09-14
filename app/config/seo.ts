import { siteConfig } from './site'
import type { SeoMeta } from '~/types/seo'

export function buildPageMeta(overrides: Partial<SeoMeta>): SeoMeta {
  return {
    title: overrides.title ?? siteConfig.seo.defaultTitle,
    description: overrides.description ?? siteConfig.seo.defaultDescription,
    image: overrides.image ?? siteConfig.seo.defaultImage,
    url: overrides.url ?? siteConfig.url,
    type: overrides.type ?? 'website',
    locale: overrides.locale ?? siteConfig.locale,
    siteName: overrides.siteName ?? siteConfig.name,
  }
}

export function formatSeoTitle(pageTitle: string): string {
  return siteConfig.seo.titleTemplate.replace('%s', pageTitle)
}
