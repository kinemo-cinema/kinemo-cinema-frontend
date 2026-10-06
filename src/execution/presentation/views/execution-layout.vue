<script setup>
import {useI18n} from "vue-i18n";

const {t} = useI18n();
</script>

<template>
  <section class="execution-layout">

    <nav class="execution-nav">

      <router-link
          :to="{name: 'execution-list'}"
          class="execution-link"
          active-class="execution-link--active">

        <i class="pi pi-play-circle"/>

        <span>
          {{ t("executionNav.executions") }}
        </span>

      </router-link>

    </nav>

    <router-view/>

  </section>
</template>

<style scoped>
.execution-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.execution-nav {
  border-bottom: 1px solid rgba(127, 127, 127, 0.2);
  padding-bottom: 0.5rem;
}

.execution-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
}

.execution-link--active {
  background: rgba(139, 92, 246, 0.15);
  color: #8B5CF6;
}
</style>