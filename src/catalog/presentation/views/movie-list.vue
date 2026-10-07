<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import useCatalogStore from "../../application/catalog.store.js";
import {onMounted, toRefs} from "vue";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useCatalogStore();
const { movies, moviesLoaded, errors } = toRefs(store);
const { fetchMovies, fetchGenres, deleteMovie } = store;

onMounted(() => {
  if (!store.moviesLoaded) fetchMovies();
  if (!store.genresLoaded) fetchGenres();
});

/**
 * Resolves the display name of the genre associated with a movie.
 * @param {number} genreId - The ID of the genre.
 * @returns {string} The genre name, or an em-dash if not found.
 */
const getGenreName = (genreId) => {
  const genre = store.getGenreById(genreId);
  return genre ? genre.name : '—';
};

/**
 * Navigate to the new movie creation page.
 */
const navigateToNew = () => {
  router.push({ name: 'catalog-movie-new' });
};

/**
 * Navigate to the movie editing page.
 * @param {number} id - The ID of the movie to edit.
 */
const navigateToEdit = (id) => {
  router.push({ name: 'catalog-movie-edit', params: { id } });
};

/**
 * Confirm and delete a movie.
 * @param {Object} movie - The movie to delete.
 */
const confirmDelete = (movie) => {
  confirm.require({
    message: t('movies.confirm-delete', { title: movie.getTitle() }),
    header: t('movies.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteMovie(movie); },
  });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ t('movies.title') }}</h1>
    <pv-button :label="t('movies.new')" icon="pi pi-plus" class="mb-3" @click="navigateToNew"/>

    <pv-data-table
        :value="movies"
        :loading="!moviesLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20]">
      <pv-column :header="t('movies.id')">
        <template #body="slotProps">{{ slotProps.data.getId() }}</template>
      </pv-column>

      <pv-column :header="t('movies.fields.title')">
        <template #body="slotProps">{{ slotProps.data.getTitle() }}</template>
      </pv-column>

      <pv-column :header="t('movies.fields.duration')">
        <template #body="slotProps">
          {{ slotProps.data.getDuration().getMinutes() }} {{ t('movies.minutes') }}
        </template>
      </pv-column>

      <pv-column :header="t('movies.fields.genre')">
        <template #body="slotProps">{{ getGenreName(slotProps.data.getGenreId()) }}</template>
      </pv-column>

      <pv-column :header="t('movies.fields.status')">
        <template #body="slotProps">{{ slotProps.data.getStatusAsString() }}</template>
      </pv-column>

      <pv-column :header="t('movies.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" text rounded @click="navigateToEdit(slotProps.data.getId())"/>
          <pv-button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)"/>
        </template>
      </pv-column>
    </pv-data-table>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>

    <pv-confirm-dialog/>
  </div>
</template>

<style scoped>
</style>