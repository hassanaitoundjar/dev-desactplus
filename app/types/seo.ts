export interface SeoMeta {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  locale?: string
  siteName?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
