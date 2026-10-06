<script setup>
import {computed, onMounted, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";

import useTicketingStore from "../../application/ticketing.store.js";
import {TicketingIntegration} from "../../domain/model/ticketing-integration.entity.js";

const route = useRoute();
const router = useRouter();
const ticketingStore = useTicketingStore();

/**
 * Determines whether the form is being used for edition.
 */
const isEditMode = computed(
    () => Boolean(route.params.id)
);

/**
 * Available connection statuses.
 */
const statusOptions = [
  {
    label: "Connected",
    value: "CONNECTED"
  },
  {
    label: "Disconnected",
    value: "DISCONNECTED"
  },
  {
    label: "Reconnecting",
    value: "RECONNECTING"
  }
];

/**
 * Form state.
 */
const form = reactive({
  cinemaId: "",
  providerName: "",
  status: "DISCONNECTED"
});

/**
 * Loads the integration information when editing.
 */
onMounted(async () => {
  if (!isEditMode.value) {
    return;
  }

  if (!ticketingStore.ticketingIntegrationsLoaded) {
    ticketingStore.fetchTicketingIntegrations();
  }

  const integration =
      ticketingStore.getTicketingIntegrationById(
          route.params.id
      );

  if (!integration) {
    return;
  }

  form.cinemaId = integration.getCinemaId() ?? "";
  form.providerName = integration.getProviderName();
  form.status = integration.getStatusAsString();
});

/**
 * Validates the required form fields.
 *
 * @returns {boolean}
 */
function isFormValid() {
  return (
      String(form.cinemaId).trim() !== "" &&
      form.providerName.trim() !== ""
  );
}

/**
 * Creates or updates the ticketing integration.
 */
function saveIntegration() {
  if (!isFormValid()) {
    return;
  }

  if (isEditMode.value) {
    updateIntegration();
    return;
  }

  createIntegration();
}

/**
 * Creates a new ticketing integration.
 */
function createIntegration() {
  const integration = new TicketingIntegration({
    cinemaId: String(form.cinemaId).trim(),
    providerName: form.providerName.trim(),
    status: form.status
  });

  ticketingStore.addTicketingIntegration(integration);

  router.push({
    name: "ticketing-integrations"
  });
}

/**
 * Updates an existing ticketing integration.
 */
function updateIntegration() {
  const currentIntegration =
      ticketingStore.getTicketingIntegrationById(
          route.params.id
      );

  if (!currentIntegration) {
    return;
  }

  const integration = new TicketingIntegration({
    integrationId: currentIntegration.getId(),
    cinemaId: String(form.cinemaId).trim(),
    providerName: form.providerName.trim(),
    status: form.status
  });

  ticketingStore.updateTicketingIntegration(integration);

  router.push({
    name: "ticketing-integration-detail",
    params: {
      id: integration.getId()
    }
  });
}

/**
 * Returns to the integration list.
 */
function cancel() {
  router.push({
    name: "ticketing-integrations"
  });
}
</script>

<template>
  <section class="ticketing-integration-form">

    <div class="ticketing-integration-form__header">
      <div>
        <h1>
          {{
            isEditMode
                ? "Edit Ticketing Integration"
                : "New Ticketing Integration"
          }}
        </h1>

        <p>
          Configure the connection between Kinemo
          and an external ticketing provider.
        </p>
      </div>
    </div>

    <form
        class="ticketing-integration-form__content"
        @submit.prevent="saveIntegration"
    >

      <div class="ticketing-integration-form__field">
        <label for="cinemaId">
          Cinema ID
        </label>

        <InputText
            id="cinemaId"
            v-model="form.cinemaId"
            placeholder="Enter cinema ID"
            fluid
        />
      </div>

      <div class="ticketing-integration-form__field">
        <label for="providerName">
          Provider Name
        </label>

        <InputText
            id="providerName"
            v-model="form.providerName"
            placeholder="Enter ticketing provider"
            fluid
        />
      </div>

      <div class="ticketing-integration-form__field">
        <label for="status">
          Connection Status
        </label>

        <Select
            id="status"
            v-model="form.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select status"
            fluid
        />
      </div>

      <div class="ticketing-integration-form__actions">
        <Button
            type="button"
            label="Cancel"
            severity="secondary"
            outlined
            @click="cancel"
        />

        <Button
            type="submit"
            :label="isEditMode ? 'Save Changes' : 'Create Integration'"
            icon="pi pi-check"
            :disabled="!isFormValid()"
        />
      </div>

    </form>

  </section>
</template>

<style scoped>
.ticketing-integration-form {
  padding: 2rem;
}

.ticketing-integration-form__header {
  margin-bottom: 2rem;
}

.ticketing-integration-form__header h1 {
  margin: 0 0 0.5rem;
}

.ticketing-integration-form__header p {
  margin: 0;
}

.ticketing-integration-form__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 40rem;
}

.ticketing-integration-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ticketing-integration-form__field label {
  font-weight: 600;
}

.ticketing-integration-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .ticketing-integration-form {
    padding: 1rem;
  }

  .ticketing-integration-form__actions {
    justify-content: stretch;
    flex-direction: column-reverse;
  }
}
</style>