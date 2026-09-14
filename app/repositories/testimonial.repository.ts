import type { Testimonial } from '~/types/testimonial'
import type { ApiTestimonial } from '~/types/api'
import { mapApiTestimonialToDomain } from '~/api/mappers/testimonial.mapper'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockApiTestimonials: ApiTestimonial[] = [
  { id: '1', author: 'Amina Benali', role: 'Architecte d\'intérieur', content: 'Desact Plus a transformé notre vision en réalité. Chaque pièce respire l\'élégance et la qualité. Un partenaire de confiance pour les projets les plus exigeants.', rating: 5, date: '2025-05-12' },
  { id: '2', author: 'Karim Tazi', role: 'Propriétaire, Villa Anfa', content: 'La qualité des matériaux et le souci du détail sont exceptionnels. Notre salon est devenu un véritable espace de vie, pas juste une pièce meublée.', rating: 5, date: '2025-04-20' },
  { id: '3', author: 'Sophie Martin', role: 'Designer, Studio Noor', content: 'Je recommande Desact Plus à tous mes clients. Leur catalogue allie esthétique contemporaine et savoir-faire artisanal. Un vrai plaisir de collaborer avec eux.', rating: 5, date: '2025-06-01' },
]

export async function getAllTestimonials(): Promise<Testimonial[]> {
  await delay(300)
  return mockApiTestimonials.map(mapApiTestimonialToDomain)
}

export async function getFeaturedTestimonials(limit = 3): Promise<Testimonial[]> {
  await delay(300)
  return mockApiTestimonials.slice(0, limit).map(mapApiTestimonialToDomain)
}
