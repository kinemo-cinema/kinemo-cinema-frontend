<script setup>
import {computed, onMounted} from "vue";
import {useRouter} from "vue-router";

import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";

import useTicketingStore from "../../application/ticketing.store.js";

const router = useRouter();
const ticketingStore = useTicketingStore();

/**
 * Ticketing integrations exposed by the application store.
 */
const integrations = computed(
    () => ticketingStore.ticketingIntegrations
);

/**
 * Whether the store has already loaded the integrations.
 */
const loaded = computed(
    () => ticketingStore.ticketingIntegrationsLoaded
);

/**
 * Loads ticketing integrations when the view is mounted.
 */
onMounted(() => {
  if (!loaded.value) {
    ticketingStore.fetchTicketingIntegrations();
  }
});

/**
 * Navigates to the form used to create a new integration.
 */
function createIntegration() {
  router.push({
    name: "ticketing-integration-new"
  });
}

/**
 * Navigates to the integration detail view.
 *
 * @param {TicketingIntegration} integration
 */
function viewIntegration(integration) {
  router.push({
    name: "ticketing-integration-detail",
    params: {
      id: integration.getId()
    }
  });
}

/**
 * Navigates to the integration edit form.
 *
 * @param {TicketingIntegration} integration
 */
function editIntegration(integration) {
  router.push({
    name: "ticketing-integration-edit",
    params: {
      id: integration.getId()
    }
  });
}

/**
 * Connects an integration through the application store.
 *
 * @param {TicketingIntegration} integration
 */
function connectIntegration(integration) {
  ticketingStore.connectIntegration(integration);
}

/**
 * Disconnects an integration through the application store.
 *
 * @param {TicketingIntegration} integration
 */
function disconnectIntegration(integration) {
  ticketingStore.disconnectIntegration(integration);
}

/**
 * Starts a reconnection attempt through the application store.
 *
 * @param {TicketingIntegration} integration
 */
function reconnectIntegration(integration) {
  ticketingStore.reconnectIntegration(integration);
}

/**
 * Returns the PrimeVue severity associated with a connection status.
 *
 * @param {string} status
 * @returns {string}
 */
function getStatusSeverity(status) {
  switch (status) {
    case "CONNECTED":
      return "success";

    case "RECONNECTING":
      return "warn";

    case "DISCONNECTED":
      return "danger";

    default:
      return "secondary";
  }
}
</script>

<template>
  <section class="ticketing-integration-list">

    <div class="ticketing-integration-list__header">
      <div>
        <h1>Ticketing Integrations</h1>
        <p>
          Manage the connections between Kinemo and external
          ticketing providers.
        </p>
      </div>

      <Button
          label="New Integration"
          icon="pi pi-plus"
          @click="createIntegration"
      />
    </div>

    <DataTable
        :value="integrations"
        dataKey="id"
        stripedRows
        responsiveLayout="scroll"
        emptyMessage="No ticketing integrations found."
    >

      <Column header="Provider">
        <template #body="{data}">
          {{ data.getProviderName() }}
        </template>
      </Column>

      <Column header="Cinema">
        <template #body="{data}">
          {{ data.getCinemaId() }}
        </template>
      </Column>

      <Column header="Status">
        <template #body="{data}">
          <Tag
              :value="data.getStatusAsString()"
              :severity="getStatusSeverity(
                            data.getStatusAsString()
                        )"
          />
        </template>
      </Column>

      <Column
          header="Actions"
          style="min-width: 20rem"
      >
        <template #body="{data}">

          <div class="ticketing-integration-list__actions">

            <Button
                icon="pi pi-eye"
                severity="secondary"
                text
                rounded
                aria-label="View integration"
                @click="viewIntegration(data)"
            />

            <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                aria-label="Edit integration"
                @click="editIntegration(data)"
            />

            <Button
                v-if="data.getStatusAsString() === 'DISCONNECTED'"
                label="Connect"
                icon="pi pi-link"
                size="small"
                @click="connectIntegration(data)"
            />

            <Button
                v-if="data.getStatusAsString() === 'CONNECTED'"
                label="Disconnect"
                icon="pi pi-times"
                severity="danger"
                size="small"
                @click="disconnectIntegration(data)"
            />

            <Button
                v-if="data.getStatusAsString() === 'RECONNECTING'"
                label="Reconnect"
                icon="pi pi-refresh"
                severity="warn"
                size="small"
                @click="reconnectIntegration(data)"
            />

          </div>

        </template>
      </Column>

    </DataTable>

  </section>
</template>

<style scoped>
.ticketing-integration-list {
  padding: 2rem;
}

.ticketing-integration-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.ticketing-integration-list__header h1 {
  margin: 0 0 0.5rem;
}

.ticketing-integration-list__header p {
  margin: 0;
}

.ticketing-integration-list__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .ticketing-integration-list {
    padding: 1rem;
  }

  .ticketing-integration-list__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>