<script setup>
import { onMounted, ref } from 'vue';
import { useBackend } from '../../../shared/application/use-backend.js';
const { busy, error, run } = useBackend();
const shows = ref([]);
const showId = ref(null);
const allocation = ref(null);
const totalSeats = ref(1);
const seatNumber = ref(null);
const status = ref('Sold');
const reason = ref('');
const message = ref('');
const load = () => run(async http => { shows.value = (await http.get('/shows')).data; });
const lookup = () => run(async http => { allocation.value = null; message.value = ''; try { allocation.value = (await http.get(`/seat-allocations/${showId.value}`)).data; } catch (failure) { if (failure.response?.status === 404) message.value = 'Esta función todavía no tiene un mapa de asientos.'; else throw failure; } });
const initialize = () => run(async http => { allocation.value = (await http.post('/seat-allocations', { showId: showId.value, totalSeats: totalSeats.value })).data; message.value = ''; });
const assign = () => run(async http => { allocation.value = (await http.patch(`/seat-allocations/${allocation.value.showId}/seats/${seatNumber.value}`, { newStatus: status.value })).data; });
const disable = () => run(async http => { allocation.value = (await http.post(`/seat-allocations/${allocation.value.showId}/seats/${seatNumber.value}/out-of-service`, { reason: reason.value })).data; reason.value = ''; });
onMounted(load);
</script>
<template>
  <section class="backend-page"><header><h1>Asignación de asientos</h1><button :disabled="busy" @click="load">Actualizar funciones</button></header><p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p><p v-if="!busy && !shows.length && !error">Registra una función para gestionar sus asientos.</p>
    <form @submit.prevent="lookup"><label>Función<select v-model="showId" required @change="allocation = null; message = ''"><option v-for="show in shows" :key="show.id" :value="show.id">#{{ show.id }} · {{ show.startDateTime }}</option></select></label><button :disabled="busy || !shows.length">Consultar mapa</button></form><p v-if="message" role="status">{{ message }}</p>
    <form v-if="showId && !allocation" @submit.prevent="initialize"><label>Total de asientos<input v-model.number="totalSeats" type="number" min="1" max="1000" step="1" required /></label><button :disabled="busy">Crear mapa de asientos</button></form>
    <template v-if="allocation"><h2>Función #{{ allocation.showId }}</h2><div class="seat-grid"><button v-for="seat in allocation.showSeats" :key="seat.id" :disabled="busy" :aria-pressed="seatNumber === seat.seatNumber" @click="seatNumber = seat.seatNumber">{{ seat.seatNumber }} · {{ seat.status }}</button></div>
      <form @submit.prevent="assign"><label>Asiento<select v-model="seatNumber" required><option v-for="seat in allocation.showSeats" :key="seat.id" :value="seat.seatNumber">{{ seat.seatNumber }}</option></select></label><label>Estado<select v-model="status"><option v-for="value in ['Sold','Enabled','Disabled']" :key="value">{{ value }}</option></select></label><button :disabled="busy">Actualizar asiento</button></form>
      <form @submit.prevent="disable"><label>Motivo de fuera de servicio<input v-model="reason" maxlength="500" required /></label><button :disabled="busy || !seatNumber">Marcar asiento fuera de servicio</button></form>
    </template>
  </section>
</template>
<style scoped>.seat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: .6rem; } .seat-grid [aria-pressed=true] { outline: 3px solid var(--secondary); }</style>
