<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useProductFilters } from '~/composables/useProductFilters'
import { useCategories } from '~/composables/useCategories'

const { selectedCategory, selectedMaterials, selectedColors, inStockOnly, priceRange } = useProductFilters()
const { categories: apiCategories } = useCategories()

// Build category list dynamically from Medusa API data
const categories = computed(() => {
  const all = [{ label: 'Tous les produits', value: 'all' }]
  if (apiCategories.value) {
    all.push(...apiCategories.value.map(c => ({
      label: c.name,
      value: c.id // use Medusa category ID for filtering
    })))
  }
  return all
})

// Price Slider logic
const minAvailable = 0
const maxAvailable = 20000

const minPercent = computed(() => ((priceRange.value[0] - minAvailable) / (maxAvailable - minAvailable)) * 100)
const maxPercent = computed(() => ((priceRange.value[1] - minAvailable) / (maxAvailable - minAvailable)) * 100)

function handleMinInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  if (val > priceRange.value[1]) {
    priceRange.value[0] = priceRange.value[1]
  } else {
    priceRange.value[0] = val
  }
}

function handleMaxInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  if (val < priceRange.value[0]) {
    priceRange.value[1] = priceRange.value[0]
  } else {
    priceRange.value[1] = val
  }
}

const openSections = ref<Record<string, boolean>>({
  categories: true,
  prix: true,
  materiaux: true,
  couleurs: true,
  disponibilite: true
})

function toggleSection(section: string) {
  openSections.value[section] = !openSections.value[section]
}

const materiaux = [
  'Bois massif',
  'Métal',
  'Tissu',
  'Cuir',
  'Marbre',
  'Verre',
  'Céramique'
]

const couleurs = [
  '#C19A5B', // gold
  '#F3EDE4', // cream
  '#B5A898', // taupe
  '#8C8279', // stone
  '#DCD8D0', // sand
  '#4A4541', // slate
  '#0A0908', // black
  '#FFFFFF'  // white
]

function toggleMaterial(mat: string) {
  if (selectedMaterials.value.includes(mat)) {
    selectedMaterials.value = selectedMaterials.value.filter(m => m !== mat)
  } else {
    selectedMaterials.value.push(mat)
  }
}

function toggleColor(col: string) {
  if (selectedColors.value.includes(col)) {
    selectedColors.value = selectedColors.value.filter(c => c !== col)
  } else {
    selectedColors.value.push(col)
  }
}

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

function updateCategory(val: string) {
  selectedCategory.value = val
  router.replace({ query: { ...route.query, category: val === 'all' ? undefined : val } })
}
</script>

<template>
  <aside class="product-sidebar">
    <!-- Catégories -->
    <div class="sidebar-section">
      <button class="section-header" @click="toggleSection('categories')">
        <span class="section-title">CATÉGORIES</span>
        <ChevronDown :size="16" class="sidebar-icon" :class="{ 'sidebar-icon-rotated': openSections.categories }" />
      </button>
      <div v-show="openSections.categories" class="section-content">
        <ul class="category-list">
          <li v-for="cat in categories" :key="cat.value">
            <button 
              class="category-link" 
              :class="{ 'active': selectedCategory === cat.value }"
              @click="updateCategory(cat.value)"
            >
              {{ cat.label }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Prix -->
    <div class="sidebar-section">
      <button class="section-header" @click="toggleSection('prix')">
        <span class="section-title">PRIX</span>
        <ChevronDown :size="16" class="sidebar-icon" :class="{ 'sidebar-icon-rotated': openSections.prix }" />
      </button>
      <div v-show="openSections.prix" class="section-content">
        <!-- Interactive Dual Slider -->
        <div class="price-slider-container">
          <div class="slider-track-wrapper">
            <div class="slider-track">
              <div class="slider-fill" :style="{ left: minPercent + '%', right: (100 - maxPercent) + '%' }"></div>
            </div>
            <input type="range" :min="minAvailable" :max="maxAvailable" step="100" :value="priceRange[0]" @input="handleMinInput" class="range-input">
            <input type="range" :min="minAvailable" :max="maxAvailable" step="100" :value="priceRange[1]" @input="handleMaxInput" class="range-input">
          </div>
          <div class="price-range">
            <span>{{ priceRange[0] }} MAD</span>
            <span>{{ priceRange[1] }} MAD</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Matériaux -->
    <div class="sidebar-section">
      <button class="section-header" @click="toggleSection('materiaux')">
        <span class="section-title">MATÉRIAUX</span>
        <ChevronDown :size="16" class="sidebar-icon" :class="{ 'sidebar-icon-rotated': openSections.materiaux }" />
      </button>
      <div v-show="openSections.materiaux" class="section-content">
        <ul class="checkbox-list">
          <li v-for="mat in materiaux" :key="mat" class="checkbox-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                class="checkbox-input" 
                :checked="selectedMaterials.includes(mat)"
                @change="toggleMaterial(mat)"
              />
              <span class="checkbox-custom"></span>
              {{ mat }}
            </label>
          </li>
        </ul>
      </div>
    </div>

    <!-- Couleurs -->
    <div class="sidebar-section">
      <button class="section-header" @click="toggleSection('couleurs')">
        <span class="section-title">COULEURS</span>
        <ChevronDown :size="16" class="sidebar-icon" :class="{ 'sidebar-icon-rotated': openSections.couleurs }" />
      </button>
      <div v-show="openSections.couleurs" class="section-content">
        <div class="color-grid">
          <button 
            v-for="color in couleurs" 
            :key="color"
            class="color-swatch"
            :class="{ 'swatch-active': selectedColors.includes(color) }"
            :style="{ backgroundColor: color }"
            :aria-label="`Couleur ${color}`"
            @click="toggleColor(color)"
          ></button>
        </div>
      </div>
    </div>

    <!-- Disponibilité -->
    <div class="sidebar-section no-border">
      <button class="section-header" @click="toggleSection('disponibilite')">
        <span class="section-title">DISPONIBILITÉ</span>
        <ChevronDown :size="16" class="sidebar-icon" :class="{ 'sidebar-icon-rotated': openSections.disponibilite }" />
      </button>
      <div v-show="openSections.disponibilite" class="section-content">
        <label class="checkbox-label">
          <input type="checkbox" class="checkbox-input" v-model="inStockOnly" />
          <span class="checkbox-custom"></span>
          En stock uniquement
        </label>
      </div>
    </div>

    <!-- Help Box -->
    <div class="help-box">
      <div class="help-header">
        <svg xmlns="http://www.3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--dp-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headset"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/></svg>
        <span class="help-title">BESOIN D'AIDE ?</span>
      </div>
      <p class="help-desc">Notre équipe est à votre écoute pour vous accompagner.</p>
      <NuxtLink to="/contact" class="help-btn">
        NOUS CONTACTER
        <svg xmlns="http://www.3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
.product-sidebar {
  width: 100%;
}

.sidebar-section {
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 1.5rem 0;
}
.sidebar-section.no-border {
  border-bottom: none;
}

.sidebar-icon {
  transition: transform 0.3s ease;
}

.sidebar-icon-rotated {
  transform: rotate(180deg);
}

.section-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--dp-charcoal);
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-content {
  padding-top: 1rem;
}

/* Category List */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-link {
  background: none;
  border: none;
  padding: 0;
  text-decoration: none;
  color: var(--dp-ash);
  font-size: 0.875rem;
  transition: color 0.3s ease;
  cursor: pointer;
  text-align: left;
}

.category-link:hover {
  color: var(--dp-charcoal);
}

.category-link.active {
  color: var(--dp-gold);
}

/* Checkboxes */
.checkbox-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--dp-ash);
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: var(--dp-charcoal);
  border-color: var(--dp-charcoal);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
}

/* Color Grid */
.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem 1.5rem;
}

.color-swatch {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.swatch-active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px var(--dp-white), 0 0 0 4px var(--dp-charcoal);
  border-color: transparent;
}

/* Slider */
.price-slider-container {
  padding: 0.5rem 0 1rem 0;
}

.slider-track-wrapper {
  position: relative;
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.slider-track {
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: var(--dp-sand);
  border-radius: 2px;
  z-index: 1;
}

.slider-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: var(--dp-gold);
  z-index: 2;
}

.range-input {
  position: absolute;
  width: 100%;
  height: 100%;
  appearance: none;
  -webkit-appearance: none;
  background: none;
  pointer-events: none;
  z-index: 3;
  margin: 0;
  outline: none;
}

/* Thumb styles for Webkit (Chrome, Safari, Edge) */
.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--dp-gold);
  border: 2px solid var(--dp-white);
  box-shadow: 0 0 0 2px var(--dp-gold);
  cursor: grab;
  /* Adjust thumb position vertically if needed */
  transform: translateY(-0.5px);
}

.range-input::-webkit-slider-thumb:active {
  cursor: grabbing;
}

/* Thumb styles for Firefox */
.range-input::-moz-range-thumb {
  pointer-events: auto;
  width: 8px; /* Firefox calculates sizing slightly differently */
  height: 8px;
  border-radius: 50%;
  background-color: var(--dp-gold);
  border: 2px solid var(--dp-white);
  box-shadow: 0 0 0 2px var(--dp-gold);
  cursor: grab;
}

.range-input::-moz-range-thumb:active {
  cursor: grabbing;
}

.price-range {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--dp-charcoal);
  font-weight: 500;
}

/* Help Box */
.help-box {
  background-color: #faf9f7; /* Very light beige */
  border: 1px solid rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.help-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.help-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--dp-gold);
  letter-spacing: 0.05em;
}

.help-desc {
  font-size: 0.75rem;
  color: var(--dp-ash);
  line-height: 1.5;
  margin: 0;
}

.help-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: 1px solid rgba(0,0,0,0.1);
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  color: var(--dp-charcoal);
  cursor: pointer;
  transition: all 0.3s ease;
}

.help-btn:hover {
  border-color: var(--dp-charcoal);
  background-color: var(--dp-white);
}
</style>
