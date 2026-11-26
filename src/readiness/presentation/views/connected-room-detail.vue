<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';

const route = useRoute();
const { locale } = useI18n();
const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));

const room = ref(null);
const observations = ref('');
const validationError = ref('');

const block = ref({
  reason: '',
  start: '',
  end: ''
});

const canRelease = computed(() =>
    String(room.value?.status).toUpperCase() === 'MAINTENANCE'
);

const load = () => run(async http => {
  room.value = (await http.get(`/rooms/${route.params.id}`)).data;
});

const prepare = async () => {
  validationError.value = '';

  if (!observations.value.trim()) {
    validationError.value = isSpanish.value
        ? 'Ingresa las observaciones.'
        : 'Enter the observations.';

    return;
  }

  const success = await run(async http => {
    room.value = (await http.post(
        `/rooms/${route.params.id}/preparation`,
        { observations: observations.value.trim() }
    )).data;
  });

  if (success) {
    observations.value = '';
  }
};

const release = () => {
  validationError.value = '';

  return run(async http => {
    room.value = (await http.post(
        `/rooms/${route.params.id}/release`
    )).data;
  });
};

const formatDate = (value, field) => {
  const numbers = value.replace(/\D/g, '').slice(0, 8);

  let formatted = numbers.slice(0, 4);

  if (numbers.length > 4) {
    formatted += '-' + numbers.slice(4, 6);
  }

  if (numbers.length > 6) {
    formatted += '-' + numbers.slice(6, 8);
  }

  block.value[field] = formatted;
};

const toISO = (value, isEnd = false) => {
  const match = value.trim().match(
      /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) {
    throw new Error('Invalid date format');
  }

  const [, year, month, day] = match.map(Number);

  const date = new Date(
      year,
      month - 1,
      day,
      isEnd ? 23 : 0,
      isEnd ? 59 : 0,
      isEnd ? 59 : 0
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

const blockRoom = async () => {
  validationError.value = '';

  if (!block.value.reason.trim()) {
    validationError.value = isSpanish.value
        ? 'Ingresa el motivo del bloqueo.'
        : 'Enter the reason for blocking the room.';

    return;
  }

  let startDateTime;
  let endDateTime;

  try {
    startDateTime = toISO(block.value.start);
    endDateTime = toISO(block.value.end, true);
  } catch {
    validationError.value = isSpanish.value
        ? 'Ingresa fechas válidas con el formato AAAA-MM-DD.'
        : 'Enter valid dates using the YYYY-MM-DD format.';

    return;
  }

  if (new Date(endDateTime) <= new Date(startDateTime)) {
    validationError.value = isSpanish.value
        ? 'La fecha de fin no puede ser anterior a la fecha de inicio.'
        : 'The end date cannot be earlier than the start date.';

    return;
  }

  const success = await run(async http => {
    room.value = (await http.post(
        `/rooms/${route.params.id}/blocking`,
        {
          reason: block.value.reason.trim(),
          startDateTime,
          endDateTime
        }
    )).data;
  });

  if (success) {
    block.value = {
      reason: '',
      start: '',
      end: ''
    };
  }
};

const statusClass = value => {
  const normalized = String(value).toUpperCase();

  if (['AVAILABLE', 'READY'].includes(normalized)) {
    return 'rd-status-success';
  }

  if (['PREPARING', 'MAINTENANCE'].includes(normalized)) {
    return 'rd-status-warning';
  }

  if (normalized === 'BLOCKED') {
    return 'rd-status-danger';
  }

  return '';
};

onMounted(load);
watch(() => route.params.id, load);
</script>

<template>
  <section class="rd-page">

    <router-link
        :to="{ name: 'readiness-rooms' }"
        class="rd-back"
    >
      <i class="pi pi-arrow-left"/>
      {{ isSpanish ? 'Volver a salas' : 'Back to rooms' }}
    </router-link>

    <header class="rd-header">

      <div class="rd-grow">

        <h2>
          {{ room?.name || (isSpanish ? 'Detalles de sala' : 'Room details') }}
        </h2>

        <p>
          {{ isSpanish
            ? 'Administra la preparación y disponibilidad de la sala.'
            : 'Manage room preparation and operational availability.' }}
        </p>

      </div>

      <button
          type="button"
          class="rd-button rd-secondary"
          :disabled="busy"
          @click="load"
      >
        <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"/>
        {{ isSpanish ? 'Actualizar' : 'Refresh' }}
      </button>

    </header>

    <div
        v-if="error || validationError"
        class="rd-message rd-message-error"
        role="alert"
    >
      <i class="pi pi-exclamation-circle"/>
      {{ validationError || error }}
    </div>

    <div v-if="busy && !room" class="rd-card rd-empty">
      <i class="pi pi-spin pi-spinner"/>
      {{ isSpanish ? 'Cargando información...' : 'Loading information...' }}
    </div>

    <template v-if="room">

      <div class="rd-card">

        <div class="rd-card-header">

          <div class="rd-icon">
            <i class="pi pi-home"/>
          </div>

          <div class="rd-grow">

            <h3>
              {{ isSpanish ? 'Información de la sala' : 'Room information' }}
            </h3>

            <p>
              ID: #{{ room.id }}
              ·
              {{ room.capacity }}
              {{ isSpanish ? 'asientos' : 'seats' }}
            </p>

          </div>

          <span
              class="rd-status"
              :class="statusClass(room.status)"
          >
            {{ room.status }}
          </span>

        </div>

        <div class="rd-card-body rd-records">
          <BackendRecords :value="room"/>
        </div>

      </div>

      <div class="rd-detail-grid">

        <form class="rd-card" @submit.prevent="prepare">

          <div class="rd-card-header">

            <div class="rd-icon">
              <i class="pi pi-check-circle"/>
            </div>

            <div>

              <h3>
                {{ isSpanish
                  ? 'Preparación e inspección'
                  : 'Preparation and inspection' }}
              </h3>

              <p>
                {{ isSpanish
                  ? 'Registra las condiciones de la sala.'
                  : 'Register the room conditions.' }}
              </p>

            </div>

          </div>

          <div class="rd-card-body">

            <div class="rd-field">

              <label for="observations">
                {{ isSpanish ? 'Observaciones' : 'Observations' }}
                <span class="rd-required">*</span>
              </label>

              <textarea
                  id="observations"
                  v-model="observations"
                  class="rd-input"
                  :placeholder="isSpanish
                    ? 'Describe las condiciones de la sala...'
                    : 'Describe the room conditions...'"
                  :disabled="busy"
                  required
              />

            </div>

          </div>

          <footer class="rd-footer">

            <span>
              {{ isSpanish
                ? 'Inspección operativa'
                : 'Operational inspection' }}
            </span>

            <button
                type="submit"
                class="rd-button rd-primary"
                :disabled="busy"
            >
              <i class="pi pi-check"/>
              {{ isSpanish
                ? 'Registrar preparación'
                : 'Register preparation' }}
            </button>

          </footer>

        </form>

        <form class="rd-card" @submit.prevent="blockRoom">

          <div class="rd-card-header">

            <div class="rd-icon">
              <i class="pi pi-wrench"/>
            </div>

            <div>

              <h3>
                {{ isSpanish
                  ? 'Bloqueo por mantenimiento'
                  : 'Maintenance blocking' }}
              </h3>

              <p>
                {{ isSpanish
                  ? 'Restringe temporalmente el uso de la sala.'
                  : 'Temporarily restrict room availability.' }}
              </p>

            </div>

          </div>

          <div class="rd-card-body rd-form-grid">

            <div class="rd-field rd-full">

              <label for="reason">
                {{ isSpanish ? 'Motivo' : 'Reason' }}
                <span class="rd-required">*</span>
              </label>

              <input
                  id="reason"
                  v-model="block.reason"
                  class="rd-input"
                  :placeholder="isSpanish
                    ? 'Motivo del mantenimiento'
                    : 'Maintenance reason'"
                  :disabled="busy"
                  required
              />

            </div>

            <div class="rd-field">

              <label for="block-start">
                {{ isSpanish ? 'Fecha de inicio' : 'Start date' }}
                <span class="rd-required">*</span>
              </label>

              <input
                  id="block-start"
                  :value="block.start"
                  type="text"
                  inputmode="numeric"
                  class="rd-input"
                  :placeholder="isSpanish ? 'AAAA-MM-DD' : 'YYYY-MM-DD'"
                  maxlength="10"
                  autocomplete="off"
                  :disabled="busy"
                  @input="formatDate($event.target.value, 'start'); $event.target.value = block.start"
                  required
              />

            </div>

            <div class="rd-field">

              <label for="block-end">
                {{ isSpanish ? 'Fecha de fin' : 'End date' }}
                <span class="rd-required">*</span>
              </label>

              <input
                  id="block-end"
                  :value="block.end"
                  type="text"
                  inputmode="numeric"
                  class="rd-input"
                  :placeholder="isSpanish ? 'AAAA-MM-DD' : 'YYYY-MM-DD'"
                  maxlength="10"
                  autocomplete="off"
                  :disabled="busy"
                  @input="formatDate($event.target.value, 'end'); $event.target.value = block.end"
                  required
              />

            </div>

          </div>

          <footer class="rd-footer">

            <span>
              {{ isSpanish ? 'Bloqueo temporal' : 'Temporary blocking' }}
            </span>

            <button
                type="submit"
                class="rd-button rd-danger"
                :disabled="busy"
            >
              <i class="pi pi-lock"/>
              {{ isSpanish ? 'Bloquear sala' : 'Block room' }}
            </button>

          </footer>

        </form>

      </div>

      <div class="rd-card">

        <div class="rd-card-header">

          <div class="rd-icon">
            <i class="pi pi-unlock"/>
          </div>

          <div class="rd-grow">

            <h3>
              {{ isSpanish ? 'Liberar sala' : 'Release room' }}
            </h3>

            <p>
              {{ isSpanish
                ? 'Disponible cuando la sala se encuentra en mantenimiento.'
                : 'Available when the room is under maintenance.' }}
            </p>

          </div>

          <button
              type="button"
              class="rd-button rd-primary"
              :disabled="busy || !canRelease"
              @click="release"
          >
            <i class="pi pi-unlock"/>
            {{ isSpanish ? 'Liberar sala' : 'Release room' }}
          </button>

        </div>

      </div>

    </template>

  </section>
</template>
