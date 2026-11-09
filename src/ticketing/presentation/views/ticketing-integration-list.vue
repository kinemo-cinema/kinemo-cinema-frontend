<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

import useTicketingStore
  from "../../application/ticketing.store.js";

const router = useRouter();
const { t } = useI18n();

const store = useTicketingStore();

const {
  ticketingIntegrations,
  ticketingIntegrationsLoading,
  ticketingIntegrationsLoaded,
  errors
} = storeToRefs(store);


/* =========================================================
   DATA
========================================================= */

const integrations = computed(() => {
  return ticketingIntegrations.value.map(integration => ({
    id: integration.getId(),
    systemName: integration.getSystemName(),
    endpointUrl: integration.getEndpointUrl(),
    status: integration.getConnectionStatusAsString(),
    lastVerifiedAt: integration.getLastVerifiedAt()
  }));
});


onMounted(async () => {
  await store.fetchTicketingIntegrations();
});


/* =========================================================
   NAVIGATION
========================================================= */

const goToDashboard = () => {
  router.push("/dashboard");
};


const goToNew = () => {
  router.push("/ticketing/integrations/new");
};


const goToDetail = (id) => {
  router.push(`/ticketing/integrations/${id}`);
};


const goToEdit = (id) => {
  router.push(`/ticketing/integrations/${id}/edit`);
};


/* =========================================================
   ACTIONS
========================================================= */

const refresh = async () => {
  await store.fetchTicketingIntegrations();
};


/* =========================================================
   HELPERS
========================================================= */

const formatDate = (value) => {
  if (!value) {
    return "Never";
  }

  const date =
      value instanceof Date
          ? value
          : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
};


const statusClass = (status) => {
  return `status-${String(status ?? "").toLowerCase()}`;
};
</script>


<template>

  <section class="ticketing-page">

    <!-- BACK -->

    <button
        type="button"
        class="back-button"
        @click="goToDashboard"
    >
      <i class="pi pi-arrow-left"></i>
      Back to Dashboard
    </button>


    <!-- HEADER -->

    <header class="page-header">

      <div class="page-header-content">

        <span class="page-eyebrow">
          BC04 · TICKETING INTEGRATION
        </span>

        <h1>
          {{ t("ticketing.title") }}
        </h1>

        <p>
          {{ t("ticketing.subtitle") }}
        </p>

      </div>


      <div class="page-actions">

        <button
            type="button"
            class="secondary-button"
            :disabled="ticketingIntegrationsLoading"
            @click="refresh"
        >
          <i
              class="pi"
              :class="
                ticketingIntegrationsLoading
                  ? 'pi-spin pi-spinner'
                  : 'pi-refresh'
              "
          ></i>

          Refresh
        </button>


        <button
            type="button"
            class="primary-button"
            @click="goToNew"
        >
          <i class="pi pi-plus"></i>

          New Integration
        </button>

      </div>

    </header>


    <!-- LOADING -->

    <div
        v-if="ticketingIntegrationsLoading"
        class="state-card"
    >
      <i class="pi pi-spin pi-spinner state-spinner"></i>

      <h3>
        Loading ticketing integrations
      </h3>

      <p>
        Retrieving connected ticketing systems.
      </p>
    </div>


    <!-- ERROR -->

    <div
        v-else-if="errors.length"
        class="state-card error-state"
    >

      <div class="state-icon error-icon">
        <i class="pi pi-exclamation-triangle"></i>
      </div>

      <h3>
        Unable to load ticketing integrations
      </h3>

      <p>
        Make sure the Kinemo API is running.
      </p>

      <button
          type="button"
          class="secondary-button"
          @click="refresh"
      >
        <i class="pi pi-refresh"></i>
        Try again
      </button>

    </div>


    <!-- EMPTY -->

    <div
        v-else-if="
          ticketingIntegrationsLoaded &&
          integrations.length === 0
        "
        class="state-card"
    >

      <div class="state-icon">
        <i class="pi pi-ticket"></i>
      </div>

      <h3>
        No integrations available
      </h3>

      <p>
        Add a ticketing provider to start synchronizing cinema data.
      </p>

      <button
          type="button"
          class="primary-button"
          @click="goToNew"
      >
        <i class="pi pi-plus"></i>
        New Integration
      </button>

    </div>


    <!-- CONTENT -->

    <div
        v-else
        class="integrations-section"
    >

      <div class="section-heading">

        <div>

          <span class="section-kicker">
            CONNECTED SYSTEMS
          </span>

          <h2>
            External ticketing providers
          </h2>

        </div>

        <span class="record-count">
          {{ integrations.length }}
        </span>

      </div>


      <div class="table-wrapper">

        <table class="integrations-table">

          <thead>

          <tr>
            <th>System</th>
            <th>Endpoint</th>
            <th>Status</th>
            <th>Last verified</th>
            <th class="actions-column">
              Actions
            </th>
          </tr>

          </thead>


          <tbody>

          <tr
              v-for="integration in integrations"
              :key="integration.id"
          >

            <td>

              <div class="system-cell">

                <div class="system-icon">
                  <i class="pi pi-ticket"></i>
                </div>

                <div>

                  <strong>
                    {{ integration.systemName }}
                  </strong>

                  <span class="system-id">
                      ID #{{ integration.id }}
                    </span>

                </div>

              </div>

            </td>


            <td>

                <span class="endpoint">
                  {{ integration.endpointUrl }}
                </span>

            </td>


            <td>

                <span
                    class="status-badge"
                    :class="
                      statusClass(integration.status)
                    "
                >

                  <span class="status-dot"></span>

                  {{ integration.status }}

                </span>

            </td>


            <td>

                <span class="last-verified">
                  {{
                    formatDate(
                        integration.lastVerifiedAt
                    )
                  }}
                </span>

            </td>


            <td>

              <div class="row-actions">

                <button
                    type="button"
                    class="icon-button"
                    title="View integration"
                    @click="goToDetail(integration.id)"
                >
                  <i class="pi pi-eye"></i>
                </button>


                <button
                    type="button"
                    class="icon-button"
                    title="Edit integration"
                    @click="goToEdit(integration.id)"
                >
                  <i class="pi pi-pencil"></i>
                </button>

              </div>

            </td>

          </tr>

          </tbody>

        </table>

      </div>

    </div>

  </section>

</template>


<style scoped>
.ticketing-page {
  width: 100%;
}


/* =========================================================
   BACK
========================================================= */

.back-button {
  margin-bottom: 1.5rem;
  padding: 0;

  display: inline-flex;
  align-items: center;

  gap: 0.55rem;

  color: var(--text-muted);

  background: transparent;
  border: 0;

  font-size: 0.85rem;
  font-weight: 600;

  cursor: pointer;

  transition:
      color 0.2s ease,
      transform 0.2s ease;
}


.back-button:hover {
  color: var(--primary-light);

  transform: translateX(-2px);
}


/* =========================================================
   BUTTONS
========================================================= */

.primary-button,
.secondary-button {
  min-height: 42px;

  padding: 0 1rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 0.55rem;

  border-radius: var(--radius-sm);

  font-size: 0.85rem;
  font-weight: 700;

  cursor: pointer;

  transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease;
}


.primary-button {
  color: #07110e;

  background: var(--secondary);

  border: 1px solid var(--secondary);
}


.primary-button:hover {
  transform: translateY(-1px);

  background: var(--secondary-light);
}


.secondary-button {
  color: var(--secondary);

  background: transparent;

  border: 1px solid rgba(52, 214, 176, 0.65);
}


.secondary-button:hover {
  background: rgba(52, 214, 176, 0.08);
}


.secondary-button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


/* =========================================================
   SECTION
========================================================= */

.integrations-section {
  width: 100%;
}


.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 1rem;

  margin-bottom: 1rem;
}


.section-heading h2 {
  margin: 0;

  font-size: 1.15rem;
}


.record-count {
  min-width: 32px;
  height: 32px;

  padding: 0 0.7rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: var(--text-muted);

  background: var(--bg-card);

  border: 1px solid var(--border);
  border-radius: var(--radius-pill);

  font-size: 0.75rem;
  font-weight: 700;
}


/* =========================================================
   TABLE
========================================================= */

.table-wrapper {
  width: 100%;

  overflow-x: auto;

  background: var(--bg-card);

  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}


.integrations-table {
  width: 100%;
  min-width: 900px;

  border-collapse: collapse;
}


.integrations-table th {
  padding: 1rem;

  color: var(--text-muted);

  background: var(--bg-card-alt);

  border-bottom: 1px solid var(--border);

  font-size: 0.75rem;
  font-weight: 700;

  text-align: left;
  text-transform: uppercase;

  letter-spacing: 0.04em;
}


.integrations-table td {
  padding: 1rem;

  color: var(--text-soft);

  border-bottom: 1px solid var(--border-soft);

  font-size: 0.85rem;

  vertical-align: middle;
}


.integrations-table tbody tr {
  transition: background 0.15s ease;
}


.integrations-table tbody tr:hover {
  background: rgba(139, 92, 246, 0.04);
}


.integrations-table tbody tr:last-child td {
  border-bottom: 0;
}


/* =========================================================
   SYSTEM
========================================================= */

.system-cell {
  display: flex;
  align-items: center;

  gap: 0.75rem;
}


.system-icon {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: var(--primary-light);

  background: rgba(139, 92, 246, 0.1);

  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-sm);
}


.system-cell strong {
  display: block;

  color: var(--text);
}


.system-id {
  display: block;

  margin-top: 0.2rem;

  color: var(--text-muted);

  font-size: 0.72rem;
}


.endpoint {
  display: inline-block;

  max-width: 300px;

  overflow: hidden;

  color: var(--text-soft);

  text-overflow: ellipsis;
  white-space: nowrap;
}


/* =========================================================
   STATUS
========================================================= */

.status-badge {
  display: inline-flex;
  align-items: center;

  gap: 0.4rem;

  padding: 0.3rem 0.6rem;

  border-radius: var(--radius-pill);

  font-size: 0.68rem;
  font-weight: 800;

  letter-spacing: 0.03em;
}


.status-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: currentColor;
}


.status-available {
  color: #86efac;

  background: rgba(34, 197, 94, 0.1);

  border: 1px solid rgba(34, 197, 94, 0.2);
}


.status-reconnecting {
  color: #fcd34d;

  background: rgba(245, 158, 11, 0.1);

  border: 1px solid rgba(245, 158, 11, 0.2);
}


.status-unavailable {
  color: #fca5a5;

  background: rgba(239, 68, 68, 0.1);

  border: 1px solid rgba(239, 68, 68, 0.2);
}


.last-verified {
  color: var(--text-muted);

  white-space: nowrap;
}


/* =========================================================
   ACTIONS
========================================================= */

.actions-column {
  width: 110px;

  text-align: center !important;
}


.row-actions {
  display: flex;
  justify-content: center;

  gap: 0.35rem;
}


.icon-button {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--text-muted);

  background: transparent;

  border: 1px solid transparent;
  border-radius: var(--radius-sm);

  cursor: pointer;

  transition:
      color 0.15s ease,
      background 0.15s ease,
      border-color 0.15s ease;
}


.icon-button:hover {
  color: var(--primary-light);

  background: rgba(139, 92, 246, 0.08);

  border-color: rgba(139, 92, 246, 0.18);
}


/* =========================================================
   STATES
========================================================= */

.state-card {
  min-height: 240px;

  padding: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 0.7rem;

  color: var(--text-muted);

  background: var(--bg-card);

  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  text-align: center;
}


.state-card h3 {
  margin: 0;

  color: var(--text);
}


.state-card p {
  margin: 0 0 0.5rem;
}


.state-spinner {
  margin-bottom: 0.4rem;

  color: var(--primary-light);

  font-size: 2rem;
}


.state-icon {
  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--primary-light);

  background: rgba(139, 92, 246, 0.1);

  border-radius: 12px;

  font-size: 1.2rem;
}


.error-icon {
  color: #fca5a5;

  background: rgba(239, 68, 68, 0.1);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media screen and (max-width: 768px) {

  .section-heading {
    align-items: center;
  }


  .primary-button,
  .secondary-button {
    width: 100%;
  }

}
</style>