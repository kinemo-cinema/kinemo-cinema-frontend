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

const integrationId = computed(() => route.params.id);

const integration = computed(() =>
    ticketingStore.getTicketingIntegrationById(integrationId.value)
);

const syncLogs = computed(() =>
    ticketingStore.getSyncLogsByConnectionId(integrationId.value)
);

const showOccupancies = computed(() =>
    ticketingStore.getShowOccupanciesByConnectionId(integrationId.value)
);

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

function editIntegration() {
  router.push({
    name: "ticketing-integration-edit",
    params: {id: integrationId.value}
  });
}

function goBack() {
  router.push({
    name: "ticketing-integrations"
  });
}

function getConnectionSeverity(status) {
  switch (status) {
    case "AVAILABLE":
      return "success";
    case "RECONNECTING":
      return "warn";
    case "UNAVAILABLE":
      return "danger";
    default:
      return "secondary";
  }
}

function getSyncSeverity(status) {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "IN_PROGRESS":
      return "info";
    case "FAILED":
      return "danger";
    default:
      return "secondary";
  }
}

function formatDate(value) {
  if (!value) return "-";

  const date =
      value instanceof Date
          ? value
          : new Date(value);

  return Number.isNaN(date.getTime())
      ? "-"
      : date.toLocaleString();
}
</script>

<template>
  <section class="ticketing-detail">

    <div class="ticketing-detail__header">
      <div>
        <h1>Ticketing Integration Detail</h1>
        <p>
          Review connection, synchronization and occupancy information.
        </p>
      </div>

      <div class="ticketing-detail__actions">
        <Button
            label="Back"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            @click="goBack"
        />

        <Button
            v-if="integration"
            label="Edit"
            icon="pi pi-pencil"
            @click="editIntegration"
        />
      </div>
    </div>

    <Card
        v-if="!ticketingStore.ticketingIntegrationsLoaded"
        class="ticketing-detail__card"
    >
      <template #content>
        Loading ticketing integration...
      </template>
    </Card>

    <template v-else-if="integration">

      <Card class="ticketing-detail__card">
        <template #title>
          Integration Information
        </template>

        <template #content>
          <div class="ticketing-detail__grid">

            <div>
              <strong>ID</strong>
              <span>{{ integration.getId() }}</span>
            </div>

            <div>
              <strong>System</strong>
              <span>{{ integration.getSystemName() }}</span>
            </div>

            <div>
              <strong>Endpoint</strong>
              <span>{{ integration.getEndpointUrl() }}</span>
            </div>

            <div>
              <strong>Status</strong>
              <Tag
                  :value="integration.getConnectionStatusAsString()"
                  :severity="getConnectionSeverity(
                      integration.getConnectionStatusAsString()
                  )"
              />
            </div>

            <div>
              <strong>Last Verified</strong>
              <span>
                {{ formatDate(integration.getLastVerifiedAt()) }}
              </span>
            </div>

          </div>
        </template>
      </Card>

      <Card class="ticketing-detail__card">
        <template #title>
          Synchronization Logs
        </template>

        <template #content>
          <DataTable
              :value="syncLogs"
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No synchronization logs found."
          >

            <Column header="Operator">
              <template #body="{data}">
                {{ data.getOperatorId() }}
              </template>
            </Column>

            <Column header="Status">
              <template #body="{data}">
                <Tag
                    :value="data.getStatusAsString()"
                    :severity="getSyncSeverity(data.getStatusAsString())"
                />
              </template>
            </Column>

            <Column header="Records">
              <template #body="{data}">
                {{ data.getRecordsProcessed() }}
              </template>
            </Column>

            <Column header="Started">
              <template #body="{data}">
                {{ formatDate(data.getStartedAt()) }}
              </template>
            </Column>

            <Column header="Completed">
              <template #body="{data}">
                {{ formatDate(data.getCompletedAt()) }}
              </template>
            </Column>

            <Column header="Error">
              <template #body="{data}">
                {{ data.getErrorDetails() || "-" }}
              </template>
            </Column>

          </DataTable>
        </template>
      </Card>

      <Card class="ticketing-detail__card">
        <template #title>
          Show Occupancy
        </template>

        <template #content>
          <DataTable
              :value="showOccupancies"
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No occupancy information found."
          >

            <Column header="Show">
              <template #body="{data}">
                {{ data.getShowId() }}
              </template>
            </Column>

            <Column header="Capacity">
              <template #body="{data}">
                {{ data.getTotalCapacity() }}
              </template>
            </Column>

            <Column header="Occupied">
              <template #body="{data}">
                {{ data.getOccupiedSeats() }}
              </template>
            </Column>

            <Column header="Available">
              <template #body="{data}">
                {{ data.getAvailableSeats() }}
              </template>
            </Column>

            <Column header="Occupancy">
              <template #body="{data}">
                {{ data.getOccupancyPercentage().toFixed(1) }}%
              </template>
            </Column>

            <Column header="Updated">
              <template #body="{data}">
                {{ formatDate(data.getLastUpdatedAt()) }}
              </template>
            </Column>

          </DataTable>
        </template>
      </Card>

    </template>

    <Card
        v-else
        class="ticketing-detail__card"
    >
      <template #content>
        Ticketing integration not found.
      </template>
    </Card>

  </section>
</template>

<style scoped>
.ticketing-detail {
  padding: 2rem;
}

.ticketing-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.ticketing-detail__header h1 {
  margin: 0 0 0.5rem;
}

.ticketing-detail__header p {
  margin: 0;
}

.ticketing-detail__actions {
  display: flex;
  gap: 0.75rem;
}

.ticketing-detail__card {
  margin-bottom: 1.5rem;
}

.ticketing-detail__grid {
  display: grid;
  grid-template-columns:
      repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1.5rem;
}

.ticketing-detail__grid > div {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

@media (max-width: 768px) {
  .ticketing-detail {
    padding: 1rem;
  }

  .ticketing-detail__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .ticketing-detail__actions {
    width: 100%;
  }
}
</style>