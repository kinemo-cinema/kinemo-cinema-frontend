<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();

/**
 * Sub-navigation entries for BC01. Each `name` matches a route defined in
 * catalog-routes.js so router-link resolves through the named route rather
 * than a hardcoded path.
 *
 * @type {Array<{name: string, i18nKey: string, icon: string}>}
 */
const links = [
  { name: 'catalog-movies',                i18nKey: 'catalogNav.movies',                icon: 'pi pi-video' },
  { name: 'catalog-genres',                i18nKey: 'catalogNav.genres',                icon: 'pi pi-tags' },
  { name: 'catalog-sensory-files',         i18nKey: 'catalogNav.sensoryFiles',          icon: 'pi pi-file' },
  { name: 'catalog-sensory-tracks',        i18nKey: 'catalogNav.sensoryTracks',         icon: 'pi pi-sliders-h' },
  { name: 'catalog-configuration-history', i18nKey: 'catalogNav.configurationHistory',  icon: 'pi pi-history' },
];
</script>

<template>
  <section class="catalog-layout">
    <nav class="catalog-nav" aria-label="Catalog sections">
      <router-link
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="catalog-nav-link"
          active-class="catalog-nav-link--active">
        <i :class="link.icon"/>
        <span>{{ t(link.i18nKey) }}</span>
      </router-link>
    </nav>

    <div class="catalog-content">
      <router-view/>
    </div>
  </section>
</template>

<style scoped>
.catalog-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.catalog-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-bottom: 1px solid rgba(127, 127, 127, 0.2);
  padding-bottom: 0.5rem;
}

.catalog-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  font-size: 0.9rem;
  opacity: 0.75;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.catalog-nav-link:hover {
  opacity: 1;
  background: rgba(139, 92, 246, 0.1);
}

.catalog-nav-link--active {
  opacity: 1;
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.15);
}

.catalog-content {
  min-height: 20rem;
}
</style>