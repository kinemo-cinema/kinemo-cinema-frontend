<script setup>
import { onMounted, ref } from 'vue';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';
const { busy, error, run } = useBackend();
const items = ref([]);
const shows = ref([]);
const movies = ref([]);
const showId = ref(null);
const reasons = ref({});
const load = () => run(async http => {
  const responses = await Promise.all([http.get('/executions'), http.get('/shows'), http.get('/movies')]);
  [items.value, shows.value, movies.value] = responses.map(response => response.data);
});
const start = () => run(async http => {
  const show = shows.value.find(item => item.id === showId.value);
  const movie = movies.value.find(item => item.id === show?.movieId);
  if (!movie?.sensoryContent?.id) throw new Error('Contenido sensorial no disponible');
  const { data } = await http.post('/executions', { showId: show.id, sensoryContentId: movie.sensoryContent.id });
  items.value.unshift(data);
});
const command = (item, name) => run(async http => {
  const { data } = await http.post(`/executions/${item.id}/${name}`, name === 'emergency-stop' ? { reason: reasons.value[item.id] } : undefined);
  items.value = items.value.map(row => row.id === data.id ? data : row);
});
onMounted(load);
</script>
<template>
  <section class="backend-page">
    <header><h1>Ejecución 4D</h1><button :disabled="busy" @click="load">Actualizar</button></header>
    <p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p>
    <form @submit.prevent="start"><label>Función<select v-model="showId" required><option :value="null" disabled>Selecciona una función</option><option v-for="show in shows" :key="show.id" :value="show.id">#{{ show.id }} · {{ show.startDateTime }}</option></select></label><button :disabled="busy || !shows.length">Iniciar ejecución</button></form>
    <p v-if="!busy && !items.length && !error">No hay ejecuciones registradas.</p>
    <article v-for="item in items" :key="item.id"><BackendRecords :value="item" /><div class="backend-actions"><button :disabled="busy || item.status !== 'InProgress'" @click="command(item, 'pause')">Pausar</button><button :disabled="busy || item.status !== 'Paused'" @click="command(item, 'resume')">Reanudar</button><button :disabled="busy || !['InProgress','Paused'].includes(item.status)" @click="command(item, 'finish')">Finalizar</button></div><form @submit.prevent="command(item, 'emergency-stop')"><label>Motivo de emergencia<input v-model="reasons[item.id]" required /></label><button :disabled="busy || !['InProgress','Paused'].includes(item.status)">Parada de emergencia</button></form></article>
  </section>
</template>
