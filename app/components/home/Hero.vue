<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import Container from '../ui/Container.vue'
import BaseImage from '../ui/BaseImage.vue'
import { useProducts } from '~/composables/useProducts'
import { formatPrice } from '~/utils/formatPrice'

const { featured, products } = useProducts()

const defaultBgColors = ['#ebd6bc', '#b7c2b2', '#d4cec4', '#f1f1f1', '#e8e8e8']
const defaultBlobColors = ['#e0caa9', '#aeb8a8', '#c8c2b7', '#e2e2e2', '#d9d9d9']

const slides = computed(() => {
  const sourceProducts = (featured.value && featured.value.length > 0) ? featured.value : (products.value || [])
  if (sourceProducts.length === 0) return []
  
  return sourceProducts.slice(0, 5).map((product, index) => {
    // If the product has multiple images, take the first one, or a placeholder
    const imageUrl = (product.images && product.images.length > 0) ? product.images[0].src : '/images/hero-living-room.jpg'
    return {
      id: product.id,
      title: product.name,
      category: product.categories?.[0]?.name || product.categoryId || 'decor',
      price: product.price,
      slug: product.slug,
      image: imageUrl,
      bgColor: defaultBgColors[index % defaultBgColors.length],
      blobColor: defaultBlobColors[index % defaultBlobColors.length]
    }
  })
})

const currentSlide = ref(0)
const direction = ref('next')
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

function nextSlide() {
  direction.value = 'next'
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetAutoPlay()
}

function prevSlide() {
  direction.value = 'prev'
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
  resetAutoPlay()
}

function setSlide(index: number) {
  if (index === currentSlide.value) return
  direction.value = index > currentSlide.value ? 'next' : 'prev'
  currentSlide.value = index
  resetAutoPlay()
}

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    direction.value = 'next'
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
  }, 6000)
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

function resetAutoPlay() {
  stopAutoPlay()
  startAutoPlay()
}

// Touch swipe support for mobile
let touchStartX = 0
let touchEndX = 0

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0].screenX
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

function handleSwipe() {
  const minSwipeDistance = 50
  if (touchEndX < touchStartX - minSwipeDistance) {
    nextSlide() // Swiped left -> Next slide
  }
  if (touchEndX > touchStartX + minSwipeDistance) {
    prevSlide() // Swiped right -> Prev slide
  }
}

onMounted(() => {
  startAutoPlay()
})

onBeforeUnmount(() => {
  stopAutoPlay()
})
</script>

<template>
  <section 
    class="hero-slider" 
    @touchstart="handleTouchStart" 
    @touchend="handleTouchEnd"
  >
    <button class="nav-arrow left" aria-label="Previous slide" @click="prevSlide">
      <ArrowLeft :size="18" stroke-width="1.5" />
    </button>
    <button class="nav-arrow right" aria-label="Next slide" @click="nextSlide">
      <ArrowRight :size="18" stroke-width="1.5" />
    </button>

    <div class="slider-viewport">
      <TransitionGroup :name="'slide-' + direction" tag="div" class="slider-track">
        <template v-for="(slide, index) in slides">
          <div 
            v-if="currentSlide === index"
            :key="slide.id"
            class="slide"
            :style="{ backgroundColor: slide.bgColor }"
          >
          <!-- Abstract Background Elements (inside each slide so they transition) -->
          <div class="bg-elements">
            <svg class="blob blob-center" viewBox="0 0 500 500" :fill="slide.blobColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M439.5,330Q419,410,334.5,435Q250,460,166,432.5Q82,405,43,327.5Q4,250,56.5,183Q109,116,179.5,84Q250,52,326.5,77Q403,102,431.5,176Q460,250,439.5,330Z" />
            </svg>
            <svg class="bg-lines" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20,100 C50,20 150,20 180,100" stroke="#fff" stroke-opacity="0.3" stroke-width="6" stroke-linecap="round" />
              <path d="M50,120 C70,60 130,60 150,120" stroke="#fff" stroke-opacity="0.3" stroke-width="6" stroke-linecap="round" />
              <path d="M80,140 C90,100 110,100 120,140" stroke="#fff" stroke-opacity="0.3" stroke-width="6" stroke-linecap="round" />
            </svg>
            <div class="bg-dots"/>
          </div>

          <Container class="slide-container">
            <div class="slide-content">
              <!-- Left Column -->
              <div class="slide-left">
                <div class="category-badge">
                  <div class="icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M8 21h8" />
                      <path d="M12 21v-4" />
                      <path d="M12 17a3 3 0 0 0-3-3H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2a3 3 0 0 0-3 3" />
                      <path d="M7 2v5" />
                      <path d="M17 2v5" />
                    </svg>
                  </div>
                  <div class="badge-text">
                    Discover more products<br>
                    in the <span class="highlight">{{ slide.category }}</span> category
                  </div>
                </div>

                <h1 class="slide-title">
                  {{ slide.title }}
                </h1>

                <div class="slide-actions">
                  <NuxtLink :to="`/products/${slide.slug}`" class="shop-btn">Shop Now</NuxtLink>
                  <span class="price">{{ formatPrice(slide.price) }}</span>
                </div>
              </div>

              <!-- Right Column -->
              <div class="slide-right">
                <div class="image-wrapper">
                  <BaseImage :src="slide.image" :alt="slide.title" class="product-image" />
                </div>
              </div>
            </div>
          </Container>
        </div>
        </template>
      </TransitionGroup>
    </div>

    <!-- Pagination Dots -->
    <div class="pagination-wrapper">
      <div class="pagination-pill">
        <button 
          v-for="(_, index) in slides" 
          :key="index"
          class="dot"
          :class="{ active: currentSlide === index }"
          :aria-label="`Go to slide ${index + 1}`"
          @click="setSlide(index)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-slider {
  position: relative;
  height: 60vh;
  min-height: 500px;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-family: var(--font-body);
}

/* Background Elements */
.bg-elements {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.blob-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  transform: translate(-30%, -50%);
  opacity: 0.6;
}

.bg-lines {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 250px;
  height: 250px;
  transform: rotate(15deg);
}
@media (max-width: 768px) {
  .bg-lines {
    width: 150px;
    height: 150px;
    top: 50%;
    right: 30%;
  }
  .blob-center {
    display: none;
  }
}

.bg-dots {
  position: absolute;
  bottom: 15%;
  left: 35%;
  width: 100px;
  height: 100px;
  background-image: radial-gradient(#5a5e55 40%, transparent 40%);
  background-size: 25px 25px;
  background-position: 0 0;
  opacity: 0.4;
  border-radius: 50%;
}

/* Navigation Arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--dp-white);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dp-charcoal);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}
.nav-arrow:hover {
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
}
.nav-arrow.left { left: 2rem; }
.nav-arrow.right { right: 2rem; }

@media (max-width: 768px) {
  .nav-arrow { display: none; }
}

/* Slider Track */
.slider-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.slide-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.slide-content {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .slide-content {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

/* Left Column */
.slide-left {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
}

@media (min-width: 1024px) {
  .slide-left {
    padding-top: 0;
    padding-left: 2rem;
  }
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dp-charcoal);
}

.badge-text {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #4a4e47;
  line-height: 1.4;
}

.badge-text .highlight {
  font-weight: 700;
  color: #3b3f38;
  position: relative;
}

.badge-text .highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #d2794a; /* Terracotta orange line */
}

.slide-title {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 600;
  color: #3a3e36;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
}

@media (min-width: 768px) {
  .slide-title {
    font-size: 4.5rem;
  }
}

.slide-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.shop-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--dp-white);
  color: var(--dp-charcoal);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.875rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.shop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
}

.price {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 600;
  color: #3a3e36;
}

/* Right Column */
.slide-right {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 250px;
  margin: 0 auto;
  aspect-ratio: 4/3;
  /* Complex organic shape using clip-path */
  clip-path: polygon(
    10% 0, 100% 0, 100% 85%, 
    90% 100%, 0 100%, 0 15%
  );
  border-radius: 20px; /* Base rounding fallback */
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

/* A more organic clip path */
@supports (clip-path: path('M0,0')) {
  .image-wrapper {
    clip-path: path('M 60,0 C 250,-10 500,40 500,180 C 500,350 400,500 250,500 C 60,500 0,380 0,200 C 0,80 10,10 60,0 Z');
    /* Using scale to fit container */
    mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M 500,0 C 800,0 1000,200 1000,500 C 1000,800 800,1000 500,1000 C 450,1000 400,800 350,700 C 300,900 150,1000 50,900 C -50,800 0,400 100,200 C 200,0 300,50 350,200 C 400,50 450,0 500,0 Z"/></svg>');
    mask-size: cover;
    mask-repeat: no-repeat;
    mask-position: center;
    clip-path: none;
    border-radius: 0;
  }
}

@media (min-width: 1024px) {
  .category-badge { margin-bottom: 2.5rem; gap: 1rem; }
  .slide-title { margin: 0 0 2.5rem 0; }
  .image-wrapper { 
    max-width: 900px;
    width: 130%; 
    right: -15%;
  }
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Pagination Pill */
.pagination-wrapper {
  position: absolute;
  bottom: 2rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 20;
}

.pagination-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--dp-white);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #c4c4c4;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.dot.active {
  background-color: var(--dp-charcoal);
  transform: scale(1.3);
}

/* Animations */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Abstract blob on the right overlapping image */
.slide-right::after {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 80%;
  background-color: #8c9688;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  z-index: -1;
  opacity: 0.4;
}

.slide-right::before {
  content: '';
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 40%;
  height: 60%;
  background-color: #a3ad9f;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  z-index: -1;
  opacity: 0.6;
}
</style>
