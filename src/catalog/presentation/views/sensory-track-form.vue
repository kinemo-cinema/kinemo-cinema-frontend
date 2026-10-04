<script setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import useCatalogStore from "../../application/catalog.store.js";
import {computed, onMounted, ref} from "vue";
import {SensoryTrack} from "../../domain/model/sensory-track.entity.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useCatalogStore();

const { errors, sensoryFiles, addSensoryTrack, updateSensoryTrack, fetchSensoryFiles } = store;

const TRACK_TYPES = ['MOTION', 'WIND', 'WATER', 'VIBRATION'];
const TRACK_STATUSES = ['ENABLED', 'DISABLED', 'PENDING'];

const form = ref({
  sensoryFileId: null,
  trackType: 'MOTION',
  intensityLevel: 50,
  trackStatus: 'PENDING',
});

const isEdit = computed(() => !!route.params.id);

/**
 * Select options for the sensory file dropdown. Plain objects are used
 * because PrimeVue's option binding cannot reach private entity fields.
 */
const fileOptions = computed(() =>
    sensoryFiles.value.map(f => ({ id: f.getId(), fileName: f.getFileName() }))
);

onMounted(() => {
  if (!store.sensoryFilesLoaded) fetchSensoryFiles();
  if (isEdit.value) {
    const track = getSensoryTrackById(route.params.id);
    if (track) {
      form.value.sensoryFileId = track.getSensoryFileId();
      form.value.trackType = track.getTrackTypeAsString();
      form.value.intensityLevel = track.getIntensityLevelAsNumber();
      form.value.trackStatus = track.getTrackStatusAsString();
    } else {
      router.push({ name: 'catalog-sensory-tracks' });
    }
  }
});

/**
 * Retrieves a sensory track by its ID.
 * @param {number|string} id - The sensory track ID.
 * @returns {SensoryTrack|null} The sensory track or null if not found.
 */
function getSensoryTrackById(id) {
  return store.getSensoryTrackById(id);
}

/**
 * Saves the sensory track, either by adding a new one or updating an existing one.
 */
const saveSensoryTrack = () => {
  const existing = isEdit.value ? getSensoryTrackById(route.params.id) : null;

  const sensoryTrack = new SensoryTrack({
    id: existing ? existing.getId() : null,
    sensoryFileId: form.value.sensoryFileId,
    trackType: form.value.trackType,
    intensityLevel: form.value.intensityLevel,
    trackStatus: form.value.trackStatus,
  });

  if (isEdit.value) updateSensoryTrack(sensoryTrack); else addSensoryTrack(sensoryTrack);
  navigateBack();
};

/**
 * Navigates back to the sensory tracks list.
 */
const navigateBack = () => {
  router.push({ name: 'catalog-sensory-tracks' });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('sensoryTrack.edit-title') : t('sensoryTrack.new-title') }}</h1>

    <form @submit.prevent="saveSensoryTrack">
      <div class="field mb-3">
        <label for="sensoryFile">{{ t('sensoryTrack.sensoryFile') }}</label>
        <pv-select
            id="sensoryFile"
            v-model="form.sensoryFileId"
            :options="fileOptions"
            optionLabel="fileName"
            optionValue="id"
            :placeholder="t('sensoryTrack.select-sensory-file')"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="trackType">{{ t('sensoryTrack.trackType') }}</label>
        <pv-select
            id="trackType"
            v-model="form.trackType"
            :options="TRACK_TYPES"
            :placeholder="t('sensoryTrack.select-track-type')"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="intensity">{{ t('sensoryTrack.intensityLevel') }}</label>
        <pv-input-number
            id="intensity"
            v-model="form.intensityLevel"
            class="w-full"
            :min="0"
            :max="100"
            suffix="%"
            showButtons/>
      </div>

      <div class="field mb-3">
        <label for="trackStatus">{{ t('sensoryTrack.trackStatus') }}</label>
        <pv-select
            id="trackStatus"
            v-model="form.trackStatus"
            :options="TRACK_STATUSES"
            class="w-full"
            required/>
      </div>

      <pv-button type="submit" :label="t('sensoryTrack.save')" icon="pi pi-save"/>
      <pv-button :label="t('sensoryTrack.cancel')" severity="secondary" class="ml-2" @click="navigateBack"/>
    </form>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>