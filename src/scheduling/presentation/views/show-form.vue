<script setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {storeToRefs} from "pinia";
import useSchedulingStore from "../../application/scheduling.store.js";
import useCatalogStore from "../../../catalog/application/catalog.store.js";
import {computed, onMounted, ref} from "vue";
import {Show} from "../../domain/model/show.entity.js";
import {ShowSchedule} from "../../domain/model/show-schedule.value-object.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const schedulingStore = useSchedulingStore();
const catalogStore = useCatalogStore();

// Reactive refs from both stores
const { errors, rooms } = storeToRefs(schedulingStore);
const { movies } = storeToRefs(catalogStore);

// Actions
const { addShow, updateShow, fetchShows, fetchRooms, isRoomAvailable, getConflictingShows } = schedulingStore;
const { fetchMovies } = catalogStore;

// Local UI state
const conflictMessage = ref('');

const form = ref({
  movieId: null,
  roomId: null,
  startLocal: '',   // "YYYY-MM-DDTHH:mm"
  endLocal: '',
  assignedProfessionalId: null,
});

const isEdit = computed(() => !!route.params.id);

/**
 * Select options for the movie dropdown. Only schedulable (ACTIVE)
 * movies are offered. Plain objects are used because PrimeVue's option
 * binding cannot reach private entity fields directly.
 */
const movieOptions = computed(() =>
    movies.value
        .filter(m => m.canBeScheduled())
        .map(m => ({ id: m.getId(), title: m.getTitle() }))
);

/**
 * Select options for the room dropdown. Only operationally ready rooms
 * are offered.
 */
const roomOptions = computed(() =>
    rooms.value
        .filter(r => r.isAvailable())
        .map(r => ({ id: r.getId(), name: r.getName() }))
);

onMounted(() => {
  if (!catalogStore.moviesLoaded) fetchMovies();
  if (!schedulingStore.roomsLoaded) fetchRooms();
  if (!schedulingStore.showsLoaded) fetchShows();

  if (isEdit.value) {
    const show = getShowById(route.params.id);
    if (show) {
      form.value.movieId = show.getMovieId();
      form.value.roomId = show.getRoomId();
      form.value.startLocal = toLocalInput(show.getStartTime().toDate());
      form.value.endLocal = toLocalInput(show.getEndTime().toDate());
      form.value.assignedProfessionalId = show.getAssignedProfessionalId();
    } else {
      router.push({ name: 'scheduling-shows' });
    }
  }
});

/**
 * Retrieves a show by its ID.
 * @param {number|string} id - The show ID.
 * @returns {Show|null} The show or null if not found.
 */
function getShowById(id) {
  return schedulingStore.getShowById(id);
}

/**
 * Converts a Date into the "YYYY-MM-DDTHH:mm" format required by
 * native datetime-local inputs, using local time components.
 *
 * @param {Date} date - The date to convert.
 * @returns {string} The local input string.
 */
function toLocalInput(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Converts a datetime-local input value back into an ISO 8601 string
 * suitable for the API, honoring the browser's local timezone.
 *
 * @param {string} localValue - The "YYYY-MM-DDTHH:mm" value.
 * @returns {string} An ISO 8601 string.
 */
function toISO(localValue) {
  return new Date(localValue).toISOString();
}

/**
 * Builds a ShowSchedule from the current form state.
 * @returns {ShowSchedule}
 * @throws {Error} If the window is invalid.
 */
function buildSchedule() {
  return new ShowSchedule(toISO(form.value.startLocal), toISO(form.value.endLocal));
}

/**
 * Saves the show. Runs the client-side conflict check before persisting,
 * and refuses to save when the room is already booked in the requested
 * window.
 */
const saveShow = () => {
  conflictMessage.value = '';

  let schedule;
  try {
    schedule = buildSchedule();
  } catch (_) {
    conflictMessage.value = t('show.invalid-window');
    return;
  }

  const excludeId = isEdit.value ? route.params.id : null;
  if (!isRoomAvailable(form.value.roomId, schedule, excludeId)) {
    const conflicting = getConflictingShows(form.value.roomId, schedule, excludeId);
    const names = conflicting
        .map(s => `#${s.getId()} (${s.getStartTimeAsISO()} → ${s.getEndTimeAsISO()})`)
        .join(', ');
    conflictMessage.value = t('show.room-conflict', { conflicts: names });
    return;
  }

  const existing = isEdit.value ? getShowById(route.params.id) : null;

  const show = new Show({
    id: existing ? existing.getId() : null,
    movieId: form.value.movieId,
    roomId: form.value.roomId,
    assignedProfessionalId: form.value.assignedProfessionalId,
    schedule: schedule,
    status: existing ? existing.getStatusAsString() : 'SCHEDULED',
    cancellationReason: existing ? existing.getCancellationReason() : null,
    createdAt: existing ? existing.getCreatedAtFormated() : null,
    updatedAt: null,
  });

  if (isEdit.value) updateShow(show); else addShow(show);
  navigateBack();
};

/**
 * Navigates back to the shows list.
 */
const navigateBack = () => {
  router.push({ name: 'scheduling-shows' });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('show.edit-title') : t('show.new-title') }}</h1>

    <form @submit.prevent="saveShow">
      <div class="field mb-3">
        <label for="movie">{{ t('show.movie') }}</label>
        <pv-select
            id="movie"
            v-model="form.movieId"
            :options="movieOptions"
            optionLabel="title"
            optionValue="id"
            :placeholder="t('show.select-movie')"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="room">{{ t('show.room') }}</label>
        <pv-select
            id="room"
            v-model="form.roomId"
            :options="roomOptions"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('show.select-room')"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="start">{{ t('show.start-time') }}</label>
        <pv-input-text
            id="start"
            v-model="form.startLocal"
            type="datetime-local"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="end">{{ t('show.end-time') }}</label>
        <pv-input-text
            id="end"
            v-model="form.endLocal"
            type="datetime-local"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="professional">{{ t('show.assigned-professional') }}</label>
        <pv-input-number
            id="professional"
            v-model="form.assignedProfessionalId"
            class="w-full"
            :min="0"
            showButtons/>
      </div>

      <pv-button type="submit" :label="t('show.save')" icon="pi pi-save"/>
      <pv-button :label="t('show.cancel')" severity="secondary" class="ml-2" @click="navigateBack"/>
    </form>

    <div v-if="conflictMessage" class="text-orange-500 mt-3">
      {{ conflictMessage }}
    </div>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>