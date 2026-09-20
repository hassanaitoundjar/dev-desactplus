<template>
  <div class="maintenance-page">
    <div class="maintenance-content">
      <div class="logo-wrapper">
        <h1 class="logo">DESACT PLUS</h1>
        <div class="logo-line"></div>
      </div>
      
      <h2 class="maintenance-title">We are refining our experience.</h2>
      
      <p class="maintenance-description">
        Our digital storefront is currently undergoing scheduled maintenance to elevate your experience. We will be right back.
      </p>
      
      <div class="maintenance-contact">
        For urgent inquiries, please contact<br>
        <a href="mailto:contact@desactplus.com">contact@desactplus.com</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Disable default layout so the header/footer don't show
definePageMeta({
  layout: false,
});
</script>

<style scoped>
.maintenance-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--dp-charcoal);
  color: var(--dp-ivory);
  font-family: var(--font-primary), 'Cormorant Garamond', serif;
  text-align: center;
  padding: 2rem;
}

.maintenance-content {
  max-width: 600px;
  animation: fadeIn 1.5s ease-out;
}

.logo-wrapper {
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-family: var(--font-primary), 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  color: var(--dp-gold);
  margin: 0;
  text-transform: uppercase;
}

.logo-line {
  width: 40px;
  height: 1px;
  background-color: var(--dp-gold);
}

.maintenance-title {
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.maintenance-description {
  font-family: var(--font-secondary), 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--dp-taupe);
  margin-bottom: 3rem;
}

.maintenance-contact {
  font-family: var(--font-secondary), 'Inter', sans-serif;
  font-size: 0.9rem;
  color: var(--dp-stone);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
}

.maintenance-contact a {
  color: var(--dp-gold);
  text-decoration: none;
  transition: color 0.3s ease;
  margin-top: 0.5rem;
  display: inline-block;
}

.maintenance-contact a:hover {
  color: var(--dp-gold-light);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .maintenance-title {
    font-size: 2rem;
  }
}
</style>
