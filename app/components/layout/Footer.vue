<script setup lang="ts">
import { footerNavigation } from '~/config/navigation'
import { siteConfig } from '~/config/site'
</script>

<template>
  <footer class="footer">
    <div class="container-site">
      <div class="footer-grid">
        
        <!-- Brand -->
        <div class="footer-brand">
          <NuxtLink to="/" class="footer-logo">
            <span class="footer-logo-title">DESACT</span>
            <span class="footer-logo-subtitle">Plus</span>
          </NuxtLink>
          <p class="footer-desc">
            {{ siteConfig.description }}
          </p>
          <div class="footer-socials">
            <a :href="siteConfig.social.instagram" target="_blank" class="footer-social-link">
              IN
            </a>
            <a :href="siteConfig.social.facebook" target="_blank" class="footer-social-link">
              FB
            </a>
            <a :href="siteConfig.social.pinterest" target="_blank" class="footer-social-link">
              PI
            </a>
          </div>
        </div>

        <!-- Links -->
        <div class="footer-links-col">
          <h4 class="footer-links-title">{{ footerNavigation.shop.title }}</h4>
          <ul class="footer-links-list">
            <li v-for="link in footerNavigation.shop.links" :key="link.href">
              <NuxtLink :to="link.href" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-links-col">
          <h4 class="footer-links-title">{{ footerNavigation.company.title }}</h4>
          <ul class="footer-links-list">
            <li v-for="link in footerNavigation.company.links" :key="link.href">
              <NuxtLink :to="link.href" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-links-col">
          <h4 class="footer-links-title">{{ footerNavigation.support.title }}</h4>
          <ul class="footer-links-list">
            <li v-for="link in footerNavigation.support.links" :key="link.href">
              <NuxtLink :to="link.href" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} {{ siteConfig.name }}. Tous droits réservés.</p>
        <div class="footer-bottom-links">
          <NuxtLink to="/mentions-legales" class="footer-link-bottom">Mentions légales</NuxtLink>
          <NuxtLink to="/confidentialite" class="footer-link-bottom">Politique de confidentialité</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
  padding-top: var(--space-20);
  padding-bottom: var(--space-10);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
  margin-bottom: var(--space-16);
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-8);
  }
}

.footer-brand {
  grid-column: span 1;
}

@media (min-width: 1024px) {
  .footer-brand {
    grid-column: span 2 / span 2;
  }
}

.footer-logo {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  color: var(--dp-white);
  margin-bottom: var(--space-6);
  text-decoration: none;
}

.footer-logo-title {
  font-size: 1.875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1;
}

.footer-logo-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--dp-gold);
  margin-top: 0.25rem;
}

.footer-desc {
  color: #a8a29e; /* approx dp-stone */
  font-size: 0.875rem;
  max-width: 24rem;
  line-height: 1.625;
  margin-bottom: var(--space-8);
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.footer-social-link {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid #44403c; /* approx dp-slate */
  color: var(--dp-white);
  transition: colors 0.3s ease;
  text-decoration: none;
}

.footer-social-link:hover {
  border-color: var(--dp-gold);
  color: var(--dp-gold);
}

.footer-links-col {
  display: flex;
  flex-direction: column;
}

.footer-links-title {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--dp-gold);
  margin-bottom: var(--space-6);
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer-link {
  font-size: 0.875rem;
  color: #a8a29e;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--dp-white);
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-8);
  border-top: 1px solid #44403c;
  font-size: 0.75rem;
  color: #a8a29e;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
  }
}

.footer-bottom p {
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-top: var(--space-4);
}

@media (min-width: 768px) {
  .footer-bottom-links {
    margin-top: 0;
  }
}

.footer-link-bottom {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link-bottom:hover {
  color: var(--dp-white);
}
</style>
