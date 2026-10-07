<script setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref} from "vue";

import useTicketingStore from "../../application/ticketing.store.js";
import {TicketingIntegration} from "../../domain/model/ticketing-integration.entity.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();

const ticketingStore = useTicketingStore();

/*
 * Reactive state from store
 */
const {errors} = storeToRefs(ticketingStore);

/*
 * Actions
 */
const {
  addTicketingIntegration,
  updateTicketingIntegration,
  fetchTicketingIntegrations
} = ticketingStore;

/*
 * Local form state
 */
const form = ref({
  systemName: "",
  endpointUrl: "",
  connectionStatus: "AVAILABLE"
});

const isEdit = computed(() => !!route.params.id);

/*
 * Select options.
 * Computed so the labels update when EN / ES changes.
 */
const statusOptions = computed(() => [
  {
    label: t("NewIntegration.available"),
    value: "AVAILABLE"
  },
  {
    label: t("NewIntegration.reconnecting"),
    value: "RECONNECTING"
  },
  {
    label: t("NewIntegration.unavailable"),
    value: "UNAVAILABLE"
  }
]);

onMounted(async () => {
  if (!ticketingStore.ticketingIntegrationsLoaded) {
    await fetchTicketingIntegrations();
  }

  if (isEdit.value) {
    const integration =
        getIntegrationById(route.params.id);

    if (integration) {
      form.value.systemName =
          integration.getSystemName();

      form.value.endpointUrl =
          integration.getEndpointUrl();

      form.value.connectionStatus =
          integration.getConnectionStatusAsString();
    } else {
      router.push({
        name: "ticketing-integrations"
      });
    }
  }
});

/**
 * Retrieves a ticketing integration by its ID.
 *
 * @param {number|string} id
 * @returns {TicketingIntegration|undefined}
 */
function getIntegrationById(id) {
  return ticketingStore.getTicketingIntegrationById(id);
}

/**
 * Checks whether the form contains the required information.
 *
 * @returns {boolean}
 */
function isFormValid() {
  return (
      form.value.systemName.trim() !== "" &&
      form.value.endpointUrl.trim() !== ""
  );
}

/**
 * Creates or updates a ticketing integration.
 */
const saveIntegration = async () => {
  if (!isFormValid()) return;

  const existing =
      isEdit.value
          ? getIntegrationById(route.params.id)
          : null;

  const integration = new TicketingIntegration({
    id: existing
        ? existing.getId()
        : null,

    systemName:
        form.value.systemName.trim(),

    endpointUrl:
        form.value.endpointUrl.trim(),

    connectionStatus:
    form.value.connectionStatus,

    lastVerifiedAt: existing
        ? existing.getLastVerifiedAt()
        : null
  });

  let success;

  if (isEdit.value) {
    success =
        await updateTicketingIntegration(integration);
  } else {
    success =
        await addTicketingIntegration(integration);
  }

  if (success) {
    navigateBack();
  }
};

/**
 * Navigates back to the integrations list.
 */
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
            ? t("NewIntegration.edit-title")
            : t("NewIntegration.title")
      }}
    </h1>

    <p class="form-subtitle">
      {{ t("NewIntegration.subtitle") }}
    </p>

    <form @submit.prevent="saveIntegration">

      <div class="field mb-3">
        <label for="systemName">
          {{ t("NewIntegration.system-name") }}
        </label>

        <pv-input-text
            id="systemName"
            v-model="form.systemName"
            class="w-full"
            :placeholder="
              t('NewIntegration.system-placeholder')
            "
            required
        />
      </div>

      <div class="field mb-3">
        <label for="endpointUrl">
          {{ t("NewIntegration.endpoint-url") }}
        </label>

        <pv-input-text
            id="endpointUrl"
            v-model="form.endpointUrl"
            class="w-full"
            placeholder="https://api.provider.com"
            required
        />
      </div>

      <div class="field mb-3">
        <label for="connectionStatus">
          {{ t("NewIntegration.status") }}
        </label>

        <pv-select
            id="connectionStatus"
            v-model="form.connectionStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="
              t('NewIntegration.select-status')
            "
            class="w-full"
            required
        />
      </div>

      <pv-button
          type="submit"
          :label="
            isEdit
                ? t('NewIntegration.save')
                : t('NewIntegration.create')
          "
          icon="pi pi-save"
          :disabled="!isFormValid()"
      />

      <pv-button
          type="button"
          :label="t('NewIntegration.cancel')"
          severity="secondary"
          class="ml-2"
          @click="navigateBack"
      />

    </form>

    <div
        v-if="errors.length"
        class="text-red-500 mt-3"
    >
      {{ t("errors.occurred") }}:
      {{ errors.map(e => e.message).join(", ") }}
    </div>

  </div>
</template>

<style scoped>
.form-subtitle {
  margin-top: 0.75rem;
  margin-bottom: 2rem;
}
</style>