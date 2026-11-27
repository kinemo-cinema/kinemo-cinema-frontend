<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import '../execution.css';

const { locale } = useI18n();
const route = useRoute();

const isSpanish = computed(() => locale.value.startsWith('es'));

const isActive = computed(() =>
    String(route.name ?? '').startsWith('execution-')
);
</script>

<template>
  <section class="ex-layout">
    <div class="ex-breadcrumb">
      <router-link to="/dashboard">
        Dashboard
      </router-link>

      <i class="pi pi-chevron-right"/>

      <span>
                {{ isSpanish ? 'Ejecución' : 'Execution' }}
            </span>
    </div>

    <header class="ex-heading">
      <div class="ex-heading-content">
        <div class="ex-module-icon">
          <i class="pi pi-play-circle"/>
        </div>

        <div>
          <h1>
            {{ isSpanish ? 'Ejecución 4D' : '4D Execution' }}
          </h1>

          <p>
            {{
              isSpanish
                  ? 'Supervisa y controla las experiencias sensoriales.'
                  : 'Monitor and control sensory experiences.'
            }}
          </p>
        </div>
      </div>

      <span class="ex-module-badge">BC06</span>
    </header>

    <nav class="ex-nav">
      <router-link
          :to="{ name: 'execution-list' }"
          class="ex-nav-link"
          :class="{ 'ex-nav-link-active': isActive }"
      >
        <i class="pi pi-play-circle"/>

        {{ isSpanish ? 'Ejecuciones' : 'Executions' }}
      </router-link>
    </nav>

    <router-view/>
  </section>
</template>