<script setup>
import { computed, onMounted, ref } from 'vue';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';
const { busy, error, run } = useBackend();
const equipment = ref([]);
const rooms = ref([]);
const orders = ref({});
const selectedId = ref(null);
const selected = computed(() => equipment.value.find(item => item.id === selectedId.value));
const form = ref({ roomId: null, name: '', equipmentType: 'MotionSeat', usefulLifeHours: 1000 });
const incident = ref({ description: '', severity: 'Medium' });
const channel = ref('Motion');
const schedule = ref({ incidentId: null, type: 'Preventive', date: '' });
const notes = ref({});
const load = () => run(async http => {
  const responses = await Promise.all([http.get('/equipment'), http.get('/rooms')]);
  [equipment.value, rooms.value] = responses.map(response => response.data);
  const histories = await Promise.all(equipment.value.map(item => http.get(`/maintenance-orders/equipment/${item.id}`)));
  orders.value = Object.fromEntries(equipment.value.map((item, index) => [item.id, histories[index].data]));
});
const create = () => run(async http => { const { data } = await http.post('/equipment', form.value); equipment.value.push(data); selectedId.value = data.id; orders.value[data.id] = []; form.value.name = ''; });
const updateEquipment = data => { equipment.value = equipment.value.map(item => item.id === data.id ? data : item); };
const report = () => run(async http => { updateEquipment((await http.post(`/equipment/${selectedId.value}/incidents`, incident.value)).data); incident.value.description = ''; });
const test = () => run(async http => { updateEquipment((await http.post(`/equipment/${selectedId.value}/tests`, { channel: channel.value })).data); });
const scheduleOrder = () => run(async http => { const { data } = await http.post('/maintenance-orders', { equipmentId: selectedId.value, incidentId: schedule.value.incidentId, type: schedule.value.type, scheduledDate: new Date(schedule.value.date).toISOString() }); orders.value[selectedId.value] = [...(orders.value[selectedId.value] || []), data]; });
const complete = order => run(async http => { const { data } = await http.post(`/maintenance-orders/${order.id}/completion`, { notes: notes.value[order.id] }); orders.value[order.equipmentId] = orders.value[order.equipmentId].map(item => item.id === data.id ? data : item); updateEquipment((await http.get(`/equipment/${order.equipmentId}`)).data); });
onMounted(load);
</script>
<template>
  <section class="backend-page">
    <header><h1>Mantenimiento</h1><button :disabled="busy" @click="load">Actualizar</button></header>
    <p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p>
    <h2>Registrar equipo</h2>
    <form @submit.prevent="create"><label>Sala<select v-model="form.roomId" required><option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.name }}</option></select></label><label>Nombre<input v-model="form.name" maxlength="150" required /></label><label>Tipo<select v-model="form.equipmentType"><option v-for="type in ['MotionSeat','WindSystem','WaterSystem','VibrationSystem','Controller']" :key="type">{{ type }}</option></select></label><label>Vida útil (horas)<input v-model.number="form.usefulLifeHours" type="number" min="1" max="1000000" required /></label><button :disabled="busy || !rooms.length">Registrar</button></form>
    <p v-if="!busy && !equipment.length && !error">No hay equipos registrados.</p>
    <label v-if="equipment.length">Equipo<select v-model="selectedId"><option :value="null" disabled>Selecciona un equipo</option><option v-for="item in equipment" :key="item.id" :value="item.id">#{{ item.id }} · {{ item.name }}</option></select></label>
    <template v-if="selected"><h2>{{ selected.name }}</h2><BackendRecords :value="selected" />
      <h3>Reportar incidente</h3><form @submit.prevent="report"><label>Descripción<input v-model="incident.description" maxlength="1000" required /></label><label>Gravedad<select v-model="incident.severity"><option v-for="level in ['Low','Medium','High','Critical']" :key="level">{{ level }}</option></select></label><button :disabled="busy">Registrar incidente</button></form>
      <h3>Registrar diagnóstico</h3><p>Esta operación registra el diagnóstico del modelo del backend; no controla ni verifica hardware físico.</p><form @submit.prevent="test"><label>Canal<select v-model="channel"><option v-for="value in ['Motion','Wind','Water','Vibration']" :key="value">{{ value }}</option></select></label><button :disabled="busy">Registrar prueba</button></form>
      <h3>Programar mantenimiento</h3><form @submit.prevent="scheduleOrder"><label>Tipo<select v-model="schedule.type"><option>Preventive</option><option>Corrective</option></select></label><label>Incidente<select v-model="schedule.incidentId"><option :value="null">Sin incidente asociado</option><option v-for="item in selected.incidents" :key="item.id" :value="item.id">#{{ item.id }} · {{ item.description }}</option></select></label><label>Fecha<input v-model="schedule.date" type="datetime-local" required /></label><button :disabled="busy">Programar</button></form>
      <h3>Órdenes</h3><p v-if="!orders[selectedId]?.length">Sin órdenes registradas.</p><article v-for="order in orders[selectedId] || []" :key="order.id"><BackendRecords :value="order" /><form v-if="order.status !== 'Completed'" @submit.prevent="complete(order)"><label>Notas de cierre<input v-model="notes[order.id]" maxlength="1000" required /></label><button :disabled="busy">Completar orden</button></form></article>
    </template>
  </section>
</template>
