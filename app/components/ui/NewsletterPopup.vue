<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, Truck, ShieldCheck, Award, Headset } from 'lucide-vue-next'
import BaseImage from '../ui/BaseImage.vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const email = ref('')
const route = useRoute()

onMounted(() => {
  // Only show on home page
  if (route.path !== '/') return

  // Check if user has already seen the popup
  const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup')
  if (!hasSeenPopup) {
    // Automatically open the popup after a short delay
    setTimeout(() => {
      isOpen.value = true
    }, 1000)
  }
})

const closePopup = () => {
  isOpen.value = false
  localStorage.setItem('hasSeenNewsletterPopup', 'true')
}

const submitNewsletter = () => {
  if (email.value) {
    // In a real app, you would send this to your API
    closePopup()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="nl-overlay" @click.self="closePopup">
        <div class="nl-modal" role="dialog" aria-modal="true">
          
          <!-- Close Button -->
          <button class="nl-btn-close-modal" aria-label="Fermer" @click="closePopup">
            <X :size="20" stroke-width="1.5" />
          </button>

          <!-- Main Content Area -->
          <div class="nl-main">
            
            <!-- Left: Text & Form -->
            <div class="nl-content">
              <span class="nl-subtitle">BIENVENUE CHEZ ATELIER MAISON</span>
              <h2 class="nl-title">L'élégance<br>commence ici.</h2>
              <div class="nl-divider"/>
              
              <p class="nl-desc">
                Inscrivez-vous et recevez 10 % de réduction sur votre première commande, ainsi que nos inspirations et nouveautés exclusives.
              </p>
              
              <form class="nl-form" @submit.prevent="submitNewsletter">
                <input 
                  v-model="email" 
                  type="email" 
                  placeholder="Votre adresse e-mail" 
                  class="nl-input"
                  required
                >
                <button type="submit" class="nl-btn-submit">
                  RECEVOIR 10 % DE RÉDUCTION
                </button>
              </form>
              
              <button class="nl-btn-close-text" @click="closePopup">
                Non merci, je préfère découvrir le site
              </button>
            </div>
            
            <!-- Right: Image -->
            <div class="nl-image-col">
              <BaseImage 
                src="/images/collection-lighting.png" 
                alt="Newsletter image" 
                class="nl-image"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.nl-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(26, 25, 22, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  backdrop-filter: blur(4px);
}

.nl-modal {
  position: relative;
  width: 100%;
  max-width: 900px;
  background-color: #f3eee8;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
}

.nl-btn-close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.25rem;
  height: 2.25rem;
  background-color: var(--dp-white);
  color: var(--dp-charcoal);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.nl-btn-close-modal:hover {
  transform: scale(1.1);
}

/* Main Area */
.nl-main {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}

@media (min-width: 768px) {
  .nl-main {
    flex-direction: row;
    height: 500px;
  }
}

.nl-content {
  flex: 1;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

@media (min-width: 768px) {
  .nl-content {
    padding: var(--space-12);
    align-items: flex-start;
    text-align: left;
  }
}

.nl-subtitle {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #a88a65; /* Gold/brown */
  margin-bottom: var(--space-4);
}

.nl-title {
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  line-height: 1.1;
  margin: 0 0 var(--space-4) 0;
}

@media (min-width: 768px) {
  .nl-title {
    font-size: 3rem;
  }
}

.nl-divider {
  width: 2.5rem;
  height: 2px;
  background-color: #a88a65;
  margin-bottom: var(--space-6);
}

.nl-desc {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: var(--space-8);
  max-width: 24rem;
}

.nl-form {
  width: 100%;
  max-width: 24rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.nl-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  background-color: transparent;
  color: var(--dp-charcoal);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.nl-input::placeholder {
  color: #9ca3af;
}

.nl-input:focus {
  border-color: var(--dp-charcoal);
}

.nl-btn-submit {
  width: 100%;
  padding: 0.875rem;
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nl-btn-submit:hover {
  background-color: #000;
}

.nl-btn-close-text {
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.75rem;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s ease;
}

.nl-btn-close-text:hover {
  color: var(--dp-charcoal);
}

/* Image Column */
.nl-image-col {
  position: relative;
  width: 100%;
  height: 200px;
  flex: none;
}

@media (min-width: 768px) {
  .nl-image-col {
    flex: 1;
    max-width: 50%;
    height: auto;
  }
}

.nl-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
