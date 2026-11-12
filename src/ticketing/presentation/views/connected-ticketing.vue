<script setup>
import { onMounted, ref } from 'vue';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';
const { busy, error, run } = useBackend();
const integrations = ref([]);
const form = ref({ cinemaId: null, providerName: '' });
const showIds = ref({});
const occupancy = ref(null);
const occupancyShowId = ref(null);
const load = () => run(async http => { integrations.value = (await http.get('/ticketing/integrations')).data; });
const create = () => run(async http => { const { data } = await http.post('/ticketing/integrations', form.value); integrations.value.push(data); form.value = { cinemaId: null, providerName: '' }; });
const sync = item => run(async http => { const { data } = await http.post(`/ticketing/integrations/${item.id}/sync`, { showId: showIds.value[item.id] }); integrations.value = integrations.value.map(row => row.id === data.id ? data : row); });
const lookup = () => run(async http => { occupancy.value = null; occupancy.value = (await http.get(`/ticketing/occupancies/${occupancyShowId.value}`)).data; });
onMounted(load);
</script>
<template>
  <section class="backend-page">
    <header><h1>Integraciones de ticketing</h1><button :disabled="busy" @click="load">Actualizar</button></header>
    <p>Consulta las conexiones y la ocupación guardadas en tu backend.</p>
    <p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p>
    <form @submit.prevent="create"><label>Cine<input v-model.number="form.cinemaId" type="number" min="1" required /></label><label>Proveedor<input v-model="form.providerName" required /></label><button :disabled="busy">Crear integración</button></form>
    <p v-if="!busy && !integrations.length && !error">No hay integraciones registradas.</p>
    <article v-for="item in integrations" :key="item.id"><BackendRecords :value="item" /><form @submit.prevent="sync(item)"><label>Función<input v-model.number="showIds[item.id]" type="number" min="1" required /></label><button disabled title="Falta configurar un proveedor real de ticketing">Sincronizar ocupación</button></form></article>
    <p>La sincronización externa está deshabilitada hasta configurar un proveedor real de ticketing. La ocupación ya guardada sí se puede consultar.</p>
    <h2>Consultar ocupación por función</h2><form @submit.prevent="lookup"><label>Función<input v-model.number="occupancyShowId" type="number" min="1" required /></label><button :disabled="busy">Consultar</button></form><BackendRecords v-if="occupancy" :value="occupancy" />
  </section>
</template>
