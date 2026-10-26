<script setup>
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {storeToRefs} from "pinia";

import useTicketingStore from "../../application/ticketing.store.js";

const {t} = useI18n();
const router = useRouter();

const ticketingStore = useTicketingStore();

/*
 * Reactive state from store
 */
const {
  ticketingIntegrations,
  ticketingIntegrationsLoaded,
  errors
} = storeToRefs(ticketingStore);

/*
 * Actions
 */
const {
  fetchTicketingIntegrations
} = ticketingStore;

/*
 * Reload integrations every time the list view is mounted.
 */
onMounted(() => {
  fetchTicketingIntegrations();
});

/**
 * Navigate to new integration.
 */
const navigateToNew = () => {
  router.push({
    name: "ticketing-integration-new"
  });
};

/**
 * Navigate to integration detail.
 *
 * @param {number} id
 */
const navigateToDetail = (id) => {
  router.push({
    name: "ticketing-integration-detail",
    params: {id}
  });
};

/**
 * Navigate to integration edit.
 *
 * @param {number} id
 */
const navigateToEdit = (id) => {
  router.push({
    name: "ticketing-integration-edit",
    params: {id}
  });
};

/**
 * Returns PrimeVue severity according to
 * the connection status.
 *
 * @param {string} status
 * @returns {string}
 */
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

/**
 * Formats the last verification date.
 *
 * @param {Date|string|null} value
 * @returns {string}
 */
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
        <h1>
          {{ t("ticketing.title") }}
        </h1>

        <p>
          {{ t("ticketing.subtitle") }}
        </p>
      </div>

      <pv-button
          :label="t('ticketing.new')"
          icon="pi pi-plus"
          class="mb-3"
          @click="navigateToNew"
      />
    </div>

    <pv-data-table
        :value="ticketingIntegrations"
        :loading="!ticketingIntegrationsLoaded"
        striped-rows
        table-style="min-width: 60rem"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 20, 50]"
        :empty-message="t('ticketing.empty')"
    >

      <pv-column :header="t('ticketing.system')">
        <template #body="slotProps">
          {{
            slotProps.data.getSystemName()
          }}
        </template>
      </pv-column>

      <pv-column :header="t('ticketing.endpoint')">
        <template #body="slotProps">
          {{
            slotProps.data.getEndpointUrl()
          }}
        </template>
      </pv-column>

      <pv-column :header="t('ticketing.status')">
        <template #body="slotProps">

          <span
              :class="[
                'status-badge',
                `status-${slotProps.data
                    .getConnectionStatusAsString()
                    .toLowerCase()}`
              ]"
          >
            {{
              slotProps.data
                  .getConnectionStatusAsString()
            }}
          </span>

        </template>
      </pv-column>

      <pv-column :header="t('ticketing.lastVerified')">
        <template #body="slotProps">
          {{
            formatDate(
                slotProps.data.getLastVerifiedAt()
            )
          }}
        </template>
      </pv-column>

      <pv-column :header="t('ticketing.actions')">
        <template #body="slotProps">

          <div class="actions">

            <pv-button
                icon="pi pi-eye"
                text
                rounded
                @click="
                  navigateToDetail(
                    slotProps.data.getId()
                  )
                "
            />

            <pv-button
                icon="pi pi-pencil"
                text
                rounded
                @click="
                  navigateToEdit(
                    slotProps.data.getId()
                  )
                "
            />

          </div>

        </template>
      </pv-column>

    </pv-data-table>

    <div
        v-if="errors.length"
        class="text-red-500 mt-3"
    >
      {{ t("errors.occurred") }}:
      {{
        errors
            .map(error => error.message)
            .join(", ")
      }}
    </div>

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
  margin: 0;
}

.header p {
  margin: 0.75rem 0 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-available {
  background: rgba(34, 197, 94, 0.15);
}

.status-reconnecting {
  background: rgba(245, 158, 11, 0.15);
}

.status-unavailable {
  background: rgba(239, 68, 68, 0.15);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>