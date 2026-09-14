import type { Collection } from '~/types/collection'
import type { ApiCollection } from '~/types/api'
import { mapApiCollectionToDomain } from '~/api/mappers/collection.mapper'
import { useApiClient } from '~/api/apiClient'

interface StoreCollectionsResponse {
  collections: ApiCollection[]
  count: number
  offset: number
  limit: number
}

export async function getAllCollections(): Promise<Collection[]> {
  const client = useApiClient()
  try {
    const data = await client.get<StoreCollectionsResponse>('/store/collections')
    return (data.collections || []).map((c, idx) => mapApiCollectionToDomain(c, idx)).sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return []
  }
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const client = useApiClient()
  try {
    const data = await client.get<StoreCollectionsResponse>('/store/collections', { handle: slug })
    if (data.collections && data.collections.length > 0) {
      return mapApiCollectionToDomain(data.collections[0])
    }
    return undefined
  } catch (error) {
    console.error(`Failed to fetch collection by slug ${slug}:`, error)
    return undefined
  }
}

export async function getFeaturedCollections(limit = 4): Promise<Collection[]> {
  const client = useApiClient()
  try {
    // If backend supports metadata filtering, we could add `metadata: { featured: true }`
    const data = await client.get<StoreCollectionsResponse>('/store/collections')
    return (data.collections || [])
      .map((c, idx) => mapApiCollectionToDomain(c, idx))
      .filter((c) => c.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch featured collections:', error)
    return []
  }
}
