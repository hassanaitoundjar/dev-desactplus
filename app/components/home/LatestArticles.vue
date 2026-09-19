<script setup lang="ts">
import { getLatestPosts, type BlogPost } from '~/repositories/blog.repository'

const articles = ref<BlogPost[]>([])

onMounted(async () => {
  articles.value = await getLatestPosts(4)
})

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getImage(article: BlogPost): string {
  return article.featured_image || '/images/articles/article-1.jpg'
}
</script>

<template>
  <section class="latest-articles">
    <div class="la-container">
      <!-- Header -->
      <div class="la-header">
        <h2 class="la-title">Derniers articles</h2>
        <NuxtLink to="/blog" class="la-visit-btn">
          Visiter le Blog
          <span class="la-arrow">→</span>
        </NuxtLink>
      </div>

      <!-- Articles Grid -->
      <div class="la-grid">
        <article v-for="article in articles" :key="article.id" class="la-card">
          <!-- Image Container -->
          <div class="la-image-wrapper">
            <img
              :src="getImage(article)"
              :alt="article.title"
              class="la-image"
              loading="lazy"
            />
            <!-- Author Overlay -->
            <div class="la-author-overlay">
              <div class="la-author">
                <div class="la-author-initial">{{ article.author_name?.charAt(0) || 'D' }}</div>
                <span class="la-author-name">{{ article.author_name }}</span>
              </div>
              <div class="la-image-actions">
                <button class="la-action-btn" aria-label="Share">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </button>
                <button class="la-action-btn" aria-label="Bookmark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="la-card-body">
            <div class="la-meta">
              <span class="la-category">{{ article.category }}</span>
              <span class="la-separator">/</span>
              <span class="la-date">{{ formatDate(article.published_at) }}</span>
            </div>
            <h3 class="la-card-title">{{ article.title }}</h3>
            <p class="la-excerpt">{{ article.excerpt }}</p>
            <NuxtLink :to="`/blog/${article.slug}`" class="la-read-more">
              Continuer la lecture
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.latest-articles {
  padding: var(--space-20, 5rem) 0;
}

.la-container {
  max-width: var(--max-width, 1440px);
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.la-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.la-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dp-charcoal);
  margin: 0;
}

.la-visit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border: 1.5px solid var(--dp-charcoal);
  border-radius: 9999px;
  color: var(--dp-charcoal);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.25s ease, color 0.25s ease;
  white-space: nowrap;
}

.la-visit-btn:hover {
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
}

.la-arrow {
  transition: transform 0.25s ease;
}

.la-visit-btn:hover .la-arrow {
  transform: translateX(3px);
}

/* Grid */
.la-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

/* Card */
.la-card {
  background: var(--dp-white);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.la-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

/* Image */
.la-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.la-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.la-card:hover .la-image {
  transform: scale(1.05);
}

/* Author Overlay */
.la-author-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%);
}

.la-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.la-author-initial {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.7);
  background: var(--dp-charcoal, #2d2d2d);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.la-author-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.la-image-actions {
  display: flex;
  gap: 0.375rem;
}

.la-action-btn {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}

.la-action-btn:hover {
  background: rgba(255,255,255,0.4);
}

/* Card Body */
.la-card-body {
  padding: 1.25rem;
}

.la-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
  font-size: 0.75rem;
  color: var(--dp-ash);
}

.la-category {
  color: var(--dp-stone);
  font-weight: 600;
}

.la-separator {
  color: var(--dp-taupe);
}

.la-date {
  color: var(--dp-stone);
}

.la-card-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--dp-charcoal);
  margin: 0 0 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.la-excerpt {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--dp-ash);
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.la-read-more {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #f38d53;
  text-decoration: none;
  transition: color 0.2s ease;
}

.la-read-more:hover {
  color: #e57a41;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .la-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .la-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .la-title {
    font-size: 1.375rem;
  }

  .la-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .la-container {
    padding: 0 1rem;
  }
}
</style>
