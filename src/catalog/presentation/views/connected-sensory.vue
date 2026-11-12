<script setup>
import { computed, onMounted, ref } from 'vue';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';
const { busy, error, run } = useBackend();
const movies = ref([]);
const movieId = ref(null);
const selected = computed(() => movies.value.find(movie => movie.id === movieId.value));
const file = ref(null);
const effectType = ref('Motion');
const durationSeconds = ref(1);
const intensityLevel = ref('Medium');
const load = () => run(async http => { movies.value = (await http.get('/movies')).data; if (!movieId.value) movieId.value = movies.value[0]?.id ?? null; });
const replace = movie => { movies.value = movies.value.map(item => item.id === movie.id ? movie : item); };
const upload = () => run(async http => {
  const data = new FormData();
  data.append('file', file.value); data.append('effectType', effectType.value); data.append('durationSeconds', durationSeconds.value);
  replace((await http.post(`/movies/${movieId.value}/sensory-file`, data)).data);
});
const configure = () => run(async http => { replace((await http.post(`/movies/${movieId.value}/effects-profile`, { intensityLevel: intensityLevel.value })).data); });
onMounted(load);
</script>
<template>
  <section class="backend-page">
    <header><h1>Contenido sensorial</h1><button :disabled="busy" @click="load">Actualizar</button></header>
    <p v-if="error" role="alert">{{ error }}</p><p v-if="busy" role="status">Procesando...</p>
    <p v-if="!busy && !movies.length && !error">Registra una película para asociar contenido sensorial.</p>
    <label v-if="movies.length">Película<select v-model="movieId"><option v-for="movie in movies" :key="movie.id" :value="movie.id">{{ movie.title }}</option></select></label>
    <template v-if="selected">
      <h2>{{ selected.title }}</h2><BackendRecords :value="selected.sensoryContent" />
      <h2>Asociar archivo</h2>
      <form @submit.prevent="upload"><label>Archivo<input type="file" required @change="file = $event.target.files[0]" /></label><label>Efecto<select v-model="effectType"><option v-for="effect in ['Motion','Wind','Water','Vibration']" :key="effect">{{ effect }}</option></select></label><label>Duración en segundos<input v-model.number="durationSeconds" type="number" min="1" required /></label><button :disabled="busy || !file">Subir archivo</button></form>
      <h2>Perfil de efectos</h2><form @submit.prevent="configure"><label>Intensidad<select v-model="intensityLevel"><option v-for="intensity in ['Low','Medium','High']" :key="intensity">{{ intensity }}</option></select></label><button :disabled="busy">Guardar perfil</button></form>
    </template>
  </section>
</template>
