<script setup lang="ts">
import { X, Search as SearchIcon, ArrowRight } from 'lucide-vue-next'
import { useNavigation } from '~/composables/useNavigation'
import { useSearch } from '~/composables/useSearch'
import { formatPrice } from '~/utils/formatPrice'

const { searchOpen, closeSearch } = useNavigation()
const { query, results, hasResults } = useSearch()

const searchInput = ref<HTMLInputElement | null>(null)

watch(searchOpen, (isOpen) => {
  if (isOpen) {
    setTimeout(() => searchInput.value?.focus(), 100)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="searchOpen" class="search-overlay">
        
        <!-- Header -->
        <div class="search-header container-site">
          <button class="search-close-btn" @click="closeSearch">
            <span class="search-close-text">Fermer</span>
            <X :size="24" stroke-width="1.5" />
          </button>
        </div>

        <!-- Search Input -->
        <div class="search-input-section container-site">
          <div class="search-input-wrapper">
            <SearchIcon :size="32" class="search-icon" stroke-width="1" />
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              placeholder="Rechercher un produit, une collection..."
              class="search-input"
            />
          </div>
        </div>

        <!-- Results -->
        <div class="search-results-section container-site">
          <div class="search-results-wrapper">
            
            <div v-if="query.length >= 2 && !hasResults" class="search-empty">
              <EmptyState 
                title="Aucun résultat" 
                :description="`Aucun résultat trouvé pour &quot;${query}&quot;`" 
              />
              <button class="search-clear-btn" @click="query = ''">Effacer la recherche</button>
            </div>

            <div v-else-if="hasResults" class="search-grid">
              <NuxtLink
                v-for="product in results.slice(0, 6)"
                :key="product.id"
                :to="`/products/${product.slug}`"
                class="search-product-card"
                @click="closeSearch"
              >
                <div class="search-product-image">
                  <img :src="product.images[0].src" :alt="product.name" />
                </div>
                <div class="search-product-info">
                  <h4 class="search-product-name">{{ product.name }}</h4>
                  <p class="search-product-price">{{ formatPrice(product.price) }}</p>
                </div>
              </NuxtLink>
            </div>

            <div v-if="results.length > 6" class="search-view-all">
              <NuxtLink :to="`/search?q=${query}`" class="search-view-all-link" @click="closeSearch">
                Voir tous les résultats
                <ArrowRight :size="16" />
              </NuxtLink>
            </div>

            <!-- Suggestions -->
            <div v-if="query.length < 2" class="search-suggestions">
              <div>
                <h4 class="search-suggestions-title">Recherches populaires</h4>
                <ul class="search-suggestions-list">
                  <li><button class="search-suggestion-btn" @click="query = 'canapé'">Canapés</button></li>
                  <li><button class="search-suggestion-btn" @click="query = 'table à manger'">Tables à manger</button></li>
                  <li><button class="search-suggestion-btn" @click="query = 'lit'">Lits</button></li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.search-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.search-close-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dp-charcoal);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-close-btn:hover {
  color: var(--dp-gold);
}

.search-close-text {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.search-input-section {
  padding-top: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--dp-sand);
}

.search-input-wrapper {
  position: relative;
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
}

.search-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: var(--dp-stone);
}

.search-input {
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  font-family: var(--font-heading);
  font-size: 2.25rem;
  color: var(--dp-charcoal);
  padding-left: 3.5rem;
  padding-bottom: 1rem;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--dp-sand);
}

@media (min-width: 768px) {
  .search-input {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .search-input {
    font-size: 3.75rem;
  }
}

.search-results-section {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.search-results-wrapper {
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
}

.search-empty {
  text-align: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.search-empty-text {
  font-family: var(--font-body);
  color: var(--dp-ash);
  margin-bottom: 0.5rem;
}

.search-clear-btn {
  color: var(--dp-gold);
  text-decoration: underline;
  text-underline-offset: 4px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.search-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .search-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.search-product-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-decoration: none;
}

.search-product-image {
  width: 6rem;
  height: 6rem;
  background-color: var(--dp-ivory);
  overflow: hidden;
  flex-shrink: 0;
}

.search-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.search-product-card:hover .search-product-image img {
  transform: scale(1.1);
}

.search-product-info {
  display: flex;
  flex-direction: column;
}

.search-product-name {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--dp-charcoal);
  margin-bottom: 0.25rem;
  margin-top: 0;
  transition: color 0.3s ease;
}

.search-product-card:hover .search-product-name {
  color: var(--dp-gold);
}

.search-product-price {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dp-stone);
  margin: 0;
}

.search-view-all {
  margin-top: 3rem;
  text-align: center;
}

.search-view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-gold);
  text-decoration: none;
  transition: color 0.3s ease;
}

.search-view-all-link:hover {
  color: var(--dp-charcoal);
}

.search-suggestions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 768px) {
  .search-suggestions {
    grid-template-columns: repeat(2, 1fr);
  }
}

.search-suggestions-title {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--dp-gold);
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.search-suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-suggestion-btn {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--dp-charcoal);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0;
}

.search-suggestion-btn:hover {
  color: var(--dp-gold);
}

.fade-enter-active,
.fade-leave-active { transition: opacity 300ms; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
