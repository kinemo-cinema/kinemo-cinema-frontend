<script setup>
import { onMounted, ref } from 'vue';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';
const { busy, error, run } = useBackend();
const rooms = ref([]);
const form = ref({ name: '', capacity: 1 });
const load = () => run(async http => { rooms.value = (await http.get('/rooms')).data; });
const create = () => run(async http => { const { data } = await http.post('/rooms', { name: form.value.name.trim(), capacity: form.value.capacity }); rooms.value.push(data); form.value = { name: '', capacity: 1 }; });
onMounted(load);
</script>
<template>
  <section class="backend-page"><header><h1>Salas</h1><button :disabled="busy" @click="load">Actualizar</button></header><p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p>
    <form @submit.prevent="create"><label>Nombre<input v-model="form.name" required /></label><label>Capacidad<input v-model.number="form.capacity" type="number" min="1" step="1" required /></label><button :disabled="busy">Crear sala</button></form>
    <p v-if="!busy && !rooms.length && !error">No hay salas registradas.</p><article v-for="room in rooms" :key="room.id"><h2><router-link :to="`/room-readiness/rooms/${room.id}`">{{ room.name }}</router-link></h2><BackendRecords :value="room" /></article>
  </section>
</template>
