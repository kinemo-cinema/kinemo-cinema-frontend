<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBackend } from '../../../shared/application/use-backend.js';
import BackendRecords from '../../../shared/presentation/components/backend-records.vue';
import '../subscription.css';

const { locale } = useI18n();
const { busy, error, run } = useBackend();

const isSpanish = computed(() => locale.value.startsWith('es'));
const tr = (es, en) => isSpanish.value ? es : en;

const items = ref([]);
const plans = ref([]);
const newPlans = ref({});
const search = ref('');
const statusFilter = ref('');
const message = ref('');

const normalizeStatus = status =>
    String(status ?? '').toUpperCase();

const activeCount = computed(() =>
    items.value.filter(item =>
        normalizeStatus(item.status) === 'ACTIVE'
    ).length
);

const statuses = computed(() =>
    [...new Set(items.value.map(item => item.status).filter(Boolean))]
);

const planName = id =>
    plans.value.find(plan => String(plan.id) === String(id))?.name
    ?? `Plan ${id}`;

const planPrice = id => {
  const plan = plans.value.find(plan =>
      String(plan.id) === String(id)
  );

  return plan?.price != null ? `$${plan.price}` : '—';
};

const statusLabel = status => {
  const labels = {
    ACTIVE: tr('Activa', 'Active'),
    PENDING: tr('Pendiente', 'Pending'),
    INACTIVE: tr('Inactiva', 'Inactive'),
    CANCELLED: tr('Cancelada', 'Cancelled'),
    CANCELED: tr('Cancelada', 'Canceled'),
    EXPIRED: tr('Vencida', 'Expired'),
    SUSPENDED: tr('Suspendida', 'Suspended')
  };

  return labels[normalizeStatus(status)] ?? status ?? '—';
};

const statusClass = status => {
  const value = normalizeStatus(status);

  if (value === 'ACTIVE') return 'sb-status-active';
  if (value === 'PENDING') return 'sb-status-pending';

  if (
      ['INACTIVE', 'CANCELLED', 'CANCELED', 'EXPIRED', 'SUSPENDED']
          .includes(value)
  ) {
    return 'sb-status-inactive';
  }

  return '';
};

const filteredItems = computed(() => {
  const query = search.value.trim().toLowerCase();

  return items.value.filter(item => {
    const matchesSearch = [
      item.id,
      item.cinemaId,
      planName(item.planId)
    ].some(value =>
        String(value ?? '').toLowerCase().includes(query)
    );

    const matchesStatus =
        !statusFilter.value ||
        item.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const availablePlans = item =>
    plans.value.filter(plan =>
        String(plan.id) !== String(item.planId)
    );

const formatDate = value => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString(
      isSpanish.value ? 'es-PE' : 'en-US'
  );
};

const load = () => {
  message.value = '';

  return run(async http => {
    const [subscriptionsResponse, plansResponse] =
        await Promise.all([
          http.get('/subscriptions'),
          http.get('/subscription-plans')
        ]);

    items.value =
        subscriptionsResponse.data.value ??
        subscriptionsResponse.data;

    plans.value =
        plansResponse.data.value ??
        plansResponse.data;
  });
};

const changePlan = async item => {
  const newPlanId = newPlans.value[item.id];

  if (!newPlanId || busy.value) return;

  message.value = '';

  const confirmed = window.confirm(
      tr(
          '¿Deseas cambiar el plan de esta suscripción?',
          'Do you want to change this subscription plan?'
      )
  );

  if (!confirmed) return;

  const success = await run(async http => {
    const { data } = await http.post(
        `/subscriptions/${item.id}/upgrades`,
        { newPlanId }
    );

    items.value = items.value.map(row =>
        row.id === data.id ? data : row
    );

    newPlans.value[item.id] = null;
  });

  if (success) {
    message.value = tr(
        'Plan actualizado correctamente.',
        'Plan updated successfully.'
    );
  }
};

const clearFilters = () => {
  search.value = '';
  statusFilter.value = '';
};

onMounted(load);
</script>

<template>
  <section class="sb-page">
    <div class="sb-breadcrumb">
      <router-link to="/dashboard">
        Dashboard
      </router-link>

      <i class="pi pi-chevron-right"/>

      <span>
                {{ tr('Suscripciones', 'Subscriptions') }}
            </span>
    </div>

    <header class="sb-heading">
      <div class="sb-heading-content">
        <div class="sb-module-icon">
          <i class="pi pi-credit-card"/>
        </div>

        <div>
          <h1>
            {{ tr('Suscripciones', 'Subscriptions') }}
          </h1>

          <p>
            {{
              tr(
                  'Administra los planes y suscripciones de los cines.',
                  'Manage cinema plans and subscriptions.'
              )
            }}
          </p>
        </div>
      </div>

      <span class="sb-badge">BC09</span>
    </header>

    <div class="sb-stats">
      <article class="sb-stat">
        <div class="sb-stat-top">
                    <span>
                        {{ tr('Suscripciones registradas', 'Total Subscriptions') }}
                    </span>

          <i class="pi pi-id-card"/>
        </div>

        <strong>{{ items.length }}</strong>
      </article>

      <article class="sb-stat">
        <div class="sb-stat-top">
                    <span>
                        {{ tr('Suscripciones activas', 'Active Subscriptions') }}
                    </span>

          <i class="pi pi-check-circle"/>
        </div>

        <strong>{{ activeCount }}</strong>
      </article>

      <article class="sb-stat">
        <div class="sb-stat-top">
                    <span>
                        {{ tr('Planes disponibles', 'Available Plans') }}
                    </span>

          <i class="pi pi-box"/>
        </div>

        <strong>{{ plans.length }}</strong>
      </article>
    </div>

    <div class="sb-alert sb-info">
      <i class="pi pi-info-circle"/>

      {{
        tr(
            'La gestión de pagos no está disponible. No se realizarán cargos hasta configurar una pasarela de pago real.',
            'Payment processing is unavailable. No charges will be made until a real payment gateway is configured.'
        )
      }}
    </div>

    <div
        v-if="error"
        class="sb-alert sb-error"
        role="alert"
    >
      <i class="pi pi-exclamation-circle"/>
      {{ error }}
    </div>

    <div
        v-if="message"
        class="sb-alert sb-success"
        role="status"
    >
      <i class="pi pi-check-circle"/>
      {{ message }}
    </div>

    <article class="sb-card">
      <header class="sb-card-header">
        <div>
          <h2>
            {{ tr('Gestión de suscripciones', 'Subscription Management') }}
          </h2>

          <p>
            {{
              tr(
                  'Consulta las suscripciones y sus planes actuales.',
                  'Review subscriptions and their current plans.'
              )
            }}
          </p>
        </div>

        <div class="sb-actions">
          <button
              type="button"
              class="sb-button sb-secondary"
              :disabled="busy"
              @click="load"
          >
            <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"/>

            {{ tr('Actualizar', 'Refresh') }}
          </button>

          <router-link
              to="/subscriptions"
              class="sb-button sb-primary"
          >
            <i class="pi pi-plus"/>

            {{ tr('Contratar plan', 'Choose Plan') }}
          </router-link>
        </div>
      </header>

      <div class="sb-card-body">
        <div class="sb-toolbar">
          <input
              v-model="search"
              class="sb-input"
              type="text"
              :placeholder="tr('Buscar suscripción...', 'Search subscription...')"
          />

          <select
              v-model="statusFilter"
              class="sb-select"
              :aria-label="tr('Filtrar por estado', 'Filter by status')"
          >
            <option value="">
              {{ tr('Todos los estados', 'All Statuses') }}
            </option>

            <option
                v-for="status in statuses"
                :key="status"
                :value="status"
            >
              {{ statusLabel(status) }}
            </option>
          </select>

          <button
              type="button"
              class="sb-button sb-secondary"
              @click="clearFilters"
          >
            <i class="pi pi-filter-slash"/>

            {{ tr('Limpiar', 'Clear') }}
          </button>
        </div>
      </div>

      <div
          v-if="!filteredItems.length"
          class="sb-empty"
      >
        <i :class="busy ? 'pi pi-spin pi-spinner' : 'pi pi-credit-card'"/>

        <h3>
          {{
            busy
                ? tr('Cargando...', 'Loading...')
                : tr('Sin suscripciones', 'No Subscriptions')
          }}
        </h3>

        <p v-if="!busy">
          {{
            items.length
                ? tr('No hay resultados para los filtros seleccionados.', 'No results match the selected filters.')
                : tr('Las suscripciones registradas aparecerán aquí.', 'Registered subscriptions will appear here.')
          }}
        </p>
      </div>
    </article>

    <div
        v-if="filteredItems.length"
        class="sb-grid"
    >
      <article
          v-for="item in filteredItems"
          :key="item.id"
          class="sb-card"
      >
        <header class="sb-card-header">
          <div>
            <h2>{{ planName(item.planId) }}</h2>

            <p>
              {{ tr('Suscripción', 'Subscription') }}
              #{{ item.id }}
            </p>
          </div>

          <span
              class="sb-status"
              :class="statusClass(item.status)"
          >
                        {{ statusLabel(item.status) }}
                    </span>
        </header>

        <div class="sb-card-body">
          <div class="sb-information">
            <div class="sb-info-item">
              <span>Cinema ID</span>
              <strong>#{{ item.cinemaId }}</strong>
            </div>

            <div class="sb-info-item">
              <span>{{ tr('Precio del plan', 'Plan Price') }}</span>
              <strong>{{ planPrice(item.planId) }}</strong>
            </div>

            <div class="sb-info-item">
              <span>Plan ID</span>
              <strong>#{{ item.planId }}</strong>
            </div>

            <div class="sb-info-item">
              <span>{{ tr('Renovación', 'Renewal Date') }}</span>
              <strong>{{ formatDate(item.endDate) }}</strong>
            </div>
          </div>

          <form
              class="sb-change-form"
              @submit.prevent="changePlan(item)"
          >
            <div class="sb-field">
              <label :for="`plan-${item.id}`">
                {{ tr('Cambiar plan', 'Change Plan') }}
              </label>

              <select
                  :id="`plan-${item.id}`"
                  v-model="newPlans[item.id]"
                  class="sb-select"
                  required
                  :disabled="busy || !availablePlans(item).length"
              >
                <option
                    :value="null"
                    disabled
                >
                  {{ tr('Seleccionar nuevo plan', 'Select New Plan') }}
                </option>

                <option
                    v-for="plan in availablePlans(item)"
                    :key="plan.id"
                    :value="plan.id"
                >
                  {{ plan.name }} — ${{ plan.price }}
                </option>
              </select>
            </div>

            <div class="sb-actions">
              <button
                  type="submit"
                  class="sb-button sb-primary"
                  :disabled="busy || !newPlans[item.id]"
              >
                <i class="pi pi-arrow-right-arrow-left"/>

                {{ tr('Actualizar plan', 'Update Plan') }}
              </button>
            </div>
          </form>

          <details class="sb-details">
            <summary>
              {{ tr('Información completa', 'Full Information') }}
            </summary>

            <div class="sb-details-content">
              <BackendRecords :value="item"/>
            </div>
          </details>
        </div>
      </article>
    </div>
  </section>
</template>