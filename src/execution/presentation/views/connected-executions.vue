<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';

const { locale } = useI18n();
const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));

const items = ref([]);
const shows = ref([]);
const movies = ref([]);
const showId = ref(null);
const reasons = ref({});
const search = ref('');
const statusFilter = ref('');
const message = ref('');
const validationError = ref('');

const normalizeStatus = value =>
    String(value ?? '').replace(/[\s_-]/g, '').toUpperCase();

const selectedShow = computed(() =>
    shows.value.find(show =>
        String(show.id) === String(showId.value)
    )
);

const selectedMovie = computed(() =>
    movies.value.find(movie =>
        String(movie.id) === String(selectedShow.value?.movieId)
    )
);

const hasSensoryContent = computed(() =>
    Boolean(selectedMovie.value?.sensoryContent?.id)
);

const activeCount = computed(() =>
    items.value.filter(item =>
        normalizeStatus(item.status) === 'INPROGRESS'
    ).length
);

const pausedCount = computed(() =>
    items.value.filter(item =>
        normalizeStatus(item.status) === 'PAUSED'
    ).length
);

const completedCount = computed(() =>
    items.value.filter(item =>
        ['COMPLETED', 'FINISHED'].includes(
            normalizeStatus(item.status)
        )
    ).length
);

const availableShows = computed(() =>
    shows.value.filter(show =>
        normalizeStatus(show.status) === 'SCHEDULED' &&
        !items.value.some(item =>
            String(item.showId) === String(show.id)
        )
    )
);

const movieName = movieId =>
    movies.value.find(movie =>
        String(movie.id) === String(movieId)
    )?.title ?? `#${movieId ?? '—'}`;

const executionMovie = item => {
  const show = shows.value.find(show =>
      String(show.id) === String(item.showId)
  );

  return show ? movieName(show.movieId) : '—';
};

const statusLabel = value => {
  const status = normalizeStatus(value);

  const labels = {
    INPROGRESS: isSpanish.value ? 'En ejecución' : 'In progress',
    PAUSED: isSpanish.value ? 'Pausada' : 'Paused',
    COMPLETED: isSpanish.value ? 'Finalizada' : 'Completed',
    FINISHED: isSpanish.value ? 'Finalizada' : 'Finished',
    EMERGENCYSTOPPED: isSpanish.value
        ? 'Parada de emergencia'
        : 'Emergency stopped',
    READY: isSpanish.value ? 'Preparada' : 'Ready',
    CANCELLED: isSpanish.value ? 'Cancelada' : 'Cancelled'
  };

  return labels[status] ?? value ?? '—';
};

const statusClass = value => {
  const status = normalizeStatus(value);

  if (status === 'INPROGRESS') return 'ex-status-active';
  if (status === 'PAUSED') return 'ex-status-paused';

  if (['COMPLETED', 'FINISHED'].includes(status)) {
    return 'ex-status-completed';
  }

  if (['EMERGENCYSTOPPED', 'CANCELLED'].includes(status)) {
    return 'ex-status-emergency';
  }

  return '';
};

const statusOptions = computed(() =>
    [...new Set(items.value.map(item => item.status).filter(Boolean))]
        .map(status => ({
          value: status,
          label: statusLabel(status)
        }))
);

const filteredItems = computed(() => {
  const query = search.value.trim().toLowerCase();

  return items.value.filter(item => {
    const matchesSearch =
        !query ||
        String(item.id).includes(query) ||
        String(item.showId).includes(query) ||
        executionMovie(item).toLowerCase().includes(query);

    const matchesStatus =
        !statusFilter.value ||
        item.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

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

const canPause = item =>
    normalizeStatus(item.status) === 'INPROGRESS';

const canResume = item =>
    normalizeStatus(item.status) === 'PAUSED';

const canControl = item =>
    ['INPROGRESS', 'PAUSED'].includes(
        normalizeStatus(item.status)
    );

const resetMessages = () => {
  message.value = '';
  validationError.value = '';
};

const load = () => run(async http => {
  const responses = await Promise.all([
    http.get('/executions'),
    http.get('/shows'),
    http.get('/movies')
  ]);

  [items.value, shows.value, movies.value] =
      responses.map(response => {
        const data = response.data.value ?? response.data;
        return Array.isArray(data) ? data : [];
      });

  if (
      showId.value &&
      !availableShows.value.some(show =>
          String(show.id) === String(showId.value)
      )
  ) {
    showId.value = null;
  }
});

const start = async () => {
  resetMessages();

  if (!selectedShow.value) {
    validationError.value = isSpanish.value
        ? 'Selecciona una función.'
        : 'Select a show.';

    return;
  }

  if (!hasSensoryContent.value) {
    validationError.value = isSpanish.value
        ? 'La película no tiene contenido sensorial disponible.'
        : 'The movie does not have sensory content available.';

    return;
  }

  const success = await run(async http => {
    const { data } = await http.post('/executions', {
      showId: selectedShow.value.id,
      sensoryContentId: selectedMovie.value.sensoryContent.id
    });

    items.value.unshift(data);
  });

  if (success) {
    showId.value = null;

    message.value = isSpanish.value
        ? 'Ejecución iniciada correctamente.'
        : 'Execution started successfully.';
  }
};

const command = async (item, name) => {
  resetMessages();

  if (name === 'pause' && !canPause(item)) return;
  if (name === 'resume' && !canResume(item)) return;

  if (
      ['finish', 'emergency-stop'].includes(name) &&
      !canControl(item)
  ) return;

  const reason = String(reasons.value[item.id] ?? '').trim();

  if (name === 'emergency-stop' && !reason) {
    validationError.value = isSpanish.value
        ? 'Ingresa el motivo de la parada de emergencia.'
        : 'Enter the emergency stop reason.';

    return;
  }

  const success = await run(async http => {
    const { data } = await http.post(
        `/executions/${item.id}/${name}`,
        name === 'emergency-stop'
            ? { reason }
            : undefined
    );

    items.value = items.value.map(row =>
        String(row.id) === String(data.id)
            ? data
            : row
    );
  });

  if (!success) return;

  const messages = {
    pause: isSpanish.value
        ? 'Ejecución pausada correctamente.'
        : 'Execution paused successfully.',

    resume: isSpanish.value
        ? 'Ejecución reanudada correctamente.'
        : 'Execution resumed successfully.',

    finish: isSpanish.value
        ? 'Ejecución finalizada correctamente.'
        : 'Execution finished successfully.',

    'emergency-stop': isSpanish.value
        ? 'Parada de emergencia registrada.'
        : 'Emergency stop registered.'
  };

  message.value = messages[name];

  if (name === 'emergency-stop') {
    reasons.value[item.id] = '';
  }
};

onMounted(load);
</script>

<template>
  <section class="ex-page">
    <header class="ex-section-header">
      <div>
        <h2>
          {{
            isSpanish
                ? 'Control de ejecuciones'
                : 'Execution Control'
          }}
        </h2>

        <p>
          {{
            isSpanish
                ? 'Administra el estado de las funciones 4D.'
                : 'Manage the status of 4D shows.'
          }}
        </p>
      </div>

      <button
          type="button"
          class="ex-button ex-button-secondary"
          :disabled="busy"
          @click="load"
      >
        <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"/>

        {{ isSpanish ? 'Actualizar' : 'Refresh' }}
      </button>
    </header>

    <div class="ex-stats">
      <article class="ex-stat">
        <div class="ex-stat-top">
                    <span>
                        {{ isSpanish ? 'Total de ejecuciones' : 'Total executions' }}
                    </span>

          <i class="pi pi-list"/>
        </div>

        <strong>{{ items.length }}</strong>
      </article>

      <article class="ex-stat">
        <div class="ex-stat-top">
                    <span>
                        {{ isSpanish ? 'En ejecución' : 'In progress' }}
                    </span>

          <i class="pi pi-play"/>
        </div>

        <strong>{{ activeCount }}</strong>
      </article>

      <article class="ex-stat">
        <div class="ex-stat-top">
                    <span>
                        {{ isSpanish ? 'Pausadas' : 'Paused' }}
                    </span>

          <i class="pi pi-pause"/>
        </div>

        <strong>{{ pausedCount }}</strong>
      </article>

      <article class="ex-stat">
        <div class="ex-stat-top">
                    <span>
                        {{ isSpanish ? 'Finalizadas' : 'Completed' }}
                    </span>

          <i class="pi pi-check-circle"/>
        </div>

        <strong>{{ completedCount }}</strong>
      </article>
    </div>

    <div
        v-if="error || validationError"
        class="ex-alert ex-alert-error"
        role="alert"
    >
      <i class="pi pi-exclamation-circle"/>

      {{ validationError || error }}
    </div>

    <div
        v-if="message"
        class="ex-alert ex-alert-success"
        role="status"
    >
      <i class="pi pi-check-circle"/>

      {{ message }}
    </div>

    <article class="ex-card">
      <header class="ex-card-header">
        <div>
          <h3>
            {{ isSpanish ? 'Nueva ejecución' : 'New Execution' }}
          </h3>

          <p>
            {{
              isSpanish
                  ? 'Selecciona una función programada para iniciar.'
                  : 'Select a scheduled show to start.'
            }}
          </p>
        </div>
      </header>

      <div class="ex-card-body">
        <form
            v-if="availableShows.length"
            class="ex-form"
            @submit.prevent="start"
        >
          <div class="ex-form-row">
            <div class="ex-field">
              <label for="execution-show">
                {{ isSpanish ? 'Función' : 'Show' }}
              </label>

              <select
                  id="execution-show"
                  v-model="showId"
                  class="ex-select"
                  required
                  :disabled="busy"
                  @change="resetMessages"
              >
                <option :value="null" disabled>
                  {{
                    isSpanish
                        ? 'Selecciona una función'
                        : 'Select a show'
                  }}
                </option>

                <option
                    v-for="show in availableShows"
                    :key="show.id"
                    :value="show.id"
                >
                  #{{ show.id }}
                  · {{ movieName(show.movieId) }}
                  · {{ formatDate(show.startDateTime) }}
                </option>
              </select>
            </div>

            <button
                type="submit"
                class="ex-button ex-button-primary"
                :disabled="busy || !selectedShow || !hasSensoryContent"
            >
              <i class="pi pi-play"/>

              {{
                isSpanish
                    ? 'Iniciar ejecución'
                    : 'Start Execution'
              }}
            </button>
          </div>

          <div
              v-if="selectedShow"
              class="ex-information"
          >
            <div class="ex-info-item">
                            <span>
                                {{ isSpanish ? 'Película' : 'Movie' }}
                            </span>

              <strong>
                {{ movieName(selectedShow.movieId) }}
              </strong>
            </div>

            <div class="ex-info-item">
                            <span>
                                {{ isSpanish ? 'Fecha programada' : 'Scheduled date' }}
                            </span>

              <strong>
                {{ formatDate(selectedShow.startDateTime) }}
              </strong>
            </div>

            <div class="ex-info-item">
                            <span>
                                {{ isSpanish ? 'Contenido sensorial' : 'Sensory content' }}
                            </span>

              <strong>
                {{
                  hasSensoryContent
                      ? (isSpanish ? 'Disponible' : 'Available')
                      : (isSpanish ? 'No disponible' : 'Unavailable')
                }}
              </strong>
            </div>
          </div>

          <div
              v-if="selectedShow && !hasSensoryContent"
              class="ex-alert ex-alert-warning"
          >
            <i class="pi pi-exclamation-triangle"/>

            {{
              isSpanish
                  ? 'Configura el contenido sensorial de la película antes de iniciar la ejecución.'
                  : 'Configure the sensory content of the movie before starting the execution.'
            }}
          </div>

          <div
              v-if="selectedShow && !hasSensoryContent"
              class="ex-actions"
          >
            <router-link
                to="/catalog"
                class="ex-button ex-button-secondary"
            >
              <i class="pi pi-video"/>

              {{
                isSpanish
                    ? 'Ir al catálogo'
                    : 'Go to Catalog'
              }}
            </router-link>
          </div>
        </form>

        <div
            v-else-if="busy"
            class="ex-empty"
        >
          <i class="pi pi-spin pi-spinner"/>

          <p>
            {{ isSpanish ? 'Cargando funciones...' : 'Loading shows...' }}
          </p>
        </div>

        <div
            v-else
            class="ex-empty"
        >
          <i class="pi pi-calendar"/>

          <h3>
            {{
              isSpanish
                  ? 'No hay funciones disponibles'
                  : 'No available shows'
            }}
          </h3>

          <p>
            {{
              isSpanish
                  ? 'Programa una nueva función para iniciar una ejecución.'
                  : 'Schedule a new show to start an execution.'
            }}
          </p>

          <router-link
              to="/scheduling"
              class="ex-button ex-button-secondary"
          >
            <i class="pi pi-calendar-plus"/>

            {{
              isSpanish
                  ? 'Ir a programación'
                  : 'Go to Scheduling'
            }}
          </router-link>
        </div>
      </div>
    </article>

    <article class="ex-card">
      <header class="ex-card-header">
        <div>
          <h3>
            {{
              isSpanish
                  ? 'Ejecuciones registradas'
                  : 'Registered Executions'
            }}
          </h3>

          <p>
            {{
              isSpanish
                  ? 'Supervisa y administra las ejecuciones del sistema.'
                  : 'Monitor and manage system executions.'
            }}
          </p>
        </div>

        <span class="ex-module-badge">
                    {{ items.length }}
                </span>
      </header>

      <div class="ex-toolbar">
        <div class="ex-search">
          <i class="pi pi-search"/>

          <input
              v-model="search"
              type="text"
              class="ex-input"
              :placeholder="
                            isSpanish
                                ? 'Buscar por ID o película...'
                                : 'Search by ID or movie...'
                        "
          />
        </div>

        <select
            v-model="statusFilter"
            class="ex-select"
        >
          <option value="">
            {{
              isSpanish
                  ? 'Todos los estados'
                  : 'All statuses'
            }}
          </option>

          <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div
          v-if="!filteredItems.length"
          class="ex-empty"
      >
        <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-play-circle'"/>

        <h3>
          {{
            busy
                ? (isSpanish ? 'Cargando...' : 'Loading...')
                : (isSpanish ? 'No hay ejecuciones' : 'No executions found')
          }}
        </h3>

        <p v-if="!busy">
          {{
            isSpanish
                ? 'Las ejecuciones registradas aparecerán aquí.'
                : 'Registered executions will appear here.'
          }}
        </p>

        <button
            v-if="search || statusFilter"
            type="button"
            class="ex-button ex-button-secondary"
            @click="search = ''; statusFilter = ''"
        >
          {{
            isSpanish
                ? 'Limpiar filtros'
                : 'Clear filters'
          }}
        </button>
      </div>

      <div
          v-else
          class="ex-execution-list"
      >
        <article
            v-for="item in filteredItems"
            :key="item.id"
            class="ex-execution"
        >
          <header class="ex-card-header">
            <div class="ex-execution-title">
              <div class="ex-execution-icon">
                <i class="pi pi-play-circle"/>
              </div>

              <div>
                <h3>
                  {{ isSpanish ? 'Ejecución' : 'Execution' }}
                  #{{ item.id }}
                </h3>

                <p>{{ executionMovie(item) }}</p>
              </div>
            </div>

            <span
                class="ex-status"
                :class="statusClass(item.status)"
            >
                            {{ statusLabel(item.status) }}
                        </span>
          </header>

          <div class="ex-execution-content">
            <div class="ex-information">
              <div class="ex-info-item">
                                <span>
                                    {{ isSpanish ? 'ID de función' : 'Show ID' }}
                                </span>

                <strong>#{{ item.showId }}</strong>
              </div>

              <div class="ex-info-item">
                                <span>
                                    {{ isSpanish ? 'Película' : 'Movie' }}
                                </span>

                <strong>{{ executionMovie(item) }}</strong>
              </div>

              <div class="ex-info-item">
                                <span>
                                    {{ isSpanish ? 'Estado' : 'Status' }}
                                </span>

                <strong>{{ statusLabel(item.status) }}</strong>
              </div>
            </div>

            <div
                v-if="canControl(item)"
                class="ex-controls"
            >
              <button
                  type="button"
                  class="ex-button ex-button-secondary"
                  :disabled="busy || !canPause(item)"
                  @click="command(item, 'pause')"
              >
                <i class="pi pi-pause"/>

                {{ isSpanish ? 'Pausar' : 'Pause' }}
              </button>

              <button
                  type="button"
                  class="ex-button ex-button-primary"
                  :disabled="busy || !canResume(item)"
                  @click="command(item, 'resume')"
              >
                <i class="pi pi-play"/>

                {{ isSpanish ? 'Reanudar' : 'Resume' }}
              </button>

              <button
                  type="button"
                  class="ex-button ex-button-secondary"
                  :disabled="busy || !canControl(item)"
                  @click="command(item, 'finish')"
              >
                <i class="pi pi-check-circle"/>

                {{ isSpanish ? 'Finalizar' : 'Finish' }}
              </button>
            </div>

            <form
                v-if="canControl(item)"
                class="ex-emergency"
                @submit.prevent="command(item, 'emergency-stop')"
            >
              <div class="ex-emergency-title">
                <i class="pi pi-exclamation-triangle"/>

                {{
                  isSpanish
                      ? 'Control de emergencia'
                      : 'Emergency Control'
                }}
              </div>

              <div class="ex-form-row">
                <div class="ex-field">
                  <label :for="`emergency-${item.id}`">
                    {{
                      isSpanish
                          ? 'Motivo de emergencia'
                          : 'Emergency reason'
                    }}
                  </label>

                  <input
                      :id="`emergency-${item.id}`"
                      v-model="reasons[item.id]"
                      class="ex-input"
                      type="text"
                      required
                      :disabled="busy"
                      :placeholder="
                                            isSpanish
                                                ? 'Ingresa el motivo'
                                                : 'Enter the reason'
                                        "
                  />
                </div>

                <button
                    type="submit"
                    class="ex-button ex-button-danger"
                    :disabled="busy || !String(reasons[item.id] ?? '').trim()"
                >
                  <i class="pi pi-stop-circle"/>

                  {{
                    isSpanish
                        ? 'Parada de emergencia'
                        : 'Emergency Stop'
                  }}
                </button>
              </div>
            </form>

            <details class="ex-details">
              <summary>
                {{
                  isSpanish
                      ? 'Ver detalles de ejecución'
                      : 'View execution details'
                }}
              </summary>

              <div class="ex-details-content">
                <BackendRecords :value="item"/>
              </div>
            </details>
          </div>
        </article>
      </div>

      <footer class="ex-card-footer">
        {{
          isSpanish
              ? `Mostrando ${filteredItems.length} de ${items.length} ejecuciones`
              : `Showing ${filteredItems.length} of ${items.length} executions`
        }}
      </footer>
    </article>
  </section>
</template>