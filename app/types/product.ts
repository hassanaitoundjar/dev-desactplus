export interface ProductImage {
  src: string
  alt: string
}

export interface ProductDimension {
  label: string
  value: string
}

export interface ProductOptionValue {
  id: string
  value: string
  label?: string
}

export interface ProductOption {
  id: string
  title: string
  values: ProductOptionValue[]
}

export interface ProductVariant {
  id: string
  sku: string
  price: number
  compareAtPrice?: number
  inventoryQuantity: number
  options: Record<string, string> // e.g., { 'option_id': 'value_id' }
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription?: string
  price: number // base or starting price
  compareAtPrice?: number
  currency: string
  categoryId: string
  categoryIds?: string[]
  categories?: { id: string; name: string; handle?: string }[]
  collectionId?: string
  images: ProductImage[]
  
  // Options & Variants (New Backend Architecture)
  options: ProductOption[]
  variants: ProductVariant[]

  // UI Compatibility Properties (Mapped from options by mapper)
  materials: string[]
  colors: string[]
  dimensions?: ProductDimension[]
  fabrics?: string[]
  
  tags: string[]
  featured: boolean
  isNew: boolean
  available: boolean
  rating?: number
  reviewsCount?: number
  sku: string
  createdAt: string
}

export type ProductSortOption = 'default' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc'

export interface ProductFilters {
  categoryId?: string
  collectionId?: string
  minPrice?: number
  maxPrice?: number
  materials?: string[]
  colors?: string[]
  available?: boolean
  search?: string
  sort?: ProductSortOption
}
