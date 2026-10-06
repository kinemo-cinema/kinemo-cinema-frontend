<script setup lang="js">
import { useI18n } from 'vue-i18n';

/**
 * Application hub view.
 *
 * @remarks
 * Presents the nine bounded contexts of the Kinemo platform
 * as navigable module cards.
 */

const { t } = useI18n();

/**
 * Commercial and management bounded contexts.
 *
 * @type {Array<{bc: string, key: string, icon: string, route: string}>}
 */
const managerModules = [
  {
    bc: 'BC01',
    key: 'catalog',
    icon: 'pi pi-video',
    route: '/catalog'
  },
  {
    bc: 'BC02',
    key: 'scheduling',
    icon: 'pi pi-calendar',
    route: '/scheduling'
  },
  {
    bc: 'BC03',
    key: 'rooms',
    icon: 'pi pi-building',
    route: '/rooms'
  },
  {
    bc: 'BC04',
    key: 'ticketing',
    icon: 'pi pi-ticket',
    route: '/ticketing'
  },
  {
    bc: 'BC08',
    key: 'analytics',
    icon: 'pi pi-chart-bar',
    route: '/analytics'
  },
  {
    bc: 'BC09',
    key: 'subscription',
    icon: 'pi pi-credit-card',
    route: '/subscriptions'
  }
];

/**
 * Operational and technical bounded contexts.
 *
 * @type {Array<{bc: string, key: string, icon: string, route: string}>}
 */
const technicianModules = [
  {
    bc: 'BC05',
    key: 'seat-control',
    icon: 'pi pi-th-large',
    route: '/seat-control'
  },
  {
    bc: 'BC06',
    key: 'execution',
    icon: 'pi pi-play-circle',
    route: '/execution'
  },
  {
    bc: 'BC07',
    key: 'maintenance',
    icon: 'pi pi-wrench',
    route: '/maintenance'
  }
];
</script>

<template>
  <section class="hub">

    <!-- Header -->
    <header class="hub-header">
      <h1>
        {{ t('hub.title') }}
      </h1>

      <p class="hub-subtitle">
        {{ t('hub.subtitle') }}
      </p>
    </header>

    <!-- Management modules -->
    <div class="hub-section">

      <h2 class="hub-section-title">
        <i class="pi pi-briefcase"></i>
        {{ t('hub.sections.manager') }}
      </h2>

      <div class="hub-grid">

        <router-link
            v-for="mod in managerModules"
            :key="mod.bc"
            :to="mod.route"
            class="module-card"
        >
          <pv-card>

            <template #content>

              <div class="module-top">

                <i
                    :class="mod.icon"
                    class="module-icon"
                ></i>

                <span class="bc-label">
                  {{ mod.bc }}
                </span>

              </div>

              <h3 class="module-title">
                {{ t(`hub.modules.${mod.key}.title`) }}
              </h3>

              <p class="module-description">
                {{ t(`hub.modules.${mod.key}.description`) }}
              </p>

            </template>

          </pv-card>
        </router-link>

      </div>

    </div>

    <!-- Technical modules -->
    <div class="hub-section">

      <h2 class="hub-section-title">
        <i class="pi pi-wrench"></i>
        {{ t('hub.sections.technician') }}
      </h2>

      <div class="hub-grid">

        <router-link
            v-for="mod in technicianModules"
            :key="mod.bc"
            :to="mod.route"
            class="module-card"
        >
          <pv-card>

            <template #content>

              <div class="module-top">

                <i
                    :class="mod.icon"
                    class="module-icon"
                ></i>

                <span class="bc-label">
                  {{ mod.bc }}
                </span>

              </div>

              <h3 class="module-title">
                {{ t(`hub.modules.${mod.key}.title`) }}
              </h3>

              <p class="module-description">
                {{ t(`hub.modules.${mod.key}.description`) }}
              </p>

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

  transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
}

.module-card:hover {
  transform: translateY(-2px);
}

/* Icon + BC number */

.module-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.module-icon {
  font-size: 1.75rem;
  color: #8B5CF6;
}

.bc-label {
  padding: 0.3rem 0.55rem;

  color: #A78BFA;
  background: rgba(139, 92, 246, 0.1);

  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 6px;

  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
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