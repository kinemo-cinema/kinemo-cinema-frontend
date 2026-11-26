<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t, locale } = useI18n();

const isSpanish = computed(() => locale.value.startsWith('es'));

const links = [
  {
    name: 'catalog-movies',
    prefix: 'catalog-movie',
    i18nKey: 'catalogNav.movies',
    icon: 'pi pi-video'
  },
  {
    name: 'catalog-genres',
    prefix: 'catalog-genre',
    i18nKey: 'catalogNav.genres',
    icon: 'pi pi-tags'
  },
  {
    name: 'catalog-sensory-files',
    prefix: 'catalog-sensory-file',
    i18nKey: 'catalogNav.sensoryFiles',
    icon: 'pi pi-file'
  },
  {
    name: 'catalog-sensory-tracks',
    prefix: 'catalog-sensory-track',
    i18nKey: 'catalogNav.sensoryTracks',
    icon: 'pi pi-sliders-h'
  },
  {
    name: 'catalog-configuration-history',
    prefix: 'catalog-configuration-history',
    i18nKey: 'catalogNav.configurationHistory',
    icon: 'pi pi-history'
  }
];

const isActive = (link) =>
    String(route.name || '').startsWith(link.prefix);
</script>

<template>
  <section class="catalog-layout">

    <div class="catalog-breadcrumb">
      <router-link to="/dashboard" class="breadcrumb-link">
        <i class="pi pi-home"/>
        <span>Dashboard</span>
      </router-link>

      <i class="pi pi-angle-right breadcrumb-separator"/>

      <span class="breadcrumb-current">
        {{ isSpanish ? 'Catálogo y contenido sensorial' : 'Catalog & Sensory' }}
      </span>
    </div>

    <header class="catalog-header">
      <div class="catalog-heading">
        <div class="catalog-icon">
          <i class="pi pi-video"/>
        </div>

        <div>
          <h1>
            {{ isSpanish ? 'Catálogo y contenido sensorial' : 'Catalog & Sensory' }}
          </h1>

          <p>
            {{ isSpanish
              ? 'Gestiona películas, géneros y configuraciones sensoriales.'
              : 'Manage movies, genres and sensory configurations.' }}
          </p>
        </div>
      </div>

      <span class="catalog-module">
        BC01
      </span>
    </header>

    <nav
        class="catalog-nav"
        :aria-label="isSpanish ? 'Secciones del catálogo' : 'Catalog sections'"
    >
      <router-link
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="catalog-nav-link"
          :class="{ 'catalog-nav-link--active': isActive(link) }"
      >
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
  gap: 1.25rem;
  width: 100%;
  min-width: 0;
}

.catalog-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  font-size: 0.75rem;
  color: #9299ad;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #9299ad;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #b49afa;
}

.breadcrumb-link i {
  font-size: 0.75rem;
}

.breadcrumb-separator {
  font-size: 0.65rem;
  color: #555c70;
}

.breadcrumb-current {
  color: #c5c9d5;
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.catalog-heading {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.catalog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.22);
  color: #a78bfa;
}

.catalog-icon i {
  font-size: 1.25rem;
}

.catalog-heading h1 {
  margin: 0;
  color: #f1f1f5;
  font-size: 1.625rem;
  font-weight: 650;
  letter-spacing: -0.6px;
  line-height: 1.3;
}

.catalog-heading p {
  margin: 0.3rem 0 0;
  color: #9299ad;
  font-size: 0.82rem;
  line-height: 1.5;
}

.catalog-module {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  border: 1px solid rgba(139, 92, 246, 0.22);
  background: rgba(139, 92, 246, 0.08);
  color: #b49afa;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.catalog-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem;
  border: 1px solid #292b3a;
  border-radius: 10px;
  background: #161720;
  overflow-x: auto;
  scrollbar-width: thin;
}

.catalog-nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0.7rem 1rem;
  border: 1px solid transparent;
  border-radius: 7px;
  text-decoration: none;
  color: #9299ad;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.catalog-nav-link i {
  font-size: 0.85rem;
}

.catalog-nav-link:hover {
  color: #d7c8ff;
  background: rgba(139, 92, 246, 0.06);
}

.catalog-nav-link--active {
  color: #b49afa;
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.2);
}

.catalog-content {
  width: 100%;
  min-width: 0;
  min-height: 20rem;
}

@media (max-width: 768px) {
  .catalog-layout {
    gap: 1rem;
  }

  .catalog-heading h1 {
    font-size: 1.25rem;
  }

  .catalog-heading p {
    font-size: 0.75rem;
  }

  .catalog-icon {
    width: 40px;
    height: 40px;
  }

  .catalog-nav-link {
    padding: 0.65rem 0.8rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .catalog-module {
    display: none;
  }

  .catalog-heading {
    align-items: flex-start;
  }
}
</style>
