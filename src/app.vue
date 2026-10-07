<script setup lang="js">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Layout from './shared/presentation/components/layout.vue'

const route = useRoute()

const useLayout = computed(() => {
  return route.meta.layout !== false
})
</script>

<template>
  <!-- Páginas normales de Kinemo -->
  <Layout v-if="useLayout">
    <router-view />
  </Layout>

  <!-- Login u otras páginas sin navbar -->
  <router-view v-else />
</template>