<script setup>
import {computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";

import Button from "primevue/button";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";

import useTicketingStore from "../../application/ticketing.store.js";

const route = useRoute();
const router = useRouter();
const ticketingStore = useTicketingStore();

/**
 * Current integration identifier.
 */
const integrationId = computed(
    () => route.params.id
);

/**
 * Current ticketing integration.
 */
const integration = computed(
    () => ticketingStore.getTicketingIntegrationById(
        integrationId.value
    )
);

/**
 * Synchronization logs loaded in the store.
 */
const syncLogs = computed(
    () => ticketingStore.syncLogs
);

/**
 * Show occupancies loaded in the store.
 */
const showOccupancies = computed(
    () => ticketingStore.showOccupancies
);

/**
 * Loads the resources required by the detail view.
 */
onMounted(() => {
  if (!ticketingStore.ticketingIntegrationsLoaded) {
    ticketingStore.fetchTicketingIntegrations();
  }

  if (!ticketingStore.syncLogsLoaded) {
    ticketingStore.fetchSyncLogs();
  }

  if (!ticketingStore.showOccupanciesLoaded) {
    ticketingStore.fetchShowOccupancies();
  }
});

/**
 * Navigates to the integration edit form.
 */
function editIntegration() {
  router.push({
    name: "ticketing-integration-edit",
    params: {
      id: integrationId.value
    }
  });
}

/**
 * Returns to the list of ticketing integrations.
 */
function goBack() {
  router.push({
    name: "ticketing-integrations"
  });
}

/**
 * Connects the current integration.
 */
function connectIntegration() {
  if (!integration.value) {
    return;
  }

  ticketingStore.connectIntegration(
      integration.value
  );
}

/**
 * Disconnects the current integration.
 */
function disconnectIntegration() {
  if (!integration.value) {
    return;
  }

  ticketingStore.disconnectIntegration(
      integration.value
  );
}

/**
 * Starts a reconnection attempt.
 */
function reconnectIntegration() {
  if (!integration.value) {
    return;
  }

  ticketingStore.reconnectIntegration(
      integration.value
  );
}

/**
 * Returns the PrimeVue severity for a connection status.
 *
 * @param {string} status
 * @returns {string}
 */
function getConnectionSeverity(status) {
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

/**
 * Returns the PrimeVue severity for a synchronization status.
 *
 * @param {string} status
 * @returns {string}
 */
function getSyncSeverity(status) {
  switch (status) {
    case "SUCCESSFUL":
      return "success";

    case "INCOMPLETE":
      return "warn";

    case "FAILED":
      return "danger";

    case "PENDING":
      return "info";

    default:
      return "secondary";
  }
}

/**
 * Formats a date for display.
 *
 * @param {Date|string|null} value
 * @returns {string}
 */
function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date =
      value instanceof Date
          ? value
          : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}
</script>

<template>
  <section class="ticketing-integration-detail">

    <div class="ticketing-integration-detail__header">
      <div>
        <h1>Ticketing Integration Detail</h1>

        <p>
          Review the connection, synchronization activity
          and show occupancy information.
        </p>
      </div>

      <div class="ticketing-integration-detail__header-actions">
        <Button
            label="Back"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            @click="goBack"
        />

        <Button
            label="Edit"
            icon="pi pi-pencil"
            @click="editIntegration"
        />
      </div>
    </div>

    <template v-if="integration">

      <Card class="ticketing-integration-detail__card">
        <template #title>
          Integration Information
        </template>

        <template #content>
          <div class="ticketing-integration-detail__grid">

            <div>
                            <span class="field-label">
                                Integration ID
                            </span>

              <span>
                                {{ integration.getId() }}
                            </span>
            </div>

            <div>
                            <span class="field-label">
                                Cinema ID
                            </span>

              <span>
                                {{ integration.getCinemaId() }}
                            </span>
            </div>

            <div>
                            <span class="field-label">
                                Provider
                            </span>

              <span>
                                {{ integration.getProviderName() }}
                            </span>
            </div>

            <div>
                            <span class="field-label">
                                Status
                            </span>

              <Tag
                  :value="integration.getStatusAsString()"
                  :severity="
                                    getConnectionSeverity(
                                        integration.getStatusAsString()
                                    )
                                "
              />
            </div>

          </div>

          <div class="ticketing-integration-detail__connection-actions">

            <Button
                v-if="
                                integration.getStatusAsString()
                                    === 'DISCONNECTED'
                            "
                label="Connect"
                icon="pi pi-link"
                @click="connectIntegration"
            />

            <Button
                v-if="
                                integration.getStatusAsString()
                                    === 'CONNECTED'
                            "
                label="Disconnect"
                icon="pi pi-times"
                severity="danger"
                @click="disconnectIntegration"
            />

            <Button
                v-if="
                                integration.getStatusAsString()
                                    === 'RECONNECTING'
                            "
                label="Reconnect"
                icon="pi pi-refresh"
                severity="warn"
                @click="reconnectIntegration"
            />

          </div>
        </template>
      </Card>

      <Card class="ticketing-integration-detail__card">
        <template #title>
          Synchronization Logs
        </template>

        <template #content>

          <DataTable
              :value="syncLogs"
              dataKey="id"
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No synchronization logs found."
          >

            <Column header="Show">
              <template #body="{data}">
                {{ data.getShowId() }}
              </template>
            </Column>

            <Column header="Executed At">
              <template #body="{data}">
                {{ formatDate(data.getExecutedAt()) }}
              </template>
            </Column>

            <Column header="Status">
              <template #body="{data}">
                <Tag
                    :value="data.getStatusAsString()"
                    :severity="
                                        getSyncSeverity(
                                            data.getStatusAsString()
                                        )
                                    "
                />
              </template>
            </Column>

            <Column header="Error Details">
              <template #body="{data}">
                {{
                  data.getErrorDetails()
                  || "-"
                }}
              </template>
            </Column>

          </DataTable>

        </template>
      </Card>

      <Card class="ticketing-integration-detail__card">
        <template #title>
          Show Occupancy
        </template>

        <template #content>

          <DataTable
              :value="showOccupancies"
              dataKey="id"
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No show occupancy information found."
          >

            <Column header="Show">
              <template #body="{data}">
                {{ data.getShowId() }}
              </template>
            </Column>

            <Column header="Total Seats">
              <template #body="{data}">
                {{ data.getTotalSeats() }}
              </template>
            </Column>

            <Column header="Occupied Seats">
              <template #body="{data}">
                {{ data.getOccupiedSeats() }}
              </template>
            </Column>

            <Column header="Available Seats">
              <template #body="{data}">
                {{ data.getAvailableSeats() }}
              </template>
            </Column>

            <Column header="Occupancy">
              <template #body="{data}">
                {{
                  data
                      .getOccupancyPercentage()
                      .toFixed(1)
                }}%
              </template>
            </Column>

            <Column header="Last Updated">
              <template #body="{data}">
                {{
                  formatDate(
                      data.getLastUpdatedAt()
                  )
                }}
              </template>
            </Column>

          </DataTable>

        </template>
      </Card>

    </template>

    <Card v-else>
      <template #content>
        Ticketing integration not found.
      </template>
    </Card>

  </section>
</template>

<style scoped>
.ticketing-integration-detail {
  padding: 2rem;
}

.ticketing-integration-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.ticketing-integration-detail__header h1 {
  margin: 0 0 0.5rem;
}

.ticketing-integration-detail__header p {
  margin: 0;
}

.ticketing-integration-detail__header-actions {
  display: flex;
  gap: 0.75rem;
}

.ticketing-integration-detail__card {
  margin-bottom: 1.5rem;
}

.ticketing-integration-detail__grid {
  display: grid;
  grid-template-columns:
        repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1.5rem;
}

.ticketing-integration-detail__grid > div {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-weight: 600;
}

.ticketing-integration-detail__connection-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .ticketing-integration-detail {
    padding: 1rem;
  }

  .ticketing-integration-detail__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .ticketing-integration-detail__header-actions {
    width: 100%;
    flex-direction: column-reverse;
  }

  .ticketing-integration-detail__connection-actions {
    flex-direction: column;
  }
}
</style>