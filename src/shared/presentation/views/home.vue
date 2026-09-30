<script setup lang="js">
import { useI18n } from 'vue-i18n';

/**
 * Application hub view.
 *
 * @remarks
 * Presents the bounded contexts of the Kinemo platform as navigable
 * module cards, grouped by the two primary personas: the Cinema Manager
 * (commercial and analytical modules) and the Maintenance Technician
 * (operational and technical modules).
 */
const { t } = useI18n();

/** @type {Array<{key: string, icon: string, route: string}>} */
const managerModules = [
  { key: 'catalog',     icon: 'pi pi-video',         route: '/catalog' },
  { key: 'sensory',     icon: 'pi pi-sliders-h',     route: '/sensory' },
  { key: 'scheduling',  icon: 'pi pi-calendar',      route: '/scheduling' },
  { key: 'analytics',   icon: 'pi pi-chart-bar',     route: '/analytics' },
  { key: 'ticketing',   icon: 'pi pi-ticket',        route: '/ticketing' },
  { key: 'subscription', icon: 'pi pi-credit-card',  route: '/subscription' },
];

/** @type {Array<{key: string, icon: string, route: string}>} */
const technicianModules = [
  { key: 'room-readiness', icon: 'pi pi-home',        route: '/room-readiness' },
  { key: 'seat-control',   icon: 'pi pi-th-large',    route: '/seat-control' },
  { key: 'execution',      icon: 'pi pi-play-circle', route: '/execution' },
  { key: 'emergency',      icon: 'pi pi-exclamation-triangle', route: '/emergency' },
  { key: 'testing',        icon: 'pi pi-wrench',      route: '/testing' },
  { key: 'maintenance',    icon: 'pi pi-cog',         route: '/maintenance' },
];
</script>

<template>
  <section class="hub">
    <header class="hub-header">
      <h1>{{ t('hub.title') }}</h1>
      <p class="hub-subtitle">{{ t('hub.subtitle') }}</p>
    </header>

    <div class="hub-section">
      <h2 class="hub-section-title">
        <i class="pi pi-briefcase"/>
        {{ t('hub.sections.manager') }}
      </h2>
      <div class="hub-grid">
        <router-link
            v-for="mod in managerModules"
            :key="mod.key"
            :to="mod.route"
            class="module-card">
          <pv-card>
            <template #content>
              <i :class="mod.icon" class="module-icon"/>
              <h3 class="module-title">{{ t(`hub.modules.${mod.key}.title`) }}</h3>
              <p class="module-description">{{ t(`hub.modules.${mod.key}.description`) }}</p>
            </template>
          </pv-card>
        </router-link>
      </div>
    </div>

    <div class="hub-section">
      <h2 class="hub-section-title">
        <i class="pi pi-wrench"/>
        {{ t('hub.sections.technician') }}
      </h2>
      <div class="hub-grid">
        <router-link
            v-for="mod in technicianModules"
            :key="mod.key"
            :to="mod.route"
            class="module-card">
          <pv-card>
            <template #content>
              <i :class="mod.icon" class="module-icon"/>
              <h3 class="module-title">{{ t(`hub.modules.${mod.key}.title`) }}</h3>
              <p class="module-description">{{ t(`hub.modules.${mod.key}.description`) }}</p>
            </template>
          </pv-card>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hub {
  padding: 1rem 0;
}

.hub-header h1 {
  font-size: 1.75rem;
  margin: 0;
}

.hub-subtitle {
  margin-top: 0.5rem;
  opacity: 0.75;
}

.hub-section {
  margin-top: 2.5rem;
}

.hub-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin: 0 0 1rem;
  opacity: 0.85;
}

.hub-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.module-card {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.module-card:hover {
  transform: translateY(-2px);
}

.module-icon {
  font-size: 1.75rem;
  color: #8B5CF6;
}

.module-title {
  font-size: 1rem;
  margin: 0.75rem 0 0.35rem;
}

.module-description {
  font-size: 0.85rem;
  line-height: 1.5;
  opacity: 0.7;
  margin: 0;
}

@media screen and (min-width: 700px) {
  .hub-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (min-width: 1100px) {
  .hub-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>