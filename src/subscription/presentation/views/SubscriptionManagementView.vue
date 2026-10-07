<template>
  <div class="subscription-management-view">
    <header class="view-header">
      <h2>BC09 — Subscription & Service Management</h2>
      <p>Gestión centralizada de planes, contratos de usuario, pagos y estados de suscripción (PostgreSQL).</p>
    </header>

    <div v-if="loading" class="loading-state">
      Cargando información de suscripciones...
    </div>

    <div v-else class="content-grid">
      <SubscriptionCard
          v-for="sub in subscriptions"
          :key="sub.id"
          :subscription="sub"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { SubscriptionApiService } from '../../infrastructure/subscription-api.service';
import SubscriptionCard from '../components/SubscriptionCard.vue';

export default {
  name: 'SubscriptionManagementView',
  components: {
    SubscriptionCard
  },
  setup() {
    const subscriptions = ref([]);
    const loading = ref(true);
    const apiService = new SubscriptionApiService();

    onMounted(async () => {
      try {
        subscriptions.value = await apiService.getSubscriptions();
      } catch (error) {
        console.error('Error al inicializar la vista de suscripciones:', error);
      } finally {
        loading.value = false;
      }
    });

    return {
      subscriptions,
      loading
    };
  }
};
</script>

<style scoped>
.subscription-management-view {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}
.view-header {
  margin-bottom: 20px;
}
.view-header h2 {
  color: #333;
  margin-bottom: 6px;
}
.view-header p {
  color: #666;
  font-size: 0.95rem;
}
.loading-state {
  text-align: center;
  padding: 40px;
  color: #888;
}
</style>