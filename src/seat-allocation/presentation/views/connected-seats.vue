
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBackend } from '../../../shared/application/use-backend.js';

const { locale } = useI18n();
const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));

const shows = ref([]);
const rooms = ref([]);
const showId = ref(null);
const allocation = ref(null);
const seatNumber = ref(null);
const status = ref('Sold');
const reason = ref('');
const message = ref('');
const validationError = ref('');
const canInitialize = ref(false);

const selectedShow = computed(() =>
    shows.value.find(show =>
        String(show.id) === String(showId.value)
    )
);

const selectedRoom = computed(() =>
    rooms.value.find(room =>
        String(room.id) === String(selectedShow.value?.roomId)
    )
);

const roomCapacity = computed(() =>
    Number(selectedRoom.value?.capacity ?? 0)
);

const seats = computed(() =>
    allocation.value?.showSeats ?? []
);

const selectedSeat = computed(() =>
    seats.value.find(seat =>
        String(seat.seatNumber) === String(seatNumber.value)
    )
);

const normalizeStatus = value =>
    String(value ?? '').replace(/[\s_-]/g, '').toUpperCase();

const enabledSeats = computed(() =>
    seats.value.filter(seat =>
        normalizeStatus(seat.status) === 'ENABLED'
    ).length
);

const soldSeats = computed(() =>
    seats.value.filter(seat =>
        normalizeStatus(seat.status) === 'SOLD'
    ).length
);

const disabledSeats = computed(() =>
    seats.value.filter(seat =>
        ['DISABLED', 'OUTOFSERVICE']
            .includes(normalizeStatus(seat.status))
    ).length
);

const statusOptions = computed(() => [
  {
    value: 'Sold',
    label: isSpanish.value ? 'Vendido' : 'Sold'
  },
  {
    value: 'Enabled',
    label: isSpanish.value ? 'Habilitado' : 'Enabled'
  },
  {
    value: 'Disabled',
    label: isSpanish.value ? 'Deshabilitado' : 'Disabled'
  }
]);

const formatDate = value => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString(
      isSpanish.value ? 'es-PE' : 'en-US',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
  );
};

const roomName = id =>
    rooms.value.find(room =>
        String(room.id) === String(id)
    )?.name ?? `#${id}`;

const resetSelection = () => {
  allocation.value = null;
  seatNumber.value = null;
  reason.value = '';
  message.value = '';
  validationError.value = '';
  canInitialize.value = false;
};

const load = () => run(async http => {
  const [showsResponse, roomsResponse] = await Promise.all([
    http.get('/shows'),
    http.get('/rooms')
  ]);

  shows.value = (
      showsResponse.data.value ?? showsResponse.data
  ).filter(show =>
      normalizeStatus(show.status) === 'SCHEDULED'
  );
  rooms.value = roomsResponse.data.value ?? roomsResponse.data;

  if (
      showId.value &&
      !shows.value.some(show =>
          String(show.id) === String(showId.value)
      )
  ) {
    showId.value = null;
    resetSelection();
  }
});

const lookup = async () => {
  if (!showId.value) return;

  resetSelection();

  await run(async http => {
    try {
      allocation.value = (
          await http.get(`/seat-allocations/${showId.value}`)
      ).data;
    } catch (failure) {
      if (failure.response?.status === 404) {
        canInitialize.value = true;

        message.value = isSpanish.value
            ? 'Esta función todavía no tiene un mapa de asientos.'
            : 'This show does not have a seat map yet.';
      } else {
        throw failure;
      }
    }
  });
};

const initialize = async () => {
  validationError.value = '';

  if (
      !showId.value ||
      !Number.isInteger(roomCapacity.value) ||
      roomCapacity.value < 1
  ) {
    validationError.value = isSpanish.value
        ? 'La sala no tiene una capacidad válida.'
        : 'The room does not have a valid capacity.';

    return;
  }

  const success = await run(async http => {
    allocation.value = (
        await http.post('/seat-allocations', {
          showId: showId.value,
          totalSeats: roomCapacity.value
        })
    ).data;
  });

  if (success) {
    canInitialize.value = false;

    message.value = isSpanish.value
        ? 'Mapa de asientos creado correctamente.'
        : 'Seat map created successfully.';
  }
};

const selectSeat = seat => {
  if (!seat) return;

  seatNumber.value = seat.seatNumber;

  const normalized = normalizeStatus(seat.status);

  if (normalized === 'ENABLED') {
    status.value = 'Enabled';
  } else if (normalized === 'SOLD') {
    status.value = 'Sold';
  } else {
    status.value = 'Disabled';
  }

  validationError.value = '';
  message.value = '';
};

const assign = async () => {
  validationError.value = '';
  message.value = '';

  if (!allocation.value || !selectedSeat.value) {
    validationError.value = isSpanish.value
        ? 'Selecciona un asiento.'
        : 'Select a seat.';

    return;
  }

  const success = await run(async http => {
    allocation.value = (
        await http.patch(
            `/seat-allocations/${allocation.value.showId}/seats/${seatNumber.value}`,
            {
              newStatus: status.value
            }
        )
    ).data;
  });

  if (success) {
    message.value = isSpanish.value
        ? 'Estado del asiento actualizado correctamente.'
        : 'Seat status updated successfully.';
  }
};

const disable = async () => {
  validationError.value = '';
  message.value = '';

  if (!allocation.value || !selectedSeat.value) {
    validationError.value = isSpanish.value
        ? 'Selecciona un asiento.'
        : 'Select a seat.';

    return;
  }

  if (!reason.value.trim()) {
    validationError.value = isSpanish.value
        ? 'Ingresa el motivo.'
        : 'Enter a reason.';

    return;
  }

  const success = await run(async http => {
    allocation.value = (
        await http.post(
            `/seat-allocations/${allocation.value.showId}/seats/${seatNumber.value}/out-of-service`,
            {
              reason: reason.value.trim()
            }
        )
    ).data;
  });

  if (success) {
    reason.value = '';
    status.value = 'Disabled';

    message.value = isSpanish.value
        ? 'Asiento marcado fuera de servicio.'
        : 'Seat marked as out of service.';
  }
};

const seatClass = value => {
  const normalized = normalizeStatus(value);

  if (normalized === 'ENABLED') {
    return 'sa-seat-enabled';
  }

  if (normalized === 'SOLD') {
    return 'sa-seat-sold';
  }

  if (['DISABLED', 'OUTOFSERVICE'].includes(normalized)) {
    return 'sa-seat-disabled';
  }

  return '';
};

const seatIcon = value => {
  const normalized = normalizeStatus(value);

  if (normalized === 'SOLD') {
    return 'pi pi-user';
  }

  if (['DISABLED', 'OUTOFSERVICE'].includes(normalized)) {
    return 'pi pi-ban';
  }

  return 'pi pi-stop';
};

onMounted(load);
</script>

<template>
  <section class="sa-page">

    <header class="sa-header">

      <div class="sa-grow">

        <h2>
          {{ isSpanish ? 'Gestión de asientos' : 'Seat Management' }}
        </h2>

        <p>
          {{ isSpanish
            ? 'Selecciona una función para administrar sus asientos.'
            : 'Select a show to manage its seats.' }}
        </p>

      </div>

      <button
          type="button"
          class="sa-button sa-secondary"
          :disabled="busy"
          @click="load"
      >
        <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"/>
        {{ isSpanish ? 'Actualizar funciones' : 'Refresh shows' }}
      </button>

    </header>

    <div
        v-if="error || validationError"
        class="sa-message sa-message-error"
        role="alert"
    >
      <i class="pi pi-exclamation-circle"/>
      {{ validationError || error }}
    </div>

    <div
        v-if="message && !error && !validationError"
        class="sa-message"
        :class="{ 'sa-message-warning': canInitialize }"
        role="status"
    >
      <i :class="canInitialize ? 'pi pi-info-circle' : 'pi pi-check-circle'"/>
      {{ message }}
    </div>

    <div class="sa-card">

      <div class="sa-card-header">

        <div class="sa-icon">
          <i class="pi pi-calendar"/>
        </div>

        <div class="sa-grow">

          <h3>
            {{ isSpanish ? 'Seleccionar función' : 'Select Show' }}
          </h3>

          <p>
            {{ isSpanish
              ? 'Consulta las funciones registradas en el sistema.'
              : 'Browse the shows registered in the system.' }}
          </p>

        </div>

      </div>

      <div class="sa-card-body">

        <form
            class="sa-inline-form"
            @submit.prevent="lookup"
        >

          <div class="sa-field">

            <label for="show-id">
              {{ isSpanish ? 'Función' : 'Show' }}
              <span class="sa-required">*</span>
            </label>

            <select
                id="show-id"
                v-model="showId"
                class="sa-input"
                :disabled="busy || !shows.length"
                @change="resetSelection"
                required
            >

              <option :value="null" disabled>
                {{ isSpanish ? 'Selecciona una función' : 'Select a show' }}
              </option>

              <option
                  v-for="show in shows"
                  :key="show.id"
                  :value="show.id"
              >
                #{{ show.id }} · {{ roomName(show.roomId) }} · {{ formatDate(show.startDateTime) }}
              </option>

            </select>

          </div>

          <button
              type="submit"
              class="sa-button sa-primary"
              :disabled="busy || !showId"
          >
            <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-search'"/>
            {{ isSpanish ? 'Ver mapa de asientos' : 'View Seat Map' }}
          </button>

        </form>

        <div
            v-if="selectedRoom"
            class="sa-room-information"
        >

          <div class="sa-room-item">

            <i class="pi pi-building"/>

            <div>
              <span>{{ isSpanish ? 'Sala' : 'Room' }}</span>
              <strong>{{ selectedRoom.name }}</strong>
            </div>

          </div>

          <div class="sa-room-item">

            <i class="pi pi-users"/>

            <div>
              <span>{{ isSpanish ? 'Capacidad máxima' : 'Maximum capacity' }}</span>
              <strong>
                {{ roomCapacity }}
                {{ isSpanish ? 'asientos' : 'seats' }}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>

    <div
        v-if="busy && !shows.length"
        class="sa-card sa-empty"
    >
      <i class="pi pi-spin pi-spinner"/>
      {{ isSpanish ? 'Cargando funciones...' : 'Loading shows...' }}
    </div>

    <div
        v-else-if="!shows.length && !error"
        class="sa-card sa-empty"
    >

      <div class="sa-icon">
        <i class="pi pi-calendar"/>
      </div>

      <h3>
        {{ isSpanish ? 'No hay funciones disponibles' : 'No shows available' }}
      </h3>

      <p>
        {{ isSpanish
          ? 'Registra una función para comenzar a gestionar sus asientos.'
          : 'Register a show to start managing its seats.' }}
      </p>

      <router-link
          to="/scheduling"
          class="sa-button sa-primary"
      >
        <i class="pi pi-calendar-plus"/>
        {{ isSpanish ? 'Ir a programación' : 'Go to Scheduling' }}
      </router-link>

    </div>

    <div
        v-else-if="!allocation && !canInitialize && !busy && !error"
        class="sa-card sa-empty"
    >

      <div class="sa-icon">
        <i class="pi pi-th-large"/>
      </div>

      <h3>
        {{ isSpanish ? 'Mapa de asientos' : 'Seat Map' }}
      </h3>

      <p>
        {{ isSpanish
          ? 'Selecciona una función para visualizar sus asientos.'
          : 'Select a show to display its seats.' }}
      </p>

    </div>

    <form
        v-if="showId && canInitialize && !allocation"
        class="sa-card"
        @submit.prevent="initialize"
    >

      <div class="sa-card-header">

        <div class="sa-icon">
          <i class="pi pi-plus"/>
        </div>

        <div class="sa-grow">

          <h3>
            {{ isSpanish ? 'Crear mapa de asientos' : 'Create Seat Map' }}
          </h3>

          <p>
            {{ isSpanish
              ? 'Genera los asientos según la capacidad de la sala.'
              : 'Generate seats based on the room capacity.' }}
          </p>

        </div>

      </div>

      <div class="sa-card-body">

        <div class="sa-form-grid">

          <div class="sa-field">

            <label>
              {{ isSpanish ? 'Sala seleccionada' : 'Selected room' }}
            </label>

            <input
                :value="selectedRoom?.name ?? '—'"
                class="sa-input"
                readonly
            />

          </div>

          <div class="sa-field">

            <label for="total-seats">
              {{ isSpanish ? 'Total de asientos' : 'Total seats' }}
            </label>

            <input
                id="total-seats"
                :value="roomCapacity"
                type="number"
                class="sa-input"
                readonly
            />

          </div>

        </div>

        <div class="sa-message sa-space-top">

          <i class="pi pi-info-circle"/>

          <span>
            {{ isSpanish
              ? 'Podrás habilitar, vender o deshabilitar individualmente los asientos después de crear el mapa.'
              : 'You can enable, sell or disable individual seats after creating the map.' }}
          </span>

        </div>

      </div>

      <footer class="sa-footer">

        <span>
          {{ roomCapacity }}
          {{ isSpanish ? 'asientos físicos' : 'physical seats' }}
        </span>

        <button
            type="submit"
            class="sa-button sa-primary"
            :disabled="busy || roomCapacity < 1"
        >
          <i class="pi pi-plus"/>
          {{ isSpanish ? 'Crear mapa' : 'Create Seat Map' }}
        </button>

      </footer>

    </form>

    <template v-if="allocation">

      <div
          v-if="roomCapacity > 0 && seats.length !== roomCapacity"
          class="sa-message sa-message-warning"
      >

        <i class="pi pi-exclamation-triangle"/>

        <span>
          {{ isSpanish
            ? `La sala tiene capacidad para ${roomCapacity} asientos, pero esta función tiene ${seats.length} asientos registrados.`
            : `The room has a capacity of ${roomCapacity} seats, but this show has ${seats.length} registered seats.` }}
        </span>

      </div>

      <div class="sa-stats">

        <div class="sa-stat">

          <div class="sa-stat-label">
            <i class="pi pi-th-large"/>
            {{ isSpanish ? 'Total de asientos' : 'Total Seats' }}
          </div>

          <strong>{{ seats.length }}</strong>

        </div>

        <div class="sa-stat">

          <div class="sa-stat-label">
            <i class="pi pi-check-circle sa-text-enabled"/>
            {{ isSpanish ? 'Habilitados' : 'Enabled' }}
          </div>

          <strong class="sa-text-enabled">
            {{ enabledSeats }}
          </strong>

        </div>

        <div class="sa-stat">

          <div class="sa-stat-label">
            <i class="pi pi-user sa-text-sold"/>
            {{ isSpanish ? 'Vendidos' : 'Sold' }}
          </div>

          <strong class="sa-text-sold">
            {{ soldSeats }}
          </strong>

        </div>

        <div class="sa-stat">

          <div class="sa-stat-label">
            <i class="pi pi-ban sa-text-disabled"/>
            {{ isSpanish ? 'Deshabilitados' : 'Disabled' }}
          </div>

          <strong class="sa-text-disabled">
            {{ disabledSeats }}
          </strong>

        </div>

      </div>

      <div class="sa-card">

        <div class="sa-card-header">

          <div class="sa-icon">
            <i class="pi pi-th-large"/>
          </div>

          <div class="sa-grow">

            <h3>
              {{ isSpanish ? 'Mapa de asientos' : 'Seat Map' }}
            </h3>

            <p>
              {{ selectedRoom?.name ?? '—' }}
              ·
              {{ isSpanish ? 'Función' : 'Show' }}
              #{{ allocation.showId }}
              ·
              {{ seats.length }}
              {{ isSpanish ? 'asientos' : 'seats' }}
            </p>

          </div>

          <span
              v-if="selectedSeat"
              class="sa-selected-label"
          >
            {{ isSpanish ? 'Asiento' : 'Seat' }}
            #{{ selectedSeat.seatNumber }}
          </span>

        </div>

        <div class="sa-card-body">

          <div
              v-if="!seats.length"
              class="sa-empty"
          >

            <div class="sa-icon">
              <i class="pi pi-th-large"/>
            </div>

            <h3>
              {{ isSpanish ? 'No hay asientos registrados' : 'No seats registered' }}
            </h3>

          </div>

          <div v-else class="sa-map-container">

            <div class="sa-screen">
              {{ isSpanish ? 'PANTALLA' : 'SCREEN' }}
            </div>

            <div class="sa-seat-grid">

              <button
                  v-for="seat in seats"
                  :key="seat.seatNumber"
                  type="button"
                  class="sa-seat"
                  :class="[
                    seatClass(seat.status),
                    {
                      'sa-seat-selected':
                        String(seatNumber) === String(seat.seatNumber)
                    }
                  ]"
                  :title="`${seat.seatNumber} · ${seat.status}`"
                  :aria-pressed="String(seatNumber) === String(seat.seatNumber)"
                  :disabled="busy"
                  @click="selectSeat(seat)"
              >

                <i :class="seatIcon(seat.status)"/>

                <span>
                  {{ String(seat.seatNumber).padStart(2, '0') }}
                </span>

              </button>

            </div>

            <div class="sa-legend">

              <div class="sa-legend-item">
                <span class="sa-legend-dot sa-seat-enabled"/>
                {{ isSpanish ? 'Habilitado' : 'Enabled' }}
              </div>

              <div class="sa-legend-item">
                <span class="sa-legend-dot sa-seat-sold"/>
                {{ isSpanish ? 'Vendido' : 'Sold' }}
              </div>

              <div class="sa-legend-item">
                <span class="sa-legend-dot sa-seat-disabled"/>
                {{ isSpanish ? 'Deshabilitado' : 'Disabled' }}
              </div>

            </div>

          </div>

        </div>

        <footer class="sa-footer">

          <span>
            {{ isSpanish
              ? 'Selecciona cualquier asiento para modificar su estado.'
              : 'Select any seat to modify its status.' }}
          </span>

          <span>
            {{ seats.length }}
            {{ isSpanish ? 'asientos registrados' : 'registered seats' }}
          </span>

        </footer>

      </div>

      <div class="sa-detail-grid">

        <form
            class="sa-card"
            @submit.prevent="assign"
        >

          <div class="sa-card-header">

            <div class="sa-icon">
              <i class="pi pi-pencil"/>
            </div>

            <div class="sa-grow">

              <h3>
                {{ isSpanish ? 'Actualizar asiento' : 'Update Seat' }}
              </h3>

              <p>
                {{ isSpanish
                  ? 'Modifica el estado operativo del asiento.'
                  : 'Modify the operational status of the seat.' }}
              </p>

            </div>

          </div>

          <div class="sa-card-body sa-form-grid">

            <div class="sa-field">

              <label for="seat-number">
                {{ isSpanish ? 'Asiento' : 'Seat' }}
                <span class="sa-required">*</span>
              </label>

              <select
                  id="seat-number"
                  :value="seatNumber ?? ''"
                  class="sa-input"
                  :disabled="busy"
                  @change="selectSeat(seats.find(seat => String(seat.seatNumber) === $event.target.value))"
                  required
              >

                <option value="" disabled>
                  {{ isSpanish ? 'Seleccionar asiento' : 'Select seat' }}
                </option>

                <option
                    v-for="seat in seats"
                    :key="seat.seatNumber"
                    :value="seat.seatNumber"
                >
                  #{{ seat.seatNumber }}
                </option>

              </select>

            </div>

            <div class="sa-field">

              <label for="seat-status">
                {{ isSpanish ? 'Estado' : 'Status' }}
                <span class="sa-required">*</span>
              </label>

              <select
                  id="seat-status"
                  v-model="status"
                  class="sa-input"
                  :disabled="busy || !selectedSeat"
                  required
              >

                <option
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>

              </select>

            </div>

          </div>

          <footer class="sa-footer">

            <span>
              {{ isSpanish ? 'Cambio de estado' : 'Status update' }}
            </span>

            <button
                type="submit"
                class="sa-button sa-primary"
                :disabled="busy || !selectedSeat"
            >
              <i class="pi pi-check"/>
              {{ isSpanish ? 'Guardar cambios' : 'Save Changes' }}
            </button>

          </footer>

        </form>

        <form
            class="sa-card"
            @submit.prevent="disable"
        >

          <div class="sa-card-header">

            <div class="sa-icon">
              <i class="pi pi-ban"/>
            </div>

            <div class="sa-grow">

              <h3>
                {{ isSpanish ? 'Fuera de servicio' : 'Out of Service' }}
              </h3>

              <p>
                {{ isSpanish
                  ? 'Restringe el uso de un asiento por motivos técnicos.'
                  : 'Restrict seat usage due to technical issues.' }}
              </p>

            </div>

          </div>

          <div class="sa-card-body">

            <div class="sa-field">

              <label for="disable-reason">
                {{ isSpanish ? 'Motivo' : 'Reason' }}
                <span class="sa-required">*</span>
              </label>

              <input
                  id="disable-reason"
                  v-model="reason"
                  class="sa-input"
                  maxlength="500"
                  :placeholder="isSpanish
                    ? 'Describe el problema del asiento'
                    : 'Describe the seat issue'"
                  :disabled="busy || !selectedSeat"
                  required
              />

            </div>

          </div>

          <footer class="sa-footer">

            <span>
              {{ selectedSeat
                ? `${isSpanish ? 'Asiento' : 'Seat'} #${selectedSeat.seatNumber}`
                : (isSpanish ? 'Ningún asiento seleccionado' : 'No seat selected') }}
            </span>

            <button
                type="submit"
                class="sa-button sa-danger"
                :disabled="busy || !selectedSeat"
            >
              <i class="pi pi-ban"/>
              {{ isSpanish ? 'Marcar fuera de servicio' : 'Mark Out of Service' }}
            </button>

          </footer>

        </form>

      </div>

    </template>

  </section>
</template>
