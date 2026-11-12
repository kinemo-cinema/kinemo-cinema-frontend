<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';
const route = useRoute();
const { busy, error, run } = useBackend();
const room = ref(null);
const observations = ref('');
const block = ref({ reason: '', start: '', end: '' });
const load = () => run(async http => { room.value = (await http.get(`/rooms/${route.params.id}`)).data; });
const prepare = () => run(async http => { room.value = (await http.post(`/rooms/${route.params.id}/preparation`, { observations: observations.value })).data; });
const release = () => run(async http => { room.value = (await http.post(`/rooms/${route.params.id}/release`)).data; });
const blockRoom = () => {
  if (new Date(block.value.end) <= new Date(block.value.start)) { error.value = 'El fin debe ser posterior al inicio.'; return; }
  return run(async http => { room.value = (await http.post(`/rooms/${route.params.id}/blocking`, { reason: block.value.reason, startDateTime: new Date(block.value.start).toISOString(), endDateTime: new Date(block.value.end).toISOString() })).data; });
};
onMounted(load);
watch(() => route.params.id, load);
</script>
<template>
  <section class="backend-page">
    <header><h1>{{ room?.name || 'Sala' }}</h1><router-link to="/room-readiness/rooms">Volver a salas</router-link><button :disabled="busy" @click="load">Actualizar</button></header>
    <p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p>
    <template v-if="room">
      <BackendRecords :value="room" />
      <h2>Preparación e inspección</h2>
      <form @submit.prevent="prepare"><label>Observaciones<textarea v-model="observations" required /></label><button :disabled="busy">Registrar preparación</button></form>
      <h2>Bloqueo por mantenimiento</h2>
      <form @submit.prevent="blockRoom"><label>Motivo<input v-model="block.reason" required /></label><label>Inicio<input v-model="block.start" type="datetime-local" required /></label><label>Fin<input v-model="block.end" type="datetime-local" required /></label><button :disabled="busy">Bloquear sala</button></form>
      <button :disabled="busy || room.status !== 'Maintenance'" @click="release">Liberar sala</button>
    </template>
  </section>
</template>
