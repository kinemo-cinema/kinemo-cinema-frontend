<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useBackend } from '../../../shared/application/use-backend.js';

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));

const rooms = ref([]);
const search = ref('');
const status = ref('');
const validationError = ref('');
const showForm = ref(route.name === 'readiness-room-new');

const form = ref({
  name: '',
  capacity: 1
});

const statusOptions = computed(() =>
    [...new Set(rooms.value.map(room => room.status))]
);

const filteredRooms = computed(() => {
  const query = search.value.trim().toLowerCase();

  return rooms.value.filter(room => {
    const matchesSearch = [
      room.id,
      room.name,
      room.capacity
    ].some(value =>
        String(value ?? '').toLowerCase().includes(query)
    );

    const matchesStatus =
        !status.value || room.status === status.value;

    return matchesSearch && matchesStatus;
  });
});

const load = () => run(async http => {
  rooms.value = (await http.get('/rooms')).data;
});

const openForm = () => {
  validationError.value = '';
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  validationError.value = '';

  form.value = {
    name: '',
    capacity: 1
  };

  if (route.name === 'readiness-room-new') {
    router.push({ name: 'readiness-rooms' });
  }
};

const create = async () => {
  validationError.value = '';

  if (
      !form.value.name.trim() ||
      !Number.isInteger(form.value.capacity) ||
      form.value.capacity < 1
  ) {
    validationError.value = isSpanish.value
        ? 'Ingresa un nombre y una capacidad válida.'
        : 'Enter a valid name and capacity.';

    return;
  }

  const success = await run(async http => {
    const { data } = await http.post('/rooms', {
      name: form.value.name.trim(),
      capacity: form.value.capacity
    });

    rooms.value.push(data);
  });

  if (success) {
    closeForm();
  }
};

const clearFilters = () => {
  search.value = '';
  status.value = '';
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

watch(() => route.name, name => {
  showForm.value = name === 'readiness-room-new';
});

onMounted(load);
</script>

<template>
  <section class="rd-page">

    <header class="rd-header">

      <div class="rd-grow">
        <h2>{{ isSpanish ? 'Salas' : 'Rooms' }}</h2>

        <p>
          {{ isSpanish
            ? 'Consulta y administra las salas del cine.'
            : 'View and manage cinema rooms.' }}
        </p>
      </div>

      <button
          type="button"
          class="rd-button rd-primary"
          :disabled="busy || showForm"
          @click="openForm"
      >
        <i class="pi pi-plus"/>
        {{ isSpanish ? 'Nueva sala' : 'New Room' }}
      </button>

    </header>

    <form
        v-if="showForm"
        class="rd-card"
        @submit.prevent="create"
    >

      <div class="rd-card-header">

        <div class="rd-icon">
          <i class="pi pi-home"/>
        </div>

        <div>
          <h3>{{ isSpanish ? 'Nueva sala' : 'New Room' }}</h3>

          <p>
            {{ isSpanish
              ? 'Completa la información de la sala.'
              : 'Complete the room information.' }}
          </p>
        </div>

      </div>

      <div class="rd-card-body rd-form-grid">

        <div class="rd-field">

          <label for="room-name">
            {{ isSpanish ? 'Nombre' : 'Name' }}
            <span class="rd-required">*</span>
          </label>

          <input
              id="room-name"
              v-model="form.name"
              class="rd-input"
              :placeholder="isSpanish ? 'Ejemplo: Sala 01' : 'Example: Room 01'"
              :disabled="busy"
              required
          />

        </div>

        <div class="rd-field">

          <label for="room-capacity">
            {{ isSpanish ? 'Capacidad' : 'Capacity' }}
            <span class="rd-required">*</span>
          </label>

          <input
              id="room-capacity"
              v-model.number="form.capacity"
              type="number"
              min="1"
              step="1"
              class="rd-input"
              :disabled="busy"
              required
          />

          <small>
            {{ isSpanish ? 'Número de asientos.' : 'Number of seats.' }}
          </small>

        </div>

        <div
            v-if="validationError"
            class="rd-message rd-message-error rd-full"
            role="alert"
        >
          <i class="pi pi-exclamation-circle"/>
          {{ validationError }}
        </div>

      </div>

      <footer class="rd-footer">

        <span>
          <span class="rd-required">*</span>
          {{ isSpanish ? 'Campos obligatorios' : 'Required fields' }}
        </span>

        <div class="rd-actions">

          <button
              type="button"
              class="rd-button rd-secondary"
              :disabled="busy"
              @click="closeForm"
          >
            {{ isSpanish ? 'Cancelar' : 'Cancel' }}
          </button>

          <button
              type="submit"
              class="rd-button rd-primary"
              :disabled="busy"
          >
            <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-check'"/>
            {{ isSpanish ? 'Guardar' : 'Save' }}
          </button>

        </div>

      </footer>

    </form>

    <div v-if="error" class="rd-message rd-message-error" role="alert">
      <i class="pi pi-exclamation-circle"/>
      {{ error }}
    </div>

    <div class="rd-card">

      <div class="rd-card-header">

        <h3>{{ isSpanish ? 'Salas registradas' : 'Registered rooms' }}</h3>

        <span class="rd-count">
          {{ rooms.length }}
          {{ isSpanish ? 'registros' : 'records' }}
        </span>

        <div class="rd-grow"/>

        <button
            type="button"
            class="rd-button rd-secondary"
            :disabled="busy"
            :aria-label="isSpanish ? 'Actualizar' : 'Refresh'"
            @click="load"
        >
          <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"/>
        </button>

      </div>

      <div class="rd-toolbar">

        <div class="rd-search">

          <i class="pi pi-search"/>

          <input
              v-model="search"
              type="search"
              :placeholder="isSpanish ? 'Buscar salas...' : 'Search rooms...'"
          />

        </div>

        <select
            v-model="status"
            class="rd-input rd-filter"
        >

          <option value="">
            {{ isSpanish ? 'Todos los estados' : 'All statuses' }}
          </option>

          <option
              v-for="item in statusOptions"
              :key="item"
              :value="item"
          >
            {{ item }}
          </option>

        </select>

        <button
            v-if="search || status"
            class="rd-button rd-secondary"
            @click="clearFilters"
        >
          <i class="pi pi-times"/>
          {{ isSpanish ? 'Limpiar' : 'Clear' }}
        </button>

      </div>

      <div class="rd-table-container">

        <table class="rd-table">

          <thead>
          <tr>
            <th>ID</th>
            <th>{{ isSpanish ? 'Nombre' : 'Name' }}</th>
            <th>{{ isSpanish ? 'Capacidad' : 'Capacity' }}</th>
            <th>{{ isSpanish ? 'Estado' : 'Status' }}</th>
            <th>{{ isSpanish ? 'Acciones' : 'Actions' }}</th>
          </tr>
          </thead>

          <tbody>

          <tr v-for="room in filteredRooms" :key="room.id">

            <td class="rd-id">#{{ room.id }}</td>

            <td>
              <div class="rd-room-name">
                <i class="pi pi-home"/>
                {{ room.name }}
              </div>
            </td>

            <td>
              {{ room.capacity }}
              {{ isSpanish ? 'asientos' : 'seats' }}
            </td>

            <td>
                <span
                    class="rd-status"
                    :class="statusClass(room.status)"
                >
                  {{ room.status }}
                </span>
            </td>

            <td>
              <router-link
                  :to="{
                      name: 'readiness-room-detail',
                      params: { id: room.id }
                    }"
                  class="rd-button rd-secondary"
              >
                <i class="pi pi-eye"/>
                {{ isSpanish ? 'Ver detalles' : 'View details' }}
              </router-link>
            </td>

          </tr>

          </tbody>

        </table>

      </div>

      <div v-if="busy && !rooms.length" class="rd-empty">
        <i class="pi pi-spin pi-spinner"/>
        {{ isSpanish ? 'Cargando salas...' : 'Loading rooms...' }}
      </div>

      <div v-else-if="!filteredRooms.length" class="rd-empty">

        <div class="rd-icon">
          <i class="pi pi-home"/>
        </div>

        <h3>
          {{ error
            ? (isSpanish ? 'Información no disponible' : 'Information unavailable')
            : (isSpanish ? 'No se encontraron salas' : 'No rooms found') }}
        </h3>

        <p>
          {{ error
            ? (isSpanish ? 'Verifica la conexión con el servidor.' : 'Check the server connection.')
            : search || status
                ? (isSpanish ? 'Prueba con otros filtros.' : 'Try different filters.')
                : (isSpanish ? 'Registra tu primera sala.' : 'Register your first cinema room.') }}
        </p>

        <button
            v-if="error"
            class="rd-button rd-secondary"
            @click="load"
        >
          <i class="pi pi-refresh"/>
          {{ isSpanish ? 'Reintentar' : 'Retry' }}
        </button>

        <button
            v-else-if="search || status"
            class="rd-button rd-secondary"
            @click="clearFilters"
        >
          {{ isSpanish ? 'Limpiar filtros' : 'Clear filters' }}
        </button>

        <button
            v-else
            class="rd-button rd-primary"
            :disabled="showForm"
            @click="openForm"
        >
          <i class="pi pi-plus"/>
          {{ isSpanish ? 'Nueva sala' : 'New Room' }}
        </button>

      </div>

      <footer class="rd-footer">
        {{ isSpanish ? 'Mostrando' : 'Showing' }}
        {{ filteredRooms.length }}
        {{ isSpanish ? 'de' : 'of' }}
        {{ rooms.length }}
        {{ isSpanish ? 'salas' : 'rooms' }}
      </footer>

    </div>

  </section>
</template>