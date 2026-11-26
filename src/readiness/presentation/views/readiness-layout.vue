<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import '../readiness.css';

const { locale } = useI18n();

const isSpanish = computed(() => locale.value.startsWith('es'));
</script>

<template>
  <section class="rd-layout">

    <div class="rd-breadcrumb">
      <router-link to="/dashboard">Dashboard</router-link>
      <i class="pi pi-angle-right"/>
      <span>{{ isSpanish ? 'Preparación de salas' : 'Room Readiness' }}</span>
    </div>

    <header class="rd-heading">

      <div class="rd-icon">
        <i class="pi pi-home"/>
      </div>

      <div class="rd-grow">
        <h1>{{ isSpanish ? 'Preparación de salas' : 'Room Readiness' }}</h1>

        <p>
          {{ isSpanish
            ? 'Gestiona salas, inspecciones y disponibilidad operativa.'
            : 'Manage cinema rooms, inspections and operational availability.' }}
        </p>
      </div>

      <span class="rd-code">BC03</span>

    </header>

    <nav class="rd-nav">

      <router-link
          :to="{ name: 'readiness-rooms' }"
          class="rd-active"
      >
        <i class="pi pi-home"/>
        {{ isSpanish ? 'Salas' : 'Rooms' }}
      </router-link>

    </nav>

    <router-view/>

  </section>
</template>
