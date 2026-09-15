import type { Category } from '~/types/category'
import type { ApiCategory } from '~/types/api'
import { mapApiCategoryToDomain } from '~/api/mappers/category.mapper'
import { useApiClient } from '~/api/apiClient'

interface StoreCategoriesResponse {
  product_categories: ApiCategory[]
  count: number
  offset: number
  limit: number
}

/**
 * API Endpoint: `GET /store/product-categories`
 */
export async function getAllCategories(): Promise<Category[]> {
  const client = useApiClient()
  try {
    const data = await client.get<StoreCategoriesResponse>('/store/product-categories', { fields: '*' })
    return (data.product_categories || []).map((c, idx) => mapApiCategoryToDomain(c, idx)).sort((a, b) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

/**
 * API Endpoint: `GET /store/product-categories?handle={slug}`
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const client = useApiClient()
  try {
    const data = await client.get<StoreCategoriesResponse>('/store/product-categories', { handle: slug, fields: '*' })
    if (data.product_categories && data.product_categories.length > 0 && data.product_categories[0]) {
      return mapApiCategoryToDomain(data.product_categories[0])
    }
    return undefined
  } catch (error) {
    console.error(`Failed to fetch category by slug ${slug}:`, error)
    return undefined
  }
}

/**
 * API Endpoint: `GET /store/product-categories`
 */
export async function getFeaturedCategories(limit = 4): Promise<Category[]> {
  const client = useApiClient()
  try {
    const data = await client.get<StoreCategoriesResponse>('/store/product-categories', { fields: '*' })
    return (data.product_categories || [])
      .map((c, idx) => mapApiCategoryToDomain(c, idx))
      .filter((c) => c.featured)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch featured categories:', error)
    return []
  }
}
