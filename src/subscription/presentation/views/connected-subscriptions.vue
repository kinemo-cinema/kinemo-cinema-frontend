<script setup>
import { onMounted, ref } from 'vue';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';
const { busy, error, run } = useBackend();
const items = ref([]);
const plans = ref([]);
const payments = ref({});
const tokens = ref({});
const newPlans = ref({});
const load = () => run(async http => { const responses = await Promise.all([http.get('/subscriptions'), http.get('/subscription-plans')]); [items.value, plans.value] = responses.map(response => response.data); });
const change = (item, action, payload) => run(async http => { const { data } = await http.post(`/subscriptions/${item.id}/${action}`, payload); items.value = items.value.map(row => row.id === data.id ? data : row); tokens.value[item.id] = ''; });
onMounted(load);
</script>
<template>
  <section class="backend-page">
    <header><h1>Suscripciones</h1><router-link to="/subscriptions">Contratar plan</router-link><button :disabled="busy" @click="load">Actualizar</button></header>
    <p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p><p v-if="!busy && !items.length && !error">No hay suscripciones registradas.</p>
    <article v-for="item in items" :key="item.id"><h2>{{ plans.find(plan => plan.id === item.planId)?.name || `Plan ${item.planId}` }}</h2><BackendRecords :value="item" />
      <p>Los pagos no están disponibles: falta configurar una pasarela real. No se realizarán cargos ni se registrarán pagos simulados.</p>
      <form @submit.prevent="change(item, 'upgrades', { newPlanId: newPlans[item.id] })"><label>Nuevo plan<select v-model="newPlans[item.id]" required><option v-for="plan in plans.filter(plan => plan.id !== item.planId)" :key="plan.id" :value="plan.id">{{ plan.name }}</option></select></label><button :disabled="busy || !newPlans[item.id]">Cambiar plan</button></form>
    </article>
  </section>
</template>
