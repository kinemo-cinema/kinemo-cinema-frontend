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

const formatDate = (event, field) => {
  const numbers = event.target.value.replace(/\D/g, '').slice(0, 8);

  let formatted = numbers.slice(0, 4);

  if (numbers.length > 4) {
    formatted += '-' + numbers.slice(4, 6);
  }

  if (numbers.length > 6) {
    formatted += '-' + numbers.slice(6, 8);
  }

  form.value[field] = formatted;
  event.target.value = formatted;
};

const toLocalInput = date => {
  const pad = value => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const toISO = (value, isEnd = false) => {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    throw new Error('Invalid date format');
  }

  const [, year, month, day] = match.map(Number);

  const existing = isEdit.value
      ? schedulingStore.getShowById(route.params.id)
      : null;

  const previous = existing
      ? (isEnd ? existing.getEndTime() : existing.getStartTime()).toDate()
      : null;

  const date = new Date(
      year,
      month - 1,
      day,
      previous ? previous.getHours() : (isEnd ? 16 : 14),
      previous ? previous.getMinutes() : 0,
      previous ? previous.getSeconds() : 0,
      previous ? previous.getMilliseconds() : 0
  );

  if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
  ) {
    throw new Error('Invalid date');
  }

  return date.toISOString();
};

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
      !form.value.startLocal.trim() ||
      !form.value.endLocal.trim()
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

  let startISO;
  let endISO;

  try {
    startISO = toISO(form.value.startLocal);
    endISO = toISO(form.value.endLocal, true);
  } catch {
    conflictMessage.value = isSpanish.value
        ? 'Ingresa fechas válidas con el formato AAAA-MM-DD.'
        : 'Enter valid dates using the YYYY-MM-DD format.';

    return;
  }

  if (new Date(endISO) <= new Date(startISO)) {
    conflictMessage.value = isSpanish.value
        ? 'La fecha de fin no puede ser anterior a la fecha de inicio.'
        : 'The end date cannot be earlier than the start date.';

    return;
  }

  let schedule;

  try {
    schedule = new ShowSchedule(startISO, endISO);
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
            `#${show.getId()} (${toLocalInput(show.getStartTime().toDate())} → ${toLocalInput(show.getEndTime().toDate())})`
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
      assignedProfessionalId: form.value.assignedProfessionalId === ''
          ? null
          : form.value.assignedProfessionalId,
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
            ? 'Configura la película, sala y fechas de la función.'
            : 'Configure the movie, room and dates for the show.' }}
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
          <i class="pi pi-video"/>
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
              {{ isSpanish ? 'Fecha de inicio' : 'Start date' }}
              <span class="sc-required">*</span>
            </label>

            <input
                id="start"
                :value="form.startLocal"
                type="text"
                inputmode="numeric"
                :placeholder="isSpanish ? 'AAAA-MM-DD' : 'YYYY-MM-DD'"
                class="sc-input"
                maxlength="10"
                autocomplete="off"
                :disabled="saving"
                @input="formatDate($event, 'startLocal')"
                required
            />

            <small>
              {{ isSpanish
                ? 'Ejemplo: 2027-07-20'
                : 'Example: 2027-07-20' }}
            </small>

          </div>

          <div class="sc-field">

            <label for="end">
              {{ isSpanish ? 'Fecha de fin' : 'End date' }}
              <span class="sc-required">*</span>
            </label>

            <input
                id="end"
                :value="form.endLocal"
                type="text"
                inputmode="numeric"
                :placeholder="isSpanish ? 'AAAA-MM-DD' : 'YYYY-MM-DD'"
                class="sc-input"
                maxlength="10"
                autocomplete="off"
                :disabled="saving"
                @input="formatDate($event, 'endLocal')"
                required
            />

            <small>
              {{ isSpanish
                ? 'Ejemplo: 2027-07-20'
                : 'Example: 2027-07-20' }}
            </small>

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
                :placeholder="isSpanish
                  ? 'ID del profesional'
                  : 'Professional ID'"
                :disabled="saving"
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
              ? 'El sistema verificará automáticamente la disponibilidad de la sala antes de guardar.'
              : 'The system will automatically check room availability before saving.' }}
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
