<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Container from '~/components/ui/Container.vue'
import { formatPrice } from '~/utils/formatPrice'
import { CheckCircle, Package, Truck, ArrowRight, Mail, MapPin } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

const route = useRoute()
const orderId = computed(() => (route.query.order as string) || 'DP-XXXXXX')

interface OrderInfo {
  orderId: string
  email: string
  name: string
  city: string
  total: number
  itemCount: number
}

const orderInfo = ref<OrderInfo | null>(null)

onMounted(() => {
  const raw = sessionStorage.getItem('dp-last-order')
  if (raw) {
    orderInfo.value = JSON.parse(raw)
    sessionStorage.removeItem('dp-last-order')
  }
})
</script>

<template>
  <div class="confirm-page">
    <Container>
      <div class="confirm-wrap">

        <!-- Success Animation -->
        <div class="success-ring">
          <CheckCircle :size="52" :stroke-width="1.2" />
        </div>

        <span class="confirm-eyebrow">Commande confirmée</span>
        <h1 class="confirm-title">Merci{{ orderInfo?.name ? `, ${orderInfo.name.split(' ')[0]}` : '' }} !</h1>
        <p class="confirm-sub">
          Votre commande <strong>{{ orderId }}</strong> a bien été enregistrée.
          <template v-if="orderInfo?.email">
            <br >Un e-mail de confirmation a été envoyé à <strong>{{ orderInfo.email }}</strong>.
          </template>
        </p>

        <!-- Order Card -->
        <div class="order-card">
          <div class="order-card-row">
            <div class="order-card-item">
              <span class="oc-label">Numéro</span>
              <span class="oc-value">{{ orderId }}</span>
            </div>
            <div v-if="orderInfo" class="order-card-item">
              <span class="oc-label">Articles</span>
              <span class="oc-value">{{ orderInfo.itemCount }}</span>
            </div>
            <div v-if="orderInfo" class="order-card-item">
              <span class="oc-label">Total</span>
              <span class="oc-value oc-gold">{{ formatPrice(orderInfo.total) }}</span>
            </div>
            <div v-if="orderInfo" class="order-card-item">
              <span class="oc-label">Ville</span>
              <span class="oc-value">{{ orderInfo.city }}</span>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="timeline">
          <h2 class="timeline-heading">Prochaines étapes</h2>

          <div class="timeline-steps">
            <div class="tl-step">
              <div class="tl-icon"><Mail :size="18" :stroke-width="1.5" /></div>
              <div class="tl-content">
                <strong>Confirmation envoyée</strong>
                <span>Consultez votre boîte e-mail pour le récapitulatif de commande.</span>
              </div>
            </div>

            <div class="tl-step">
              <div class="tl-icon"><Package :size="18" :stroke-width="1.5" /></div>
              <div class="tl-content">
                <strong>Préparation en cours</strong>
                <span>Nos artisans préparent vos pièces avec le plus grand soin.</span>
              </div>
            </div>

            <div class="tl-step">
              <div class="tl-icon"><Truck :size="18" :stroke-width="1.5" /></div>
              <div class="tl-content">
                <strong>Livraison sous 5-10 jours</strong>
                <span>Vous recevrez un SMS avec le lien de suivi dès l'expédition.</span>
              </div>
            </div>

            <div class="tl-step">
              <div class="tl-icon"><MapPin :size="18" :stroke-width="1.5" /></div>
              <div class="tl-content">
                <strong>Installation à domicile</strong>
                <span>Notre équipe vous contactera pour planifier la livraison et le montage.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="confirm-actions">
          <NuxtLink to="/products" class="btn-gold">
            Continuer vos achats
            <ArrowRight :size="14" />
          </NuxtLink>
          <NuxtLink to="/" class="btn-ghost">
            Retour à l'accueil
          </NuxtLink>
        </div>

      </div>
    </Container>
  </div>
</template>

<style scoped>
.confirm-page {
  padding: 4rem 0 6rem;
  background: var(--dp-white);
  min-height: 80vh;
}

.confirm-wrap {
  max-width: 620px;
  margin: 0 auto;
  text-align: center;
}

/* ─── Success ─── */
.success-ring {
  color: var(--dp-success);
  margin-bottom: 1.5rem;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.confirm-eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--dp-success);
  margin-bottom: 0.75rem;
}

.confirm-title {
  font-family: var(--font-body);
  font-size: 2.75rem;
  font-weight: 300;
  color: var(--dp-charcoal);
  margin: 0 0 1rem 0;
  line-height: 1.15;
}

.confirm-sub {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--dp-ash);
  line-height: 1.6;
  margin: 0 0 2.5rem 0;
}

.confirm-sub strong {
  color: var(--dp-charcoal);
  font-weight: 600;
}

/* ─── Order Card ─── */
.order-card {
  background: var(--dp-ivory);
  border: 1px solid var(--dp-sand);
  padding: 1.5rem 2rem;
  margin-bottom: 3rem;
}

.order-card-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .order-card-row {
    grid-template-columns: repeat(4, 1fr);
  }
}

.order-card-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
}

.oc-label {
  font-family: var(--font-body);
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dp-ash);
}

.oc-value {
  font-family: var(--font-body);
  font-size: 1.0625rem;
  color: var(--dp-charcoal);
}

.oc-gold { color: var(--dp-gold); }

/* ─── Timeline ─── */
.timeline {
  text-align: left;
  margin-bottom: 3rem;
}

.timeline-heading {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0 0 1.75rem 0;
  text-align: center;
}

.timeline-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.tl-step {
  display: flex;
  gap: 1.25rem;
  padding-bottom: 1.75rem;
  position: relative;
}

.tl-step:last-child { padding-bottom: 0; }

/* Vertical line */
.tl-step::before {
  content: '';
  position: absolute;
  left: 17px;
  top: 2.25rem;
  bottom: 0;
  width: 1px;
  background: var(--dp-sand);
}

.tl-step:last-child::before { display: none; }

.tl-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--dp-ivory);
  border: 1px solid var(--dp-sand);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dp-gold);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.tl-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding-top: 0.375rem;
}

.tl-content strong {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dp-charcoal);
}

.tl-content span {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
  line-height: 1.5;
}

/* ─── Actions ─── */
.confirm-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.btn-gold {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 300px;
  padding: 1.125rem 2rem;
  background: var(--dp-gold);
  color: var(--dp-white);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: opacity 0.2s;
}

.btn-gold:hover { opacity: 0.9; }

.btn-ghost {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
  text-decoration: none;
  transition: color 0.2s;
}

.btn-ghost:hover { color: var(--dp-charcoal); }
</style>
