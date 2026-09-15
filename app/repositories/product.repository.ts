import type { Product, ProductFilters } from '~/types/product'
import type { ApiProduct } from '~/types/api'
import { mapApiProductToDomain } from '~/api/mappers/product.mapper'
import { useApiClient } from '~/api/apiClient'

// API Store API response wrapper for products
interface StoreProductsResponse {
  products: ApiProduct[]
  count: number
  offset: number
  limit: number
}

// API Store API response wrapper for a single product
interface StoreProductResponse {
  product: ApiProduct
}

/**
 * Build the default query params.
 */
async function buildDefaultQueryParams(): Promise<Record<string, unknown>> {
  return {}
}

// ─── Exported repository functions ──────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', queryParams)
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const client = useApiClient()
  try {
    const data = await client.get<StoreProductResponse>(`/store/products/${slug}`)
    if (data.product) {
      return mapApiProductToDomain(data.product)
    }
    return undefined
  } catch (error) {
    console.error(`Failed to fetch product by slug ${slug}:`, error)
    return undefined
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, 'category_id[]': categoryId })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error(`Failed to fetch products for category ${categoryId}:`, error)
    return []
  }
}

export async function getProductsByCollection(collectionId: string): Promise<Product[]> {
  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, collection_id: [collectionId] })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error(`Failed to fetch products for collection ${collectionId}:`, error)
    return []
  }
}

/**
 * Fetch "featured" products.
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, limit })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return []
  }
}

/**
 * API Endpoint: `GET /store/products?order=-created_at`
 */
export async function getNewProducts(limit = 6): Promise<Product[]> {
  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, order: '-created_at', limit })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error('Failed to fetch new products:', error)
    return []
  }
}

/**
 * API Endpoint: `GET /store/products?category_id[]={categoryId}`
 */
export async function getRelatedProducts(currentSlug: string, categoryId: string, limit = 4): Promise<Product[]> {
  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, 'category_id[]': categoryId, limit: limit + 1 })
    const related = (data.products || [])
      .map(mapApiProductToDomain)
      .filter((p) => p.slug !== currentSlug)
      .slice(0, limit)
    return related
  } catch (error) {
    console.error(`Failed to fetch related products for category ${categoryId}:`, error)
    return []
  }
}

/**
 * API Endpoint: `GET /store/products?q={query}`
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, q: query })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error(`Failed to search products with query ${query}:`, error)
    return []
  }
}

/**
 * API Endpoint: `GET /store/products` with query parameters
 */
export async function filterProducts(filters: ProductFilters): Promise<Product[]> {
  const client = useApiClient()
  try {
    const queryParams: Record<string, any> = await buildDefaultQueryParams()

    if (filters.categoryId && filters.categoryId !== 'all') {
      queryParams['category_id[]'] = filters.categoryId
    }
    if (filters.collectionId && filters.collectionId !== 'all') {
      queryParams['collection_id[]'] = filters.collectionId
    }
    if (filters.search) {
      queryParams.q = filters.search
    }
    
    // API v2 sorting
    switch (filters.sort) {
      case 'price-asc':
        queryParams.order = 'variants.prices.amount'
        break
      case 'price-desc':
        queryParams.order = '-variants.prices.amount'
        break
      case 'newest':
        queryParams.order = '-created_at'
        break
      case 'name-asc':
        queryParams.order = 'title'
        break
    }

    const data = await client.get<StoreProductsResponse>('/store/products', queryParams)
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error('Failed to filter products:', error)
    return []
  }
}
