<template>
  <div class="subscription-card">
    <div class="card-header">
      <h3>{{ subscription.planName }}</h3>
      <span :class="['badge', subscription.status.toLowerCase()]">{{ subscription.status }}</span>
    </div>
    <div class="card-body">
      <p><strong>Contrato ID:</strong> {{ subscription.contractId }}</p>
      <p><strong>Precio:</strong> ${{ subscription.price }}</p>
      <p><strong>Renovación:</strong> {{ subscription.renewalDate }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubscriptionCard',
  props: {
    subscription: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.subscription-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
}
.badge.active { background-color: #e1f5fe; color: #0288d1; }
.badge.pending { background-color: #fff9c4; color: #fbc02d; }
.badge.canceled { background-color: #ffebee; color: #d32f2f; }
</style>