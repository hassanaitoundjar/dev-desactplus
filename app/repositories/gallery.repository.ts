import { useApiClient } from '~/api/apiClient'

export interface Hotspot {
  x: number
  y: number
  title: string
  price: string
  description: string
  image: string
  link: string
  variant_id?: string
  variantId?: string
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  title?: string
  category: string
  aspect: 'tall' | 'wide' | 'square'
  link: string
  sort_order?: number
  hotspots?: Hotspot[]
}

export interface GalleryResponse {
  items: GalleryItem[]
  categories: string[]
}

export async function getGalleryItems(category?: string): Promise<{ items: GalleryItem[]; categories: string[] }> {
  const client = useApiClient()
  try {
    const params: Record<string, unknown> = {}
    if (category && category !== 'All') {
      params.category = category
    }
    const data = await client.get<GalleryResponse>('/store/gallery', params)
    return {
      items: data.items || [],
      categories: data.categories || [],
    }
  } catch (error) {
    console.error('Failed to fetch gallery items:', error)
    return {
      items: [],
      categories: [],
    }
  }
}
