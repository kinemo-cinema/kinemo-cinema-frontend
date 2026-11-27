<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';

const { locale } = useI18n();
const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));

const tr = (es, en) => isSpanish.value ? es : en;

const equipment = ref([]);
const rooms = ref([]);
const orders = ref({});
const selectedId = ref(null);
const search = ref('');
const roomFilter = ref('');
const message = ref('');
const validationError = ref('');
const notes = ref({});

const form = ref({
  roomId: null,
  name: '',
  equipmentType: 'MotionSeat',
  usefulLifeHours: 1000
});

const incident = ref({
  description: '',
  severity: 'Medium'
});

const channel = ref('Motion');

const schedule = ref({
  incidentId: null,
  type: 'Preventive',
  date: ''
});

const equipmentTypes = computed(() => [
  { value: 'MotionSeat', label: tr('Asiento móvil', 'Motion Seat') },
  { value: 'WindSystem', label: tr('Sistema de viento', 'Wind System') },
  { value: 'WaterSystem', label: tr('Sistema de agua', 'Water System') },
  { value: 'VibrationSystem', label: tr('Sistema de vibración', 'Vibration System') },
  { value: 'Controller', label: tr('Controlador', 'Controller') }
]);

const severityOptions = computed(() => [
  { value: 'Low', label: tr('Baja', 'Low') },
  { value: 'Medium', label: tr('Media', 'Medium') },
  { value: 'High', label: tr('Alta', 'High') },
  { value: 'Critical', label: tr('Crítica', 'Critical') }
]);

const channelOptions = computed(() => [
  { value: 'Motion', label: tr('Movimiento', 'Motion') },
  { value: 'Wind', label: tr('Viento', 'Wind') },
  { value: 'Water', label: tr('Agua', 'Water') },
  { value: 'Vibration', label: tr('Vibración', 'Vibration') }
]);

const orderTypes = computed(() => [
  { value: 'Preventive', label: tr('Preventivo', 'Preventive') },
  { value: 'Corrective', label: tr('Correctivo', 'Corrective') }
]);

const selected = computed(() =>
    equipment.value.find(item =>
        String(item.id) === String(selectedId.value)
    )
);

const selectedOrders = computed(() =>
    orders.value[selectedId.value] ?? []
);

const allOrders = computed(() =>
    Object.values(orders.value).flat()
);

const normalizeStatus = value =>
    String(value ?? '').replace(/[\s_-]/g, '').toUpperCase();

const isCompleted = order =>
    normalizeStatus(order.status) === 'COMPLETED';

const incidentCount = computed(() =>
    equipment.value.reduce(
        (total, item) => total + (item.incidents?.length ?? 0),
        0
    )
);

const pendingOrders = computed(() =>
    allOrders.value.filter(order =>
        !['COMPLETED', 'CANCELLED', 'CANCELED', 'CLOSED'].includes(
            normalizeStatus(order.status)
        )
    ).length
);

const completedOrders = computed(() =>
    allOrders.value.filter(isCompleted).length
);

const roomName = id =>
    rooms.value.find(room =>
        String(room.id) === String(id)
    )?.name ?? `#${id ?? '—'}`;

const typeLabel = value =>
    equipmentTypes.value.find(option =>
        option.value === value
    )?.label ?? value ?? '—';

const orderTypeLabel = value =>
    orderTypes.value.find(option =>
        option.value === value
    )?.label ?? value ?? '—';

const statusLabel = value => {
  const labels = {
    AVAILABLE: tr('Disponible', 'Available'),
    OPERATIONAL: tr('Operativo', 'Operational'),
    ACTIVE: tr('Activo', 'Active'),
    MAINTENANCE: tr('En mantenimiento', 'Maintenance'),
    UNDERMAINTENANCE: tr('En mantenimiento', 'Under maintenance'),
    OUTOFSERVICE: tr('Fuera de servicio', 'Out of service'),
    INACTIVE: tr('Inactivo', 'Inactive'),
    SCHEDULED: tr('Programado', 'Scheduled'),
    INPROGRESS: tr('En progreso', 'In progress'),
    COMPLETED: tr('Completado', 'Completed'),
    PENDING: tr('Pendiente', 'Pending'),
    CANCELLED: tr('Cancelado', 'Cancelled'),
    CANCELED: tr('Cancelado', 'Canceled'),
    CLOSED: tr('Cerrado', 'Closed'),
    REPORTED: tr('Reportado', 'Reported'),
    RESOLVED: tr('Resuelto', 'Resolved'),
    PASSED: tr('Aprobado', 'Passed'),
    FAILED: tr('Fallido', 'Failed'),
    WITHINLIMIT: tr('Dentro del límite', 'Within limit'),
    NEARLIMIT: tr('Cerca del límite', 'Near limit'),
    EXCEEDED: tr('Límite excedido', 'Exceeded')
  };

  return labels[normalizeStatus(value)] ?? value ?? '—';
};

const statusClass = value => {
  const status = normalizeStatus(value);

  if ([
    'AVAILABLE',
    'OPERATIONAL',
    'ACTIVE',
    'COMPLETED',
    'RESOLVED',
    'PASSED',
    'WITHINLIMIT'
  ].includes(status)) {
    return 'mt-status-success';
  }

  if ([
    'MAINTENANCE',
    'UNDERMAINTENANCE',
    'SCHEDULED',
    'PENDING',
    'REPORTED',
    'NEARLIMIT'
  ].includes(status)) {
    return 'mt-status-warning';
  }

  if ([
    'OUTOFSERVICE',
    'FAILED',
    'CANCELLED',
    'CANCELED',
    'EXCEEDED'
  ].includes(status)) {
    return 'mt-status-danger';
  }

  if (status === 'INPROGRESS') {
    return 'mt-status-progress';
  }

  return '';
};

const filteredEquipment = computed(() => {
  const query = search.value.trim().toLowerCase();

  return equipment.value.filter(item => {
    const matchesSearch =
        !query ||
        String(item.id).includes(query) ||
        String(item.name ?? '').toLowerCase().includes(query) ||
        typeLabel(item.equipmentType).toLowerCase().includes(query) ||
        roomName(item.roomId).toLowerCase().includes(query);

    const matchesRoom =
        !roomFilter.value ||
        String(item.roomId) === String(roomFilter.value);

    return matchesSearch && matchesRoom;
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

const formatDateInput = event => {
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

  schedule.value.date = value;
  event.target.value = value;
};

const toISO = value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  const date = new Date(`${value}T09:00:00`);

  if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
  ) {
    return null;
  }

  return date.toISOString();
};

const asArray = data => {
  const value = data?.value ?? data;

  return Array.isArray(value) ? value : [];
};

const resetMessages = () => {
  message.value = '';
  validationError.value = '';
};

const selectEquipment = item => {
  selectedId.value = item.id;

  incident.value = {
    description: '',
    severity: 'Medium'
  };

  schedule.value = {
    incidentId: null,
    type: 'Preventive',
    date: ''
  };

  channel.value = 'Motion';

  resetMessages();
};

const load = async () => {
  resetMessages();

  await run(async http => {
    const responses = await Promise.all([
      http.get('/equipment'),
      http.get('/rooms')
    ]);

    const loadedEquipment = asArray(responses[0].data);
    const loadedRooms = asArray(responses[1].data);

    const histories = await Promise.all(
        loadedEquipment.map(item =>
            http.get(`/maintenance-orders/equipment/${item.id}`)
        )
    );

    equipment.value = loadedEquipment;
    rooms.value = loadedRooms;

    orders.value = Object.fromEntries(
        loadedEquipment.map((item, index) => [
          item.id,
          asArray(histories[index].data)
        ])
    );

    if (
        selectedId.value &&
        !equipment.value.some(item =>
            String(item.id) === String(selectedId.value)
        )
    ) {
      selectedId.value = null;
    }
  });
};

const create = async () => {
  resetMessages();

  if (!form.value.roomId || !form.value.name.trim()) {
    validationError.value = tr(
        'Completa la sala y el nombre del equipo.',
        'Complete the room and equipment name.'
    );

    return;
  }

  if (
      !Number.isInteger(form.value.usefulLifeHours) ||
      form.value.usefulLifeHours < 1 ||
      form.value.usefulLifeHours > 1000000
  ) {
    validationError.value = tr(
        'Ingresa una vida útil válida.',
        'Enter a valid useful life.'
    );

    return;
  }

  const success = await run(async http => {
    const { data } = await http.post('/equipment', {
      roomId: form.value.roomId,
      name: form.value.name.trim(),
      equipmentType: form.value.equipmentType,
      usefulLifeHours: form.value.usefulLifeHours
    });

    equipment.value.push(data);
    orders.value[data.id] = [];

    selectEquipment(data);

    form.value = {
      roomId: null,
      name: '',
      equipmentType: 'MotionSeat',
      usefulLifeHours: 1000
    };
  });

  if (success) {
    message.value = tr(
        'Equipo registrado correctamente.',
        'Equipment registered successfully.'
    );
  }
};

const updateEquipment = data => {
  equipment.value = equipment.value.map(item =>
      String(item.id) === String(data.id)
          ? data
          : item
  );
};

const report = async () => {
  resetMessages();

  if (!selected.value || !incident.value.description.trim()) {
    validationError.value = tr(
        'Ingresa la descripción del incidente.',
        'Enter the incident description.'
    );

    return;
  }

  const success = await run(async http => {
    const { data } = await http.post(
        `/equipment/${selectedId.value}/incidents`,
        {
          description: incident.value.description.trim(),
          severity: incident.value.severity
        }
    );

    updateEquipment(data);

    incident.value.description = '';
    incident.value.severity = 'Medium';
  });

  if (success) {
    message.value = tr(
        'Incidente registrado correctamente.',
        'Incident reported successfully.'
    );
  }
};

const test = async () => {
  resetMessages();

  if (!selected.value) return;

  const success = await run(async http => {
    const { data } = await http.post(
        `/equipment/${selectedId.value}/tests`,
        { channel: channel.value }
    );

    updateEquipment(data);
  });

  if (success) {
    message.value = tr(
        'Diagnóstico registrado correctamente.',
        'Diagnostic registered successfully.'
    );
  }
};

const scheduleOrder = async () => {
  resetMessages();

  if (!selected.value) return;

  const scheduledDate = toISO(schedule.value.date);

  if (!scheduledDate) {
    validationError.value = tr(
        'Ingresa una fecha válida en formato YYYY-MM-DD.',
        'Enter a valid date in YYYY-MM-DD format.'
    );

    return;
  }

  const success = await run(async http => {
    const { data } = await http.post(
        '/maintenance-orders',
        {
          equipmentId: selectedId.value,
          incidentId: schedule.value.incidentId,
          type: schedule.value.type,
          scheduledDate
        }
    );

    orders.value[selectedId.value] = [
      ...(orders.value[selectedId.value] ?? []),
      data
    ];

    schedule.value = {
      incidentId: null,
      type: 'Preventive',
      date: ''
    };
  });

  if (success) {
    message.value = tr(
        'Mantenimiento programado correctamente.',
        'Maintenance scheduled successfully.'
    );
  }
};

const complete = async order => {
  resetMessages();

  const completionNotes = String(
      notes.value[order.id] ?? ''
  ).trim();

  if (!completionNotes) {
    validationError.value = tr(
        'Ingresa las notas de cierre.',
        'Enter the completion notes.'
    );

    return;
  }

  const success = await run(async http => {
    const { data } = await http.post(
        `/maintenance-orders/${order.id}/completion`,
        { notes: completionNotes }
    );

    orders.value[order.equipmentId] =
        (orders.value[order.equipmentId] ?? []).map(item =>
            String(item.id) === String(data.id)
                ? data
                : item
        );

    notes.value[order.id] = '';

    const response = await http.get(
        `/equipment/${order.equipmentId}`
    );

    updateEquipment(response.data);
  });

  if (success) {
    message.value = tr(
        'Orden completada correctamente.',
        'Maintenance order completed successfully.'
    );
  }
};

onMounted(load);
</script>

<template>
  <section class="mt-page">
    <header class="mt-section-header">
      <div>
        <h2>
          {{ tr('Control de mantenimiento', 'Maintenance Control') }}
        </h2>

        <p>
          {{
            tr(
                'Supervisa el estado de los equipos del cine.',
                'Monitor the condition of cinema equipment.'
            )
          }}
        </p>
      </div>

      <button
          type="button"
          class="mt-button mt-button-secondary"
          :disabled="busy"
          @click="load"
      >
        <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"/>

        {{ tr('Actualizar', 'Refresh') }}
      </button>
    </header>

    <div class="mt-stats">
      <article class="mt-stat">
        <div class="mt-stat-top">
                    <span>
                        {{ tr('Equipos registrados', 'Registered Equipment') }}
                    </span>

          <i class="pi pi-cog"/>
        </div>

        <strong>{{ equipment.length }}</strong>
      </article>

      <article class="mt-stat">
        <div class="mt-stat-top">
                    <span>
                        {{ tr('Incidentes registrados', 'Reported Incidents') }}
                    </span>

          <i class="pi pi-exclamation-triangle"/>
        </div>

        <strong>{{ incidentCount }}</strong>
      </article>

      <article class="mt-stat">
        <div class="mt-stat-top">
                    <span>
                        {{ tr('Órdenes pendientes', 'Pending Orders') }}
                    </span>

          <i class="pi pi-wrench"/>
        </div>

        <strong>{{ pendingOrders }}</strong>
      </article>

      <article class="mt-stat">
        <div class="mt-stat-top">
                    <span>
                        {{ tr('Órdenes completadas', 'Completed Orders') }}
                    </span>

          <i class="pi pi-check-circle"/>
        </div>

        <strong>{{ completedOrders }}</strong>
      </article>
    </div>

    <div
        v-if="error || validationError"
        class="mt-alert mt-alert-error"
        role="alert"
    >
      <i class="pi pi-exclamation-circle"/>

      {{ validationError || error }}
    </div>

    <div
        v-if="message"
        class="mt-alert mt-alert-success"
        role="status"
    >
      <i class="pi pi-check-circle"/>

      {{ message }}
    </div>

    <article class="mt-card">
      <header class="mt-card-header">
        <div>
          <h3>
            {{ tr('Registrar equipo', 'Register Equipment') }}
          </h3>

          <p>
            {{
              tr(
                  'Añade un nuevo componente a una sala.',
                  'Add a new component to a cinema room.'
              )
            }}
          </p>
        </div>

        <i class="pi pi-plus-circle"/>
      </header>

      <div class="mt-card-body">
        <form
            class="mt-form"
            @submit.prevent="create"
        >
          <div class="mt-form-grid">
            <div class="mt-field">
              <label for="equipment-room">
                {{ tr('Sala', 'Room') }}
              </label>

              <select
                  id="equipment-room"
                  v-model="form.roomId"
                  class="mt-select"
                  required
                  :disabled="busy"
              >
                <option :value="null" disabled>
                  {{ tr('Selecciona una sala', 'Select a room') }}
                </option>

                <option
                    v-for="room in rooms"
                    :key="room.id"
                    :value="room.id"
                >
                  {{ room.name }}
                </option>
              </select>
            </div>

            <div class="mt-field">
              <label for="equipment-name">
                {{ tr('Nombre del equipo', 'Equipment Name') }}
              </label>

              <input
                  id="equipment-name"
                  v-model="form.name"
                  class="mt-input"
                  maxlength="150"
                  required
                  :disabled="busy"
                  :placeholder="tr('Ej. Asiento 4D A01', 'E.g. 4D Seat A01')"
              />
            </div>

            <div class="mt-field">
              <label for="equipment-type">
                {{ tr('Tipo de equipo', 'Equipment Type') }}
              </label>

              <select
                  id="equipment-type"
                  v-model="form.equipmentType"
                  class="mt-select"
                  :disabled="busy"
              >
                <option
                    v-for="option in equipmentTypes"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="mt-field">
              <label for="equipment-life">
                {{ tr('Vida útil (horas)', 'Useful Life (Hours)') }}
              </label>

              <input
                  id="equipment-life"
                  v-model.number="form.usefulLifeHours"
                  class="mt-input"
                  type="number"
                  min="1"
                  max="1000000"
                  step="1"
                  required
                  :disabled="busy"
              />
            </div>
          </div>

          <div
              v-if="!rooms.length && !busy"
              class="mt-alert mt-alert-info"
          >
            <i class="pi pi-info-circle"/>

            {{
              tr(
                  'Debes registrar una sala antes de añadir equipos.',
                  'Register a room before adding equipment.'
              )
            }}

            <router-link
                to="/room-readiness"
                class="mt-button mt-button-secondary"
            >
              {{ tr('Ir a salas', 'Go to Rooms') }}
            </router-link>
          </div>

          <div class="mt-actions">
            <button
                type="submit"
                class="mt-button mt-button-primary"
                :disabled="busy || !rooms.length"
            >
              <i class="pi pi-plus"/>

              {{ tr('Registrar equipo', 'Register Equipment') }}
            </button>
          </div>
        </form>
      </div>
    </article>

    <article class="mt-card">
      <header class="mt-card-header">
        <div>
          <h3>
            {{ tr('Equipos registrados', 'Registered Equipment') }}
          </h3>

          <p>
            {{
              tr(
                  'Selecciona un equipo para gestionar su mantenimiento.',
                  'Select equipment to manage its maintenance.'
              )
            }}
          </p>
        </div>

        <span class="mt-badge">{{ equipment.length }}</span>
      </header>

      <div class="mt-toolbar">
        <div class="mt-search">
          <i class="pi pi-search"/>

          <input
              v-model="search"
              class="mt-input"
              :placeholder="tr('Buscar equipo...', 'Search equipment...')"
          />
        </div>

        <select
            v-model="roomFilter"
            class="mt-select"
        >
          <option value="">
            {{ tr('Todas las salas', 'All Rooms') }}
          </option>

          <option
              v-for="room in rooms"
              :key="room.id"
              :value="room.id"
          >
            {{ room.name }}
          </option>
        </select>
      </div>

      <div
          v-if="filteredEquipment.length"
          class="mt-table-container"
      >
        <table class="mt-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>{{ tr('Nombre', 'Name') }}</th>
            <th>{{ tr('Sala', 'Room') }}</th>
            <th>{{ tr('Tipo', 'Type') }}</th>
            <th>{{ tr('Vida útil', 'Useful Life') }}</th>
            <th>{{ tr('Acciones', 'Actions') }}</th>
          </tr>
          </thead>

          <tbody>
          <tr
              v-for="item in filteredEquipment"
              :key="item.id"
              :class="{
                                'mt-selected':
                                    String(selectedId) === String(item.id)
                            }"
          >
            <td>#{{ item.id }}</td>

            <td>{{ item.name }}</td>

            <td>{{ roomName(item.roomId) }}</td>

            <td>{{ typeLabel(item.equipmentType) }}</td>

            <td>
              {{ item.usefulLifeHours ?? '—' }} h
            </td>

            <td>
              <button
                  type="button"
                  class="mt-table-action"
                  :disabled="busy"
                  @click="selectEquipment(item)"
              >
                <i class="pi pi-cog"/>

                {{ tr('Gestionar', 'Manage') }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div
          v-else
          class="mt-empty"
      >
        <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-cog'"/>

        <h3>
          {{
            busy
                ? tr('Cargando...', 'Loading...')
                : tr('No hay equipos', 'No equipment found')
          }}
        </h3>

        <p v-if="!busy">
          {{
            tr(
                'Los equipos registrados aparecerán aquí.',
                'Registered equipment will appear here.'
            )
          }}
        </p>

        <button
            v-if="search || roomFilter"
            type="button"
            class="mt-button mt-button-secondary"
            @click="search = ''; roomFilter = ''"
        >
          {{ tr('Limpiar filtros', 'Clear Filters') }}
        </button>
      </div>

      <footer class="mt-card-footer">
        {{
          tr(
              `Mostrando ${filteredEquipment.length} de ${equipment.length} equipos`,
              `Showing ${filteredEquipment.length} of ${equipment.length} equipment`
          )
        }}
      </footer>
    </article>

    <template v-if="selected">
      <article class="mt-card">
        <header class="mt-card-header">
          <div class="mt-equipment-title">
            <i class="pi pi-cog"/>

            <div>
              <h3>{{ selected.name }}</h3>

              <p>
                {{ tr('Equipo', 'Equipment') }}
                #{{ selected.id }}
                · {{ roomName(selected.roomId) }}
              </p>
            </div>
          </div>

          <button
              type="button"
              class="mt-button mt-button-secondary"
              :disabled="busy"
              @click="selectedId = null"
          >
            <i class="pi pi-times"/>

            {{ tr('Cerrar', 'Close') }}
          </button>
        </header>

        <div class="mt-card-body">
          <div class="mt-information">
            <div class="mt-info-item">
              <span>{{ tr('Tipo', 'Type') }}</span>

              <strong>
                {{ typeLabel(selected.equipmentType) }}
              </strong>
            </div>

            <div class="mt-info-item">
              <span>{{ tr('Vida útil', 'Useful Life') }}</span>

              <strong>
                {{ selected.usefulLifeHours ?? '—' }} h
              </strong>
            </div>

            <div class="mt-info-item">
              <span>{{ tr('Incidentes', 'Incidents') }}</span>

              <strong>
                {{ selected.incidents?.length ?? 0 }}
              </strong>
            </div>
          </div>

          <details class="mt-details">
            <summary>
              {{ tr('Ver detalles del equipo', 'View Equipment Details') }}
            </summary>

            <div class="mt-details-content">
              <BackendRecords :value="selected"/>
            </div>
          </details>
        </div>
      </article>

      <div class="mt-grid">
        <article class="mt-card">
          <header class="mt-card-header">
            <div>
              <h3>
                {{ tr('Reportar incidente', 'Report Incident') }}
              </h3>

              <p>
                {{
                  tr(
                      'Registra fallas o problemas del equipo.',
                      'Report equipment failures or issues.'
                  )
                }}
              </p>
            </div>

            <i class="pi pi-exclamation-triangle"/>
          </header>

          <div class="mt-card-body">
            <form
                class="mt-form"
                @submit.prevent="report"
            >
              <div class="mt-field">
                <label for="incident-description">
                  {{ tr('Descripción', 'Description') }}
                </label>

                <textarea
                    id="incident-description"
                    v-model="incident.description"
                    class="mt-textarea"
                    maxlength="1000"
                    required
                    :disabled="busy"
                    :placeholder="tr(
                                        'Describe el problema detectado...',
                                        'Describe the detected issue...'
                                    )"
                />
              </div>

              <div class="mt-field">
                <label for="incident-severity">
                  {{ tr('Gravedad', 'Severity') }}
                </label>

                <select
                    id="incident-severity"
                    v-model="incident.severity"
                    class="mt-select"
                    :disabled="busy"
                >
                  <option
                      v-for="option in severityOptions"
                      :key="option.value"
                      :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="mt-actions">
                <button
                    type="submit"
                    class="mt-button mt-button-primary"
                    :disabled="busy || !incident.description.trim()"
                >
                  <i class="pi pi-plus"/>

                  {{ tr('Registrar incidente', 'Report Incident') }}
                </button>
              </div>
            </form>
          </div>
        </article>

        <article class="mt-card">
          <header class="mt-card-header">
            <div>
              <h3>
                {{ tr('Diagnóstico del equipo', 'Equipment Diagnostics') }}
              </h3>

              <p>
                {{
                  tr(
                      'Registra pruebas de los canales sensoriales.',
                      'Register sensory channel tests.'
                  )
                }}
              </p>
            </div>

            <i class="pi pi-bolt"/>
          </header>

          <div class="mt-card-body">
            <form
                class="mt-form"
                @submit.prevent="test"
            >
              <div class="mt-field">
                <label for="diagnostic-channel">
                  {{ tr('Canal sensorial', 'Sensory Channel') }}
                </label>

                <select
                    id="diagnostic-channel"
                    v-model="channel"
                    class="mt-select"
                    :disabled="busy"
                >
                  <option
                      v-for="option in channelOptions"
                      :key="option.value"
                      :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="mt-alert mt-alert-info">
                <i class="pi pi-info-circle"/>

                {{
                  tr(
                      'El diagnóstico registra una prueba del modelo del backend. No controla ni verifica hardware físico.',
                      'Diagnostics register a backend model test. They do not control or verify physical hardware.'
                  )
                }}
              </div>

              <div class="mt-actions">
                <button
                    type="submit"
                    class="mt-button mt-button-primary"
                    :disabled="busy"
                >
                  <i class="pi pi-bolt"/>

                  {{ tr('Registrar prueba', 'Register Test') }}
                </button>
              </div>
            </form>
          </div>
        </article>
      </div>

      <article class="mt-card">
        <header class="mt-card-header">
          <div>
            <h3>
              {{ tr('Incidentes del equipo', 'Equipment Incidents') }}
            </h3>

            <p>
              {{
                tr(
                    'Historial de problemas registrados.',
                    'History of reported issues.'
                )
              }}
            </p>
          </div>

          <span class="mt-badge">
                        {{ selected.incidents?.length ?? 0 }}
                    </span>
        </header>

        <div
            v-if="selected.incidents?.length"
            class="mt-table-container"
        >
          <table class="mt-table">
            <thead>
            <tr>
              <th>ID</th>
              <th>{{ tr('Descripción', 'Description') }}</th>
              <th>{{ tr('Gravedad', 'Severity') }}</th>
              <th>{{ tr('Estado', 'Status') }}</th>
            </tr>
            </thead>

            <tbody>
            <tr
                v-for="item in selected.incidents"
                :key="item.id"
            >
              <td>#{{ item.id }}</td>

              <td style="white-space: normal; min-width: 180px">
                {{ item.description }}
              </td>

              <td>
                {{
                  severityOptions.find(
                      option => option.value === item.severity
                  )?.label ?? item.severity ?? '—'
                }}
              </td>

              <td>
                                    <span
                                        class="mt-status"
                                        :class="statusClass(item.status)"
                                    >
                                        {{ statusLabel(item.status) }}
                                    </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div
            v-else
            class="mt-empty"
        >
          <i class="pi pi-check-circle"/>

          <h3>
            {{ tr('Sin incidentes registrados', 'No reported incidents') }}
          </h3>

          <p>
            {{
              tr(
                  'Los incidentes del equipo aparecerán aquí.',
                  'Equipment incidents will appear here.'
              )
            }}
          </p>
        </div>
      </article>

      <article class="mt-card">
        <header class="mt-card-header">
          <div>
            <h3>
              {{ tr('Programar mantenimiento', 'Schedule Maintenance') }}
            </h3>

            <p>
              {{
                tr(
                    'Crea una orden preventiva o correctiva.',
                    'Create a preventive or corrective order.'
                )
              }}
            </p>
          </div>

          <i class="pi pi-calendar-plus"/>
        </header>

        <div class="mt-card-body">
          <form
              class="mt-form"
              @submit.prevent="scheduleOrder"
          >
            <div class="mt-form-grid">
              <div class="mt-field">
                <label for="maintenance-type">
                  {{ tr('Tipo de mantenimiento', 'Maintenance Type') }}
                </label>

                <select
                    id="maintenance-type"
                    v-model="schedule.type"
                    class="mt-select"
                    :disabled="busy"
                >
                  <option
                      v-for="option in orderTypes"
                      :key="option.value"
                      :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="mt-field">
                <label for="maintenance-date">
                  {{ tr('Fecha programada', 'Scheduled Date') }}
                </label>

                <input
                    id="maintenance-date"
                    :value="schedule.date"
                    class="mt-input"
                    type="text"
                    inputmode="numeric"
                    maxlength="10"
                    placeholder="YYYY-MM-DD"
                    required
                    :disabled="busy"
                    @input="formatDateInput"
                />
              </div>

              <div class="mt-field mt-field-full">
                <label for="maintenance-incident">
                  {{ tr('Incidente asociado', 'Related Incident') }}
                </label>

                <select
                    id="maintenance-incident"
                    v-model="schedule.incidentId"
                    class="mt-select"
                    :disabled="busy"
                >
                  <option :value="null">
                    {{ tr('Sin incidente asociado', 'No related incident') }}
                  </option>

                  <option
                      v-for="item in selected.incidents ?? []"
                      :key="item.id"
                      :value="item.id"
                  >
                    #{{ item.id }} · {{ item.description }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-actions">
              <button
                  type="submit"
                  class="mt-button mt-button-primary"
                  :disabled="busy || !schedule.date"
              >
                <i class="pi pi-calendar-plus"/>

                {{ tr('Programar mantenimiento', 'Schedule Maintenance') }}
              </button>
            </div>
          </form>
        </div>
      </article>

      <article class="mt-card">
        <header class="mt-card-header">
          <div>
            <h3>
              {{ tr('Órdenes de mantenimiento', 'Maintenance Orders') }}
            </h3>

            <p>
              {{
                tr(
                    'Consulta y completa las órdenes del equipo.',
                    'Review and complete equipment maintenance orders.'
                )
              }}
            </p>
          </div>

          <span class="mt-badge">
                        {{ selectedOrders.length }}
                    </span>
        </header>

        <div class="mt-card-body">
          <div
              v-if="!selectedOrders.length"
              class="mt-empty"
          >
            <i class="pi pi-wrench"/>

            <h3>
              {{ tr('Sin órdenes registradas', 'No maintenance orders') }}
            </h3>

            <p>
              {{
                tr(
                    'Programa un mantenimiento para crear una orden.',
                    'Schedule maintenance to create an order.'
                )
              }}
            </p>
          </div>

          <div
              v-else
              class="mt-order-list"
          >
            <article
                v-for="order in selectedOrders"
                :key="order.id"
                class="mt-order"
            >
              <header class="mt-card-header">
                <div>
                  <h3>
                    {{ tr('Orden', 'Order') }}
                    #{{ order.id }}
                  </h3>

                  <p>
                    {{ orderTypeLabel(order.type) }}
                  </p>
                </div>

                <span
                    class="mt-status"
                    :class="statusClass(order.status)"
                >
                                    {{ statusLabel(order.status) }}
                                </span>
              </header>

              <div class="mt-order-body">
                <div class="mt-information">
                  <div class="mt-info-item">
                                        <span>
                                            {{ tr('Tipo', 'Type') }}
                                        </span>

                    <strong>
                      {{ orderTypeLabel(order.type) }}
                    </strong>
                  </div>

                  <div class="mt-info-item">
                                        <span>
                                            {{ tr('Fecha programada', 'Scheduled Date') }}
                                        </span>

                    <strong>
                      {{ formatDate(order.scheduledDate) }}
                    </strong>
                  </div>

                  <div class="mt-info-item">
                                        <span>
                                            {{ tr('Incidente', 'Incident') }}
                                        </span>

                    <strong>
                      {{
                        order.incidentId
                            ? `#${order.incidentId}`
                            : tr('Ninguno', 'None')
                      }}
                    </strong>
                  </div>
                </div>

                <form
                    v-if="!isCompleted(order)"
                    class="mt-form"
                    @submit.prevent="complete(order)"
                >
                  <div class="mt-field">
                    <label :for="`order-notes-${order.id}`">
                      {{ tr('Notas de cierre', 'Completion Notes') }}
                    </label>

                    <textarea
                        :id="`order-notes-${order.id}`"
                        v-model="notes[order.id]"
                        class="mt-textarea"
                        maxlength="1000"
                        required
                        :disabled="busy"
                        :placeholder="tr(
                                                'Describe el mantenimiento realizado...',
                                                'Describe the maintenance performed...'
                                            )"
                    />
                  </div>

                  <div class="mt-actions">
                    <button
                        type="submit"
                        class="mt-button mt-button-primary"
                        :disabled="busy || !String(notes[order.id] ?? '').trim()"
                    >
                      <i class="pi pi-check-circle"/>

                      {{ tr('Completar orden', 'Complete Order') }}
                    </button>
                  </div>
                </form>

                <div
                    v-else
                    class="mt-alert mt-alert-success"
                >
                  <i class="pi pi-check-circle"/>

                  {{
                    tr(
                        'Mantenimiento completado.',
                        'Maintenance completed.'
                    )
                  }}
                </div>

                <details class="mt-details">
                  <summary>
                    {{ tr('Ver detalles de la orden', 'View Order Details') }}
                  </summary>

                  <div class="mt-details-content">
                    <BackendRecords :value="order"/>
                  </div>
                </details>
              </div>
            </article>
          </div>
        </div>
      </article>
    </template>
  </section>
</template>