<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
  value: {
    required: true
  }
});

const { locale } = useI18n();

const isSpanish = computed(() => locale.value.startsWith('es'));

const names = {
  id: ['ID', 'ID'],
  movieId: ['Movie', 'Película'],
  showId: ['Show', 'Función'],
  roomId: ['Room', 'Sala'],
  cinemaId: ['Cinema', 'Cine'],
  planId: ['Plan', 'Plan'],
  name: ['Name', 'Nombre'],
  title: ['Title', 'Título'],
  status: ['Status', 'Estado'],
  capacity: ['Capacity', 'Capacidad'],
  providerName: ['Provider', 'Proveedor'],
  inspections: ['Inspections', 'Inspecciones'],
  blocks: ['Blocks', 'Bloqueos'],
  tracks: ['Tracks', 'Pistas'],
  history: ['History', 'Historial'],
  sequences: ['Sequences', 'Secuencias'],
  syncEvents: ['Synchronization', 'Sincronización'],
  hardwareLogs: ['Hardware logs', 'Registros de hardware'],
  emergencyEvents: ['Emergency events', 'Emergencias'],
  syncLogs: ['Synchronization logs', 'Registros de sincronización'],
  occupancies: ['Occupancy', 'Ocupación'],
  transactions: ['Transactions', 'Pagos'],
  upgrades: ['Plan upgrades', 'Cambios de plan'],
  startDateTime: ['Start', 'Inicio'],
  endDateTime: ['End', 'Fin'],
  startDate: ['Start date', 'Fecha de inicio'],
  endDate: ['End date', 'Fecha de fin'],
  observations: ['Observations', 'Observaciones'],
  result: ['Result', 'Resultado'],
  active: ['Active', 'Activo'],
  reason: ['Reason', 'Motivo'],
  intensityLevel: ['Intensity', 'Intensidad'],
  effectType: ['Effect', 'Efecto'],
  filePath: ['File', 'Archivo'],
  durationSeconds: ['Duration (seconds)', 'Duración (segundos)'],
  previousIntensity: ['Previous intensity', 'Intensidad anterior'],
  newIntensity: ['New intensity', 'Nueva intensidad'],
  changedAt: ['Change date', 'Fecha del cambio'],
  sensoryContentId: ['Sensory content', 'Contenido sensorial'],
  startedAt: ['Started at', 'Inicio'],
  finishedAt: ['Finished at', 'Finalización'],
  price: ['Price', 'Precio'],
  maxScreens: ['Maximum screens', 'Máximo de pantallas']
};

const label = (key) => {
  if (names[key]) {
    return names[key][isSpanish.value ? 1 : 0];
  }

  const formatted = key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ');

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value
        ? (isSpanish.value ? 'Sí' : 'Yes')
        : 'No';
  }

  return value;
};

const getStatusClass = (value) => {
  const status = String(value).trim().toLowerCase();

  if ([
    'active',
    'available',
    'completed',
    'ready',
    'approved',
    'valid',
    'success'
  ].includes(status)) {
    return 'status-success';
  }

  if ([
    'pending',
    'processing',
    'scheduled',
    'warning',
    'inprogress',
    'in progress'
  ].includes(status)) {
    return 'status-warning';
  }

  if ([
    'failed',
    'error',
    'rejected',
    'cancelled',
    'canceled',
    'invalid'
  ].includes(status)) {
    return 'status-danger';
  }

  return 'status-neutral';
};
</script>

<template>
  <div class="backend-records">

    <template v-if="Array.isArray(value)">

      <div v-if="!value.length" class="records-empty">
        <i class="pi pi-inbox"/>

        <span>
          {{ isSpanish ? 'Sin registros disponibles.' : 'No records available.' }}
        </span>
      </div>

      <div v-else class="records-list">

        <article
            v-for="(item, index) in value"
            :key="item?.id ?? index"
            class="record-item"
        >
          <div class="record-item-header">
            <i class="pi pi-file"/>

            <span>
              {{ isSpanish ? 'Registro' : 'Record' }}
              #{{ item?.id ?? index + 1 }}
            </span>
          </div>

          <div class="record-item-body">
            <backend-records :value="item"/>
          </div>
        </article>

      </div>

    </template>

    <template v-else-if="value && typeof value === 'object'">

      <div v-if="!Object.keys(value).length" class="records-empty">
        <i class="pi pi-inbox"/>

        <span>
          {{ isSpanish ? 'Sin información disponible.' : 'No information available.' }}
        </span>
      </div>

      <dl v-else class="records-grid">

        <template v-for="(item, key) in value" :key="key">

          <template v-if="item && typeof item === 'object'">

            <div class="nested-record">

              <details class="record-details">

                <summary>
                  <i class="pi pi-chevron-right expand-icon"/>

                  <i class="pi pi-folder nested-icon"/>

                  <span>{{ label(key) }}</span>

                  <span
                      v-if="Array.isArray(item)"
                      class="nested-count"
                  >
                    {{ item.length }}
                  </span>
                </summary>

                <div class="nested-body">
                  <backend-records :value="item"/>
                </div>

              </details>

            </div>

          </template>

          <template v-else>

            <dt class="record-label">
              {{ label(key) }}
            </dt>

            <dd class="record-value">

              <span
                  v-if="typeof item === 'boolean'"
                  class="record-status"
                  :class="item ? 'status-success' : 'status-neutral'"
              >
                <i :class="item ? 'pi pi-check-circle' : 'pi pi-minus-circle'"/>

                {{ formatValue(item) }}
              </span>

              <span
                  v-else-if="key === 'status' && item !== null && item !== undefined"
                  class="record-status"
                  :class="getStatusClass(item)"
              >
                <span class="status-dot"/>

                {{ formatValue(item) }}
              </span>

              <span
                  v-else-if="key === 'filePath' && item"
                  class="file-value"
              >
                <i class="pi pi-file"/>

                {{ item }}
              </span>

              <span v-else>
                {{ formatValue(item) }}
              </span>

            </dd>

          </template>

        </template>

      </dl>

    </template>

    <div
        v-else-if="value === null || value === undefined"
        class="records-empty"
    >
      <i class="pi pi-inbox"/>

      <span>
        {{ isSpanish ? 'Sin información disponible.' : 'No information available.' }}
      </span>
    </div>

    <span v-else class="primitive-value">
      {{ formatValue(value) }}
    </span>

  </div>
</template>

<style scoped>
.backend-records {
  width: 100%;
  min-width: 0;
  color: #d6d8e2;
  font-size: 0.8rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.records-grid {
  display: grid;
  grid-template-columns: minmax(130px, 1fr) minmax(0, 2fr);
  align-items: start;
  gap: 0;
  margin: 0;
}

.record-label,
.record-value {
  min-width: 0;
  margin: 0;
  padding: 0.8rem 0.9rem;
  border-bottom: 1px solid #292b3a;
}

.record-label {
  align-self: stretch;
  color: #9299ad;
  font-size: 0.78rem;
  font-weight: 500;
}

.record-value {
  align-self: stretch;
  color: #e0e1e9;
  font-size: 0.8rem;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.record-item {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #303242;
  border-radius: 8px;
  background: #14151e;
}

.record-item-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #292b3a;
  background: #1c1e29;
  color: #c5c9d5;
  font-size: 0.75rem;
  font-weight: 500;
}

.record-item-header i {
  color: #a78bfa;
  font-size: 0.8rem;
}

.record-item-body {
  padding: 0.75rem;
}

.nested-record {
  grid-column: 1 / -1;
  min-width: 0;
  margin-top: 0.75rem;
}

.record-details {
  overflow: hidden;
  border: 1px solid #303242;
  border-radius: 8px;
  background: #14151e;
}

.record-details summary {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  color: #c5c9d5;
  font-size: 0.78rem;
  font-weight: 500;
  list-style: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.record-details summary::-webkit-details-marker {
  display: none;
}

.record-details summary:hover {
  background: rgba(139, 92, 246, 0.06);
}

.expand-icon {
  color: #858da3;
  font-size: 0.65rem;
  transition: transform 0.2s ease;
}

.record-details[open] > summary .expand-icon {
  transform: rotate(90deg);
}

.nested-icon {
  color: #a78bfa;
  font-size: 0.85rem;
}

.nested-count {
  margin-left: auto;
  padding: 0.15rem 0.5rem;
  border: 1px solid #343646;
  border-radius: 5px;
  background: #20212c;
  color: #a6adbf;
  font-size: 0.7rem;
}

.nested-body {
  padding: 1rem;
  border-top: 1px solid #292b3a;
}

.record-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border: 1px solid transparent;
  border-radius: 5px;
  font-size: 0.72rem;
  font-weight: 500;
}

.record-status i {
  font-size: 0.75rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: currentColor;
}

.status-success {
  border-color: rgba(52, 214, 176, 0.2);
  background: rgba(52, 214, 176, 0.08);
  color: #34d6b0;
}

.status-warning {
  border-color: rgba(251, 191, 36, 0.18);
  background: rgba(251, 191, 36, 0.08);
  color: #fbbf24;
}

.status-danger {
  border-color: rgba(248, 113, 113, 0.2);
  background: rgba(248, 113, 113, 0.08);
  color: #f87171;
}

.status-neutral {
  border-color: rgba(148, 163, 184, 0.18);
  background: rgba(148, 163, 184, 0.08);
  color: #94a3b8;
}

.file-value {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: #b49afa;
  overflow-wrap: anywhere;
}

.file-value i {
  flex-shrink: 0;
  margin-top: 0.2rem;
  font-size: 0.8rem;
}

.records-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  min-height: 90px;
  padding: 1.5rem;
  color: #858da3;
  font-size: 0.78rem;
  text-align: center;
}

.records-empty i {
  color: #737b91;
  font-size: 1.5rem;
}

.primitive-value {
  color: #d6d8e2;
  font-size: 0.8rem;
}

@media (max-width: 550px) {
  .records-grid {
    grid-template-columns: 1fr;
  }

  .record-label {
    padding-bottom: 0.25rem;
    border-bottom: none;
  }

  .record-value {
    padding-top: 0.25rem;
  }

  .nested-body {
    padding: 0.6rem;
  }
}
</style>
