<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import '../scheduling.css';

const { t, locale } = useI18n();
const route = useRoute();

const isSpanish = computed(() => locale.value.startsWith('es'));

const isActive = computed(() =>
    String(route.name ?? '').startsWith('scheduling-show')
);
</script>

<template>
  <section class="sc-layout">

    <div class="sc-breadcrumb">
      <router-link to="/dashboard">Dashboard</router-link>
      <i class="pi pi-angle-right"/>
      <span>{{ isSpanish ? 'Programación' : 'Scheduling' }}</span>
    </div>

    <header class="sc-heading">
      <div class="sc-icon">
        <i class="pi pi-calendar"/>
      </div>

      <div class="sc-heading-content">
        <h1>{{ isSpanish ? 'Programación' : 'Scheduling' }}</h1>

        <p>
          {{ isSpanish
            ? 'Administra funciones, horarios y disponibilidad de salas.'
            : 'Manage cinema shows, schedules and room availability.' }}
        </p>
      </div>

      <span class="sc-code">BC02</span>
    </header>

    <nav class="sc-nav" aria-label="Scheduling sections">
      <router-link
          :to="{ name: 'scheduling-shows' }"
          :class="{ 'sc-nav-active': isActive }"
      >
        <i class="pi pi-calendar"/>
        {{ t('schedulingNav.shows') }}
      </router-link>
    </nav>

    <router-view/>

  </section>
</template>