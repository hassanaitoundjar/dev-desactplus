import type { ApiCategory } from '~/types/api'
import type { Category } from '~/types/category'

export function mapApiCategoryToDomain(apiCategory: ApiCategory, index = 0): Category {
  return {
    id: apiCategory.id,
    slug: apiCategory.handle,
    name: apiCategory.name,
    description: apiCategory.description || `Découvrez notre collection de ${apiCategory.name.toLowerCase()}.`,
    image: apiCategory.metadata?.image || '/images/collection-salon.png',
    productCount: apiCategory.metadata?.productCount || 0,
    featured: apiCategory.metadata?.featured || index < 4,
    order: apiCategory.metadata?.order || index + 1
  }
}
