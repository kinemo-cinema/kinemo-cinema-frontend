<script setup lang="js">
import { useI18n } from 'vue-i18n';

/**
 * Presentation component for the Kinemo application footer.
 *
 * @remarks
 * Displays brand mark, institutional navigation, copyright, and
 * attribution to the technologies that power the platform.
 */
const { t } = useI18n();
</script>

<template>
  <footer class="kinemo-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <span class="brand-name">Kinemo</span>
        <p class="brand-tagline">{{ t('footer.tagline') }}</p>
      </div>

      <nav class="footer-links" aria-label="Footer navigation">
        <router-link to="/about">{{ t('footer.about') }}</router-link>
        <router-link to="/pricing">{{ t('footer.pricing') }}</router-link>
        <a href="mailto:contact@kinemo.io">{{ t('footer.contact') }}</a>
        <a href="/privacy">{{ t('footer.privacy') }}</a>
        <a href="/terms">{{ t('footer.terms') }}</a>
      </nav>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2026 Kinemo &mdash; {{ t('footer.rights') }}</p>
      <p>
        {{ t('footer.built-with') }}
        <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">Vue</a>
        {{ t('footer.and') }}
        <a href="https://primevue.org" target="_blank" rel="noopener noreferrer">PrimeVue</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.kinemo-footer {
  background: var(--p-surface-900, #0b0b12);
  color: var(--p-surface-0, #f5f5f7);
  padding: 2.5rem 1.5rem 1.5rem;
  margin-top: 4rem;
}

.footer-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #8B5CF6;
}

.brand-tagline {
  margin: 0.25rem 0 0;
  font-style: italic;
  opacity: 0.75;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.footer-links a {
  color: inherit;
  text-decoration: none;
  opacity: 0.85;
  font-size: 0.9rem;
  transition: opacity 0.2s ease;
}

.footer-links a:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  opacity: 0.7;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
}

.footer-bottom a {
  color: inherit;
  font-weight: 600;
}

@media screen and (min-width: 768px) {
  .footer-main {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}
</style>