<script setup lang="ts">
import { ArrowLeft, ChevronDown } from 'lucide-vue-next'
import { useCheckoutLogic } from '~/composables/useCheckoutLogic'

const { form, formErrors, step, goToPayment } = useCheckoutLogic()

const cities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
  'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Autre'
]
</script>

<template>
  <div v-show="step === 1" class="form-card">
    <h2 class="form-heading">Adresse de livraison</h2>

    <div class="field-row">
      <div class="field" :class="{ error: formErrors.firstName }">
        <label for="fn">Prénom *</label>
        <input id="fn" v-model="form.firstName" type="text" placeholder="Votre prénom" >
        <span v-if="formErrors.firstName" class="field-error">{{ formErrors.firstName }}</span>
      </div>
      <div class="field" :class="{ error: formErrors.lastName }">
        <label for="ln">Nom *</label>
        <input id="ln" v-model="form.lastName" type="text" placeholder="Votre nom" >
        <span v-if="formErrors.lastName" class="field-error">{{ formErrors.lastName }}</span>
      </div>
    </div>

    <div class="field-row">
      <div class="field" :class="{ error: formErrors.email }">
        <label for="em">E-mail *</label>
        <input id="em" v-model="form.email" type="email" placeholder="votre@email.com" >
        <span v-if="formErrors.email" class="field-error">{{ formErrors.email }}</span>
      </div>
      <div class="field" :class="{ error: formErrors.phone }">
        <label for="ph">Téléphone *</label>
        <input id="ph" v-model="form.phone" type="tel" placeholder="+212 6XX XXX XXX" >
        <span v-if="formErrors.phone" class="field-error">{{ formErrors.phone }}</span>
      </div>
    </div>

    <div class="field" :class="{ error: formErrors.address }">
      <label for="addr">Adresse complète *</label>
      <input id="addr" v-model="form.address" type="text" placeholder="Numéro, rue, quartier" >
      <span v-if="formErrors.address" class="field-error">{{ formErrors.address }}</span>
    </div>

    <div class="field-row">
      <div class="field" :class="{ error: formErrors.city }">
        <label for="city">Ville *</label>
        <div class="select-wrap">
          <select id="city" v-model="form.city">
            <option value="" disabled>Sélectionner</option>
            <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
          </select>
          <ChevronDown :size="14" class="select-chevron" />
        </div>
        <span v-if="formErrors.city" class="field-error">{{ formErrors.city }}</span>
      </div>
      <div class="field">
        <label for="zip">Code postal</label>
        <input id="zip" v-model="form.postalCode" type="text" placeholder="20000" >
      </div>
    </div>

    <div class="field">
      <label for="notes">Notes de livraison <span class="optional">(optionnel)</span></label>
      <textarea id="notes" v-model="form.notes" rows="3" placeholder="Instructions spéciales..."/>
    </div>

    <button class="btn-next" @click="goToPayment">
      Continuer vers le paiement
      <ArrowLeft :size="14" style="transform: rotate(180deg)" />
    </button>
  </div>
</template>

<style scoped>
.form-card {
  background: var(--dp-white);
  border: 1px solid var(--dp-sand);
  padding: 2rem;
}

@media (min-width: 768px) {
  .form-card { padding: 2.5rem; }
}

.form-heading {
  font-family: var(--font-heading);
  font-size: 1.375rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0 0 2rem 0;
  border-radius: 12px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .field-row { grid-template-columns: 1fr 1fr; }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
}

.field-row .field { margin-bottom: 0; }

.field label {
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dp-charcoal);
}

.optional {
  font-weight: 400;
  color: var(--dp-stone);
  text-transform: none;
  letter-spacing: 0;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 0.8125rem 0.875rem;
  border: 1px solid var(--dp-sand);
  background: var(--dp-white);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-charcoal);
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: var(--dp-charcoal);
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--dp-stone);
}

.field textarea { resize: vertical; }

.field.error input,
.field.error select {
  border-color: var(--dp-error);
}

.field-error {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-error);
}

.select-wrap {
  position: relative;
}

.select-wrap select {
  appearance: none;
  cursor: pointer;
  padding-right: 2.5rem;
}

.select-chevron {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--dp-ash);
  pointer-events: none;
}

.btn-next {
  width: 100%;
  padding: 1.125rem;
  background: var(--dp-gold);
  color: var(--dp-white);
  border: none;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-next:hover { opacity: 0.9; }
.btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
