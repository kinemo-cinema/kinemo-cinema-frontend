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
const {movies, moviesLoaded, genresLoaded, errors} = toRefs(store);
const { fetchMovies, deleteMovie, fetchGenres } = store;


onMounted(() => {
  if (!store.moviesLoaded) {
    fetchMovies();
    moviesLoaded.value = store.moviesLoaded;
  }
  if (!store.genresLoaded) {
    fetchGenres();
    genresLoaded.value = store.genresLoaded;
  }

});


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
  console.log(id);
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
    <pv-button :label="t('movies.new')" icon="pi pi-plus" class="mb-3" @click="navigateToNew" />
    <pv-data-table
        :value="movies"
        :loading="!moviesLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
    >
      <pv-column field="id" :header="t('movies.id')" sortable/>
      <pv-column field="title" :header="t('movies.fields.title')" sortable/>
      <pv-column field="durationMinutes" :header="t('movies.fields.duration')" sortable/>
      <pv-column field="genreName" :header="t('movies.fields.genre')"/>
      <pv-column field="status" :header="t('movies.fields.status')"/>
      <pv-column :header="t('movies.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" text rounded @click="navigateToEdit(slotProps.data.getId())" />
          <pv-button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)" />
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