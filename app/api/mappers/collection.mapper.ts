import type { ApiCollection } from '~/types/api'
import type { Collection } from '~/types/collection'

export function mapApiCollectionToDomain(apiCollection: ApiCollection, index = 0): Collection {
  return {
    id: apiCollection.id,
    slug: apiCollection.handle,
    name: apiCollection.title,
    description: apiCollection.metadata?.description || `Collection ${apiCollection.title}.`,
    image: apiCollection.metadata?.image || '/images/collection-salon.png',
    productCount: apiCollection.metadata?.productCount || 0,
    featured: apiCollection.metadata?.featured || index < 4,
    order: apiCollection.metadata?.order || index + 1
  }
}
