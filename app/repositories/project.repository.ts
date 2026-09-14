import type { Project } from '~/types/project'

const projects: Project[] = [
  { id: '1', slug: 'villa-anfa', title: 'Villa Anfa', description: 'Aménagement complet d\'une villa contemporaine de 450m² à Anfa, Casablanca. Un projet alliant modernité et chaleur marocaine.', category: 'Résidentiel', location: 'Casablanca', date: '2025-03-15', images: ['/images/collection-salon.png', '/images/collection-dining.png'], featured: true, tags: ['villa', 'contemporain', 'Casablanca'] },
  { id: '2', slug: 'riad-marrakech', title: 'Riad Marrakech', description: 'Rénovation et décoration d\'un riad traditionnel transformé en boutique-hôtel. Un dialogue entre patrimoine et modernité.', category: 'Hôtellerie', location: 'Marrakech', date: '2025-06-20', images: ['/images/collection-bedroom.png', '/images/bathrom.jpeg'], featured: true, tags: ['riad', 'hôtellerie', 'Marrakech'] },
  { id: '3', slug: 'penthouse-corniche', title: 'Penthouse Corniche', description: 'Design intérieur d\'un penthouse vue mer. Lignes épurées et matériaux nobles pour un espace de vie exceptionnel.', category: 'Résidentiel', location: 'Casablanca', date: '2025-01-10', images: ['/images/kitchen.jpeg', '/images/collection-lighting.png'], featured: true, tags: ['penthouse', 'luxe', 'vue mer'] },
]

export function getAllProjects(): Project[] {
  return projects
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(limit = 3): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit)
}
