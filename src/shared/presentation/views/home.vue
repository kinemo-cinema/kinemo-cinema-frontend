<script setup lang="js">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/**
 * Management and commercial bounded contexts.
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
    route: '/room-readiness'
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
    route: '/subscriptions/manage'
  }
];

/**
 * Operational and technical bounded contexts.
 */
const technicianModules = [
  {
    bc: 'BC05',
    key: 'seat-control',
    icon: 'pi pi-th-large',
    route: '/seat-allocation'
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
  },
  {
    bc: 'BC08',
    key: 'analytics',
    icon: 'pi pi-chart-bar',
    route: '/analytics'
  }
];
</script>

<template>
  <section class="dashboard">

    <!-- HERO -->
    <header class="dashboard-hero">

      <div class="hero-content">

        <span class="page-eyebrow">
          KINEMO 4D CINEMA PLATFORM
        </span>

        <h1>
          {{ t('hub.title') }}
        </h1>

        <p>
          {{ t('hub.subtitle') }}
        </p>

      </div>

      <div class="hero-decoration" aria-hidden="true">

        <div class="hero-icon">
          <i class="pi pi-sparkles"></i>
        </div>

      </div>

    </header>


    <!-- MANAGEMENT -->
    <section class="module-section">

      <header class="section-heading">

        <div>

          <span class="section-kicker">
            MANAGEMENT
          </span>

          <h2>
            <i class="pi pi-briefcase"></i>
            {{ t('hub.sections.manager') }}
          </h2>

        </div>

        <span class="section-count">
          {{ managerModules.length }}
        </span>

      </header>


      <div class="module-grid">

        <template
            v-for="mod in managerModules"
            :key="mod.bc"
        >

          <!-- ACTIVE MODULE -->
          <router-link
              v-if="!mod.disabled"
              :to="mod.route"
              class="module-card"
          >

            <div class="module-card-top">

              <div class="module-icon-wrapper">
                <i :class="mod.icon"></i>
              </div>

              <span class="bc-label">
                {{ mod.bc }}
              </span>

            </div>


            <div class="module-card-body">

              <h3>
                {{ t(`hub.modules.${mod.key}.title`) }}
              </h3>

              <p>
                {{ t(`hub.modules.${mod.key}.description`) }}
              </p>

            </div>


            <div class="module-card-footer">

              <span>
                Open module
              </span>

              <i class="pi pi-arrow-right"></i>

            </div>

          </router-link>


          <!-- DISABLED / UPCOMING MODULE -->
          <article
              v-else
              class="module-card module-card--disabled"
              aria-disabled="true"
          >

            <div class="module-card-top">

              <div class="module-icon-wrapper">
                <i :class="mod.icon"></i>
              </div>

              <div class="module-labels">

                <span class="coming-soon">
                  Coming soon
                </span>

                <span class="bc-label">
                  {{ mod.bc }}
                </span>

              </div>

            </div>


            <div class="module-card-body">

              <h3>
                {{ t(`hub.modules.${mod.key}.title`) }}
              </h3>

              <p>
                {{ t(`hub.modules.${mod.key}.description`) }}
              </p>

            </div>


            <div class="module-card-footer module-card-footer--disabled">

              <span>
                Module in development
              </span>

              <i class="pi pi-lock"></i>

            </div>

          </article>

        </template>

      </div>

    </section>


    <!-- OPERATIONS -->
    <section class="module-section">

      <header class="section-heading">

        <div>

          <span class="section-kicker">
            OPERATIONS
          </span>

          <h2>
            <i class="pi pi-cog"></i>
            {{ t('hub.sections.technician') }}
          </h2>

        </div>

        <span class="section-count">
          {{ technicianModules.length }}
        </span>

      </header>


      <div class="module-grid">

        <router-link
            v-for="mod in technicianModules"
            :key="mod.bc"
            :to="mod.route"
            class="module-card"
        >

          <div class="module-card-top">

            <div class="module-icon-wrapper">
              <i :class="mod.icon"></i>
            </div>

            <span class="bc-label">
              {{ mod.bc }}
            </span>

          </div>


          <div class="module-card-body">

            <h3>
              {{ t(`hub.modules.${mod.key}.title`) }}
            </h3>

            <p>
              {{ t(`hub.modules.${mod.key}.description`) }}
            </p>

          </div>


          <div class="module-card-footer">

            <span>
              Open module
            </span>

            <i class="pi pi-arrow-right"></i>

          </div>

        </router-link>

      </div>

    </section>

  </section>
</template>


<style scoped>
.dashboard {
  width: 100%;
}


/* =========================================================
   HERO
========================================================= */

.dashboard-hero {
  position: relative;

  min-height: 220px;

  margin-bottom: 3rem;
  padding: 2.5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 2rem;

  overflow: hidden;

  background:
      radial-gradient(
          circle at 85% 30%,
          rgba(139, 92, 246, 0.18),
          transparent 35%
      ),
      linear-gradient(
          135deg,
          rgba(22, 23, 30, 1),
          rgba(20, 21, 29, 1)
      );

  border: 1px solid var(--border);
  border-radius: var(--radius-lg);

  box-shadow: var(--shadow-card);
}


.dashboard-hero::before {
  content: '';

  position: absolute;

  width: 260px;
  height: 260px;

  top: -170px;
  left: -100px;

  background: rgba(52, 214, 176, 0.06);

  border-radius: 50%;
}


.hero-content {
  position: relative;
  z-index: 1;

  max-width: 700px;
}


.hero-content h1 {
  margin: 0.4rem 0 0.75rem;

  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
}


.hero-content p {
  max-width: 620px;

  margin: 0;

  color: var(--text-muted);

  font-size: 1rem;
  line-height: 1.7;
}


.hero-decoration {
  position: relative;
  z-index: 1;

  flex-shrink: 0;
}


.hero-icon {
  width: 90px;
  height: 90px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--primary-light);

  background: rgba(139, 92, 246, 0.1);

  border: 1px solid rgba(139, 92, 246, 0.22);
  border-radius: 24px;

  font-size: 2rem;

  box-shadow:
      0 0 50px rgba(139, 92, 246, 0.12);
}


/* =========================================================
   SECTIONS
========================================================= */

.module-section {
  margin-bottom: 3rem;
}


.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 1rem;

  margin-bottom: 1.25rem;
}


.section-heading h2 {
  display: flex;
  align-items: center;

  gap: 0.6rem;

  margin: 0;

  font-size: 1.25rem;
}


.section-heading h2 i {
  color: var(--primary-light);

  font-size: 1rem;
}


.section-count {
  min-width: 32px;
  height: 32px;

  padding: 0 0.7rem;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-muted);

  background: var(--bg-card);

  border: 1px solid var(--border);
  border-radius: var(--radius-pill);

  font-size: 0.75rem;
  font-weight: 700;
}


/* =========================================================
   MODULE GRID
========================================================= */

.module-grid {
  display: grid;

  grid-template-columns:
      repeat(3, minmax(0, 1fr));

  gap: 1rem;
}


/* =========================================================
   MODULE CARDS
========================================================= */

.module-card {
  position: relative;

  min-height: 230px;

  padding: 1.4rem;

  display: flex;
  flex-direction: column;

  color: inherit;

  background:
      linear-gradient(
          145deg,
          var(--bg-card),
          rgba(22, 23, 30, 0.88)
      );

  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  text-decoration: none;

  box-shadow:
      0 8px 26px rgba(0, 0, 0, 0.14);

  transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;
}


.module-card:not(.module-card--disabled):hover {
  transform: translateY(-4px);

  background:
      linear-gradient(
          145deg,
          rgba(139, 92, 246, 0.07),
          var(--bg-card)
      );

  border-color:
      rgba(139, 92, 246, 0.55);

  box-shadow:
      0 16px 38px rgba(0, 0, 0, 0.24);
}


.module-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 1rem;
}


.module-icon-wrapper {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--primary-light);

  background: rgba(139, 92, 246, 0.1);

  border: 1px solid rgba(139, 92, 246, 0.18);
  border-radius: 12px;

  font-size: 1.2rem;
}


.bc-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 27px;

  padding: 0.25rem 0.55rem;

  color: var(--primary-light);

  background: rgba(139, 92, 246, 0.08);

  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-sm);

  font-size: 0.68rem;
  font-weight: 800;

  letter-spacing: 0.05em;
}


/* =========================================================
   CARD CONTENT
========================================================= */

.module-card-body {
  flex: 1;

  padding-top: 1.25rem;
}


.module-card-body h3 {
  margin: 0 0 0.55rem;

  font-size: 1.05rem;
}


.module-card-body p {
  margin: 0;

  color: var(--text-muted);

  font-size: 0.86rem;
  line-height: 1.6;
}


/* =========================================================
   CARD FOOTER
========================================================= */

.module-card-footer {
  margin-top: 1.35rem;
  padding-top: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: var(--primary-light);

  border-top: 1px solid var(--border-soft);

  font-size: 0.78rem;
  font-weight: 700;
}


.module-card-footer i {
  font-size: 0.75rem;

  transition: transform 0.2s ease;
}


.module-card:hover
.module-card-footer i {
  transform: translateX(4px);
}


/* =========================================================
   DISABLED MODULE
========================================================= */

.module-card--disabled {
  cursor: not-allowed;

  opacity: 0.58;
}


.module-card--disabled .module-icon-wrapper {
  color: var(--text-muted);

  background: rgba(255, 255, 255, 0.04);

  border-color: var(--border);
}


.module-labels {
  display: flex;
  align-items: center;

  gap: 0.5rem;
}


.coming-soon {
  padding: 0.25rem 0.55rem;

  color: var(--secondary);

  background: rgba(52, 214, 176, 0.08);

  border: 1px solid rgba(52, 214, 176, 0.18);
  border-radius: var(--radius-sm);

  font-size: 0.65rem;
  font-weight: 800;

  text-transform: uppercase;
  letter-spacing: 0.04em;
}


.module-card-footer--disabled {
  color: var(--text-muted);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media screen and (max-width: 1050px) {

  .module-grid {
    grid-template-columns:
        repeat(2, minmax(0, 1fr));
  }

}


@media screen and (max-width: 700px) {

  .dashboard-hero {
    min-height: auto;

    padding: 1.75rem;

    align-items: flex-start;
  }


  .hero-decoration {
    display: none;
  }


  .module-grid {
    grid-template-columns: 1fr;
  }


  .section-heading {
    align-items: center;
  }

}


@media screen and (max-width: 480px) {

  .dashboard-hero {
    padding: 1.4rem;
  }


  .hero-content h1 {
    font-size: 1.8rem;
  }


  .module-card {
    min-height: 210px;

    padding: 1.2rem;
  }


  .module-labels {
    align-items: flex-end;
    flex-direction: column;
  }

}
</style>