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
const { sensoryFiles, sensoryFilesLoaded, moviesLoaded, errors } = toRefs(store);
const { fetchSensoryFiles, fetchMovies, deleteSensoryFile } = store;

onMounted(() => {
  if (!store.sensoryFilesLoaded) fetchSensoryFiles();
  if (!store.moviesLoaded) fetchMovies();
});

/**
 * Resolves the title of the movie associated with a sensory file.
 * @param {number} movieId - The ID of the movie.
 * @returns {string} The movie title, or an em-dash if not found.
 */
const getMovieTitle = (movieId) => {
  const movie = store.getMovieById(movieId);
  return movie ? movie.getTitle() : '—';
};

/**
 * Navigate to the new sensory file creation page.
 */
const navigateToNew = () => {
  router.push({ name: 'catalog-sensory-file-new' });
};

/**
 * Navigate to the sensory file editing page.
 * @param {number} id - The ID of the sensory file to edit.
 */
const navigateToEdit = (id) => {
  router.push({ name: 'catalog-sensory-file-edit', params: { id } });
};

/**
 * Confirm and delete a sensory file.
 * @param {Object} file - The sensory file to delete.
 */
const confirmDelete = (file) => {
  confirm.require({
    message: t('sensoryFiles.confirm-delete', { fileName: file.getFileName() }),
    header: t('sensoryFiles.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteSensoryFile(file); },
  });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ t('sensoryFiles.title') }}</h1>
    <pv-button :label="t('sensoryFiles.new')" icon="pi pi-plus" class="mb-3" @click="navigateToNew"/>
    <pv-data-table
        :value="sensoryFiles"
        :loading="!sensoryFilesLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20]">
      <pv-column :header="t('sensoryFiles.id')">
        <template #body="slotProps">{{ slotProps.data.getId() }}</template>
      </pv-column>
      <pv-column :header="t('sensoryFiles.fields.fileName')">
        <template #body="slotProps">{{ slotProps.data.getFileName() }}</template>
      </pv-column>
      <pv-column :header="t('sensoryFiles.fields.movie')">
        <template #body="slotProps">{{ getMovieTitle(slotProps.data.getMovieId()) }}</template>
      </pv-column>
      <pv-column :header="t('sensoryFiles.fields.format')">
        <template #body="slotProps">{{ slotProps.data.getFileFormat().toString() }}</template>
      </pv-column>
      <pv-column :header="t('sensoryFiles.fields.status')">
        <template #body="slotProps">{{ slotProps.data.getValidationStatusAsString() }}</template>
      </pv-column>
      <pv-column :header="t('sensoryFiles.actions')">
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