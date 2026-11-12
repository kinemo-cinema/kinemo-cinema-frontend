<script setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import useCatalogStore from "../../application/catalog.store.js";
import {computed, onMounted, ref} from "vue";
import {Movie} from "../../domain/model/movie.entity.js";
import {storeToRefs} from "pinia";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useCatalogStore();

const {errors, genres} = storeToRefs(store);
const {addMovie, updateMovie, fetchMovies, fetchGenres} = store;
const saving = ref(false);
const validationError = ref('');

const form = ref({
  title: '',
  durationMinutes: 0,
  genreId: null,
});
const isEdit = computed(() => !!route.params.id);

onMounted(async () => {
  if (!store.genresLoaded) await fetchGenres();
  if (isEdit.value) {
    if (!store.moviesLoaded) await fetchMovies();
    const movie = getMovieById(route.params.id);
    if (movie) {
      form.value.title = movie.getTitle();
      form.value.durationMinutes = movie.getDuration().getMinutes();
      form.value.genreId = movie.getGenreId()
    } else router.push({name: 'catalog-movies'});
  }
});

/**
 * Retrieves a movie by its ID from the store.
 * @param {number} id - The movie ID.
 * @returns {Movie|null} The movie or null if not found.
 */

function getMovieById(id) {
  return store.getMovieById(id);
}

/**
 * Saves the tutorial by either adding or updating it.
 */

const saveMovie = async () => {
  if (saving.value) return;
  validationError.value = '';
  if (!form.value.title.trim() || !Number.isInteger(form.value.durationMinutes) || form.value.durationMinutes < 1 || form.value.durationMinutes > 400 || form.value.genreId === null) {
    validationError.value = t('movie.validation-required');
    return;
  }
  saving.value = true;
  try {
  const existing = isEdit.value ? getMovieById(route.params.id) : null;

  const movie = new Movie({
    id: existing ? existing.getId() : null,
    title: form.value.title.trim(),
    durationMinutes: form.value.durationMinutes,
    genreId: form.value.genreId,
    // Preserve internal fields when editing; defaults when creating
    status: existing ? existing.getStatusAsString() : 'ACTIVE',
    originalMovieId: existing ? existing.getOriginalMovieId() : null,
    createdAt: existing ? existing.getCreatedAtFormated() : null,
    updatedAt: null, // entity will default to now

  });
  if (isEdit.value) await updateMovie(movie); else await addMovie(movie);
  navigateBack();
  } catch {
    // The store retains the server error so the form can display it.
  } finally {
    saving.value = false;
  }
};

/**
 * Navigates back to the movies list.
 */
const navigateBack = () => {
  router.push({name: 'catalog-movies'});
};

</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('movie.edit-title') : t('movie.new-title') }}</h1>

    <form @submit.prevent="saveMovie">
      <div class="field mb-3">
        <label for="title">{{ t('movie.title') }}</label>
        <pv-input-text
            id="title"
            v-model="form.title"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="duration">{{ t('movie.duration') }}</label>
        <input
            id="duration"
            v-model.number="form.durationMinutes"
            type="number"
            class="p-inputtext p-component w-full"
            min="1"
            max="400"
            step="1"
            required/>
      </div>

      <div class="field mb-3">
        <label for="genre">{{ t('movie.genre') }}</label>
        <pv-select
            id="genre"
            v-model="form.genreId"
            :options="genres"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('movie.select-genre')"
            class="w-full"
            required/>
      </div>

      <pv-button
          type="submit"
          :loading="saving"
          :disabled="saving"
          :label="t('movie.save')"
          icon="pi pi-save"/>

      <pv-button
          :label="t('movie.cancel')"
          severity="secondary"
          class="ml-2"
          @click="navigateBack"/>
    </form>

    <p v-if="validationError" role="alert" class="text-red-500 mt-3">{{ validationError }}</p>
    <div v-if="errors.length" role="alert" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>

</style>
