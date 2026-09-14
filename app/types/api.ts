export interface ApiProductOptionValue {
  id: string
  value: string
  label?: string
}

export interface ApiProductOption {
  id: string
  title: string
  values: ApiProductOptionValue[]
}

export interface ApiProductVariant {
  id: string
  sku: string
  title: string
  price?: number
  calculated_price?: {
    calculated_amount: number
    currency_code: string
  }
  prices?: { amount: number, currency_code: string }[]
  inventory_quantity: number
  options: Record<string, string> // maps option id to option value id
}

export interface ApiProductImage {
  src: string
  alt: string
  url?: string
}

export interface ApiProduct {
  id: string
  slug?: string
  handle?: string
  title: string
  description: string
  short_description?: string
  categories?: { id: string, name: string, handle: string }[]
  collection_id?: string
  collection?: { id: string, title: string, handle: string }
  images: ApiProductImage[]
  options: ApiProductOption[]
  variants: ApiProductVariant[]
  tags?: { id: string, value: string }[]
  is_featured?: boolean
  is_new?: boolean
  is_available?: boolean
  rating?: number
  reviews_count?: number
  sku?: string
  created_at: string
}

export interface ApiReview {
  id: string
  product_id: string
  author_name: string
  rating: number
  title?: string
  content: string
  created_at: string
  verified_purchase: boolean
}

export interface ApiTestimonial {
  id: string
  author: string
  role: string
  content: string
  rating: number
  date: string
}

export interface ApiService {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  image: string
  features: string[]
  order: number
}

export interface ApiCategory {
  id: string
  handle: string
  name: string
  description: string
  metadata?: Record<string, any>
}

export interface ApiCollection {
  id: string
  handle: string
  title: string
  metadata?: Record<string, any>
}
