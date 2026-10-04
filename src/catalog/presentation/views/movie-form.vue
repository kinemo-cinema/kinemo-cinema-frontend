<script setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import useCatalogStore from "../../application/catalog.store.js";
import {computed, onMounted, ref} from "vue";
import {Movie} from "../../domain/model/movie.entity.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useCatalogStore();

const {errors, genres, movies, addMovie, updateMovie, fetchMovies, fetchGenres} = store;

const form = ref({
  title: '',
  durationMinutes: 0,
  genreId: null,
});
const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (!genres.length) fetchGenres();
  if (isEdit.value) {
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

const saveMovie = () => {
  const existing = isEdit.value ? getMovieById(route.params.id) : null;

  const movie = new Movie({
    id: existing ? existing.getId() : null,
    title: form.value.title,
    durationMinutes: form.value.durationMinutes,
    genreId: form.value.genreId,
    // Preserve internal fields when editing; defaults when creating
    status: existing ? existing.getStatusAsString() : 'ACTIVE',
    originalMovieId: existing ? existing.getOriginalMovieId() : null,
    createdAt: existing ? existing.getCreatedAtFormated() : null,
    updatedAt: null, // entity will default to now

  });
  if (isEdit.value) updateMovie(movie); else addMovie(movie);
  navigateBack();
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
        <pv-input-number
            id="duration"
            v-model="form.durationMinutes"
            class="w-full"
            :min="1"
            :max="400"
            suffix=" min"
            showButtons/>
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
          :label="t('movie.save')"
          icon="pi pi-save"/>

      <pv-button
          :label="t('movie.cancel')"
          severity="secondary"
          class="ml-2"
          @click="navigateBack"/>
    </form>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>

</style>