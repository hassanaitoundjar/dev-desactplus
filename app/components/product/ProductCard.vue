<script setup lang="ts">
import type { Product } from '~/types/product'
import { Heart, Star, Search, ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import BaseImage from '../ui/BaseImage.vue'
import { formatPrice } from '~/utils/formatPrice'
import { useWishlist } from '~/composables/useWishlist'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ 
  product: Product,
  layout?: 'grid' | 'list'
}>(), {
  layout: 'grid'
})

import { useCart } from '~/composables/useCart'

const { toggle: toggleWishlist, isInWishlist } = useWishlist()
const { add: addToCart } = useCart()
const isWishlisted = computed(() => isInWishlist(props.product.id))

function handleWishlist(e: Event) {
  e.preventDefault()
  toggleWishlist(props.product.id)
}

const isAdded = ref(false)

async function handleAddToCart(e: Event) {
  e.preventDefault()
  // Add first variant if available
  const variantId = props.product.variants?.[0]?.id
  if (variantId) {
    await addToCart(variantId, 1)
    isAdded.value = true
    setTimeout(() => {
      isAdded.value = false
    }, 2000)
  }
}

// Fallback logic for category name and rating
const categoryName = computed(() => {
  if (!props.product.categoryId) return 'Category'
  // return props.product.categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())\
  return props.product.categories?.[0]?.name || props.product.categoryId || 'decor'
})

const productRating = computed(() => props.product.rating || '4.5')

// Calculate if discounted
const isDiscounted = computed(() => props.product.compareAtPrice && props.product.compareAtPrice > props.product.price)
const discountPercent = computed(() => {
  if (!isDiscounted.value) return 0
  const diff = props.product.compareAtPrice! - props.product.price
  return Math.round((diff / props.product.compareAtPrice!) * 100)
})

const isHovered = ref(false)
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
  <div 
    :class="['pc-wrapper', `layout-${layout}`]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Top Badges and Heart -->
    <div class="pc-top-bar">
      <div class="pc-badges">
        <span v-if="product.isNew" class="pc-badge badge-new">NEW</span>
        <span v-else-if="isDiscounted" class="pc-badge badge-discount">-{{ discountPercent }}%</span>
      </div>
      <button class="pc-wishlist-btn" @click.prevent="handleWishlist" aria-label="Add to favorites">
        <Heart :size="18" stroke-width="1.5" :class="isWishlisted ? 'icon-active' : 'icon-default'" />
      </button>
    </div>

    <!-- Image Container -->
    <div class="pc-image-container">
      <NuxtLink :to="`/products/${product.slug}`" class="pc-image-link">
        <BaseImage
          :src="product.images?.[currentImageIndex]?.src || ''"
          :alt="product.images?.[currentImageIndex]?.alt || product.name"
          class="pc-image"
        />
      </NuxtLink>
      
      <!-- Image Carousel Arrows (show on hover if multiple images) -->
      <button v-if="hasMultipleImages && isHovered" class="img-nav-btn prev" @click.prevent="prevImage">
        <ChevronLeft :size="20" stroke-width="1.5" />
      </button>
      <button v-if="hasMultipleImages && isHovered" class="img-nav-btn next" @click.prevent="nextImage">
        <ChevronRight :size="20" stroke-width="1.5" />
      </button>
    </div>

    <!-- Info Container -->
    <div class="pc-info">
      <NuxtLink :to="`/products/${product.slug}`" class="pc-link">
        <div class="pc-title-row">
          <h3 class="pc-title">{{ product.name }}</h3>
          <div class="pc-rating">
            {{ productRating }} <Star :size="12" fill="#FBBF24" color="#FBBF24" />
          </div>
        </div>
        
        <span class="pc-category">{{ categoryName }}</span>

        <div class="pc-price-row">
          <span v-if="isDiscounted" class="pc-price-old">{{ formatPrice(product.compareAtPrice!) }}</span>
          <span class="pc-price-current">{{ formatPrice(product.price) }}</span>
        </div>
      </NuxtLink>
      
      <!-- Bottom Actions Area (Swatches vs Add to Cart) -->
      <div class="pc-bottom-actions">
        <Transition name="fade" mode="out-in">
          <!-- Hover State Actions -->
          <div v-if="isHovered" class="pc-actions-hover">
            <button class="btn-add-cart" :disabled="!product.variants?.length" @click.prevent="handleAddToCart">
              <span v-if="!product.variants?.length">Indisponible</span>
              <span v-else-if="isAdded">Ajouté !</span>
              <span v-else>Add to cart</span>
            </button>
            <button class="btn-icon" aria-label="Compare" @click.prevent>
              <ArrowLeftRight :size="16" />
            </button>
            <button class="btn-icon" aria-label="Quick View" @click.prevent>
              <Search :size="16" />
            </button>
          </div>
          <!-- Default State Colors -->
          <div v-else class="pc-colors-wrapper">
            <div v-if="product.colors && product.colors.length > 0" class="pc-colors">
              <span 
                v-for="(color, index) in product.colors" 
                :key="index"
                class="pc-color-swatch"
                :style="{ backgroundColor: color }"
              ></span>
            </div>
            <div v-else class="pc-colors-empty"></div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pc-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  transition: box-shadow 0.3s ease;
}

.pc-wrapper:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.pc-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  z-index: 2;
  position: relative;
}

.pc-badges {
  display: flex;
  gap: 8px;
}

.pc-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  text-transform: uppercase;
}

.badge-new {
  background-color: #2e7d32; /* green */
}

.badge-discount {
  background-color: #f38d53; /* orange */
}

.pc-wishlist-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;
  transition: color 0.2s;
}

.pc-wishlist-btn:hover {
  color: #333;
}

.icon-active {
  color: #ef4444;
  fill: #ef4444;
}

.pc-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  aspect-ratio: 1 / 1;
  margin-bottom: 16px;
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
  object-fit: contain;
  mix-blend-mode: multiply;
}

.img-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.img-nav-btn:hover {
  color: #000;
}

.img-nav-btn.prev {
  left: -8px;
}

.img-nav-btn.next {
  right: -8px;
}

.pc-info {
  display: flex;
  flex-direction: column;
}

.pc-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}

.pc-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.pc-title {
  font-family: var(--font-heading, sans-serif);
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.pc-rating {
  font-size: 0.75rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 2px;
}

.pc-category {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 12px;
}

.pc-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.pc-price-old {
  font-size: 0.8rem;
  color: #999;
  text-decoration: line-through;
}

.pc-price-current {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f38d53;
}

.pc-bottom-actions {
  min-height: 32px;
  display: flex;
  align-items: center;
}

.pc-colors-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}

.pc-colors {
  display: flex;
  gap: 6px;
}

.pc-color-swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #e5e5e5;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
}

.pc-colors-empty {
  height: 12px;
}

.pc-actions-hover {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.btn-add-cart {
  flex: 1;
  background-color: #f38d53;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add-cart:hover:not(:disabled) {
  background-color: #e57a41;
}

.btn-add-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.btn-icon:hover {
  color: #000;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* List Layout Modifications (if needed) */
.layout-list {
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

.layout-list .pc-image-container {
  width: 200px;
  margin-bottom: 0;
}

.layout-list .pc-info {
  flex: 1;
}
</style>
