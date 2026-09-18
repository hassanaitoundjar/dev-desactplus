<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { useNavigation } from '~/composables/useNavigation'

const { navLinks, isActive } = useNavigation()
</script>

<template>
  <nav class="desktop-nav">
    <div
      v-for="link in navLinks"
      :key="link.label"
      class="nav-item group"
    >
      <NuxtLink
        :to="link.href"
        class="nav-link"
        :class="isActive(link.href) ? 'active' : ''"
      >
        {{ link.label }}
        <ChevronDown v-if="link.megaMenu" :size="14" class="nav-icon" />
      </NuxtLink>

      <!-- Mega Menu Dropdown -->
      <div
        v-if="link.megaMenu"
        class="mega-menu"
      >
        <div class="mega-menu-grid">
          <div v-for="group in link.megaMenu" :key="group.title" class="mega-menu-col">
            <span class="mega-menu-title">{{ group.title }}</span>
            <ul class="mega-menu-list">
              <li v-for="item in group.links" :key="item.label">
                <NuxtLink :to="item.href" class="mega-menu-link">
                  <span class="mega-menu-label">{{ item.label }}</span>
                  <span v-if="item.description" class="mega-menu-desc">{{ item.description }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
          
          <!-- Featured Image slot inside Mega Menu -->
          <div class="mega-menu-featured group-featured">
            <img src="/images/collection-salon.png" class="featured-img" >
            <div class="featured-content">
              <span class="featured-tag">Nouvelle Collection</span>
              <NuxtLink to="/collections/salon" class="featured-link">
                Découvrir <ChevronDown :size="14" class="featured-link-icon" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.desktop-nav {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-item {
  position: relative;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: var(--space-6) 0;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--dp-charcoal);
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link.active,
.group:hover .nav-link {
  color: var(--dp-gold);
}

.nav-icon {
  transition: transform 0.3s ease;
}

.group:hover .nav-icon {
  transform: rotate(180deg);
}

.mega-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(0.5rem);
  width: 100vw;
  max-width: 64rem; /* max-w-5xl */
  background-color: var(--dp-white);
  border: 1px solid var(--dp-sand);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: var(--z-dropdown);
}

.group:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.mega-menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
  padding: var(--space-10);
}

.mega-menu-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.mega-menu-title {
  font-size: 1.125rem;
  color: var(--dp-charcoal);
  border-bottom: 1px solid var(--dp-sand);
  padding-bottom: var(--space-2);
}

.mega-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.mega-menu-link {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-decoration: none;
}

.mega-menu-label {
  font-size: 0.875rem;
  color: var(--dp-charcoal);
  transition: color 0.3s ease;
}

.mega-menu-link:hover .mega-menu-label {
  color: var(--dp-gold);
}

.mega-menu-desc {
  font-size: 0.75rem;
  color: var(--dp-ash);
}

.mega-menu-featured {
  grid-column: span 1;
  background-color: var(--dp-cream);
  border-radius: 0.125rem;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
}

.featured-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  transition: transform 0.7s ease;
}

.group-featured:hover .featured-img {
  transform: scale(1.05);
}

.featured-content {
  position: relative;
  z-index: 10;
}

.featured-tag {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-charcoal);
  margin-bottom: var(--space-2);
}

.featured-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dp-gold);
  text-decoration: none;
  transition: color 0.3s ease;
}

.featured-link:hover {
  color: var(--dp-charcoal);
}

.featured-link-icon {
  transform: rotate(-90deg);
}
</style>
