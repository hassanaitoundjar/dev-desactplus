import type { ApiTestimonial } from '~/types/api'
import type { Testimonial } from '~/types/testimonial'

export function mapApiTestimonialToDomain(apiTestimonial: ApiTestimonial): Testimonial {
  return {
    id: apiTestimonial.id,
    author: apiTestimonial.author,
    role: apiTestimonial.role,
    content: apiTestimonial.content,
    rating: apiTestimonial.rating,
    date: apiTestimonial.date
  }
}
