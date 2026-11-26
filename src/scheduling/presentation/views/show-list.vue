<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue';
import { storeToRefs } from 'pinia';
import useSchedulingStore from '../../application/scheduling.store.js';
import useCatalogStore from '../../../catalog/application/catalog.store.js';

const { t, locale } = useI18n();
const router = useRouter();
const confirm = useConfirm();

const schedulingStore = useSchedulingStore();
const catalogStore = useCatalogStore();

const { shows, rooms, errors } = storeToRefs(schedulingStore);
const { movies, errors: catalogErrors } = storeToRefs(catalogStore);

const isSpanish = computed(() => locale.value.startsWith('es'));

const search = ref('');
const status = ref('');
const roomId = ref('');
const loading = ref(true);
const first = ref(0);
const rows = ref(10);

const allErrors = computed(() => [
  ...errors.value,
  ...catalogErrors.value
]);

const movieNames = computed(() =>
    new Map(movies.value.map(movie => [
      String(movie.getId()),
      movie.getTitle()
    ]))
);

const roomNames = computed(() =>
    new Map(rooms.value.map(room => [
      String(room.getId()),
      room.getName()
    ]))
);

const getMovieTitle = id =>
    movieNames.value.get(String(id)) ?? '—';

const getRoomName = id =>
    roomNames.value.get(String(id)) ?? '—';

const statusOptions = computed(() =>
    [...new Set(shows.value.map(show => show.getStatusAsString()))]
);

const filteredShows = computed(() => {
  const query = search.value.trim().toLowerCase();

  return shows.value.filter(show => {
    const matchesSearch = [
      show.getId(),
      getMovieTitle(show.getMovieId()),
      getRoomName(show.getRoomId())
    ].some(value =>
        String(value).toLowerCase().includes(query)
    );

    const matchesStatus =
        !status.value ||
        show.getStatusAsString() === status.value;

    const matchesRoom =
        !roomId.value ||
        String(show.getRoomId()) === String(roomId.value);

    return matchesSearch && matchesStatus && matchesRoom;
  });
});

watch([search, status, roomId], () => {
  first.value = 0;
});

const clearFilters = () => {
  search.value = '';
  status.value = '';
  roomId.value = '';
  first.value = 0;
};

const load = async () => {
  loading.value = true;

  try {
    await Promise.all([
      schedulingStore.fetchShows(),
      schedulingStore.fetchRooms(),
      catalogStore.fetchMovies()
    ]);
  } finally {
    loading.value = false;
  }
};

const formatSchedule = show => {
  const options = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  };

  const language = isSpanish.value ? 'es-PE' : 'en-US';

  const start = show.getStartTime().toDate();
  const end = show.getEndTime().toDate();

  return `${start.toLocaleString(language, options)} → ${end.toLocaleString(language, options)}`;
};

const statusClass = value => {
  const normalized = String(value).toUpperCase();

  if (normalized === 'SCHEDULED') {
    return 'sc-status-scheduled';
  }

  if (['ACTIVE', 'COMPLETED', 'READY'].includes(normalized)) {
    return 'sc-status-success';
  }

  if (['CANCELLED', 'CANCELED', 'FAILED'].includes(normalized)) {
    return 'sc-status-danger';
  }

  return '';
};

const navigateToNew = () => {
  router.push({ name: 'scheduling-show-new' });
};

const navigateToEdit = id => {
  router.push({
    name: 'scheduling-show-edit',
    params: { id }
  });
};

const confirmDelete = show => {
  confirm.require({
    message: t('shows.confirm-delete', { id: show.getId() }),
    header: t('shows.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      schedulingStore.deleteShow(show);
    }
  });
};

onMounted(load);
</script>

<template>
  <section class="sc-page">

    <header class="sc-header">

      <div class="sc-header-content">
        <h2>{{ t('shows.title') }}</h2>

        <p>
          {{ isSpanish
            ? 'Consulta y administra las funciones programadas.'
            : 'View and manage scheduled cinema shows.' }}
        </p>
      </div>

      <pv-button
          :label="t('shows.new')"
          icon="pi pi-plus"
          class="sc-button sc-primary"
          @click="navigateToNew"
      />

    </header>

    <div class="sc-card">

      <div class="sc-card-header">

        <h3>
          {{ isSpanish ? 'Funciones registradas' : 'Registered shows' }}
        </h3>

        <span class="sc-count">
          {{ shows.length }}
          {{ isSpanish ? 'registros' : 'records' }}
        </span>

        <div class="sc-spacer"/>

        <pv-button
            :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"
            :aria-label="isSpanish ? 'Actualizar' : 'Refresh'"
            :disabled="loading"
            class="sc-button sc-secondary"
            outlined
            @click="load"
        />

      </div>

      <div class="sc-toolbar">

        <div class="sc-search">
          <i class="pi pi-search"/>

          <input
              v-model="search"
              type="search"
              :placeholder="isSpanish ? 'Buscar funciones...' : 'Search shows...'"
              :aria-label="isSpanish ? 'Buscar funciones' : 'Search shows'"
          />
        </div>

        <select
            v-model="roomId"
            class="sc-input sc-filter"
            :aria-label="isSpanish ? 'Filtrar por sala' : 'Filter by room'"
        >
          <option value="">
            {{ isSpanish ? 'Todas las salas' : 'All rooms' }}
          </option>

          <option
              v-for="room in rooms"
              :key="room.getId()"
              :value="room.getId()"
          >
            {{ room.getName() }}
          </option>
        </select>

        <select
            v-model="status"
            class="sc-input sc-filter"
            :aria-label="isSpanish ? 'Filtrar por estado' : 'Filter by status'"
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

        <pv-button
            v-if="search || status || roomId"
            :label="isSpanish ? 'Limpiar' : 'Clear'"
            icon="pi pi-times"
            text
            class="sc-button"
            @click="clearFilters"
        />

      </div>

      <div class="sc-table-container">

        <pv-data-table
            v-model:first="first"
            v-model:rows="rows"
            :value="filteredShows"
            :loading="loading"
            :paginator="filteredShows.length > 0"
            :rows-per-page-options="[10, 20, 50]"
            table-style="min-width: 48rem"
            class="sc-table"
        >

          <template #empty>

            <div v-if="!loading" class="sc-empty">

              <div class="sc-icon">
                <i class="pi pi-calendar"/>
              </div>

              <h3>
                {{ allErrors.length
                  ? (isSpanish ? 'Información no disponible' : 'Information unavailable')
                  : (isSpanish ? 'No se encontraron funciones' : 'No shows found') }}
              </h3>

              <p>
                {{ allErrors.length
                  ? (isSpanish ? 'Verifica la conexión con el servidor.' : 'Check the server connection.')
                  : search || status || roomId
                      ? (isSpanish ? 'Prueba con otros filtros.' : 'Try different filters.')
                      : (isSpanish ? 'Programa tu primera función.' : 'Schedule your first show.') }}
              </p>

              <pv-button
                  v-if="allErrors.length"
                  :label="isSpanish ? 'Reintentar' : 'Retry'"
                  icon="pi pi-refresh"
                  class="sc-button sc-secondary"
                  outlined
                  @click="load"
              />

              <pv-button
                  v-else-if="search || status || roomId"
                  :label="isSpanish ? 'Limpiar filtros' : 'Clear filters'"
                  class="sc-button sc-secondary"
                  outlined
                  @click="clearFilters"
              />

              <pv-button
                  v-else
                  :label="t('shows.new')"
                  icon="pi pi-plus"
                  class="sc-button sc-primary"
                  @click="navigateToNew"
              />

            </div>

          </template>

          <pv-column :header="t('shows.id')">
            <template #body="{ data }">
              <span class="sc-id">#{{ data.getId() }}</span>
            </template>
          </pv-column>

          <pv-column :header="t('shows.fields.movie')">
            <template #body="{ data }">
              <div class="sc-movie">
                <i class="pi pi-video"/>
                {{ getMovieTitle(data.getMovieId()) }}
              </div>
            </template>
          </pv-column>

          <pv-column :header="t('shows.fields.room')">
            <template #body="{ data }">
              {{ getRoomName(data.getRoomId()) }}
            </template>
          </pv-column>

          <pv-column :header="t('shows.fields.schedule')">
            <template #body="{ data }">
              {{ formatSchedule(data) }}
            </template>
          </pv-column>

          <pv-column :header="t('shows.fields.status')">
            <template #body="{ data }">
              <span
                  class="sc-status"
                  :class="statusClass(data.getStatusAsString())"
              >
                {{ data.getStatusAsString() }}
              </span>
            </template>
          </pv-column>

          <pv-column :header="t('shows.actions')">
            <template #body="{ data }">

              <div class="sc-actions">

                <pv-button
                    icon="pi pi-pencil"
                    :aria-label="isSpanish ? 'Editar' : 'Edit'"
                    text
                    rounded
                    @click="navigateToEdit(data.getId())"
                />

                <pv-button
                    icon="pi pi-trash"
                    :aria-label="isSpanish ? 'Eliminar' : 'Delete'"
                    text
                    rounded
                    severity="danger"
                    @click="confirmDelete(data)"
                />

              </div>

            </template>
          </pv-column>

        </pv-data-table>

      </div>

      <footer class="sc-footer">
        <span>
          {{ isSpanish ? 'Mostrando' : 'Showing' }}
          {{ filteredShows.length }}
          {{ isSpanish ? 'de' : 'of' }}
          {{ shows.length }}
          {{ isSpanish ? 'funciones' : 'shows' }}
        </span>
      </footer>

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

    <pv-confirm-dialog/>

  </section>
</template>