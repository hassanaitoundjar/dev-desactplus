import type { Product, ProductFilters } from '~/types/product'
import type { ApiProduct } from '~/types/api'
import { mapApiProductToDomain } from '~/api/mappers/product.mapper'
import { useApiClient } from '~/api/apiClient'
import { mockProducts } from '~/data/mockData'

// Medusa Store API response wrapper for products
interface StoreProductsResponse {
  products: ApiProduct[]
  count: number
  offset: number
  limit: number
}

// Medusa Store API response wrapper for a single product
interface StoreProductResponse {
  product: ApiProduct
}

// Medusa v2 Store API response wrapper for regions
interface StoreRegionsResponse {
  regions: { id: string; currency_code: string; name: string }[]
  count: number
}

// Cache the region ID to avoid fetching it on every request
let cachedRegionId: string | null = null

// Track whether the backend is reachable
let backendAvailable: boolean | null = null

/**
 * Check if the Medusa backend is reachable.
 * Caches the result for the session to avoid repeated failed requests.
 */
async function isBackendAvailable(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable
  const client = useApiClient()
  try {
    await client.get<StoreRegionsResponse>('/store/regions')
    backendAvailable = true
    return true
  } catch {
    console.warn('[DisactPlus] Medusa backend not reachable — using mock data.')
    backendAvailable = false
    return false
  }
}

/**
 * Fetch the first region's ID from the Medusa backend.
 * In Medusa v2, pricing context is passed via `region_id` (not `currency_code`).
 */
async function getRegionId(): Promise<string> {
  if (cachedRegionId) return cachedRegionId
  const client = useApiClient()
  try {
    const data = await client.get<StoreRegionsResponse>('/store/regions')
    if (data.regions && data.regions.length > 0 && data.regions[0]) {
      cachedRegionId = data.regions[0].id
      return cachedRegionId
    }
  } catch (error) {
    console.error('Failed to fetch regions:', error)
  }
  // Fallback: return empty string (products will still load, just without calculated pricing)
  return ''
}

// Base fields to expand relations and get pricing in Medusa v2
const defaultFields = '*categories,*variants,*variants.calculated_price,*options,*options.values,*images,*tags,*collection'

/**
 * Build the default query params with the correct region_id for pricing context.
 * Medusa v2 does NOT accept `currency_code` as a query param — use `region_id` instead.
 */
async function buildDefaultQueryParams(): Promise<Record<string, unknown>> {
  const regionId = await getRegionId()
  const params: Record<string, unknown> = { fields: defaultFields }
  if (regionId) {
    params.region_id = regionId
  }
  return params
}

// ─── Mock data helpers ──────────────────────────────────────
function mockFilterProducts(filters: ProductFilters): Product[] {
  let results = [...mockProducts]

  if (filters.categoryId && filters.categoryId !== 'all') {
    results = results.filter(p => p.categoryId === filters.categoryId)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    )
  }
  if (filters.minPrice !== undefined) {
    results = results.filter(p => p.price >= filters.minPrice!)
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter(p => p.price <= filters.maxPrice!)
  }

  switch (filters.sort) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'name-asc':
      results.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return results
}

// ─── Exported repository functions ──────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  if (!(await isBackendAvailable())) return mockProducts

  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', queryParams)
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return mockProducts
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!(await isBackendAvailable())) {
    return mockProducts.find(p => p.slug === slug)
  }

  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, handle: slug })
    if (data.products && data.products.length > 0 && data.products[0]) {
      return mapApiProductToDomain(data.products[0])
    }
    return undefined
  } catch (error) {
    console.error(`Failed to fetch product by slug ${slug}:`, error)
    return mockProducts.find(p => p.slug === slug)
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  if (!(await isBackendAvailable())) {
    return mockProducts.filter(p => p.categoryId === categoryId)
  }

  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, 'category_id[]': categoryId })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error(`Failed to fetch products for category ${categoryId}:`, error)
    return mockProducts.filter(p => p.categoryId === categoryId)
  }
}

export async function getProductsByCollection(collectionId: string): Promise<Product[]> {
  if (!(await isBackendAvailable())) {
    return mockProducts.filter(p => p.collectionId === collectionId)
  }

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
 * Fetch "featured" products. Falls back to first N mock products.
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (!(await isBackendAvailable())) {
    return mockProducts.filter(p => p.featured).slice(0, limit)
  }

  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, limit })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return mockProducts.filter(p => p.featured).slice(0, limit)
  }
}

/**
 * Medusa Endpoint: `GET /store/products?order=-created_at`
 */
export async function getNewProducts(limit = 6): Promise<Product[]> {
  if (!(await isBackendAvailable())) {
    return mockProducts.filter(p => p.isNew).slice(0, limit)
  }

  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, order: '-created_at', limit })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error('Failed to fetch new products:', error)
    return mockProducts.filter(p => p.isNew).slice(0, limit)
  }
}

/**
 * Medusa Endpoint: `GET /store/products?category_id[]={categoryId}`
 */
export async function getRelatedProducts(currentSlug: string, categoryId: string, limit = 4): Promise<Product[]> {
  if (!(await isBackendAvailable())) {
    return mockProducts
      .filter(p => p.categoryId === categoryId && p.slug !== currentSlug)
      .slice(0, limit)
  }

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
    return mockProducts
      .filter(p => p.categoryId === categoryId && p.slug !== currentSlug)
      .slice(0, limit)
  }
}

/**
 * Medusa Endpoint: `GET /store/products?q={query}`
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!(await isBackendAvailable())) {
    const q = query.toLowerCase()
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    )
  }

  const client = useApiClient()
  try {
    const queryParams = await buildDefaultQueryParams()
    const data = await client.get<StoreProductsResponse>('/store/products', { ...queryParams, q: query })
    return (data.products || []).map(mapApiProductToDomain)
  } catch (error) {
    console.error(`Failed to search products with query ${query}:`, error)
    const q = query.toLowerCase()
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    )
  }
}

/**
 * Medusa Endpoint: `GET /store/products` with query parameters
 */
export async function filterProducts(filters: ProductFilters): Promise<Product[]> {
  if (!(await isBackendAvailable())) {
    return mockFilterProducts(filters)
  }

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
    
    // Medusa v2 sorting
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
    return mockFilterProducts(filters)
  }
}
