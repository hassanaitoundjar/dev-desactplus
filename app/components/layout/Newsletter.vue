<script setup lang="ts">
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import { ArrowRight } from 'lucide-vue-next'

const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')

async function subscribe() {
  if (!email.value) return
  
  status.value = 'loading'
  
  // Simulate API call
  setTimeout(() => {
    if (email.value.includes('@')) {
      status.value = 'success'
      email.value = ''
    } else {
      status.value = 'error'
      errorMessage.value = 'Veuillez entrer une adresse email valide.'
    }
  }, 1000)
}
</script>

<template>
  <div class="newsletter-section">
    <h3 class="newsletter-title">Rejoignez l'Atelier</h3>
    <p class="newsletter-description">
      Inscrivez-vous à notre newsletter pour recevoir nos nouveautés, invitations exclusives et inspirations design.
    </p>

    <form v-if="status !== 'success'" @submit.prevent="subscribe" class="newsletter-form">
      <div class="newsletter-input-group">
        <input
          v-model="email"
          type="email"
          placeholder="Votre adresse email"
          required
          class="newsletter-input"
        />
      </div>
      <BaseButton type="submit" variant="primary" :loading="status === 'loading'">
        S'inscrire <ArrowRight :size="16" />
      </BaseButton>
    </form>
    
    <p v-if="status === 'error'" class="newsletter-error">{{ errorMessage }}</p>

    <div v-if="status === 'success'" class="newsletter-success">
      Merci pour votre inscription ! Vous recevrez bientôt de nos nouvelles.
    </div>
  </div>
</template>

<style scoped>
.newsletter-section {
  background-color: var(--dp-ivory);
  border: 1px solid var(--dp-sand);
  padding: 2rem; /* p-8 */
  text-align: center;
}

@media (min-width: 768px) {
  .newsletter-section {
    padding: 3rem; /* md:p-12 */
  }
}

.newsletter-title {
  font-family: var(--font-heading);
  font-size: 1.5rem; /* text-2xl */
  color: var(--dp-charcoal);
  margin-bottom: 1rem; /* mb-4 */
  margin-top: 0;
}

@media (min-width: 768px) {
  .newsletter-title {
    font-size: 1.875rem; /* md:text-3xl */
  }
}

.newsletter-description {
  font-family: var(--font-body);
  color: var(--dp-ash);
  max-width: 28rem; /* max-w-md */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem; /* mb-8 */
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* gap-4 */
  max-width: 32rem; /* max-w-lg */
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 640px) {
  .newsletter-form {
    flex-direction: row;
  }
}

.newsletter-input-group {
  flex: 1 1 0%;
}

.newsletter-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-charcoal);
  background-color: var(--dp-white);
  border: 1px solid var(--dp-sand);
  transition: border-color 0.3s;
  outline: none;
  box-sizing: border-box;
}

.newsletter-input:focus {
  border-color: var(--dp-gold);
}

.newsletter-error {
  margin-top: 1rem; /* mt-4 */
  font-size: 0.875rem; /* text-sm */
  color: var(--dp-error);
}

.newsletter-success {
  background-color: rgba(91, 138, 95, 0.1); /* bg-[#5B8A5F]/10 */
  color: #5B8A5F;
  padding: 1rem; /* p-4 */
  font-family: var(--font-body);
  font-size: 0.875rem; /* text-sm */
  border-radius: 0.125rem; /* rounded-sm */
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
