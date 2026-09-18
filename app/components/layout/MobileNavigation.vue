<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, X, Instagram, Facebook, Twitter } from 'lucide-vue-next'
import { useNavigation } from '~/composables/useNavigation'

const { mobileMenuOpen, closeMobileMenu, navLinks, isActive } = useNavigation()

const openGroup = ref<string | null>(null)

function toggleGroup(title: string) {
  openGroup.value = openGroup.value === title ? null : title
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-scale">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay">
        
        <!-- Header -->
        <div class="mobile-menu-header">
          <NuxtLink to="/" class="mobile-menu-logo" @click="closeMobileMenu">
            DESACT
          </NuxtLink>
          <button class="mobile-menu-close" aria-label="Fermer le menu" @click="closeMobileMenu">
            <X :size="32" stroke-width="1" />
          </button>
        </div>

        <!-- Links Area -->
        <nav class="mobile-menu-nav">
          <ul class="mobile-menu-list">
            <li v-for="(link, index) in navLinks" :key="link.label" class="mobile-menu-item" :style="{ animationDelay: `${index * 0.1}s` }">
              
              <!-- Simple Link -->
              <NuxtLink
                v-if="!link.megaMenu"
                :to="link.href"
                class="mobile-link-text"
                :class="{ 'active': isActive(link.href) }"
                @click="closeMobileMenu"
              >
                {{ link.label }}
              </NuxtLink>

              <!-- Accordion Link -->
              <div v-else class="mobile-accordion">
                <button
                  class="mobile-accordion-btn"
                  :class="{ 'active': openGroup === link.label }"
                  @click="toggleGroup(link.label)"
                >
                  <span class="mobile-link-text">{{ link.label }}</span>
                  <ChevronDown class="mobile-accordion-icon" :size="24" stroke-width="1.5" />
                </button>
                
                <div class="mobile-accordion-panel" :class="{ 'is-open': openGroup === link.label }">
                  <div class="mobile-subgroups">
                    <div v-for="group in link.megaMenu" :key="group.title" class="mobile-subgroup">
                      <span class="mobile-subgroup-title">{{ group.title }}</span>
                      <ul class="mobile-subgroup-list">
                        <li v-for="item in group.links" :key="item.label">
                          <NuxtLink 
                            :to="item.href" 
                            class="mobile-sublink-text"
                            @click="closeMobileMenu"
                          >
                            {{ item.label }}
                          </NuxtLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </li>
          </ul>
        </nav>

        <!-- Footer -->
        <div class="mobile-menu-footer">
          <div class="mobile-footer-links">
            <NuxtLink to="/account" @click="closeMobileMenu">Compte</NuxtLink>
            <NuxtLink to="/contact" @click="closeMobileMenu">Contact</NuxtLink>
            <NuxtLink to="/faq" @click="closeMobileMenu">FAQ</NuxtLink>
          </div>
          <div class="mobile-socials">
            <a href="#" aria-label="Instagram"><Instagram :size="20" stroke-width="1.5" /></a>
            <a href="#" aria-label="Facebook"><Facebook :size="20" stroke-width="1.5" /></a>
            <a href="#" aria-label="Twitter"><Twitter :size="20" stroke-width="1.5" /></a>
          </div>
        </div>
        
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Full screen overlay with dark luxury theme */
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem;
}

.mobile-menu-logo {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--dp-white);
  text-decoration: none;
}

.mobile-menu-close {
  background: transparent;
  border: none;
  color: var(--dp-white);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.mobile-menu-close:hover {
  transform: rotate(90deg);
}

/* Navigation List */
.mobile-menu-nav {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 1.5rem;
}

.mobile-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-menu-item {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.mobile-link-text {
  font-size: 2.75rem;
  font-weight: 300;
  color: var(--dp-white);
  text-decoration: none;
  line-height: 1.1;
  transition: color 0.3s ease;
  display: block;
}

.mobile-link-text.active {
  color: var(--dp-gold);
  font-style: italic;
}

/* Accordion */
.mobile-accordion-btn {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: var(--dp-white);
}

.mobile-accordion-icon {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--dp-gold);
}

.mobile-accordion-btn.active .mobile-accordion-icon {
  transform: rotate(180deg);
}

.mobile-accordion-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  opacity: 0;
}

.mobile-accordion-panel.is-open {
  max-height: 1000px;
  opacity: 1;
}

.mobile-subgroups {
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.mobile-subgroup-title {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #8C8C8C;
  margin-bottom: 1rem;
}

.mobile-subgroup-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-sublink-text {
  font-size: 1.125rem;
  color: var(--dp-white);
  text-decoration: none;
  font-weight: 300;
  transition: color 0.3s ease;
}

/* Footer */
.mobile-menu-footer {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-footer-links {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.mobile-footer-links a {
  color: var(--dp-white);
  text-decoration: none;
}

.mobile-socials {
  display: flex;
  gap: 1.5rem;
}

.mobile-socials a {
  color: var(--dp-white);
  transition: color 0.3s ease;
}

.mobile-socials a:hover {
  color: var(--dp-gold);
}

/* Animations */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style scoped>
/* Empty style block to fix Vite HMR cache bug */
</style>
