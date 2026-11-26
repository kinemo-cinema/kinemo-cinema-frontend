<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import '../seat-allocation.css';

const { locale } = useI18n();

const isSpanish = computed(() => locale.value.startsWith('es'));
</script>

<template>
  <section class="sa-layout">

    <div class="sa-breadcrumb">

      <router-link to="/dashboard">Dashboard</router-link>

      <i class="pi pi-angle-right"/>

      <span>
        {{ isSpanish ? 'Asignación de asientos' : 'Seat Allocation' }}
      </span>

    </div>

    <header class="sa-heading">

      <div class="sa-icon">
        <i class="pi pi-th-large"/>
      </div>

      <div class="sa-grow">

        <h1>
          {{ isSpanish ? 'Asignación de asientos' : 'Seat Allocation' }}
        </h1>

        <p>
          {{ isSpanish
            ? 'Gestiona la disponibilidad y participación de asientos en cada función.'
            : 'Manage seat availability and participation for each show.' }}
        </p>

      </div>

      <span class="sa-code">BC05</span>

    </header>

    <nav class="sa-nav">

      <router-link :to="{ name: 'seat-allocation-list' }">

        <i class="pi pi-th-large"/>

        {{ isSpanish ? 'Asignaciones' : 'Allocations' }}

      </router-link>

    </nav>

    <router-view/>

  </section>
</template>
