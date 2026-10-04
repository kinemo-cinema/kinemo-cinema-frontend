<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import {storeToRefs} from "pinia";
import useSchedulingStore from "../../application/scheduling.store.js";
import useCatalogStore from "../../../catalog/application/catalog.store.js";
import {onMounted} from "vue";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const schedulingStore = useSchedulingStore();
const catalogStore = useCatalogStore();

// Reactive refs from both stores
const { shows, showsLoaded, rooms, roomsLoaded, errors } = storeToRefs(schedulingStore);
const { movies, moviesLoaded } = storeToRefs(catalogStore);

// Actions
const { fetchShows, fetchRooms, deleteShow } = schedulingStore;
const { fetchMovies } = catalogStore;

onMounted(() => {
  if (!schedulingStore.showsLoaded) fetchShows();
  if (!schedulingStore.roomsLoaded) fetchRooms();
  if (!catalogStore.moviesLoaded) fetchMovies();
});

/**
 * Resolves the display title of the movie scheduled for a show.
 * @param {number} movieId - The ID of the movie.
 * @returns {string} The movie title, or an em-dash if not found.
 */
const getMovieTitle = (movieId) => {
  const movie = catalogStore.getMovieById(movieId);
  return movie ? movie.getTitle() : '—';
};

/**
 * Resolves the display name of the room hosting a show.
 * @param {number} roomId - The ID of the room.
 * @returns {string} The room name, or an em-dash if not found.
 */
const getRoomName = (roomId) => {
  const room = schedulingStore.getRoomById(roomId);
  return room ? room.getName() : '—';
};

/**
 * Formats a show's schedule as a compact "start → end" string using the
 * browser's locale for date and time presentation.
 *
 * @param {Object} show - The Show entity.
 * @returns {string} The formatted schedule range.
 */
const formatSchedule = (show) => {
  const start = show.getStartTime().toDate();
  const end = show.getEndTime().toDate();
  const opts = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
  return `${start.toLocaleString(undefined, opts)} → ${end.toLocaleString(undefined, opts)}`;
};

/**
 * Navigate to the new show creation page.
 */
const navigateToNew = () => {
  router.push({ name: 'scheduling-show-new' });
};

/**
 * Navigate to the show editing page.
 * @param {number} id - The ID of the show to edit.
 */
const navigateToEdit = (id) => {
  router.push({ name: 'scheduling-show-edit', params: { id } });
};

/**
 * Confirm and delete a show.
 * @param {Object} show - The show to delete.
 */
const confirmDelete = (show) => {
  confirm.require({
    message: t('shows.confirm-delete', { id: show.getId() }),
    header: t('shows.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteShow(show); },
  });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ t('shows.title') }}</h1>
    <pv-button :label="t('shows.new')" icon="pi pi-plus" class="mb-3" @click="navigateToNew"/>

    <pv-data-table
        :value="shows"
        :loading="!showsLoaded"
        striped-rows
        table-style="min-width: 60rem"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 20, 50]">
      <pv-column :header="t('shows.id')">
        <template #body="slotProps">{{ slotProps.data.getId() }}</template>
      </pv-column>

      <pv-column :header="t('shows.fields.movie')">
        <template #body="slotProps">{{ getMovieTitle(slotProps.data.getMovieId()) }}</template>
      </pv-column>

      <pv-column :header="t('shows.fields.room')">
        <template #body="slotProps">{{ getRoomName(slotProps.data.getRoomId()) }}</template>
      </pv-column>

      <pv-column :header="t('shows.fields.schedule')">
        <template #body="slotProps">{{ formatSchedule(slotProps.data) }}</template>
      </pv-column>

      <pv-column :header="t('shows.fields.status')">
        <template #body="slotProps">{{ slotProps.data.getStatusAsString() }}</template>
      </pv-column>

      <pv-column :header="t('shows.actions')">
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