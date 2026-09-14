import type { Service } from '~/types/service'
import type { ApiService } from '~/types/api'
import { mapApiServiceToDomain } from '~/api/mappers/service.mapper'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockApiServices: ApiService[] = [
  { id: '1', slug: 'design-interieur', title: 'Design d\'Intérieur', description: 'Conception sur mesure de votre espace de vie, du concept à la réalisation.', icon: 'Palette', image: '/images/collection-salon.png', features: ['Étude de l\'espace', 'Planches d\'ambiance', 'Plans 3D', 'Suivi de chantier'], order: 1 },
  { id: '2', slug: 'mobilier-sur-mesure', title: 'Mobilier Sur Mesure', description: 'Création de pièces uniques adaptées à vos envies et à votre espace.', icon: 'Ruler', image: '/images/collection-dining.png', features: ['Design personnalisé', 'Choix des matériaux', 'Fabrication artisanale', 'Livraison et installation'], order: 2 },
  { id: '3', slug: 'conseil-decoration', title: 'Conseil en Décoration', description: 'Accompagnement expert pour sublimer votre intérieur avec les bons choix.', icon: 'Lightbulb', image: '/images/collection-bedroom.png', features: ['Diagnostic déco', 'Shopping list', 'Mise en scène', 'Optimisation de l\'espace'], order: 3 },
]

export async function getAllServices(): Promise<Service[]> {
  await delay(300)
  return mockApiServices.sort((a, b) => a.order - b.order).map(mapApiServiceToDomain)
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  await delay(200)
  const svc = mockApiServices.find((s) => s.slug === slug)
  return svc ? mapApiServiceToDomain(svc) : undefined
}
