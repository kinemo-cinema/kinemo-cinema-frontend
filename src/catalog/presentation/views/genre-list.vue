<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import useCatalogStore from "../../application/catalog.store.js";
import {onMounted, toRefs} from "vue";

const {t} = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useCatalogStore();

const {genres, errors, genresLoaded } = toRefs(store);
const {fetchGenres, deleteGenre} = store

onMounted(() => {
  if (!store.genresLoaded) {
    fetchGenres()
    genresLoaded.value = store.genresLoaded;
  }
});

/**
 * Navigate to the new genre creation page.
 */
const navigateToNew = () => {
  router.push({name: 'catalog-genre-new'});
};

/**
 * Navigate to the genre editing page.
 * @param {number} id - The ID of the genre to edit.
 */
const navigateToEdit = (id) => {
  router.push({name: 'catalog-genre-edit', params: {id}});
};

/**
 * Confirm deletion of a genre and execute deletion if confirmed.
 * @param {Object} genre - The genre object to delete.
 */
const confirmDelete = (genre) => {
  confirm.require({
    message: t('genres.confirm-delete', {name: genre.name}),
    header: t('genres.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      deleteGenre(genre);
    },
  });
};


</script>

<template>
  <div class="p-4">
    <h1>{{ t('genres.title') }}</h1>
    <pv-button :label="t('genres.new')" class="mb-3" icon="pi pi-plus" @click="navigateToNew"/>
    <pv-data-table
        :loading="!genresLoaded"
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        :value="genres"
        paginator
        striped-rows
        table-style="min-width: 50rem">
      <pv-column :header="t('genres.id')" field="id" sortable/>
      <pv-column :header="t('genres.name')" field="name" sortable/>
      <pv-column :header="t('genres.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" rounded text @click="navigateToEdit(slotProps.data.id)"/>
          <pv-button icon="pi pi-trash" rounded severity="danger" text @click="confirmDelete(slotProps.data)"/>
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