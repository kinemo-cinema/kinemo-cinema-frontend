<script setup>
import {useI18n} from "vue-i18n";
import useCatalogStore from "../../application/catalog.store.js";
import {onMounted, toRefs} from "vue";

const { t } = useI18n();
const store = useCatalogStore();
const { configurationHistory, configurationHistoryLoaded, errors } = toRefs(store);
const { fetchConfigurationHistory } = store;

onMounted(() => {
  if (!store.configurationHistoryLoaded) fetchConfigurationHistory();
});
</script>

<template>
  <div class="p-4">
    <h1>{{ t('configurationHistory.title') }}</h1>
    <pv-data-table
        :value="configurationHistory"
        :loading="!configurationHistoryLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 20, 50]">
      <pv-column :header="t('configurationHistory.id')">
        <template #body="slotProps">{{ slotProps.data.getId() }}</template>
      </pv-column>
      <pv-column :header="t('configurationHistory.fields.sensoryTrack')">
        <template #body="slotProps">#{{ slotProps.data.getSensoryTrackId() }}</template>
      </pv-column>
      <pv-column :header="t('configurationHistory.fields.previousIntensityLevel')">
        <template #body="slotProps">{{ slotProps.data.getPreviousIntensityLevelAsNumber() }}%</template>
      </pv-column>
      <pv-column :header="t('configurationHistory.fields.changedAt')">
        <template #body="slotProps">{{ slotProps.data.getChangedAtFormated() }}</template>
      </pv-column>
      <pv-column :header="t('configurationHistory.fields.restored')">
        <template #body="slotProps">{{ slotProps.data.isRestored() ? '✓' : '—' }}</template>
      </pv-column>
    </pv-data-table>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>