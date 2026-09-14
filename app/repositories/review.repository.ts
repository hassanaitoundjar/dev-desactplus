import type { Review, ReviewSubmitPayload, ReviewSummary } from '~/types/review'
import type { ApiReview } from '~/types/api'
import { mapApiReviewToDomain } from '~/api/mappers/review.mapper'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock database for reviews using API DTO format
const mockApiReviews: ApiReview[] = [
  {
    id: 'rev-1',
    product_id: '1',
    author_name: 'Sophie M.',
    rating: 5,
    title: 'Magnifique canapé !',
    content: 'La qualité du tissu bouclette est exceptionnelle. Très confortable et le design est exactement comme sur les photos. La livraison a été parfaite.',
    created_at: new Date('2023-11-15T10:30:00Z').toISOString(),
    verified_purchase: true
  },
  {
    id: 'rev-2',
    product_id: '1',
    author_name: 'Karim L.',
    rating: 4,
    content: 'Très beau produit, belles finitions. L\'assise est un peu ferme au début mais on s\'y habitue vite. Je recommande.',
    created_at: new Date('2023-10-22T14:15:00Z').toISOString(),
    verified_purchase: true
  }
]

export const reviewRepository = {
  // Prepared for future pagination and filtering
  async getReviewsByProduct(productId: string, limit = 10, offset = 0): Promise<Review[]> {
    await delay(600) // Simulate network request
    const allProductReviews = mockApiReviews
      .filter(r => r.product_id === productId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
    // Apply limit and offset
    const paginated = allProductReviews.slice(offset, offset + limit)
    
    return paginated.map(mapApiReviewToDomain)
  },

  async getReviewSummary(productId: string): Promise<ReviewSummary> {
    await delay(300)
    const productReviews = mockApiReviews.filter(r => r.product_id === productId)
    
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let sum = 0
    
    productReviews.forEach(r => {
      distribution[r.rating]++
      sum += r.rating
    })

    return {
      averageRating: productReviews.length > 0 ? sum / productReviews.length : 0,
      totalReviews: productReviews.length,
      ratingDistribution: distribution
    }
  },

  async submitReview(payload: ReviewSubmitPayload): Promise<Review> {
    await delay(800) // Simulate API save
    
    const newApiReview: ApiReview = {
      id: `rev-${Date.now()}`,
      product_id: payload.productId,
      author_name: payload.authorName,
      rating: payload.rating,
      title: payload.title,
      content: payload.content,
      created_at: new Date().toISOString(),
      verified_purchase: false
    }
    
    mockApiReviews.push(newApiReview)
    
    return mapApiReviewToDomain(newApiReview)
  }
}
