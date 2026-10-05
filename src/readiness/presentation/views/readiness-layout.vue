<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();

/**
 * Sub-navigation entries for BC03. Each `name` matches a route defined
 * in readiness-routes.js so router-link resolves through the named
 * route rather than a hardcoded path.
 *
 * @type {Array<{name: string, i18nKey: string, icon: string}>}
 */
const links = [
  { name: 'readiness-rooms', i18nKey: 'readinessNav.rooms', icon: 'pi pi-home' },
];
</script>

<template>
  <section class="readiness-layout">
    <nav class="readiness-nav" aria-label="Readiness sections">
      <router-link
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="readiness-nav-link"
          active-class="readiness-nav-link--active">
        <i :class="link.icon"/>
        <span>{{ t(link.i18nKey) }}</span>
      </router-link>
    </nav>

    <div class="readiness-content">
      <router-view/>
    </div>
  </section>
</template>

<style scoped>
.readiness-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.readiness-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-bottom: 1px solid rgba(127, 127, 127, 0.2);
  padding-bottom: 0.5rem;
}

.readiness-nav-link {
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

.readiness-nav-link:hover {
  opacity: 1;
  background: rgba(139, 92, 246, 0.1);
}

.readiness-nav-link--active {
  opacity: 1;
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.15);
}

.readiness-content {
  min-height: 20rem;
}
</style>