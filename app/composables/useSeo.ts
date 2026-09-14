import type { SeoMeta, BreadcrumbItem } from '~/types/seo'
import { siteConfig } from '~/config/site'
import { formatSeoTitle } from '~/config/seo'

export function useSeo(meta: SeoMeta) {
  const title = meta.title ? formatSeoTitle(meta.title) : siteConfig.seo.defaultTitle
  const description = meta.description || siteConfig.seo.defaultDescription
  const image = meta.image || siteConfig.seo.defaultImage
  const url = meta.url || siteConfig.url

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: meta.type || 'website' },
      { property: 'og:locale', content: siteConfig.locale },
      { property: 'og:site_name', content: siteConfig.name },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
  })
}

export function useBreadcrumbs(items: BreadcrumbItem[]) {
  const breadcrumbs = computed(() => [
    { label: 'Accueil', href: '/' },
    ...items,
  ])

  // JSON-LD breadcrumb schema
  const jsonLd = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.value.map((item, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': item.label,
      'item': item.href ? `${siteConfig.url}${item.href}` : undefined,
    })),
  }))

  useHead({
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd.value) },
    ],
  })

  return { breadcrumbs }
}
