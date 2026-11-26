<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';

const { locale } = useI18n();
const router = useRouter();
const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));

const movies = ref([]);
const movieId = ref(null);
const file = ref(null);
const fileInput = ref(null);
const effectType = ref('Motion');
const durationSeconds = ref(1);
const intensityLevel = ref('Medium');
const successMessage = ref('');

const selected = computed(() =>
    movies.value.find(movie => movie.id === movieId.value)
);

const effects = [
  { value: 'Motion', en: 'Motion', es: 'Movimiento', icon: 'pi pi-arrows-alt' },
  { value: 'Wind', en: 'Wind', es: 'Viento', icon: 'pi pi-send' },
  { value: 'Water', en: 'Water', es: 'Agua', icon: 'pi pi-tint' },
  { value: 'Vibration', en: 'Vibration', es: 'Vibración', icon: 'pi pi-bolt' }
];

const intensities = [
  { value: 'Low', en: 'Low', es: 'Baja' },
  { value: 'Medium', en: 'Medium', es: 'Media' },
  { value: 'High', en: 'High', es: 'Alta' }
];

const validUpload = computed(() =>
    Boolean(
        selected.value &&
        file.value &&
        Number.isInteger(durationSeconds.value) &&
        durationSeconds.value >= 1
    )
);

const fileSize = computed(() => {
  if (!file.value) return '';

  const bytes = file.value.size;

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / 1048576).toFixed(2)} MB`;
});

const clearFile = () => {
  file.value = null;

  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const selectFile = (event) => {
  file.value = event.target.files?.[0] ?? null;
  successMessage.value = '';
};

watch(movieId, () => {
  clearFile();
  successMessage.value = '';
  effectType.value = 'Motion';
  durationSeconds.value = 1;
  intensityLevel.value = 'Medium';
});

const load = () => {
  successMessage.value = '';

  return run(async http => {
    movies.value = (await http.get('/movies')).data;

    if (!movies.value.some(movie => movie.id === movieId.value)) {
      movieId.value = movies.value[0]?.id ?? null;
    }
  });
};

const replace = (movie) => {
  movies.value = movies.value.map(item =>
      item.id === movie.id ? movie : item
  );
};

const upload = () => {
  if (busy.value || !validUpload.value) return;

  successMessage.value = '';

  return run(async http => {
    const data = new FormData();

    data.append('file', file.value);
    data.append('effectType', effectType.value);
    data.append('durationSeconds', durationSeconds.value);

    const response = await http.post(
        `/movies/${movieId.value}/sensory-file`,
        data
    );

    replace(response.data);
    clearFile();

    successMessage.value = isSpanish.value
        ? 'Archivo sensorial asociado correctamente.'
        : 'Sensory file uploaded successfully.';
  });
};

const configure = () => {
  if (busy.value || !selected.value) return;

  successMessage.value = '';

  return run(async http => {
    const response = await http.post(
        `/movies/${movieId.value}/effects-profile`,
        { intensityLevel: intensityLevel.value }
    );

    replace(response.data);

    successMessage.value = isSpanish.value
        ? 'Perfil de efectos guardado correctamente.'
        : 'Effects profile saved successfully.';
  });
};

const navigateToMovies = () => {
  router.push({ name: 'catalog-movies' });
};

onMounted(load);
</script>

<template>
  <section class="sensory-page">

    <header class="sensory-header">
      <div>
        <h2>
          {{ isSpanish ? 'Contenido sensorial' : 'Sensory content' }}
        </h2>

        <p>
          {{ isSpanish
            ? 'Administra archivos sensoriales y configura experiencias inmersivas.'
            : 'Manage sensory files and configure immersive cinema experiences.' }}
        </p>
      </div>

      <pv-button
          type="button"
          :label="isSpanish ? 'Actualizar' : 'Refresh'"
          :icon="busy ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"
          :disabled="busy"
          outlined
          class="refresh-button"
          @click="load"
      />
    </header>

    <div v-if="error" class="feedback-message error-message" role="alert">
      <i class="pi pi-exclamation-circle"/>
      <span>{{ error }}</span>

      <button type="button" :disabled="busy" @click="load">
        {{ isSpanish ? 'Reintentar' : 'Retry' }}
      </button>
    </div>

    <div
        v-if="successMessage"
        class="feedback-message success-message"
        role="status"
    >
      <i class="pi pi-check-circle"/>
      <span>{{ successMessage }}</span>

      <button type="button" @click="successMessage = ''">
        <i class="pi pi-times"/>
      </button>
    </div>

    <div v-if="busy" class="processing-message" role="status">
      <i class="pi pi-spin pi-spinner"/>
      {{ isSpanish ? 'Procesando información...' : 'Processing information...' }}
    </div>

    <div
        v-if="!busy && !movies.length && !error"
        class="sensory-card empty-state"
    >
      <div class="empty-icon">
        <i class="pi pi-video"/>
      </div>

      <h3>
        {{ isSpanish ? 'No hay películas disponibles' : 'No movies available' }}
      </h3>

      <p>
        {{ isSpanish
          ? 'Registra una película para comenzar a asociar contenido sensorial.'
          : 'Register a movie to start adding sensory content.' }}
      </p>

      <pv-button
          :label="isSpanish ? 'Ir a películas' : 'Go to movies'"
          icon="pi pi-arrow-right"
          @click="navigateToMovies"
      />
    </div>

    <div v-if="movies.length" class="sensory-card movie-selector-card">

      <div class="selector-heading">
        <div class="section-icon purple-icon">
          <i class="pi pi-video"/>
        </div>

        <div>
          <h3>
            {{ isSpanish ? 'Seleccionar película' : 'Select movie' }}
          </h3>

          <p>
            {{ isSpanish
              ? 'Elige la película que deseas configurar.'
              : 'Choose the movie you want to configure.' }}
          </p>
        </div>
      </div>

      <div class="movie-selector">
        <label for="sensory-movie">
          {{ isSpanish ? 'Película' : 'Movie' }}
        </label>

        <pv-select
            input-id="sensory-movie"
            v-model="movieId"
            :options="movies"
            option-label="title"
            option-value="id"
            :placeholder="isSpanish ? 'Seleccionar película' : 'Select movie'"
            :disabled="busy"
            filter
            class="sensory-select"
        />
      </div>

    </div>

    <template v-if="selected">

      <div class="sensory-card">

        <div class="card-header">
          <div class="section-icon turquoise-icon">
            <i class="pi pi-database"/>
          </div>

          <div class="card-heading">
            <h3>
              {{ isSpanish ? 'Contenido asociado' : 'Associated content' }}
            </h3>

            <p>{{ selected.title }}</p>
          </div>

          <span class="movie-reference">
            #{{ selected.id }}
          </span>
        </div>

        <div class="records-body">
          <BackendRecords :value="selected.sensoryContent"/>
        </div>

      </div>

      <div class="configuration-grid">

        <form
            class="sensory-card upload-card"
            @submit.prevent="upload"
        >

          <div class="card-header">
            <div class="section-icon turquoise-icon">
              <i class="pi pi-upload"/>
            </div>

            <div class="card-heading">
              <h3>
                {{ isSpanish ? 'Asociar archivo' : 'Upload sensory file' }}
              </h3>

              <p>
                {{ isSpanish
                  ? 'Agrega contenido sensorial a la película.'
                  : 'Add sensory content to the selected movie.' }}
              </p>
            </div>
          </div>

          <div class="card-body">

            <div class="form-field">
              <label>
                {{ isSpanish ? 'Archivo sensorial' : 'Sensory file' }}
                <span class="required-mark">*</span>
              </label>

              <input
                  ref="fileInput"
                  type="file"
                  class="hidden-file-input"
                  :disabled="busy"
                  @change="selectFile"
              />

              <button
                  v-if="!file"
                  type="button"
                  class="upload-zone"
                  :disabled="busy"
                  @click="fileInput?.click()"
              >
                <div class="upload-icon">
                  <i class="pi pi-cloud-upload"/>
                </div>

                <strong>
                  {{ isSpanish ? 'Seleccionar archivo' : 'Choose a file' }}
                </strong>

                <span>
                  {{ isSpanish
                    ? 'Haz clic para explorar tus archivos.'
                    : 'Click to browse your files.' }}
                </span>
              </button>

              <div v-else class="selected-file">

                <div class="section-icon turquoise-icon">
                  <i class="pi pi-file"/>
                </div>

                <div class="file-details">
                  <strong>{{ file.name }}</strong>
                  <span>{{ fileSize }}</span>
                </div>

                <button
                    type="button"
                    class="remove-file"
                    :disabled="busy"
                    :aria-label="isSpanish ? 'Quitar archivo' : 'Remove file'"
                    @click="clearFile"
                >
                  <i class="pi pi-times"/>
                </button>

              </div>
            </div>

            <div class="form-field">
              <label>
                {{ isSpanish ? 'Tipo de efecto' : 'Effect type' }}
                <span class="required-mark">*</span>
              </label>

              <div class="effects-grid">
                <button
                    v-for="effect in effects"
                    :key="effect.value"
                    type="button"
                    class="effect-option"
                    :class="{ 'effect-selected': effectType === effect.value }"
                    :aria-pressed="effectType === effect.value"
                    :disabled="busy"
                    @click="effectType = effect.value"
                >
                  <i :class="effect.icon"/>

                  <span>
                    {{ isSpanish ? effect.es : effect.en }}
                  </span>
                </button>
              </div>
            </div>

            <div class="form-field">
              <label for="duration-seconds">
                {{ isSpanish ? 'Duración' : 'Duration' }}
                <span class="required-mark">*</span>
              </label>

              <div class="number-field">
                <i class="pi pi-clock"/>

                <input
                    id="duration-seconds"
                    v-model.number="durationSeconds"
                    type="number"
                    min="1"
                    step="1"
                    :disabled="busy"
                    required
                />

                <span>
                  {{ isSpanish ? 'seg' : 'sec' }}
                </span>
              </div>
            </div>

          </div>

          <footer class="card-footer">
            <pv-button
                type="submit"
                :label="isSpanish ? 'Subir archivo' : 'Upload file'"
                icon="pi pi-upload"
                :disabled="busy || !validUpload"
                class="primary-button"
            />
          </footer>

        </form>

        <form
            class="sensory-card profile-card"
            @submit.prevent="configure"
        >

          <div class="card-header">
            <div class="section-icon turquoise-icon">
              <i class="pi pi-sliders-h"/>
            </div>

            <div class="card-heading">
              <h3>
                {{ isSpanish ? 'Perfil de efectos' : 'Effects profile' }}
              </h3>

              <p>
                {{ isSpanish
                  ? 'Personaliza la intensidad de la experiencia.'
                  : 'Customize the intensity of the experience.' }}
              </p>
            </div>
          </div>

          <div class="card-body">

            <div class="form-field">
              <label>
                {{ isSpanish ? 'Nivel de intensidad' : 'Intensity level' }}
              </label>

              <div class="intensity-options">
                <button
                    v-for="(intensity, index) in intensities"
                    :key="intensity.value"
                    type="button"
                    class="intensity-option"
                    :class="{ 'intensity-selected': intensityLevel === intensity.value }"
                    :aria-pressed="intensityLevel === intensity.value"
                    :disabled="busy"
                    @click="intensityLevel = intensity.value"
                >

                  <div class="intensity-bars">
                    <span
                        v-for="bar in 3"
                        :key="bar"
                        :class="{ 'bar-active': bar <= index + 1 }"
                    />
                  </div>

                  <span>
                    {{ isSpanish ? intensity.es : intensity.en }}
                  </span>

                  <i
                      v-if="intensityLevel === intensity.value"
                      class="pi pi-check-circle intensity-check"
                  />

                </button>
              </div>
            </div>

            <div class="profile-information">
              <i class="pi pi-info-circle"/>

              <p>
                {{ isSpanish
                  ? 'El perfil de efectos se aplicará a la película seleccionada.'
                  : 'The effects profile will be applied to the selected movie.' }}
              </p>
            </div>

          </div>

          <footer class="card-footer">
            <pv-button
                type="submit"
                :label="isSpanish ? 'Guardar perfil' : 'Save profile'"
                icon="pi pi-check"
                :disabled="busy"
                class="primary-button"
            />
          </footer>

        </form>

      </div>

    </template>

  </section>
</template>

<style scoped>
.sensory-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  min-width: 0;
}

.sensory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.sensory-header h2 {
  margin: 0;
  color: #f1f1f5;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.35px;
}

.sensory-header p {
  margin: 0.35rem 0 0;
  color: #9299ad;
  font-size: 0.8rem;
  line-height: 1.5;
}

.refresh-button {
  flex-shrink: 0;
  min-height: 38px;
  padding: 0.6rem 0.9rem;
  border-color: #343646;
  border-radius: 7px;
  color: #a6adbf;
  font-size: 0.78rem;
}

.refresh-button:hover {
  color: #b49afa;
  border-color: #695398;
  background: rgba(139, 92, 246, 0.08);
}

.sensory-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #292b3a;
  border-radius: 12px;
  background: #161720;
}

.movie-selector-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 1.25rem;
}

.selector-heading {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 9px;
}

.section-icon i {
  font-size: 1rem;
}

.purple-icon {
  border: 1px solid rgba(139, 92, 246, 0.2);
  background: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
}

.turquoise-icon {
  border: 1px solid rgba(52, 214, 176, 0.2);
  background: rgba(52, 214, 176, 0.08);
  color: #34d6b0;
}

.selector-heading h3,
.card-heading h3 {
  margin: 0;
  color: #e6e7ef;
  font-size: 0.9rem;
  font-weight: 600;
}

.selector-heading p,
.card-heading p {
  margin: 0.3rem 0 0;
  color: #9299ad;
  font-size: 0.75rem;
  line-height: 1.5;
}

.movie-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 340px;
}

.movie-selector label,
.form-field label {
  color: #d6d8e2;
  font-size: 0.8rem;
  font-weight: 500;
}

.sensory-select {
  width: 100%;
  min-height: 40px;
  border: 1px solid #303242;
  border-radius: 7px;
  background: #11121a;
  color: #e6e7ef;
  font-size: 0.8rem;
}

.sensory-select :deep(.p-select-label) {
  display: flex;
  align-items: center;
  color: #e6e7ef;
  font-size: 0.8rem;
}

.sensory-select :deep(.p-select-dropdown) {
  color: #9299ad;
}

.sensory-select:focus-within {
  border-color: #a78bfa;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.15rem 1.25rem;
  border-bottom: 1px solid #292b3a;
}

.card-heading {
  flex: 1;
  min-width: 0;
}

.movie-reference {
  padding: 0.3rem 0.6rem;
  border: 1px solid #303242;
  border-radius: 5px;
  background: #20212c;
  color: #a6adbf;
  font-size: 0.72rem;
}

.records-body {
  padding: 1.25rem;
  overflow-x: auto;
  color: #c5c9d5;
  font-size: 0.8rem;
}

.records-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.records-body :deep(th) {
  padding: 0.8rem;
  border-bottom: 1px solid #303242;
  background: #1c1e29;
  color: #a6adbf;
  text-align: left;
  font-weight: 600;
}

.records-body :deep(td) {
  padding: 0.8rem;
  border-bottom: 1px solid #292b3a;
  color: #d6d8e2;
}

.records-body :deep(pre) {
  padding: 1rem;
  border: 1px solid #292b3a;
  border-radius: 7px;
  background: #11121a;
  color: #c5c9d5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.configuration-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: stretch;
  gap: 1.25rem;
}

.upload-card,
.profile-card {
  display: flex;
  flex-direction: column;
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-width: 0;
}

.required-mark {
  color: #a78bfa;
}

.hidden-file-input {
  display: none;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  width: 100%;
  min-height: 145px;
  padding: 1.25rem;
  border: 1px dashed #3b4552;
  border-radius: 9px;
  background: #11151c;
  color: #d6d8e2;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-zone:hover {
  border-color: #34d6b0;
  background: rgba(52, 214, 176, 0.04);
}

.upload-zone:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(52, 214, 176, 0.09);
  color: #34d6b0;
}

.upload-icon i {
  font-size: 1.3rem;
}

.upload-zone strong {
  font-size: 0.82rem;
  font-weight: 600;
}

.upload-zone > span {
  color: #858da3;
  font-size: 0.72rem;
  text-align: center;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem;
  border: 1px solid rgba(52, 214, 176, 0.2);
  border-radius: 8px;
  background: rgba(52, 214, 176, 0.04);
}

.file-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.file-details strong {
  overflow: hidden;
  color: #d6d8e2;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-details span {
  color: #9299ad;
  font-size: 0.72rem;
}

.remove-file {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #f87171;
  cursor: pointer;
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.6rem;
}

.effect-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 76px;
  padding: 0.7rem 0.3rem;
  border: 1px solid #303242;
  border-radius: 8px;
  background: #11121a;
  color: #9299ad;
  font-family: inherit;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.effect-option i {
  font-size: 1.1rem;
}

.effect-option:hover {
  border-color: #347b70;
  color: #34d6b0;
}

.effect-selected {
  border-color: rgba(52, 214, 176, 0.45);
  background: rgba(52, 214, 176, 0.08);
  color: #34d6b0;
}

.number-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 42px;
  padding: 0 0.85rem;
  border: 1px solid #303242;
  border-radius: 7px;
  background: #11121a;
  color: #858da3;
}

.number-field:focus-within {
  border-color: #34d6b0;
}

.number-field input {
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: 0.65rem 0;
  border: none;
  outline: none;
  background: transparent;
  color: #e6e7ef;
  font-family: inherit;
  font-size: 0.82rem;
  appearance: textfield;
  -moz-appearance: textfield;
}

.number-field input::-webkit-inner-spin-button,
.number-field input::-webkit-outer-spin-button {
  margin: 0;
  -webkit-appearance: none;
}

.number-field > span {
  padding-left: 0.75rem;
  border-left: 1px solid #303242;
  font-size: 0.75rem;
}

.intensity-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.intensity-option {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-height: 60px;
  padding: 0.85rem 1rem;
  border: 1px solid #303242;
  border-radius: 8px;
  background: #11121a;
  color: #a6adbf;
  font-family: inherit;
  font-size: 0.8rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.intensity-option:hover {
  border-color: #347b70;
}

.intensity-selected {
  border-color: rgba(52, 214, 176, 0.45);
  background: rgba(52, 214, 176, 0.07);
  color: #34d6b0;
}

.intensity-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  width: 34px;
  height: 25px;
}

.intensity-bars span {
  width: 6px;
  border-radius: 2px;
  background: #303242;
}

.intensity-bars span:nth-child(1) {
  height: 9px;
}

.intensity-bars span:nth-child(2) {
  height: 16px;
}

.intensity-bars span:nth-child(3) {
  height: 24px;
}

.intensity-bars .bar-active {
  background: #34d6b0;
}

.intensity-check {
  margin-left: auto;
  color: #34d6b0;
  font-size: 1rem;
}

.effect-option:disabled,
.intensity-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.profile-information {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.9rem;
  border: 1px solid rgba(52, 214, 176, 0.15);
  border-radius: 7px;
  background: rgba(52, 214, 176, 0.04);
  color: #34d6b0;
}

.profile-information i {
  margin-top: 0.1rem;
  font-size: 0.85rem;
}

.profile-information p {
  margin: 0;
  color: #9299ad;
  font-size: 0.75rem;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.25rem;
  border-top: 1px solid #292b3a;
  background: #14151e;
}

.primary-button {
  min-height: 38px;
  padding: 0.6rem 1rem;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 500;
}

.feedback-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.8rem;
  overflow-wrap: anywhere;
}

.feedback-message > span {
  flex: 1;
}

.feedback-message button {
  padding: 0.4rem;
  border: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}

.error-message {
  border-color: rgba(248, 113, 113, 0.2);
  background: rgba(248, 113, 113, 0.06);
  color: #f87171;
}

.success-message {
  border-color: rgba(52, 214, 176, 0.2);
  background: rgba(52, 214, 176, 0.06);
  color: #34d6b0;
}

.processing-message {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #a78bfa;
  font-size: 0.8rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 1rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 13px;
  background: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
}

.empty-icon i {
  font-size: 1.4rem;
}

.empty-state h3 {
  margin: 0;
  color: #e6e7ef;
  font-size: 0.95rem;
  font-weight: 600;
}

.empty-state p {
  margin: 0.65rem 0 1.25rem;
  color: #9299ad;
  font-size: 0.8rem;
  line-height: 1.5;
}

.empty-state :deep(.p-button) {
  border-radius: 7px;
  font-size: 0.8rem;
}

@media (max-width: 1000px) {
  .configuration-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .movie-selector {
    max-width: none;
  }

  .sensory-header {
    align-items: flex-start;
  }

  .sensory-header h2 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .sensory-header {
    flex-direction: column;
  }

  .effects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .card-header,
  .card-body,
  .card-footer {
    padding: 1rem;
  }

  .primary-button {
    width: 100%;
  }
}
</style>
