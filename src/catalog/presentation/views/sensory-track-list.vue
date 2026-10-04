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
const { sensoryTracks, sensoryTracksLoaded, sensoryFilesLoaded, errors } = toRefs(store);
const { fetchSensoryTracks, fetchSensoryFiles, deleteSensoryTrack } = store;

onMounted(() => {
  if (!store.sensoryTracksLoaded) fetchSensoryTracks();
  if (!store.sensoryFilesLoaded) fetchSensoryFiles();
});

/**
 * Resolves the file name of the sensory file that owns a given track.
 * @param {number} fileId - The sensory file ID.
 * @returns {string} The file name, or an em-dash if not found.
 */
const getFileName = (fileId) => {
  const file = store.getSensoryFileById(fileId);
  return file ? file.getFileName() : '—';
};

const navigateToNew = () => {
  router.push({ name: 'catalog-sensory-track-new' });
};

const navigateToEdit = (id) => {
  router.push({ name: 'catalog-sensory-track-edit', params: { id } });
};

const confirmDelete = (track) => {
  confirm.require({
    message: t('sensoryTracks.confirm-delete', { id: track.getId() }),
    header: t('sensoryTracks.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteSensoryTrack(track); },
  });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ t('sensoryTracks.title') }}</h1>
    <pv-button :label="t('sensoryTracks.new')" icon="pi pi-plus" class="mb-3" @click="navigateToNew"/>
    <pv-data-table
        :value="sensoryTracks"
        :loading="!sensoryTracksLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20]">
      <pv-column :header="t('sensoryTracks.id')">
        <template #body="slotProps">{{ slotProps.data.getId() }}</template>
      </pv-column>
      <pv-column :header="t('sensoryTracks.fields.sensoryFile')">
        <template #body="slotProps">{{ getFileName(slotProps.data.getSensoryFileId()) }}</template>
      </pv-column>
      <pv-column :header="t('sensoryTracks.fields.trackType')">
        <template #body="slotProps">{{ slotProps.data.getTrackTypeAsString() }}</template>
      </pv-column>
      <pv-column :header="t('sensoryTracks.fields.intensityLevel')">
        <template #body="slotProps">{{ slotProps.data.getIntensityLevelAsNumber() }}%</template>
      </pv-column>
      <pv-column :header="t('sensoryTracks.fields.status')">
        <template #body="slotProps">{{ slotProps.data.getTrackStatusAsString() }}</template>
      </pv-column>
      <pv-column :header="t('sensoryTracks.actions')">
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