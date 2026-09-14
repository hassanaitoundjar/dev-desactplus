export interface Collection {
  id: string
  slug: string
  name: string
  description: string
  longDescription?: string
  image: string
  heroImage?: string
  productCount: number
  featured: boolean
  order: number
}
