import type { ApiService } from '~/types/api'
import type { Service } from '~/types/service'

export function mapApiServiceToDomain(apiService: ApiService): Service {
  return {
    id: apiService.id,
    slug: apiService.slug,
    title: apiService.title,
    description: apiService.description,
    icon: apiService.icon,
    image: apiService.image,
    features: apiService.features,
    order: apiService.order
  }
}
