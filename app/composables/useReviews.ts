import { ref, computed } from 'vue'
import { reviewRepository } from '~/repositories/review.repository'
import type { Review, ReviewSubmitPayload, ReviewSummary } from '~/types/review'

export function useReviews() {
  const reviews = ref<Review[]>([])
  const summary = ref<ReviewSummary | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  // Use a map to track fetched product IDs to avoid redundant calls if needed
  // Or just rely on component lifecycle

  async function fetchReviews(productId: string) {
    if (!productId) return

    isLoading.value = true
    error.value = null

    try {
      // Run both queries in parallel
      const [fetchedReviews, fetchedSummary] = await Promise.all([
        reviewRepository.getReviewsByProduct(productId),
        reviewRepository.getReviewSummary(productId)
      ])

      reviews.value = fetchedReviews
      summary.value = fetchedSummary
    } catch (err) {
      console.error('Failed to fetch reviews', err)
      error.value = 'Une erreur est survenue lors du chargement des avis.'
    } finally {
      isLoading.value = false
    }
  }

  async function submitReview(productId: string, payload: Omit<ReviewSubmitPayload, 'productId'>) {
    if (!productId) return

    isSubmitting.value = true
    error.value = null

    try {
      const newReview = await reviewRepository.submitReview({
        ...payload,
        productId
      })

      // Update local state instead of refetching to save a request
      reviews.value.unshift(newReview)

      // Update summary locally
      if (summary.value) {
        summary.value.totalReviews++
        const oldSum = summary.value.averageRating * (summary.value.totalReviews - 1)
        summary.value.averageRating = (oldSum + newReview.rating) / summary.value.totalReviews
        summary.value.ratingDistribution[newReview.rating] = (summary.value.ratingDistribution[newReview.rating] || 0) + 1
      }

      return true
    } catch (err) {
      console.error('Failed to submit review', err)
      // error.value = 'Une erreur est survenue lors de l\\'envoi de votre avis.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    reviews,
    summary,
    isLoading,
    isSubmitting,
    error,
    fetchReviews,
    submitReview,
    hasReviews: computed(() => reviews.value.length > 0)
  }
}
