import type { ApiCategory } from '~/types/api'
import type { Category } from '~/types/category'

/**
 * Maps category handles/slugs to their local image paths.
 * These images are pre-generated for common furniture categories.
 */
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'chairs': '/images/category-chairs.jpg',
  'tables': '/images/category-tables.jpg',
  'sofas': '/images/category-sofas.jpg',
  'armchairs': '/images/category-armchairs.jpg',
  'beds': '/images/category-beds.jpg',
  'storage': '/images/category-storage.jpg',
  'textiles': '/images/category-textiles.jpg',
  'lighting': '/images/category-lighting.jpg',
  'decor': '/images/category-decor.jpg',
  'toys': '/images/category-toys.jpg',
  // French equivalents
  'chaises': '/images/category-chairs.jpg',
  'canapes': '/images/category-sofas.jpg',
  'fauteuils': '/images/category-armchairs.jpg',
  'lits': '/images/category-beds.jpg',
  'rangement': '/images/category-storage.jpg',
  'luminaires': '/images/category-lighting.jpg',
  'decoration': '/images/category-decor.jpg',
  'jouets': '/images/category-toys.jpg',
  'salon': '/images/category-sofas.jpg',
  'chambre': '/images/category-beds.jpg',
  'salle-a-manger': '/images/category-tables.jpg',
  'cuisine': '/images/category-tables.jpg',
  'bureau': '/images/category-chairs.jpg',
  'exterieur': '/images/category-decor.jpg',
}

/**
 * Maps category handles/slugs to their SVG icon paths.
 */
const CATEGORY_ICON_MAP: Record<string, string> = {
  'chairs': '/images/icons/icon-chairs.svg',
  'tables': '/images/icons/icon-tables.svg',
  'sofas': '/images/icons/icon-sofas.svg',
  'armchairs': '/images/icons/icon-armchairs.svg',
  'beds': '/images/icons/icon-beds.svg',
  'storage': '/images/icons/icon-storage.svg',
  'textiles': '/images/icons/icon-textiles.svg',
  'lighting': '/images/icons/icon-lighting.svg',
  'decor': '/images/icons/icon-decor.svg',
  'toys': '/images/icons/icon-toys.svg',
  // French equivalents
  'chaises': '/images/icons/icon-chairs.svg',
  'canapes': '/images/icons/icon-sofas.svg',
  'fauteuils': '/images/icons/icon-armchairs.svg',
  'lits': '/images/icons/icon-beds.svg',
  'rangement': '/images/icons/icon-storage.svg',
  'luminaires': '/images/icons/icon-lighting.svg',
  'decoration': '/images/icons/icon-decor.svg',
  'jouets': '/images/icons/icon-toys.svg',
  'salon': '/images/icons/icon-sofas.svg',
  'chambre': '/images/icons/icon-beds.svg',
  'salle-a-manger': '/images/icons/icon-tables.svg',
  'cuisine': '/images/icons/icon-tables.svg',
  'bureau': '/images/icons/icon-chairs.svg',
  'exterieur': '/images/icons/icon-decor.svg',
}

function resolveCategoryImage(handle: string, metadata?: Record<string, any>): string {
  if (metadata?.image) return metadata.image
  return CATEGORY_IMAGE_MAP[handle] || '/images/category-decor.jpg'
}

function resolveCategoryIcon(handle: string, metadata?: Record<string, any>): string {
  if (metadata?.icon) return metadata.icon
  return CATEGORY_ICON_MAP[handle] || '/images/icons/icon-decor.svg'
}

export function mapApiCategoryToDomain(apiCategory: ApiCategory, index = 0): Category {
  return {
    id: apiCategory.id,
    slug: apiCategory.handle,
    name: apiCategory.name,
    description: apiCategory.description || `Découvrez notre collection de ${apiCategory.name.toLowerCase()}.`,
    image: resolveCategoryImage(apiCategory.handle, apiCategory.metadata),
    icon: resolveCategoryIcon(apiCategory.handle, apiCategory.metadata),
    productCount: apiCategory.metadata?.productCount || 0,
    featured: apiCategory.metadata?.featured || index < 4,
    order: apiCategory.metadata?.order || index + 1
  }
}

