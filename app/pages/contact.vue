<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import { ref } from 'vue'
import { MapPin, Phone, Mail } from 'lucide-vue-next'

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

async function submit() {
  status.value = 'loading'
  // Simulate API
  setTimeout(() => {
    status.value = 'success'
    form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  }, 1000)
}
</script>

<template>
  <div class="contact-page">
    
    <!-- Image Side -->
    <div class="contact-visual">
      <img src="/images/collection-salon.png" alt="Desact Plus Showroom" class="contact-img" >
      <div class="contact-overlay">
        <h2 class="overlay-text">L'élégance à votre écoute</h2>
      </div>
    </div>

    <!-- Content Side -->
    <div class="contact-content">
      <div class="contact-header">
        <span class="eyebrow">Échangeons</span>
        <h1 class="title">Contact</h1>
        <p class="desc">
          Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets d'aménagement.
        </p>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <h4>Showroom</h4>
          <address>
            Quartier Racine<br >
            Casablanca, Maroc<br >
            (Sur rendez-vous uniquement)
          </address>
        </div>
        <div class="info-item">
          <h4>Contact</h4>
          <p>
            +212 (0) 5 22 XX XX XX<br >
            contact@desactplus.com
          </p>
        </div>
      </div>

      <form v-if="status !== 'success'" class="modern-form" @submit.prevent="submit">
        <div class="form-row">
          <div class="input-group">
            <input id="name" v-model="form.name" type="text" class="modern-input" placeholder=" " required >
            <label for="name" class="floating-label">Nom complet <span class="required-star">*</span></label>
          </div>
          <div class="input-group">
            <input id="email" v-model="form.email" type="email" class="modern-input" placeholder=" " required >
            <label for="email" class="floating-label">Email <span class="required-star">*</span></label>
          </div>
        </div>
        
        <div class="form-row">
          <div class="input-group">
            <input id="phone" v-model="form.phone" type="tel" class="modern-input" placeholder=" " >
            <label for="phone" class="floating-label">Téléphone</label>
          </div>
          <div class="input-group">
            <input id="subject" v-model="form.subject" type="text" class="modern-input" placeholder=" " required >
            <label for="subject" class="floating-label">Sujet <span class="required-star">*</span></label>
          </div>
        </div>
        
        <div class="input-group">
          <textarea id="message" v-model="form.message" class="modern-textarea" placeholder=" " rows="4" required/>
          <label for="message" class="floating-label">Votre message <span class="required-star">*</span></label>
        </div>
        
        <button type="submit" class="submit-btn" :disabled="status === 'loading'">
          {{ status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message' }}
        </button>
      </form>

      <div v-else class="success-state">
        <h3 class="success-title">Message envoyé</h3>
        <p class="success-text">
          Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.
        </p>
        <button class="reset-btn" @click="status = 'idle'">Nouveau message</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.contact-page {
  min-height: calc(100vh - 80px); /* Adjust based on header height */
  display: flex;
  flex-direction: column;
  background-color: var(--dp-ivory);
}

@media (min-width: 1024px) {
  .contact-page {
    flex-direction: row;
  }
}

/* Image Side */
.contact-visual {
  width: 100%;
  height: 40vh;
  position: relative;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .contact-visual {
    width: 50%;
    height: auto;
    min-height: calc(100vh - 80px);
  }
}

.contact-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.contact-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: flex-end;
  padding: 3rem;
}

.overlay-text {
  color: var(--dp-white);
  font-family: var(--font-serif);
  font-size: 2.5rem;
  line-height: 1.1;
  max-width: 400px;
}

/* Content Side */
.contact-content {
  width: 100%;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (min-width: 1024px) {
  .contact-content {
    width: 50%;
    padding: 6rem 5rem;
  }
}

.contact-header {
  margin-bottom: 4rem;
}

.eyebrow {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-gold);
  margin-bottom: 1rem;
  display: block;
}

.title {
  font-family: var(--font-serif);
  font-size: 3.5rem;
  color: var(--dp-charcoal);
  margin: 0 0 1.5rem 0;
  line-height: 1;
}

.desc {
  font-size: 1rem;
  color: var(--dp-ash);
  line-height: 1.6;
  max-width: 450px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
}

@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.info-item h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-charcoal);
  margin: 0 0 0.5rem 0;
}

.info-item p, .info-item address {
  font-size: 0.875rem;
  color: var(--dp-ash);
  line-height: 1.6;
  margin: 0;
  font-style: normal;
}

/* Form Styles */
.modern-form {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 640px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

.input-group {
  position: relative;
  padding-top: 1rem;
}

.modern-input, .modern-textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.5rem 0;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--dp-charcoal);
  transition: border-color 0.3s ease;
  outline: none;
}

.modern-textarea {
  resize: none;
  min-height: 40px;
}

.modern-input::placeholder, .modern-textarea::placeholder {
  color: transparent; /* Hide placeholder so we can use :placeholder-shown */
}

.modern-input:focus, .modern-textarea:focus {
  border-bottom-color: var(--dp-charcoal);
}

.floating-label {
  position: absolute;
  top: 1.5rem;
  left: 0;
  font-size: 1rem;
  color: var(--dp-stone);
  transition: all 0.3s ease;
  pointer-events: none;
}

.modern-input:focus ~ .floating-label,
.modern-input:not(:placeholder-shown) ~ .floating-label,
.modern-textarea:focus ~ .floating-label,
.modern-textarea:not(:placeholder-shown) ~ .floating-label {
  top: 0;
  font-size: 0.75rem;
  color: var(--dp-charcoal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.required-star {
  color: var(--dp-error);
}

.submit-btn {
  background: var(--dp-charcoal);
  color: var(--dp-white);
  border: none;
  padding: 1.25rem 2rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover {
  background: var(--dp-gold);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Success State */
.success-state {
  padding: 4rem 0;
}

.success-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  color: var(--dp-charcoal);
  margin: 0 0 1rem 0;
}

.success-text {
  font-size: 1rem;
  color: var(--dp-ash);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.reset-btn {
  background: transparent;
  border: 1px solid var(--dp-charcoal);
  color: var(--dp-charcoal);
  padding: 1rem 2rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: var(--dp-charcoal);
  color: var(--dp-white);
}
</style>
