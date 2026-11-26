
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import useSchedulingStore from '../../application/scheduling.store.js';
import useCatalogStore from '../../../catalog/application/catalog.store.js';
import { Show } from '../../domain/model/show.entity.js';
import { ShowSchedule } from '../../domain/model/show-schedule.value-object.js';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const schedulingStore = useSchedulingStore();
const catalogStore = useCatalogStore();

const { errors, rooms } = storeToRefs(schedulingStore);
const { movies, errors: catalogErrors } = storeToRefs(catalogStore);

const isSpanish = computed(() => locale.value.startsWith('es'));
const isEdit = computed(() => Boolean(route.params.id));

const loading = ref(true);
const saving = ref(false);
const conflictMessage = ref('');

const allErrors = computed(() => [
  ...errors.value,
  ...catalogErrors.value
]);

const form = ref({
  movieId: null,
  roomId: null,
  startLocal: '',
  endLocal: '',
  assignedProfessionalId: null
});

const movieOptions = computed(() =>
    movies.value
        .filter(movie => movie.canBeScheduled())
        .map(movie => ({
          id: movie.getId(),
          title: movie.getTitle()
        }))
);

const roomOptions = computed(() =>
    rooms.value
        .filter(room => room.isAvailable())
        .map(room => ({
          id: room.getId(),
          name: room.getName()
        }))
);

const navigateBack = () => {
  router.push({ name: 'scheduling-shows' });
};

const toLocalInput = date => {
  const pad = value => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toISO = value => new Date(value).toISOString();

const load = async () => {
  loading.value = true;

  try {
    await Promise.all([
      catalogStore.fetchMovies(),
      schedulingStore.fetchRooms(),
      schedulingStore.fetchShows()
    ]);

    if (isEdit.value) {
      const show = schedulingStore.getShowById(route.params.id);

      if (show) {
        form.value.movieId = show.getMovieId();
        form.value.roomId = show.getRoomId();
        form.value.startLocal = toLocalInput(show.getStartTime().toDate());
        form.value.endLocal = toLocalInput(show.getEndTime().toDate());
        form.value.assignedProfessionalId = show.getAssignedProfessionalId();
      } else if (!allErrors.value.length) {
        navigateBack();
      }
    }
  } finally {
    loading.value = false;
  }
};

const saveShow = async () => {
  if (saving.value || loading.value) return;

  conflictMessage.value = '';

  if (
      form.value.movieId === null ||
      form.value.roomId === null ||
      !form.value.startLocal ||
      !form.value.endLocal
  ) {
    conflictMessage.value = isSpanish.value
        ? 'Completa todos los campos obligatorios.'
        : 'Complete all required fields.';
    return;
  }

  if (
      !movieOptions.value.some(movie =>
          String(movie.id) === String(form.value.movieId)
      ) ||
      !roomOptions.value.some(room =>
          String(room.id) === String(form.value.roomId)
      )
  ) {
    conflictMessage.value = isSpanish.value
        ? 'Selecciona una película activa y una sala disponible.'
        : 'Select an active movie and an available room.';
    return;
  }

  let schedule;

  try {
    schedule = new ShowSchedule(
        toISO(form.value.startLocal),
        toISO(form.value.endLocal)
    );
  } catch {
    conflictMessage.value = t('show.invalid-window');
    return;
  }

  const excludeId = isEdit.value ? route.params.id : null;

  if (!schedulingStore.isRoomAvailable(
      form.value.roomId,
      schedule,
      excludeId
  )) {
    const conflicting = schedulingStore.getConflictingShows(
        form.value.roomId,
        schedule,
        excludeId
    );

    const names = conflicting
        .map(show =>
            `#${show.getId()} (${show.getStartTimeAsISO()} → ${show.getEndTimeAsISO()})`
        )
        .join(', ');

    conflictMessage.value = t('show.room-conflict', {
      conflicts: names
    });

    return;
  }

  const existing = isEdit.value
      ? schedulingStore.getShowById(route.params.id)
      : null;

  if (isEdit.value && !existing) {
    conflictMessage.value = isSpanish.value
        ? 'No se encontró la función.'
        : 'Show not found.';
    return;
  }

  saving.value = true;

  try {
    const show = new Show({
      id: existing ? existing.getId() : null,
      movieId: form.value.movieId,
      roomId: form.value.roomId,
      assignedProfessionalId: form.value.assignedProfessionalId,
      schedule,
      status: existing ? existing.getStatusAsString() : 'SCHEDULED',
      cancellationReason: existing ? existing.getCancellationReason() : null,
      createdAt: existing ? existing.getCreatedAtFormated() : null,
      updatedAt: null
    });

    if (isEdit.value) {
      await schedulingStore.updateShow(show);
    } else {
      await schedulingStore.addShow(show);
    }

    navigateBack();
  } catch {
    if (!allErrors.value.length) {
      conflictMessage.value = isSpanish.value
          ? 'No se pudo guardar la función.'
          : 'The show could not be saved.';
    }
  } finally {
    saving.value = false;
  }
};

onMounted(load);
</script>

<template>
  <section class="sc-page">

    <button
        type="button"
        class="sc-back"
        :disabled="saving"
        @click="navigateBack"
    >
      <i class="pi pi-arrow-left"/>

      {{ isSpanish ? 'Volver a funciones' : 'Back to shows' }}
    </button>

    <header class="sc-header">

      <div class="sc-header-content">

        <h2>
          {{ isEdit ? t('show.edit-title') : t('show.new-title') }}
        </h2>

        <p>
          {{ isSpanish
            ? 'Configura la película, sala y horario de la función.'
            : 'Configure the movie, room and schedule for the show.' }}
        </p>

      </div>

    </header>

    <div v-if="loading" class="sc-card sc-loading">
      <i class="pi pi-spin pi-spinner"/>

      {{ isSpanish ? 'Cargando información...' : 'Loading information...' }}
    </div>

    <form
        v-else
        class="sc-card sc-form-card"
        @submit.prevent="saveShow"
    >

      <div class="sc-card-header">

        <div class="sc-icon">
          <i class="pi pi-calendar-plus"/>
        </div>

        <div>

          <h3>
            {{ isSpanish ? 'Información de la función' : 'Show information' }}
          </h3>

          <p>
            {{ isSpanish
              ? 'Completa los campos requeridos.'
              : 'Complete the required fields.' }}
          </p>

        </div>

      </div>

      <div class="sc-form-body">

        <div class="sc-form-grid">

          <div class="sc-field">

            <label for="movie">
              {{ t('show.movie') }}
              <span class="sc-required">*</span>
            </label>

            <pv-select
                input-id="movie"
                v-model="form.movieId"
                :options="movieOptions"
                optionLabel="title"
                optionValue="id"
                :placeholder="t('show.select-movie')"
                :disabled="saving || !movieOptions.length"
                class="sc-select"
                filter
                required
            >

              <template #value="{ value, placeholder }">

                <span v-if="value !== null && value !== undefined">
                  {{ movieOptions.find(movie =>
                    String(movie.id) === String(value)
                )?.title || placeholder }}
                </span>

                <span v-else>{{ placeholder }}</span>

              </template>

            </pv-select>

            <small>
              {{ isSpanish
                ? 'Solo películas activas.'
                : 'Only active movies.' }}
            </small>

          </div>

          <div class="sc-field">

            <label for="room">
              {{ t('show.room') }}
              <span class="sc-required">*</span>
            </label>

            <pv-select
                input-id="room"
                v-model="form.roomId"
                :options="roomOptions"
                optionLabel="name"
                optionValue="id"
                :placeholder="t('show.select-room')"
                :disabled="saving || !roomOptions.length"
                class="sc-select"
                filter
                required
            >

              <template #value="{ value, placeholder }">

                <span v-if="value !== null && value !== undefined">
                  {{ roomOptions.find(room =>
                    String(room.id) === String(value)
                )?.name || placeholder }}
                </span>

                <span v-else>{{ placeholder }}</span>

              </template>

            </pv-select>

            <small>
              {{ isSpanish
                ? 'Solo salas operativamente disponibles.'
                : 'Only operationally available rooms.' }}
            </small>

          </div>

          <div class="sc-field">

            <label for="start">
              {{ t('show.start-time') }}
              <span class="sc-required">*</span>
            </label>

            <input
                id="start"
                v-model="form.startLocal"
                type="datetime-local"
                class="sc-input"
                :disabled="saving"
                required
            />

          </div>

          <div class="sc-field">

            <label for="end">
              {{ t('show.end-time') }}
              <span class="sc-required">*</span>
            </label>

            <input
                id="end"
                v-model="form.endLocal"
                type="datetime-local"
                class="sc-input"
                :min="form.startLocal || undefined"
                :disabled="saving"
                required
            />

          </div>

          <div class="sc-field">

            <label for="professional">
              {{ t('show.assigned-professional') }}
            </label>

            <input
                id="professional"
                v-model.number="form.assignedProfessionalId"
                type="number"
                min="0"
                step="1"
                class="sc-input"
                :placeholder="isSpanish ? 'ID del profesional' : 'Professional ID'"
                :disabled="saving"
                @input="form.assignedProfessionalId = form.assignedProfessionalId === '' ? null : form.assignedProfessionalId"
            />

            <small>
              {{ isSpanish ? 'Campo opcional.' : 'Optional field.' }}
            </small>

          </div>

        </div>

        <div class="sc-message">

          <i class="pi pi-info-circle"/>

          <span>
            {{ isSpanish
              ? 'El sistema verificará la disponibilidad de la sala y los conflictos de horario antes de guardar.'
              : 'The system will check room availability and scheduling conflicts before saving.' }}
          </span>

        </div>

        <div
            v-if="!movieOptions.length || !roomOptions.length"
            class="sc-message sc-message-warning"
        >

          <i class="pi pi-exclamation-triangle"/>

          <span>
            {{ isSpanish
              ? 'Necesitas al menos una película activa y una sala disponible para programar una función.'
              : 'At least one active movie and one available room are required to schedule a show.' }}
          </span>

        </div>

        <div
            v-if="conflictMessage"
            class="sc-message sc-message-warning"
            role="alert"
        >
          <i class="pi pi-exclamation-triangle"/>
          {{ conflictMessage }}
        </div>

        <div
            v-if="allErrors.length"
            class="sc-message sc-message-error"
            role="alert"
        >

          <i class="pi pi-exclamation-circle"/>

          <span>
            {{ t('errors.occurred') }}:
            {{ allErrors.map(error => error.message).join(', ') }}
          </span>

        </div>

      </div>

      <footer class="sc-footer">

        <span>
          <span class="sc-required">*</span>
          {{ isSpanish ? 'Campos obligatorios' : 'Required fields' }}
        </span>

        <div class="sc-form-actions">

          <pv-button
              type="button"
              :label="t('show.cancel')"
              class="sc-button sc-secondary"
              :disabled="saving"
              outlined
              @click="navigateBack"
          />

          <pv-button
              type="submit"
              :label="t('show.save')"
              icon="pi pi-check"
              class="sc-button sc-primary"
              :loading="saving"
              :disabled="saving || !movieOptions.length || !roomOptions.length"
          />

        </div>

      </footer>

    </form>

  </section>
</template>
