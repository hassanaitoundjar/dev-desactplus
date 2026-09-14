import type { ApiReview } from '~/types/api'
import type { Review } from '~/types/review'

export function mapApiReviewToDomain(apiReview: ApiReview): Review {
  return {
    id: apiReview.id,
    productId: apiReview.product_id,
    authorName: apiReview.author_name,
    rating: apiReview.rating,
    title: apiReview.title,
    content: apiReview.content,
    createdAt: apiReview.created_at,
    verifiedPurchase: apiReview.verified_purchase
  }
}
