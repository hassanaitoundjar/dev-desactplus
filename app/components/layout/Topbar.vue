<script setup lang="ts">
import { Phone, ChevronDown, User } from 'lucide-vue-next'
</script>

<template>
  <div class="topbar desktop-only">
    <div class="container-site topbar-inner">
      <!-- Left Side (Formerly Right): Links & Currency -->
      <div class="topbar-left">
        <div class="topbar-currency">
          <span class="currency-flag">MA</span>
          <span>MAD</span>
          <ChevronDown :size="12" />
        </div>
        <span class="topbar-divider">|</span>
        <NuxtLink to="/about" class="topbar-link">About</NuxtLink>
        <NuxtLink to="/services" class="topbar-link">Services</NuxtLink>
        <NuxtLink to="/contact" class="topbar-link">Contact Us</NuxtLink>
      </div>

      <!-- Right Side (Formerly Left): Phone & Contact -->
      <div class="topbar-right">
        <a href="tel:0667240244" class="topbar-link">
          <Phone :size="14" :stroke-width="1.5" />
          <span>0667240244 - 0667240243</span>
        </a>
        <span class="topbar-divider">|</span>
        <div class="topbar-expert">
          <div class="expert-avatars">
            <!-- Using user icon as mock avatar, could use images later -->
            <div class="expert-avatar"><User :size="12" stroke-width="1.5" /></div>
            <div class="expert-avatar"><User :size="12" stroke-width="1.5" /></div>
          </div>
          <span>Contact with an expert</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  background-color: rgba(16, 16, 16, 0.05);
  border-bottom: 1px solid var(--dp-neutral-border);
  font-size: 0.75rem;
  color: var(--dp-ash);
  padding: 0.5rem 0;
  font-family: var(--font-body);
}

.topbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--dp-ash);
  text-decoration: none;
  transition: color 0.2s;
}

.topbar-link:hover {
  color: var(--dp-charcoal);
}

.topbar-divider {
  color: var(--dp-sand);
}

.topbar-expert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.expert-avatars {
  display: flex;
}

.expert-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--dp-neutral-border);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--dp-white);
  margin-left: -6px;
}
.expert-avatar:first-child {
  margin-left: 0;
}

.topbar-currency {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.currency-flag {
  background-color: var(--dp-error);
  color: var(--dp-white);
  font-size: 0.5rem;
  padding: 0.1rem 0.2rem;
  border-radius: 2px;
  font-weight: bold;
}

.desktop-only {
  display: none;
}
@media (min-width: 768px) {
  .desktop-only {
    display: block;
  }
}
</style>
