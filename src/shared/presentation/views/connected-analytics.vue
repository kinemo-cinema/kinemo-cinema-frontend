<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBackend } from '../../application/use-backend.js';
import BackendRecords from '../components/backend-records.vue';
import '../analytics.css';

const { locale } = useI18n();
const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));

const tr = (es, en) => isSpanish.value ? es : en;

const activeTab = ref('dashboard');
const dashboard = ref(null);
const report = ref(null);
const dashboardId = ref(null);
const reportId = ref(null);
const reportType = ref('Operational');
const format = ref('PDF');
const message = ref('');
const validationError = ref('');

const period = ref({
  start: '',
  end: ''
});

const reportTypes = computed(() => [
  {
    value: 'Operational',
    label: tr('Operacional', 'Operational')
  },
  {
    value: 'Maintenance',
    label: tr('Mantenimiento', 'Maintenance')
  },
  {
    value: 'RoomPerformance',
    label: tr('Rendimiento de salas', 'Room Performance')
  }
]);

const resetMessages = () => {
  message.value = '';
  validationError.value = '';
};

const formatDateInput = (event, field) => {
  const digits = event.target.value
      .replace(/\D/g, '')
      .slice(0, 8);

  let value = digits.slice(0, 4);

  if (digits.length > 4) {
    value += '-' + digits.slice(4, 6);
  }

  if (digits.length > 6) {
    value += '-' + digits.slice(6, 8);
  }

  period.value[field] = value;
  event.target.value = value;
};

const toDate = (value, end = false) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  const date = new Date(
      `${value}T${end ? '23:59:59.999' : '00:00:00'}`
  );

  if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

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

const formatNumber = value => {
  if (typeof value !== 'number') return value ?? '—';

  return new Intl.NumberFormat(
      isSpanish.value ? 'es-PE' : 'en-US',
      {
        maximumFractionDigits: 2
      }
  ).format(value);
};

const metricLabel = key => {
  const labels = {
    totalShows: tr('Total de funciones', 'Total Shows'),
    scheduledShows: tr('Funciones programadas', 'Scheduled Shows'),
    completedShows: tr('Funciones completadas', 'Completed Shows'),
    totalRooms: tr('Total de salas', 'Total Rooms'),
    totalIncidents: tr('Total de incidentes', 'Total Incidents'),
    incidentCount: tr('Incidentes', 'Incidents'),
    emergencyStops: tr('Paradas de emergencia', 'Emergency Stops'),
    totalExecutions: tr('Total de ejecuciones', 'Total Executions'),
    plannedHours: tr('Horas planificadas', 'Planned Hours'),
    totalPlannedHours: tr('Horas planificadas', 'Total Planned Hours'),
    utilization: tr('Utilización', 'Utilization'),
    utilizationPercentage: tr('Porcentaje de utilización', 'Utilization Percentage'),
    utilizationRate: tr('Tasa de utilización', 'Utilization Rate')
  };

  return labels[key] ?? key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, letter => letter.toUpperCase());
};

const metrics = computed(() => {
  if (!dashboard.value) return [];

  const source = {
    ...dashboard.value,
    ...(dashboard.value.metrics ?? {})
  };

  return Object.entries(source)
      .filter(([key, value]) =>
          typeof value === 'number' &&
          Number.isFinite(value) &&
          !/id$/i.test(key)
      )
      .map(([key, value]) => ({
        key,
        label: metricLabel(key),
        value
      }));
});

const metricIcon = key => {
  const name = key.toLowerCase();

  if (name.includes('hour')) return 'pi pi-clock';
  if (name.includes('incident')) return 'pi pi-exclamation-triangle';
  if (name.includes('emergency')) return 'pi pi-exclamation-circle';
  if (name.includes('room')) return 'pi pi-building';
  if (name.includes('show')) return 'pi pi-video';
  if (name.includes('execution')) return 'pi pi-play-circle';

  return 'pi pi-chart-bar';
};

const chartMetrics = computed(() =>
    metrics.value.filter(item =>
        /utilizationPercentage|occupancyPercentage/i.test(item.key) &&
        item.value >= 0 &&
        item.value <= 100
    )
);

const latest = async () => {
  resetMessages();

  await run(async http => {
    try {
      dashboard.value = (
          await http.get('/analytics/dashboards/latest')
      ).data;
    } catch (failure) {
      if (failure.response?.status === 404) {
        dashboard.value = null;
      } else {
        throw failure;
      }
    }
  });
};

const generate = async type => {
  resetMessages();

  const start = toDate(period.value.start);
  const end = toDate(period.value.end, true);

  if (!start || !end || end <= start) {
    validationError.value = tr(
        'Selecciona un período válido.',
        'Select a valid period.'
    );

    return;
  }

  const payload = {
    periodStart: start.toISOString(),
    periodEnd: end.toISOString()
  };

  if (type === 'reports') {
    Object.assign(payload, {
      reportType: reportType.value,
      format: format.value
    });
  }

  const success = await run(async http => {
    const { data } = await http.post(
        `/analytics/${type}`,
        payload
    );

    if (type === 'reports') {
      report.value = data;
    } else {
      dashboard.value = data;
    }
  });

  if (success) {
    message.value = type === 'reports'
        ? tr(
            'Reporte generado correctamente.',
            'Report generated successfully.'
        )
        : tr(
            'Dashboard generado correctamente.',
            'Dashboard generated successfully.'
        );
  }
};

const lookup = async type => {
  resetMessages();

  const id = type === 'reports'
      ? reportId.value
      : dashboardId.value;

  if (!Number.isInteger(id) || id < 1) {
    validationError.value = tr(
        'Ingresa un ID válido.',
        'Enter a valid ID.'
    );

    return;
  }

  const success = await run(async http => {
    const { data } = await http.get(
        `/analytics/${type}/${id}`
    );

    if (type === 'reports') {
      report.value = data;
    } else {
      dashboard.value = data;
    }
  });

  if (success) {
    message.value = tr(
        'Registro encontrado correctamente.',
        'Record found successfully.'
    );
  }
};

const changeTab = tab => {
  activeTab.value = tab;
  resetMessages();
};

onMounted(latest);
</script>

<template>
  <section class="an-page">
    <div class="an-breadcrumb">
      <router-link to="/dashboard">
        Dashboard
      </router-link>

      <i class="pi pi-chevron-right"/>

      <span>
                {{ tr('Estadísticas', 'Analytics') }}
            </span>
    </div>

    <header class="an-heading">
      <div class="an-heading-content">
        <div class="an-module-icon">
          <i class="pi pi-chart-bar"/>
        </div>

        <div>
          <h1>
            {{ tr('Estadísticas', 'Analytics') }}
          </h1>

          <p>
            {{
              tr(
                  'Consulta indicadores y reportes del rendimiento del cine.',
                  'Review cinema performance indicators and reports.'
              )
            }}
          </p>
        </div>
      </div>

      <span class="an-badge">BC08</span>
    </header>

    <nav class="an-nav">
      <button
          type="button"
          :class="{ 'an-active': activeTab === 'dashboard' }"
          :disabled="busy"
          @click="changeTab('dashboard')"
      >
        <i class="pi pi-chart-bar"/>

        Dashboard
      </button>

      <button
          type="button"
          :class="{ 'an-active': activeTab === 'reports' }"
          :disabled="busy"
          @click="changeTab('reports')"
      >
        <i class="pi pi-file"/>

        {{ tr('Reportes', 'Reports') }}
      </button>
    </nav>

    <div class="an-alert an-alert-info">
      <i class="pi pi-info-circle"/>

      {{
        tr(
            'La utilización y las horas planificadas se calculan según las funciones registradas del período. Los incidentes corresponden a paradas de emergencia y no incluyen mantenimiento.',
            'Utilization and planned hours are based on registered shows within the period. Incidents correspond to emergency stops and exclude maintenance.'
        )
      }}
    </div>

    <div
        v-if="error || validationError"
        class="an-alert an-alert-error"
        role="alert"
    >
      <i class="pi pi-exclamation-circle"/>

      {{ validationError || error }}
    </div>

    <div
        v-if="message"
        class="an-alert an-alert-success"
        role="status"
    >
      <i class="pi pi-check-circle"/>

      {{ message }}
    </div>

    <article class="an-card">
      <header class="an-card-header">
        <div>
          <h2>
            {{ tr('Período de análisis', 'Analysis Period') }}
          </h2>

          <p>
            {{
              tr(
                  'Selecciona el intervalo de fechas que deseas consultar.',
                  'Select the date range you want to analyze.'
              )
            }}
          </p>
        </div>

        <i class="pi pi-calendar"/>
      </header>

      <div class="an-card-body">
        <form
            class="an-form"
            @submit.prevent="generate(
                        activeTab === 'dashboard'
                            ? 'dashboards'
                            : 'reports'
                    )"
        >
          <div class="an-form-grid">
            <div class="an-field">
              <label for="period-start">
                {{ tr('Fecha de inicio', 'Start Date') }}
              </label>

              <input
                  id="period-start"
                  :value="period.start"
                  class="an-input"
                  type="text"
                  inputmode="numeric"
                  maxlength="10"
                  placeholder="YYYY-MM-DD"
                  required
                  :disabled="busy"
                  @input="formatDateInput($event, 'start')"
              />
            </div>

            <div class="an-field">
              <label for="period-end">
                {{ tr('Fecha de fin', 'End Date') }}
              </label>

              <input
                  id="period-end"
                  :value="period.end"
                  class="an-input"
                  type="text"
                  inputmode="numeric"
                  maxlength="10"
                  placeholder="YYYY-MM-DD"
                  required
                  :disabled="busy"
                  @input="formatDateInput($event, 'end')"
              />
            </div>
          </div>

          <div
              v-if="activeTab === 'reports'"
              class="an-form-grid"
          >
            <div class="an-field">
              <label for="report-type">
                {{ tr('Tipo de reporte', 'Report Type') }}
              </label>

              <select
                  id="report-type"
                  v-model="reportType"
                  class="an-select"
                  :disabled="busy"
              >
                <option
                    v-for="option in reportTypes"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="an-field">
              <label for="report-format">
                {{ tr('Formato', 'Format') }}
              </label>

              <select
                  id="report-format"
                  v-model="format"
                  class="an-select"
                  :disabled="busy"
              >
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>

          <div class="an-actions">
            <button
                v-if="activeTab === 'dashboard'"
                type="button"
                class="an-button an-button-secondary"
                :disabled="busy"
                @click="latest"
            >
              <i class="pi pi-refresh"/>

              {{ tr('Último dashboard', 'Latest Dashboard') }}
            </button>

            <button
                type="submit"
                class="an-button an-button-primary"
                :disabled="busy"
            >
              <i
                  :class="
                                    busy
                                        ? 'pi pi-spin pi-spinner'
                                        : activeTab === 'dashboard'
                                            ? 'pi pi-chart-bar'
                                            : 'pi pi-file'
                                "
              />

              {{
                activeTab === 'dashboard'
                    ? tr('Generar dashboard', 'Generate Dashboard')
                    : tr('Generar reporte', 'Generate Report')
              }}
            </button>
          </div>
        </form>
      </div>
    </article>

    <template v-if="activeTab === 'dashboard'">
      <div
          v-if="dashboard && metrics.length"
          class="an-stats"
      >
        <article
            v-for="metric in metrics"
            :key="metric.key"
            class="an-stat"
        >
          <div class="an-stat-top">
            <span>{{ metric.label }}</span>

            <i :class="metricIcon(metric.key)"/>
          </div>

          <strong>
            {{ formatNumber(metric.value) }}
            {{ /percentage/i.test(metric.key) ? '%' : '' }}
          </strong>
        </article>
      </div>

      <article
          v-if="dashboard && chartMetrics.length"
          class="an-card"
      >
        <header class="an-card-header">
          <div>
            <h2>
              {{ tr('Indicadores de rendimiento', 'Performance Indicators') }}
            </h2>

            <p>
              {{
                tr(
                    'Visualización porcentual del período seleccionado.',
                    'Percentage overview of the selected period.'
                )
              }}
            </p>
          </div>

          <i class="pi pi-chart-bar"/>
        </header>

        <div class="an-card-body">
          <div class="an-chart">
            <div
                v-for="metric in chartMetrics"
                :key="metric.key"
                class="an-chart-item"
            >
              <div class="an-chart-label">
                <span>{{ metric.label }}</span>

                <strong>
                  {{ formatNumber(metric.value) }}%
                </strong>
              </div>

              <div class="an-chart-track">
                <div
                    class="an-chart-bar"
                    :style="{ width: `${metric.value}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </article>

      <article class="an-card">
        <header class="an-card-header">
          <div>
            <h2>
              {{ tr('Resultados del dashboard', 'Dashboard Results') }}
            </h2>

            <p>
              {{
                tr(
                    'Información registrada del período analizado.',
                    'Registered information for the analyzed period.'
                )
              }}
            </p>
          </div>

          <span
              v-if="dashboard"
              class="an-badge"
          >
                        #{{ dashboard.id }}
                    </span>
        </header>

        <div
            v-if="dashboard"
            class="an-card-body"
        >
          <div class="an-information">
            <div class="an-info-item">
              <span>Dashboard ID</span>

              <strong>#{{ dashboard.id }}</strong>
            </div>

            <div class="an-info-item">
              <span>{{ tr('Inicio del período', 'Period Start') }}</span>

              <strong>
                {{ formatDate(dashboard.periodStart) }}
              </strong>
            </div>

            <div class="an-info-item">
              <span>{{ tr('Fin del período', 'Period End') }}</span>

              <strong>
                {{ formatDate(dashboard.periodEnd) }}
              </strong>
            </div>
          </div>

          <details
              class="an-details"
              :open="!metrics.length"
          >
            <summary>
              {{ tr('Ver información completa', 'View Full Information') }}
            </summary>

            <div class="an-details-content">
              <BackendRecords :value="dashboard"/>
            </div>
          </details>
        </div>

        <div
            v-else
            class="an-empty"
        >
          <i
              :class="
                            busy
                                ? 'pi pi-spin pi-spinner'
                                : 'pi pi-chart-bar'
                        "
          />

          <h3>
            {{
              busy
                  ? tr('Cargando...', 'Loading...')
                  : tr('Sin dashboard generado', 'No Dashboard Generated')
            }}
          </h3>

          <p v-if="!busy">
            {{
              tr(
                  'Selecciona un período para consultar los indicadores.',
                  'Select a period to view performance indicators.'
              )
            }}
          </p>
        </div>
      </article>

      <article class="an-card">
        <header class="an-card-header">
          <div>
            <h2>
              {{ tr('Consultar dashboard', 'Find Dashboard') }}
            </h2>

            <p>
              {{
                tr(
                    'Busca un dashboard previamente generado.',
                    'Find a previously generated dashboard.'
                )
              }}
            </p>
          </div>
        </header>

        <div class="an-card-body">
          <form
              class="an-form"
              @submit.prevent="lookup('dashboards')"
          >
            <div class="an-field">
              <label for="dashboard-id">
                Dashboard ID
              </label>

              <input
                  id="dashboard-id"
                  v-model.number="dashboardId"
                  class="an-input"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  required
                  :disabled="busy"
              />
            </div>

            <div class="an-actions">
              <button
                  type="submit"
                  class="an-button an-button-secondary"
                  :disabled="busy"
              >
                <i class="pi pi-search"/>

                {{ tr('Consultar', 'Search') }}
              </button>
            </div>
          </form>
        </div>
      </article>
    </template>

    <template v-else>
      <article class="an-card">
        <header class="an-card-header">
          <div>
            <h2>
              {{ tr('Resultado del reporte', 'Report Results') }}
            </h2>

            <p>
              {{
                tr(
                    'Consulta la información del reporte generado.',
                    'Review the generated report information.'
                )
              }}
            </p>
          </div>

          <span
              v-if="report"
              class="an-badge"
          >
                        #{{ report.id }}
                    </span>
        </header>

        <div
            v-if="report"
            class="an-card-body"
        >
          <div class="an-information">
            <div class="an-info-item">
              <span>Report ID</span>

              <strong>#{{ report.id }}</strong>
            </div>

            <div class="an-info-item">
              <span>{{ tr('Tipo', 'Type') }}</span>

              <strong>
                {{
                  reportTypes.find(
                      option => option.value === report.reportType
                  )?.label ?? report.reportType ?? '—'
                }}
              </strong>
            </div>

            <div class="an-info-item">
              <span>{{ tr('Formato', 'Format') }}</span>

              <strong>
                {{ report.format ?? '—' }}
              </strong>
            </div>
          </div>

          <details
              class="an-details"
              open
          >
            <summary>
              {{ tr('Detalles del reporte', 'Report Details') }}
            </summary>

            <div class="an-details-content">
              <BackendRecords :value="report"/>
            </div>
          </details>
        </div>

        <div
            v-else
            class="an-empty"
        >
          <i
              :class="
                            busy
                                ? 'pi pi-spin pi-spinner'
                                : 'pi pi-file'
                        "
          />

          <h3>
            {{
              busy
                  ? tr('Cargando...', 'Loading...')
                  : tr('Sin reporte generado', 'No Report Generated')
            }}
          </h3>

          <p v-if="!busy">
            {{
              tr(
                  'Selecciona el período y el tipo de reporte.',
                  'Select the period and report type.'
              )
            }}
          </p>
        </div>
      </article>

      <article class="an-card">
        <header class="an-card-header">
          <div>
            <h2>
              {{ tr('Consultar reporte', 'Find Report') }}
            </h2>

            <p>
              {{
                tr(
                    'Busca un reporte previamente registrado.',
                    'Find a previously registered report.'
                )
              }}
            </p>
          </div>
        </header>

        <div class="an-card-body">
          <form
              class="an-form"
              @submit.prevent="lookup('reports')"
          >
            <div class="an-field">
              <label for="report-id">
                Report ID
              </label>

              <input
                  id="report-id"
                  v-model.number="reportId"
                  class="an-input"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  required
                  :disabled="busy"
              />
            </div>

            <div class="an-actions">
              <button
                  type="submit"
                  class="an-button an-button-secondary"
                  :disabled="busy"
              >
                <i class="pi pi-search"/>

                {{ tr('Consultar', 'Search') }}
              </button>
            </div>
          </form>
        </div>
      </article>
    </template> </section>
</template>