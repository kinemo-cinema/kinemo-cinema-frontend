<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();

/**
 * Sub-navigation entries for BC02. Each `name` matches a route defined
 * in scheduling-routes.js so router-link resolves through the named
 * route rather than a hardcoded path.
 *
 * @type {Array<{name: string, i18nKey: string, icon: string}>}
 */
const links = [
  { name: 'scheduling-shows', i18nKey: 'schedulingNav.shows', icon: 'pi pi-calendar' },
];
</script>

<template>
  <section class="scheduling-layout">
    <nav class="scheduling-nav" aria-label="Scheduling sections">
      <router-link
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="scheduling-nav-link"
          active-class="scheduling-nav-link--active">
        <i :class="link.icon"/>
        <span>{{ t(link.i18nKey) }}</span>
      </router-link>
    </nav>

    <div class="scheduling-content">
      <router-view/>
    </div>
  </section>
</template>

<style scoped>
.scheduling-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.scheduling-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-bottom: 1px solid rgba(127, 127, 127, 0.2);
  padding-bottom: 0.5rem;
}

.scheduling-nav-link {
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

.scheduling-nav-link:hover {
  opacity: 1;
  background: rgba(139, 92, 246, 0.1);
}

.scheduling-nav-link--active {
  opacity: 1;
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.15);
}

.scheduling-content {
  min-height: 20rem;
}
</style>