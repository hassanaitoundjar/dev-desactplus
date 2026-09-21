<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import { ref } from 'vue'
import { ArrowRight, CheckCircle2 } from 'lucide-vue-next'
import Container from '~/components/ui/Container.vue'
import { useApiClient } from '~/api/apiClient'

useSeo({
  title: 'Contact',
  description: 'Contactez Desact Plus pour vos projets d\'aménagement, demandes de devis ou informations sur nos produits.',
})

useBreadcrumbs([
  { label: 'Contact', href: '/contact' },
])

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const status = ref<'idle' | 'loading' | 'success'>('idle')
const api = useApiClient()

async function submit() {
  status.value = 'loading'
  
  try {
    const response = await api.post('/store/contact', form.value)
    
    status.value = 'success'
    form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  } catch (error) {
    console.error('Contact form submission failed:', error)
    status.value = 'idle'
    alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.')
  }
}
</script>

<template>
  <div class="contact-page">
    <Container>
      <!-- Hero Section -->
      <header class="contact-hero">
        <div class="hero-content">
          <span class="hero-eyebrow">Service Client</span>
          <h1 class="hero-title">Comment pouvons-nous vous aider ?</h1>
          <p class="hero-desc">
            Que ce soit pour une demande d'information, un suivi de commande ou un conseil en aménagement, 
            notre équipe d'experts est à votre entière disposition.
          </p>
        </div>
      </header>

      <!-- Main Layout -->
      <div class="contact-layout">
        
        <!-- Left: Contact Info -->
        <aside class="contact-info">
          <div class="info-block">
            <h3 class="info-title">Notre Showroom</h3>
            <address class="info-text">
              Quartier Racine<br>
              Casablanca, Maroc<br>
              <span class="info-muted">(Sur rendez-vous uniquement)</span>
            </address>
          </div>

          <div class="info-block">
            <h3 class="info-title">Nous contacter</h3>
            <p class="info-text">
              <a href="tel:+212522000000" class="info-link">+212 (0) 5 22 XX XX XX</a><br>
              <a href="mailto:contact@desactplus.com" class="info-link">contact@desactplus.com</a>
            </p>
          </div>

          <div class="info-block">
            <h3 class="info-title">Horaires d'ouverture</h3>
            <p class="info-text">
              Du Lundi au Vendredi<br>
              10h00 - 19h00<br>
              <span class="info-muted">Samedi : 10h00 - 15h00</span>
            </p>
          </div>
        </aside>

        <!-- Right: Form -->
        <div class="contact-form-wrapper">
          <transition name="fade" mode="out-in">
            <form v-if="status !== 'success'" class="luxury-form" @submit.prevent="submit">
              
              <div class="form-row">
                <div class="form-group">
                  <input id="name" v-model="form.name" type="text" class="form-input" placeholder=" " required >
                  <label for="name" class="form-label">Nom complet *</label>
                </div>
                <div class="form-group">
                  <input id="email" v-model="form.email" type="email" class="form-input" placeholder=" " required >
                  <label for="email" class="form-label">E-mail *</label>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <input id="phone" v-model="form.phone" type="tel" class="form-input" placeholder=" " >
                  <label for="phone" class="form-label">Téléphone</label>
                </div>
                <div class="form-group">
                  <input id="subject" v-model="form.subject" type="text" class="form-input" placeholder=" " required >
                  <label for="subject" class="form-label">Sujet *</label>
                </div>
              </div>
              
              <div class="form-group">
                <textarea id="message" v-model="form.message" class="form-input form-textarea" placeholder=" " rows="5" required/>
                <label for="message" class="form-label">Votre message *</label>
              </div>
              
              <button type="submit" class="submit-btn" :disabled="status === 'loading'">
                <span class="btn-text">{{ status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message' }}</span>
                <ArrowRight class="btn-icon" :size="18" />
              </button>
            </form>

            <div v-else class="success-state">
              <div class="success-icon">
                <CheckCircle2 :size="48" stroke-width="1.5" />
              </div>
              <h3 class="success-title">Message Envoyé</h3>
              <p class="success-desc">
                Nous vous remercions de l'intérêt que vous portez à Desact Plus. 
                Notre équipe reviendra vers vous dans les plus brefs délais.
              </p>
              <button class="reset-btn" @click="status = 'idle'">
                Envoyer un autre message
              </button>
            </div>
          </transition>
        </div>

      </div>
    </Container>
  </div>
</template>

<style scoped>
.contact-page {
  padding: 4rem 0 8rem;
  background-color: var(--dp-white);
  min-height: 80vh;
}

/* ─── Hero Section ─── */
.contact-hero {
  margin-bottom: 5rem;
  max-width: 800px;
}

.hero-eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--dp-gold);
  margin-bottom: 1rem;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  color: var(--dp-charcoal);
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
}

.hero-desc {
  font-family: var(--font-body);
  font-size: 1.125rem;
  color: var(--dp-ash);
  line-height: 1.6;
  max-width: 600px;
}

/* ─── Main Layout ─── */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
}

@media (min-width: 1024px) {
  .contact-layout {
    grid-template-columns: 350px 1fr;
    gap: 6rem;
  }
}

/* ─── Info Sidebar ─── */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 3rem;
  background-color: var(--dp-ivory);
  border: 1px solid var(--dp-sand);
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0;
}

.info-text {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--dp-charcoal);
  line-height: 1.6;
  font-style: normal;
  margin: 0;
}

.info-muted {
  color: var(--dp-stone);
  font-size: 0.8125rem;
}

.info-link {
  color: var(--dp-charcoal);
  text-decoration: none;
  transition: color 0.2s;
}

.info-link:hover {
  color: var(--dp-gold);
}

/* ─── Form Area ─── */
.contact-form-wrapper {
  max-width: 800px;
}

.luxury-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  position: relative;
}

.form-input {
  width: 100%;
  background: var(--dp-white);
  border: 1px solid var(--dp-sand);
  padding: 1.75rem 1.25rem 0.75rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--dp-charcoal);
  transition: all 0.3s ease;
  outline: none;
  border-radius: 0;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

/* Hide placeholder visually */
.form-input::placeholder {
  color: transparent;
}

/* Floating Label Logic */
.form-label {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-ash);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.form-input:focus,
.form-input:not(:placeholder-shown) {
  border-color: var(--dp-charcoal);
  background: var(--dp-white);
  box-shadow: 0 0 0 1px var(--dp-charcoal);
}

.form-input:focus ~ .form-label,
.form-input:not(:placeholder-shown) ~ .form-label {
  top: 0.5rem;
  font-size: 0.65rem;
  color: var(--dp-stone);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

/* Submit Button */
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  background: var(--dp-charcoal);
  color: var(--dp-white);
  border: none;
  padding: 1.25rem 2rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: fit-content;
  min-width: 250px;
}

.submit-btn:hover {
  background: var(--dp-gold);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ─── Success State ─── */
.success-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--dp-ivory);
  border: 1px solid var(--dp-sand);
}

.success-icon {
  color: var(--dp-gold);
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.success-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--dp-charcoal);
  margin: 0 0 1rem 0;
}

.success-desc {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--dp-ash);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 2.5rem;
}

.reset-btn {
  background: transparent;
  border: 1px solid var(--dp-charcoal);
  color: var(--dp-charcoal);
  padding: 1rem 2rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: var(--dp-charcoal);
  color: var(--dp-white);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
