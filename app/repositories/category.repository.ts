import type { Category } from '~/types/category'
import type { ApiCategory } from '~/types/api'
import { mapApiCategoryToDomain } from '~/api/mappers/category.mapper'
import { useApiClient } from '~/api/apiClient'
import { mockCategories } from '~/data/mockData'

interface StoreCategoriesResponse {
  product_categories: ApiCategory[]
  count: number
  offset: number
  limit: number
}

// Track whether the backend is reachable (shared with product repo via same mechanism)
let backendAvailable: boolean | null = null

async function isBackendAvailable(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable
  const client = useApiClient()
  try {
    await client.get<StoreCategoriesResponse>('/store/product-categories', { limit: 1 })
    backendAvailable = true
    return true
  } catch {
    console.warn('[DisactPlus] Medusa backend not reachable — using mock categories.')
    backendAvailable = false
    return false
  }
}

/**
 * Medusa Endpoint: `GET /store/product-categories`
 * @see https://docs.medusajs.com/api/store#product-categories_getproductcategories
 */
export async function getAllCategories(): Promise<Category[]> {
  if (!(await isBackendAvailable())) {
    return mockCategories.sort((a, b) => a.order - b.order)
  }

  const client = useApiClient()
  try {
    const data = await client.get<StoreCategoriesResponse>('/store/product-categories', { fields: '*' })
    return (data.product_categories || []).map((c, idx) => mapApiCategoryToDomain(c, idx)).sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return mockCategories.sort((a, b) => a.order - b.order)
  }
}

/**
 * Medusa Endpoint: `GET /store/product-categories?handle={slug}`
 * @see https://docs.medusajs.com/api/store#product-categories_getproductcategories
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (!(await isBackendAvailable())) {
    return mockCategories.find(c => c.slug === slug)
  }

  const client = useApiClient()
  try {
    const data = await client.get<StoreCategoriesResponse>('/store/product-categories', { handle: slug, fields: '*' })
    if (data.product_categories && data.product_categories.length > 0 && data.product_categories[0]) {
      return mapApiCategoryToDomain(data.product_categories[0])
    }
    return undefined
  } catch (error) {
    console.error(`Failed to fetch category by slug ${slug}:`, error)
    return mockCategories.find(c => c.slug === slug)
  }
}

/**
 * Medusa Endpoint: `GET /store/product-categories` (Filtered for featured)
 * @see https://docs.medusajs.com/api/store#product-categories_getproductcategories
 */
export async function getFeaturedCategories(limit = 4): Promise<Category[]> {
  if (!(await isBackendAvailable())) {
    return mockCategories
      .filter(c => c.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit)
  }

  const client = useApiClient()
  try {
    const data = await client.get<StoreCategoriesResponse>('/store/product-categories', { fields: '*' })
    return (data.product_categories || [])
      .map((c, idx) => mapApiCategoryToDomain(c, idx))
      .filter((c) => c.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch featured categories:', error)
    return mockCategories
      .filter(c => c.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit)
  }
}
