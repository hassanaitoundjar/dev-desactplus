export interface Review {
  id: string
  productId: string
  authorName: string
  rating: number
  title?: string
  content: string
  createdAt: string
  verifiedPurchase: boolean
}

export interface ReviewSubmitPayload {
  productId: string
  authorName: string
  rating: number
  title?: string
  content: string
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
}
