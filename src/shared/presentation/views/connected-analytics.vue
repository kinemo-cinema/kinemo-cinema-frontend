<script setup>
import { onMounted, ref } from 'vue';
import { useBackend } from '../../application/use-backend.js';
import BackendRecords from '../components/backend-records.vue';
const { busy, error, run } = useBackend();
const dashboard = ref(null);
const report = ref(null);
const period = ref({ start: '', end: '' });
const reportType = ref('Operational');
const format = ref('PDF');
const dashboardId = ref(null);
const reportId = ref(null);
const latest = () => run(async http => { try { dashboard.value = (await http.get('/analytics/dashboards/latest')).data; } catch (failure) { if (failure.response?.status === 404) dashboard.value = null; else throw failure; } });
const generate = type => {
  if (!period.value.start || !period.value.end || new Date(period.value.end) <= new Date(period.value.start)) { error.value = 'Selecciona un período válido.'; return; }
  return run(async http => {
    const payload = { periodStart: new Date(period.value.start).toISOString(), periodEnd: new Date(period.value.end).toISOString() };
    if (type === 'reports') Object.assign(payload, { reportType: reportType.value, format: format.value });
    const { data } = await http.post(`/analytics/${type}`, payload);
    if (type === 'reports') report.value = data; else dashboard.value = data;
  });
};
const lookup = type => run(async http => { if (type === 'reports') report.value = (await http.get(`/analytics/reports/${reportId.value}`)).data; else dashboard.value = (await http.get(`/analytics/dashboards/${dashboardId.value}`)).data; });
onMounted(latest);
</script>
<template>
  <section class="backend-page">
    <p>Utilización y horas planificadas según las funciones guardadas del período. Los incidentes corresponden a paradas de emergencia registradas; no incluyen mantenimiento.</p>
    <header><h1>Analytics</h1><button :disabled="busy" @click="latest">Último dashboard</button></header>
    <p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p>
    <form @submit.prevent="generate('dashboards')"><label>Inicio<input v-model="period.start" type="datetime-local" required /></label><label>Fin<input v-model="period.end" type="datetime-local" required /></label><button :disabled="busy">Generar dashboard</button></form>
    <p v-if="!dashboard && !busy && !error">No hay un dashboard generado.</p><BackendRecords v-if="dashboard" :value="dashboard" />
    <form @submit.prevent="lookup('dashboards')"><label>ID de dashboard<input v-model.number="dashboardId" type="number" min="1" required /></label><button :disabled="busy">Consultar dashboard</button></form>
    <h2>Reportes</h2><form @submit.prevent="generate('reports')"><label>Tipo<select v-model="reportType"><option>Operational</option><option>Maintenance</option><option>RoomPerformance</option></select></label><label>Formato<select v-model="format"><option>PDF</option><option>CSV</option></select></label><button :disabled="busy">Generar reporte del período</button></form>
    <form @submit.prevent="lookup('reports')"><label>ID de reporte<input v-model.number="reportId" type="number" min="1" required /></label><button :disabled="busy">Consultar reporte</button></form><BackendRecords v-if="report" :value="report" />
  </section>
</template>
