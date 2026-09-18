import type { Review, ReviewSubmitPayload, ReviewSummary } from '~/types/review'
import type { ApiReview } from '~/types/api'
import { mapApiReviewToDomain } from '~/api/mappers/review.mapper'
import { useApiClient } from '~/api/apiClient'

interface ReviewApiResponse {
  reviews: ApiReview[]
  summary: {
    average_rating: number
    total_reviews: number
  }
}

export const reviewRepository = {
  async getReviewsByProduct(handle: string): Promise<Review[]> {
    const api = useApiClient()
    
    try {
      const response = await api.get<ReviewApiResponse>(`/store/products/${handle}/reviews`)
      if (!response.reviews) return []
      
      return response.reviews.map(mapApiReviewToDomain)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
  },

  async getReviewSummary(handle: string): Promise<ReviewSummary> {
    const api = useApiClient()
    
    try {
      const response = await api.get<ReviewApiResponse>(`/store/products/${handle}/reviews`)
      
      // The backend returns average_rating and total_reviews
      // We will calculate a mock distribution since backend doesn't provide it yet
      // Or we can just calculate it from the returned reviews
      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      
      if (response.reviews) {
        response.reviews.forEach((r: ApiReview) => {
          if (r.rating >= 1 && r.rating <= 5) {
            distribution[r.rating]++
          }
        })
      }
      
      return {
        averageRating: response.summary?.average_rating || 0,
        totalReviews: response.summary?.total_reviews || 0,
        ratingDistribution: distribution
      }
    } catch (error) {
      console.error('Error fetching review summary:', error)
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }
  },

  async submitReview(handle: string, payload: Omit<ReviewSubmitPayload, 'productId'>): Promise<Review> {
    const api = useApiClient()
    
    // The backend expects: rating, title, content, name, email
    const requestData = {
      rating: payload.rating,
      title: payload.title,
      content: payload.content,
      name: payload.authorName,
      email: payload.email || ''
    }
    
    const response = await api.post<{message: string, review: ApiReview}>(`/store/products/${handle}/reviews`, requestData)
    
    return mapApiReviewToDomain(response.review)
  }
}
