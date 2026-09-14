export interface Service {
  id: string
  slug: string
  title: string
  description: string
  longDescription?: string
  icon: string
  image: string
  features: string[]
  order: number
}
