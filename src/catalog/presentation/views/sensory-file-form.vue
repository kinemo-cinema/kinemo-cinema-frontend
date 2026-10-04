<script setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import useCatalogStore from "../../application/catalog.store.js";
import {computed, onMounted, ref} from "vue";
import {SensoryFile} from "../../domain/model/sensory-file.entity.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useCatalogStore();

const { errors, movies, addSensoryFile, updateSensoryFile, fetchMovies } = store;

const form = ref({
  fileName: '',
  movieId: null,
  filePath: '',
});

const isEdit = computed(() => !!route.params.id);

/**
 * Select options for the movie dropdown. Only schedulable (ACTIVE)
 * movies are offered, since INACTIVE movies should not receive new
 * sensory content. Plain objects are used because PrimeVue's option
 * binding cannot reach private entity fields directly.
 */
const movieOptions = computed(() =>
    movies.value
        .filter(m => m.canBeScheduled())
        .map(m => ({ id: m.getId(), title: m.getTitle() }))
);

onMounted(() => {
  if (!store.moviesLoaded) fetchMovies();
  if (isEdit.value) {
    const file = getSensoryFileById(route.params.id);
    if (file) {
      form.value.fileName = file.getFileName();
      form.value.movieId = file.getMovieId();
      form.value.filePath = file.getFilePath();
    } else {
      router.push({ name: 'catalog-sensory-files' });
    }
  }
});

/**
 * Retrieves a sensory file by its ID.
 * @param {number|string} id - The sensory file ID.
 * @returns {SensoryFile|null} The sensory file or null if not found.
 */
function getSensoryFileById(id) {
  return store.getSensoryFileById(id);
}

/**
 * Saves the sensory file, either by adding a new one or updating an existing one.
 */
const saveSensoryFile = () => {
  const existing = isEdit.value ? getSensoryFileById(route.params.id) : null;

  const sensoryFile = new SensoryFile({
    id: existing ? existing.getId() : null,
    movieId: form.value.movieId,
    fileName: form.value.fileName,
    fileFormat: existing ? existing.getFileFormat().toString() : 'TRACK',
    filePath: form.value.filePath,
    validationStatus: existing ? existing.getValidationStatusAsString() : 'PENDING',
    uploadedAt: existing ? existing.getUploadedAtFormated() : new Date().toISOString(),
  });

  if (isEdit.value) updateSensoryFile(sensoryFile); else addSensoryFile(sensoryFile);
  navigateBack();
};

/**
 * Navigates back to the sensory files list.
 */
const navigateBack = () => {
  router.push({ name: 'catalog-sensory-files' });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('sensoryFile.edit-title') : t('sensoryFile.new-title') }}</h1>

    <form @submit.prevent="saveSensoryFile">
      <div class="field mb-3">
        <label for="fileName">{{ t('sensoryFile.fileName') }}</label>
        <pv-input-text id="fileName" v-model="form.fileName" class="w-full" required/>
      </div>

      <div class="field mb-3">
        <label for="movie">{{ t('sensoryFile.movie') }}</label>
        <pv-select
            id="movie"
            v-model="form.movieId"
            :options="movieOptions"
            optionLabel="title"
            optionValue="id"
            :placeholder="t('sensoryFile.select-movie')"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="filePath">{{ t('sensoryFile.filePath') }}</label>
        <pv-input-text id="filePath" v-model="form.filePath" class="w-full" required/>
      </div>

      <pv-button type="submit" :label="t('sensoryFile.save')" icon="pi pi-save"/>
      <pv-button :label="t('sensoryFile.cancel')" severity="secondary" class="ml-2" @click="navigateBack"/>
    </form>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>