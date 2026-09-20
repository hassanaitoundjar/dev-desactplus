<script setup lang="ts">
import type { Product } from '~/types/product'
import { Heart, Star, Search, ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import BaseImage from '../ui/BaseImage.vue'
import { formatPrice } from '~/utils/formatPrice'
import { useWishlist } from '~/composables/useWishlist'
import { computed, ref } from 'vue'

import { useCart } from '~/composables/useCart'

const props = withDefaults(defineProps<{ 
  product: Product,
  layout?: 'grid' | 'list'
}>(), {
  layout: 'grid'
})

const { toggle: toggleWishlist, isInWishlist } = useWishlist()
const { add: addToCart, isOpen: isCartOpen } = useCart()
const isWishlisted = computed(() => isInWishlist(props.product.id))

function handleWishlist(e: Event) {
  e.preventDefault()
  toggleWishlist(props.product.id)
}

const isAdded = ref(false)

async function handleAddToCart(e: Event) {
  e.preventDefault()
  const variantId = props.product.variants?.[0]?.id
  if (variantId) {
    await addToCart(variantId, 1)
    isAdded.value = true
    isCartOpen.value = true
    setTimeout(() => {
      isAdded.value = false
    }, 2000)
  }
}

const categoryName = computed(() => {
  if (!props.product.categoryId) return 'Category'
  return props.product.categories?.[0]?.name || props.product.categoryId || 'decor'
})

const productRating = computed(() => {
  const rating = Number(props.product.rating) || 0
  return rating > 0 ? rating.toFixed(1) : '0.0'
})

const reviewCount = computed(() => props.product.reviewsCount || 0)
const isDiscounted = computed(() => props.product.compareAtPrice && props.product.compareAtPrice > props.product.price)
const discountPercent = computed(() => {
  if (!isDiscounted.value) return 0
  const diff = props.product.compareAtPrice! - props.product.price
  return Math.round((diff / props.product.compareAtPrice!) * 100)
})

const currentImageIndex = ref(0)
const hasMultipleImages = computed(() => props.product.images && props.product.images.length > 1)

function nextImage(e: Event) {
  e.preventDefault()
  if (hasMultipleImages.value) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.product.images!.length
  }
}

function prevImage(e: Event) {
  e.preventDefault()
  if (hasMultipleImages.value) {
    currentImageIndex.value = (currentImageIndex.value - 1 + props.product.images!.length) % props.product.images!.length
  }
}
</script>

<template>
  <div :class="['pc-wrapper', `layout-${layout}`]">
    <!-- Image Container with Overlays -->
    <div class="pc-image-container">
      <div class="pc-top-bar">
        <div class="pc-badges">
          <span v-if="product.isNew" class="pc-badge badge-new">NEW</span>
          <span v-if="isDiscounted" class="pc-badge badge-discount">-{{ discountPercent }}%</span>
        </div>
        <button class="pc-wishlist-btn" aria-label="Add to favorites" @click.prevent="handleWishlist">
          <Heart :size="20" stroke-width="1.5" :class="isWishlisted ? 'icon-active' : 'icon-default'" />
        </button>
      </div>

      <NuxtLink :to="`/products/${product.slug}`" class="pc-image-link">
        <BaseImage
          :src="product.images?.[currentImageIndex]?.src || ''"
          :alt="product.images?.[currentImageIndex]?.alt || product.name"
          class="pc-image"
        />
      </NuxtLink>
      
      <!-- Image Carousel Arrows -->
      <button v-if="hasMultipleImages" class="img-nav-btn prev" aria-label="Previous image" @click.prevent="prevImage">
        <ChevronLeft :size="18" stroke-width="1.5" />
      </button>
      <button v-if="hasMultipleImages" class="img-nav-btn next" aria-label="Next image" @click.prevent="nextImage">
        <ChevronRight :size="18" stroke-width="1.5" />
      </button>
    </div>

    <!-- Info Container -->
    <div class="pc-info">
      <NuxtLink :to="`/products/${product.slug}`" class="pc-link">
        <div class="pc-title-row">
          <h3 class="pc-title">{{ product.name }}</h3>
          <div class="pc-rating" v-if="Number(productRating) > 0">
            {{ productRating }} <Star :size="12" fill="#FBBF24" color="#FBBF24" />
            <span v-if="reviewCount > 0" class="pc-review-count">({{ reviewCount }})</span>
          </div>
        </div>
        
        <span class="pc-category">{{ categoryName }}</span>

        <div class="pc-price-row">
          <span v-if="isDiscounted" class="pc-price-old">{{ formatPrice(product.compareAtPrice!) }}</span>
          <span class="pc-price-current">{{ formatPrice(product.price) }}</span>
        </div>
      </NuxtLink>
      
      <!-- Bottom Actions Area -->
      <div class="pc-bottom-actions">
        <button class="btn-add-cart" :disabled="!product.variants?.length" @click.prevent="handleAddToCart">
          <span v-if="!product.variants?.length">Indisponible</span>
          <span v-else-if="isAdded">Ajouté !</span>
          <span v-else>Add to cart</span>
        </button>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.pc-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: var(--dp-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.pc-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.pc-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  aspect-ratio: 4 / 5;
  background-color: #f9f9f9;
}

.pc-top-bar {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 10;
}

.pc-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.pc-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-new {
  background-color: #4CAF50;
}

.badge-discount {
  background-color: #f38d53;
}

.pc-wishlist-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: transform 0.2s;
}

.pc-wishlist-btn:hover {
  transform: scale(1.1);
}

.icon-active {
  color: #ef4444;
  fill: #ef4444;
}

.icon-default {
  color: #333;
}

.pc-image-link {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pc-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.img-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 10;
}

.img-nav-btn.prev {
  left: 0px;
}

.img-nav-btn.next {
  right: 0px;
}

@media (min-width: 1024px) {
  .img-nav-btn {
    opacity: 0;
    visibility: hidden;
  }

  .pc-wrapper:hover .img-nav-btn {
    opacity: 1;
    visibility: visible;
  }
}

.pc-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 16px;
  background-color: var(--dp-white);
  position: relative;
  z-index: 5;
  transition: transform 0.3s ease;
}

.pc-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pc-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 4px;
}

.pc-title {
  font-family: var(--font-heading, sans-serif);
  font-size: 1.1rem;
  font-weight: 700;
  color: #2D2A26;
  margin: 0;
  line-height: 1.2;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pc-rating {
  font-size: 0.75rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.pc-review-count {
  font-size: 0.7rem;
  color: #999;
  margin-left: 2px;
}

.pc-category {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 24px;
}

.pc-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.pc-price-old {
  font-size: 0.9rem;
  color: #b3b3b3;
  text-decoration: line-through;
}

.pc-price-current {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f38d53;
}

.pc-bottom-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (min-width: 1024px) {
  .pc-bottom-actions {
    position: absolute;
    top: 100%;
    left: 16px;
    right: 16px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
  }

  .pc-wrapper:hover .pc-info {
    transform: translateY(-52px);
  }

  .pc-wrapper:hover .pc-bottom-actions {
    opacity: 1;
    visibility: visible;
  }
}

.btn-add-cart {
  flex: 1;
  background-color: #f38d53;
  color: white;
  border: none;
  border-radius: 99px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-add-cart:hover:not(:disabled) {
  background-color: #e57a41;
}

.btn-add-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}




/* List Layout */
.layout-list {
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

.layout-list .pc-image-container {
  width: 250px;
  margin-bottom: 0;
  aspect-ratio: 1 / 1;
}

.layout-list .pc-info {
  flex: 1;
  padding: 0;
}

@media (max-width: 640px) {
  .layout-list {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .layout-list .pc-image-container {
    width: 100%;
    aspect-ratio: 4 / 5;
  }
}

/* Tighter mobile grid cards */
@media (max-width: 480px) {
  .pc-wrapper {
    border-radius: 8px;
  }

  .pc-info {
    padding: 12px;
  }

  .pc-title {
    font-size: 0.95rem;
  }

  .pc-category {
    font-size: 0.8rem;
    margin-bottom: 16px;
  }

  .pc-price-current {
    font-size: 1rem;
  }

  .btn-add-cart {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
  
  .pc-bottom-actions {
    gap: 8px;
  }
}
</style>