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

const integrations = computed(
    () => ticketingStore.ticketingIntegrations
);

onMounted(() => {
  if (!ticketingStore.ticketingIntegrationsLoaded) {
    ticketingStore.fetchTicketingIntegrations();
  }
});

function createIntegration() {
  router.push({
    name: "ticketing-integration-new"
  });
}

function viewIntegration(integration) {
  router.push({
    name: "ticketing-integration-detail",
    params: {id: integration.getId()}
  });
}

function editIntegration(integration) {
  router.push({
    name: "ticketing-integration-edit",
    params: {id: integration.getId()}
  });
}

function getStatusSeverity(status) {
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
  <div class="p-4">

    <div class="header">
      <div>
        <h1>Ticketing Integrations</h1>
        <p>Manage external ticketing system connections.</p>
      </div>

      <Button
          label="New Integration"
          icon="pi pi-plus"
          @click="createIntegration"
      />
    </div>

    <DataTable
        :value="integrations"
        stripedRows
        responsiveLayout="scroll"
        emptyMessage="No ticketing integrations found."
    >

      <Column header="System">
        <template #body="{data}">
          {{ data.getSystemName() }}
        </template>
      </Column>

      <Column header="Endpoint">
        <template #body="{data}">
          {{ data.getEndpointUrl() }}
        </template>
      </Column>

      <Column header="Status">
        <template #body="{data}">
          <Tag
              :value="data.getConnectionStatusAsString()"
              :severity="getStatusSeverity(
                  data.getConnectionStatusAsString()
              )"
          />
        </template>
      </Column>

      <Column header="Last Verified">
        <template #body="{data}">
          {{ formatDate(data.getLastVerifiedAt()) }}
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{data}">
          <div class="actions">

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

          </div>
        </template>
      </Column>

    </DataTable>

  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0 0 0.5rem;
}

.header p {
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>