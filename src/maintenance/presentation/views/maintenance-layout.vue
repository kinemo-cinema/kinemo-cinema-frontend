<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import '../maintenance.css';

const { locale } = useI18n();
const route = useRoute();

const isSpanish = computed(() =>
    locale.value.startsWith('es')
);

const isActive = computed(() =>
    String(route.name ?? '').startsWith('maintenance-')
);
</script>

<template>
  <section class="mt-layout">
    <div class="mt-breadcrumb">
      <router-link to="/dashboard">
        Dashboard
      </router-link>

      <i class="pi pi-chevron-right"/>

      <span>
                {{ isSpanish ? 'Mantenimiento' : 'Maintenance' }}
            </span>
    </div>

    <header class="mt-heading">
      <div class="mt-heading-content">
        <div class="mt-module-icon">
          <i class="pi pi-wrench"/>
        </div>

        <div>
          <h1>
            {{ isSpanish ? 'Mantenimiento' : 'Maintenance' }}
          </h1>

          <p>
            {{
              isSpanish
                  ? 'Gestiona los equipos, diagnósticos y órdenes de mantenimiento.'
                  : 'Manage equipment, diagnostics and maintenance orders.'
            }}
          </p>
        </div>
      </div>

      <span class="mt-badge">BC07</span>
    </header>

    <nav class="mt-nav">
      <router-link
          :to="{ name: 'maintenance-dashboard' }"
          class="mt-nav-link"
          :class="{ 'mt-nav-link-active': isActive }"
      >
        <i class="pi pi-cog"/>

        {{ isSpanish ? 'Gestión de equipos' : 'Equipment Management' }}
      </router-link>
    </nav>

    <router-view/>
  </section>
</template>