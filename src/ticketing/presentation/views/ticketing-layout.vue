<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import '../ticketing.css';

const { locale } = useI18n();

const isSpanish = computed(() => locale.value.startsWith('es'));
</script>

<template>
  <section class="tk-layout">

    <div class="tk-breadcrumb">

      <router-link to="/dashboard">Dashboard</router-link>

      <i class="pi pi-angle-right"/>

      <span>
        {{ isSpanish ? 'Integración de ticketing' : 'Ticketing Integration' }}
      </span>

    </div>

    <header class="tk-heading">

      <div class="tk-icon">
        <i class="pi pi-ticket"/>
      </div>

      <div class="tk-grow">

        <h1>
          {{ isSpanish ? 'Integración de ticketing' : 'Ticketing Integration' }}
        </h1>

        <p>
          {{ isSpanish
            ? 'Gestiona proveedores de entradas y consulta la ocupación de funciones.'
            : 'Manage ticketing providers and monitor show occupancy.' }}
        </p>

      </div>

      <span class="tk-code">BC04</span>

    </header>

    <nav class="tk-nav">

      <router-link :to="{ name: 'ticketing-integrations' }">

        <i class="pi pi-ticket"/>

        {{ isSpanish ? 'Integraciones' : 'Integrations' }}

      </router-link>

    </nav>

    <router-view/>

  </section>
</template>
