<script setup lang="ts">
import { ArrowLeft, Building2, Info, Copy } from 'lucide-vue-next'
import { useCheckoutLogic } from '~/composables/useCheckoutLogic'

const { 
  form, 
  step, 
  goBack, 
  placeOrder, 
  isSubmitting, 
  checkoutError, 
  bankAccounts, 
  copyToClipboard 
} = useCheckoutLogic()
</script>

<template>
  <div v-show="step === 2" class="form-card">
    <button class="btn-back" @click="goBack">
      <ArrowLeft :size="14" />
      Retour aux informations
    </button>

    <h2 class="form-heading">Mode de paiement</h2>

    <div class="pay-options">
      <label class="pay-option" :class="{ selected: form.paymentMethod === 'cod' }">
        <input v-model="form.paymentMethod" type="radio" value="cod" >
        <span class="radio-dot"/>
        <div class="pay-text">
          <strong>Paiement à la livraison</strong>
          <span>Payez en espèces lors de la réception.</span>
        </div>
      </label>

      <label class="pay-option" :class="{ selected: form.paymentMethod === 'transfer' }">
        <input v-model="form.paymentMethod" type="radio" value="transfer" >
        <span class="radio-dot"/>
        <div class="pay-text" style="width: 100%;">
          <div class="pay-title-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div>
              <strong>Virement bancaire</strong>
              <span style="display: block; font-size: 0.8rem; color: #6b7280; margin-top: 2px;">Payez directement depuis votre compte bancaire.</span>
            </div>
            <Building2 :size="18" style="color: #4b5563;" />
          </div>
          
          <div v-if="form.paymentMethod === 'transfer'" class="transfer-details" style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
            <!-- Dynamic Banks -->
            <div v-for="bank in bankAccounts" :key="bank.id" style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; font-size: 0.85rem; color: #374151;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 600;">Nom de la banque:</span>
                <span>{{ bank.bank_name }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 600;">Nom du compte:</span>
                <span>{{ bank.account_name }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600;">RIB:</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; letter-spacing: 0.5px; color: #4f46e5;">{{ bank.rib }}</span>
                  <button @click.prevent="copyToClipboard(bank.rib)" style="display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 0.75rem; background: none; border: none; cursor: pointer;">
                    <Copy :size="12" /> Copier
                  </button>
                </div>
              </div>
            </div>

            <div style="font-size: 0.8rem; color: #4b5563; text-align: center; margin-top: 8px; line-height: 1.5;">
              Veuillez inclure votre numéro de commande dans la référence du virement.<br>Pour toute assistance, contactez-nous par e-mail à <strong>order@dhenbio.com</strong><br>ou via WhatsApp au <strong>+212 7 02 02 34 13</strong>.<br>Votre commande sera traitée dès confirmation du paiement.
            </div>
            
            <div style="background: #eff6ff; border-radius: 6px; padding: 12px; font-size: 0.8rem; color: #1e3a8a; display: flex; align-items: flex-start; gap: 8px;">
              <Info :size="16" style="flex-shrink: 0; margin-top: 2px;" />
              <span>Vous verrez ces détails bancaires à nouveau après avoir complété votre commande. Veuillez d'abord <strong>confirmer votre commande</strong>, puis effectuer le virement avec les informations fournies.</span>
            </div>
          </div>
        </div>
      </label>
    </div>

    <!-- Address recap -->
    <div class="addr-recap">
      <div class="recap-label">LIVRÉ À</div>
      <div class="recap-body">
        <p>{{ form.firstName }} {{ form.lastName }}</p>
        <p>{{ form.address }}</p>
        <p>{{ form.postalCode ? form.postalCode + ' ' : '' }}{{ form.city }}, Maroc</p>
        <p>{{ form.phone }}</p>
      </div>
      <button class="recap-edit" @click="goBack">Modifier</button>
    </div>

    <div v-if="checkoutError" class="checkout-error-message">
      {{ checkoutError }}
    </div>

    <button class="btn-next btn-place" :disabled="isSubmitting" @click="placeOrder">
      <span v-if="isSubmitting" class="spinner"/>
      {{ isSubmitting ? 'Traitement...' : 'Confirmer la commande' }}
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

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 2rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
  cursor: pointer;
  transition: color 0.2s;
}

.btn-back:hover { color: var(--dp-charcoal); }

.pay-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.pay-option {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.125rem;
  border: 1px solid var(--dp-sand);
  cursor: pointer;
  transition: all 0.2s;
}

.pay-option.selected {
  border-color: var(--dp-charcoal);
}

.pay-option input { display: none; }

.radio-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--dp-sand);
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s;
}

.pay-option.selected .radio-dot {
  border-color: var(--dp-charcoal);
  background: var(--dp-charcoal);
  box-shadow: inset 0 0 0 3px var(--dp-white);
}

.pay-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.pay-text strong {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-charcoal);
}

.pay-text span {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-ash);
}

.addr-recap {
  padding: 1.25rem;
  background: var(--dp-ivory);
  margin-bottom: 2rem;
  position: relative;
}

.recap-label {
  font-family: var(--font-body);
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--dp-ash);
  margin-bottom: 0.625rem;
}

.recap-body p {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-charcoal);
  margin: 0;
  line-height: 1.5;
}

.recap-edit {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-gold);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.checkout-error-message {
  padding: 1rem;
  background-color: #fee2e2;
  color: #ef4444;
  border-radius: 4px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  margin-bottom: 1rem;
  text-align: center;
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

.btn-place {
  background: var(--dp-charcoal);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: var(--dp-white);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
