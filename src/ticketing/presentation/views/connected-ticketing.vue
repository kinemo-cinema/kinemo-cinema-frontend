<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));

const integrations = ref([]);
const search = ref('');
const statusFilter = ref('');
const validationError = ref('');
const selectedId = ref(route.params.id ?? null);
const showForm = ref(route.name === 'ticketing-integration-new');

const form = ref({
  cinemaId: null,
  providerName: ''
});

const showIds = ref({});
const occupancy = ref(null);
const occupancyShowId = ref(null);

const getStatus = item =>
    item.connectionStatus ?? item.status ?? '—';

const statusOptions = computed(() =>
    [...new Set(
        integrations.value
            .map(getStatus)
            .filter(value => value !== '—')
    )]
);

const filteredIntegrations = computed(() => {
  const query = search.value.trim().toLowerCase();

  return integrations.value.filter(item => {
    const matchesSearch = [
      item.id,
      item.cinemaId,
      item.providerName
    ].some(value =>
        String(value ?? '').toLowerCase().includes(query)
    );

    const matchesStatus =
        !statusFilter.value ||
        getStatus(item) === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const selectedIntegration = computed(() =>
    integrations.value.find(item =>
        String(item.id) === String(selectedId.value)
    )
);

const load = () => run(async http => {
  integrations.value = (
      await http.get('/ticketing/integrations')
  ).data;
});

const openForm = () => {
  validationError.value = '';
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  validationError.value = '';

  form.value = {
    cinemaId: null,
    providerName: ''
  };

  if (route.name === 'ticketing-integration-new') {
    router.push({ name: 'ticketing-integrations' });
  }
};

const create = async () => {
  validationError.value = '';

  if (
      !Number.isInteger(form.value.cinemaId) ||
      form.value.cinemaId < 1 ||
      !form.value.providerName.trim()
  ) {
    validationError.value = isSpanish.value
        ? 'Ingresa un ID de cine válido y el nombre del proveedor.'
        : 'Enter a valid cinema ID and provider name.';

    return;
  }

  const success = await run(async http => {
    const { data } = await http.post(
        '/ticketing/integrations',
        {
          cinemaId: form.value.cinemaId,
          providerName: form.value.providerName.trim()
        }
    );

    integrations.value.push(data);
  });

  if (success) {
    closeForm();
  }
};

const selectIntegration = item => {
  selectedId.value = item.id;
};

const closeDetails = () => {
  selectedId.value = null;

  if (route.params.id) {
    router.push({ name: 'ticketing-integrations' });
  }
};

const lookup = async () => {
  validationError.value = '';

  if (
      !Number.isInteger(occupancyShowId.value) ||
      occupancyShowId.value < 1
  ) {
    validationError.value = isSpanish.value
        ? 'Ingresa un ID de función válido.'
        : 'Enter a valid show ID.';

    return;
  }

  await run(async http => {
    occupancy.value = null;

    occupancy.value = (
        await http.get(
            `/ticketing/occupancies/${occupancyShowId.value}`
        )
    ).data;
  });
};

const clearFilters = () => {
  search.value = '';
  statusFilter.value = '';
};

const statusClass = value => {
  const normalized = String(value).toUpperCase();

  if (
      ['AVAILABLE', 'CONNECTED', 'ACTIVE', 'COMPLETED']
          .includes(normalized)
  ) {
    return 'tk-status-success';
  }

  if (
      ['RECONNECTING', 'PENDING', 'IN_PROGRESS']
          .includes(normalized)
  ) {
    return 'tk-status-warning';
  }

  if (
      ['UNAVAILABLE', 'DISCONNECTED', 'FAILED', 'INACTIVE']
          .includes(normalized)
  ) {
    return 'tk-status-danger';
  }

  return '';
};

watch(() => route.name, name => {
  showForm.value = name === 'ticketing-integration-new';
});

watch(() => route.params.id, id => {
  selectedId.value = id ?? null;
});

onMounted(load);
</script>

<template>
  <section class="tk-page">

    <header class="tk-header">

      <div class="tk-grow">

        <h2>
          {{ isSpanish ? 'Integraciones' : 'Integrations' }}
        </h2>

        <p>
          {{ isSpanish
            ? 'Administra los sistemas externos de venta de entradas.'
            : 'Manage external ticketing systems.' }}
        </p>

      </div>

      <button
          type="button"
          class="tk-button tk-primary"
          :disabled="busy || showForm"
          @click="openForm"
      >
        <i class="pi pi-plus"/>
        {{ isSpanish ? 'Nueva integración' : 'New Integration' }}
      </button>

    </header>

    <div
        v-if="error || validationError"
        class="tk-message tk-message-error"
        role="alert"
    >
      <i class="pi pi-exclamation-circle"/>
      {{ validationError || error }}
    </div>

    <form
        v-if="showForm"
        class="tk-card"
        @submit.prevent="create"
    >

      <div class="tk-card-header">

        <div class="tk-icon">
          <i class="pi pi-ticket"/>
        </div>

        <div>

          <h3>
            {{ isSpanish ? 'Nueva integración' : 'New Integration' }}
          </h3>

          <p>
            {{ isSpanish
              ? 'Registra un proveedor de venta de entradas.'
              : 'Register a ticketing provider.' }}
          </p>

        </div>

      </div>

      <div class="tk-card-body tk-form-grid">

        <div class="tk-field">

          <label for="cinema-id">
            {{ isSpanish ? 'ID del cine' : 'Cinema ID' }}
            <span class="tk-required">*</span>
          </label>

          <input
              id="cinema-id"
              v-model.number="form.cinemaId"
              type="number"
              min="1"
              step="1"
              class="tk-input"
              placeholder="1"
              :disabled="busy"
              required
          />

        </div>

        <div class="tk-field">

          <label for="provider-name">
            {{ isSpanish ? 'Nombre del proveedor' : 'Provider name' }}
            <span class="tk-required">*</span>
          </label>

          <input
              id="provider-name"
              v-model="form.providerName"
              class="tk-input"
              :placeholder="isSpanish
                ? 'Nombre del proveedor'
                : 'Enter provider name'"
              :disabled="busy"
              required
          />

        </div>

      </div>

      <footer class="tk-footer">

        <span>
          <span class="tk-required">*</span>
          {{ isSpanish ? 'Campos obligatorios' : 'Required fields' }}
        </span>

        <div class="tk-actions">

          <button
              type="button"
              class="tk-button tk-secondary"
              :disabled="busy"
              @click="closeForm"
          >
            {{ isSpanish ? 'Cancelar' : 'Cancel' }}
          </button>

          <button
              type="submit"
              class="tk-button tk-primary"
              :disabled="busy"
          >
            <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-check'"/>
            {{ isSpanish ? 'Guardar' : 'Save' }}
          </button>

        </div>

      </footer>

    </form>

    <div class="tk-card">

      <div class="tk-card-header">

        <h3>
          {{ isSpanish ? 'Proveedores registrados' : 'Registered providers' }}
        </h3>

        <span class="tk-count">
          {{ integrations.length }}
          {{ isSpanish ? 'registros' : 'records' }}
        </span>

        <div class="tk-grow"/>

        <button
            type="button"
            class="tk-button tk-secondary"
            :disabled="busy"
            :aria-label="isSpanish ? 'Actualizar' : 'Refresh'"
            @click="load"
        >
          <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"/>
        </button>

      </div>

      <div class="tk-toolbar">

        <div class="tk-search">

          <i class="pi pi-search"/>

          <input
              v-model="search"
              type="search"
              :placeholder="isSpanish
                ? 'Buscar proveedores...'
                : 'Search providers...'"
          />

        </div>

        <select
            v-model="statusFilter"
            class="tk-input tk-filter"
        >

          <option value="">
            {{ isSpanish ? 'Todos los estados' : 'All statuses' }}
          </option>

          <option
              v-for="status in statusOptions"
              :key="status"
              :value="status"
          >
            {{ status }}
          </option>

        </select>

        <button
            v-if="search || statusFilter"
            type="button"
            class="tk-button tk-secondary"
            @click="clearFilters"
        >
          <i class="pi pi-times"/>
          {{ isSpanish ? 'Limpiar' : 'Clear' }}
        </button>

      </div>

      <div class="tk-table-container">

        <table class="tk-table">

          <thead>

          <tr>
            <th>ID</th>
            <th>{{ isSpanish ? 'Proveedor' : 'Provider' }}</th>
            <th>{{ isSpanish ? 'Cine' : 'Cinema' }}</th>
            <th>{{ isSpanish ? 'Estado' : 'Status' }}</th>
            <th>{{ isSpanish ? 'Acciones' : 'Actions' }}</th>
          </tr>

          </thead>

          <tbody>

          <tr
              v-for="item in filteredIntegrations"
              :key="item.id"
              :class="{
                  'tk-selected': String(selectedId) === String(item.id)
                }"
          >

            <td class="tk-id">#{{ item.id }}</td>

            <td>

              <div class="tk-provider">
                <i class="pi pi-ticket"/>
                {{ item.providerName ?? '—' }}
              </div>

            </td>

            <td>
              {{ item.cinemaId ?? '—' }}
            </td>

            <td>

                <span
                    class="tk-status"
                    :class="statusClass(getStatus(item))"
                >
                  {{ getStatus(item) }}
                </span>

            </td>

            <td>

              <button
                  type="button"
                  class="tk-button tk-secondary"
                  @click="selectIntegration(item)"
              >
                <i class="pi pi-eye"/>
                {{ isSpanish ? 'Ver detalles' : 'View details' }}
              </button>

            </td>

          </tr>

          </tbody>

        </table>

      </div>

      <div
          v-if="busy && !integrations.length"
          class="tk-empty"
      >
        <i class="pi pi-spin pi-spinner"/>
        {{ isSpanish ? 'Cargando integraciones...' : 'Loading integrations...' }}
      </div>

      <div
          v-else-if="!filteredIntegrations.length"
          class="tk-empty"
      >

        <div class="tk-icon">
          <i class="pi pi-ticket"/>
        </div>

        <h3>
          {{ error
            ? (isSpanish ? 'Información no disponible' : 'Information unavailable')
            : (isSpanish ? 'No se encontraron integraciones' : 'No integrations found') }}
        </h3>

        <p>
          {{ error
            ? (isSpanish ? 'Verifica la conexión con el servidor.' : 'Check the server connection.')
            : search || statusFilter
                ? (isSpanish ? 'Prueba con otros filtros.' : 'Try different filters.')
                : (isSpanish ? 'Registra tu primer proveedor.' : 'Register your first ticketing provider.') }}
        </p>

        <button
            v-if="error"
            type="button"
            class="tk-button tk-secondary"
            @click="load"
        >
          <i class="pi pi-refresh"/>
          {{ isSpanish ? 'Reintentar' : 'Retry' }}
        </button>

        <button
            v-else-if="search || statusFilter"
            type="button"
            class="tk-button tk-secondary"
            @click="clearFilters"
        >
          {{ isSpanish ? 'Limpiar filtros' : 'Clear filters' }}
        </button>

        <button
            v-else
            type="button"
            class="tk-button tk-primary"
            :disabled="showForm"
            @click="openForm"
        >
          <i class="pi pi-plus"/>
          {{ isSpanish ? 'Nueva integración' : 'New Integration' }}
        </button>

      </div>

      <footer class="tk-footer">

        {{ isSpanish ? 'Mostrando' : 'Showing' }}
        {{ filteredIntegrations.length }}
        {{ isSpanish ? 'de' : 'of' }}
        {{ integrations.length }}
        {{ isSpanish ? 'integraciones' : 'integrations' }}

      </footer>

    </div>

    <div
        v-if="selectedIntegration"
        class="tk-card"
    >

      <div class="tk-card-header">

        <div class="tk-icon">
          <i class="pi pi-ticket"/>
        </div>

        <div class="tk-grow">

          <h3>
            {{ selectedIntegration.providerName ?? (
              isSpanish ? 'Detalles de integración' : 'Integration details'
          ) }}
          </h3>

          <p>ID: #{{ selectedIntegration.id }}</p>

        </div>

        <button
            type="button"
            class="tk-button tk-secondary"
            :aria-label="isSpanish ? 'Cerrar' : 'Close'"
            @click="closeDetails"
        >
          <i class="pi pi-times"/>
        </button>

      </div>

      <div class="tk-card-body">

        <div class="tk-records">

          <BackendRecords :value="selectedIntegration"/>

        </div>

        <div class="tk-divider"/>

        <h3 class="tk-detail-title">
          {{ isSpanish ? 'Sincronización de ocupación' : 'Occupancy synchronization' }}
        </h3>

        <div class="tk-lookup">

          <div class="tk-field">

            <label for="sync-show-id">
              {{ isSpanish ? 'ID de función' : 'Show ID' }}
            </label>

            <input
                id="sync-show-id"
                v-model.number="showIds[selectedIntegration.id]"
                type="number"
                min="1"
                class="tk-input"
                placeholder="1"
                disabled
            />

          </div>

          <button
              type="button"
              class="tk-button tk-primary"
              disabled
          >
            <i class="pi pi-sync"/>
            {{ isSpanish ? 'Sincronizar' : 'Synchronize' }}
          </button>

        </div>

        <div class="tk-records">

          <div class="tk-message tk-message-warning">

            <i class="pi pi-info-circle"/>

            <span>
              {{ isSpanish
                ? 'La sincronización requiere configurar un proveedor real de ticketing.'
                : 'Synchronization requires a configured external ticketing provider.' }}
            </span>

          </div>

        </div>

      </div>

    </div>

    <div class="tk-card">

      <div class="tk-card-header">

        <div class="tk-icon">
          <i class="pi pi-chart-bar"/>
        </div>

        <div class="tk-grow">

          <h3>
            {{ isSpanish ? 'Ocupación por función' : 'Show Occupancy' }}
          </h3>

          <p>
            {{ isSpanish
              ? 'Consulta la información de ocupación registrada.'
              : 'Retrieve stored occupancy information.' }}
          </p>

        </div>

      </div>

      <div class="tk-card-body">

        <form
            class="tk-lookup"
            @submit.prevent="lookup"
        >

          <div class="tk-field">

            <label for="occupancy-show-id">

              {{ isSpanish ? 'ID de función' : 'Show ID' }}

              <span class="tk-required">*</span>

            </label>

            <input
                id="occupancy-show-id"
                v-model.number="occupancyShowId"
                type="number"
                min="1"
                step="1"
                class="tk-input"
                :placeholder="isSpanish
                  ? 'Ingresa el ID de función'
                  : 'Enter show ID'"
                :disabled="busy"
                required
            />

          </div>

          <button
              type="submit"
              class="tk-button tk-primary"
              :disabled="busy"
          >
            <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-search'"/>
            {{ isSpanish ? 'Consultar' : 'Search' }}
          </button>

        </form>

        <div v-if="occupancy" class="tk-records">

          <BackendRecords :value="occupancy"/>

        </div>

      </div>

    </div>

  </section>
</template>
