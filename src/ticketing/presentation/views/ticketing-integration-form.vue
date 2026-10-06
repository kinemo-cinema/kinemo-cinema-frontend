<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";

import useTicketingStore from "../../application/ticketing.store.js";
import {TicketingIntegration} from "../../domain/model/ticketing-integration.entity.js";

const route = useRoute();
const router = useRouter();
const ticketingStore = useTicketingStore();

const form = ref({
  systemName: "",
  endpointUrl: "",
  connectionStatus: "AVAILABLE"
});

const statusOptions = [
  {label: "Available", value: "AVAILABLE"},
  {label: "Reconnecting", value: "RECONNECTING"},
  {label: "Unavailable", value: "UNAVAILABLE"}
];

const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (!ticketingStore.ticketingIntegrationsLoaded) {
    ticketingStore.fetchTicketingIntegrations();
  }

  if (isEdit.value) {
    const integration = getIntegrationById(route.params.id);

    if (integration) {
      form.value.systemName = integration.getSystemName();
      form.value.endpointUrl = integration.getEndpointUrl();
      form.value.connectionStatus =
          integration.getConnectionStatusAsString();
    }
  }
});

function getIntegrationById(id) {
  return ticketingStore.getTicketingIntegrationById(id);
}

function isFormValid() {
  return (
      form.value.systemName.trim() !== "" &&
      form.value.endpointUrl.trim() !== ""
  );
}

const saveIntegration = () => {
  if (!isFormValid()) return;

  const existing =
      isEdit.value
          ? getIntegrationById(route.params.id)
          : null;

  const integration = new TicketingIntegration({
    id: existing ? existing.getId() : null,
    systemName: form.value.systemName.trim(),
    endpointUrl: form.value.endpointUrl.trim(),
    connectionStatus: form.value.connectionStatus,
    lastVerifiedAt: existing
        ? existing.getLastVerifiedAt()
        : null
  });

  if (isEdit.value) {
    ticketingStore.updateTicketingIntegration(integration);
  } else {
    ticketingStore.addTicketingIntegration(integration);
  }

  navigateBack();
};

const navigateBack = () => {
  router.push({
    name: "ticketing-integrations"
  });
};
</script>

<template>
  <div class="p-4">

    <h1>
      {{
        isEdit
            ? "Edit Ticketing Integration"
            : "New Ticketing Integration"
      }}
    </h1>

    <p class="mb-4">
      Configure the connection between Kinemo
      and an external ticketing system.
    </p>

    <form @submit.prevent="saveIntegration">

      <div class="field mb-3">
        <label for="systemName">
          System Name
        </label>

        <InputText
            id="systemName"
            v-model="form.systemName"
            class="w-full"
            placeholder="Enter ticketing system name"
            required
        />
      </div>

      <div class="field mb-3">
        <label for="endpointUrl">
          Endpoint URL
        </label>

        <InputText
            id="endpointUrl"
            v-model="form.endpointUrl"
            class="w-full"
            placeholder="https://api.provider.com"
            required
        />
      </div>

      <div class="field mb-3">
        <label for="connectionStatus">
          Connection Status
        </label>

        <Select
            id="connectionStatus"
            v-model="form.connectionStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            placeholder="Select status"
        />
      </div>

      <Button
          type="submit"
          :label="
            isEdit
                ? 'Save Changes'
                : 'Create Integration'
          "
          icon="pi pi-save"
          :disabled="!isFormValid()"
      />

      <Button
          type="button"
          label="Cancel"
          severity="secondary"
          class="ml-2"
          @click="navigateBack"
      />

    </form>

  </div>
</template>

<style scoped>
</style>