<script setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {useConfirm} from "primevue";
import {storeToRefs} from "pinia";
import useReadinessStore from "../../application/readiness.store.js";
import {computed, onMounted, ref} from "vue";
import {RoomInspection} from "../../domain/model/room-inspection.entity.js";
import {RoomBlock} from "../../domain/model/room-block.entity.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const store = useReadinessStore();

const { errors } = storeToRefs(store);
const {
  fetchRooms,
  markRoomReady,
  startRoomPreparation,
  sendRoomToMaintenance,
  completeRoomMaintenance,
  releaseRoom,
  approveInspection,
  rejectInspection,
  addRoomInspection,
  addBlock,
} = {
  ...store,
  // Alias blockRoom to addBlock for readability at the call site below
  addBlock: store.blockRoom,
};

const showInspectionForm = ref(false);
const showBlockForm = ref(false);

const inspectionForm = ref({
  inspectorId: null,
  technicalReviewRequired: false,
});

const blockForm = ref({
  reason: '',
  startLocal: '',
  endLocal: '',
});

/**
 * The room being inspected. Recomputed when the store collection
 * changes so the view stays in sync after transitions.
 */
const room = computed(() => store.getRoomById(route.params.id));

onMounted(() => {
  if (!store.roomsLoaded) fetchRooms();
});

/**
 * Converts a datetime-local input value to an ISO 8601 string.
 */
function toISO(localValue) {
  return new Date(localValue).toISOString();
}

const submitInspection = () => {
  const roomId = parseInt(route.params.id);

  const inspection = new RoomInspection({
    roomId: roomId,
    inspectorId: inspectionForm.value.inspectorId,
    technicalReviewRequired: inspectionForm.value.technicalReviewRequired,
    inspectedAt: new Date().toISOString(),
  });

  addRoomInspection(inspection);
  inspectionForm.value = { inspectorId: null, technicalReviewRequired: false };
  showInspectionForm.value = false;
};

const submitBlock = () => {
  const roomId = parseInt(route.params.id);

  const block = new RoomBlock({
    roomId: roomId,
    reason: blockForm.value.reason,
    startTime: toISO(blockForm.value.startLocal),
    endTime: toISO(blockForm.value.endLocal),
    status: 'SCHEDULED',
  });

  addBlock(room.value, block);
  blockForm.value = { reason: '', startLocal: '', endLocal: '' };
  showBlockForm.value = false;
};

const confirmRelease = () => {
  confirm.require({
    message: t('roomDetail.release-confirm'),
    header: t('roomDetail.release-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { releaseRoom(room.value); },
  });
};

const backToList = () => {
  router.push({ name: 'readiness-rooms' });
};
</script>

<template>
  <div class="p-4">
    <div v-if="!room" class="text-center py-5">
      <p>{{ t('roomDetail.not-found') }}</p>
      <pv-button :label="t('roomDetail.back')" icon="pi pi-arrow-left" @click="backToList"/>
    </div>

    <template v-else>
      <div class="flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h1 class="m-0">{{ room.getName() }}</h1>
          <p class="mt-1 mb-0 opacity-70">
            {{ t('rooms.fields.capacity') }}: {{ room.getCapacity() }}
            &nbsp;·&nbsp;
            {{ t('rooms.fields.status') }}: {{ room.getStatusAsString() }}
            &nbsp;·&nbsp;
            {{ t('roomDetail.ready-label') }}:
            {{ room.canHostShow() ? '✓' : '—' }}
          </p>
        </div>
        <pv-button :label="t('roomDetail.back')" icon="pi pi-arrow-left" severity="secondary" @click="backToList"/>
      </div>

      <!-- Transition toolbar -->
      <div class="flex flex-wrap gap-2 mb-4">
        <pv-button
            :label="t('roomDetail.transitions.prepare')"
            icon="pi pi-cog"
            @click="startRoomPreparation(room)"/>
        <pv-button
            :label="t('roomDetail.transitions.mark-ready')"
            icon="pi pi-check-circle"
            @click="markRoomReady(room)"/>
        <pv-button
            :label="t('roomDetail.transitions.maintenance')"
            icon="pi pi-wrench"
            severity="warn"
            @click="sendRoomToMaintenance(room)"/>
        <pv-button
            :label="t('roomDetail.transitions.complete-maintenance')"
            icon="pi pi-check"
            severity="success"
            @click="completeRoomMaintenance(room)"/>
        <pv-button
            :label="t('roomDetail.transitions.release')"
            icon="pi pi-unlock"
            severity="help"
            @click="confirmRelease"/>
      </div>

      <pv-confirm-dialog/>

      <!-- Inspections -->
      <section class="mb-5">
        <div class="flex align-items-center justify-content-between mb-2">
          <h2 class="m-0">{{ t('roomDetail.inspections.title') }}</h2>
          <pv-button
              :label="t('roomDetail.inspections.add')"
              icon="pi pi-plus"
              size="small"
              @click="showInspectionForm = !showInspectionForm"/>
        </div>

        <form v-if="showInspectionForm" class="p-3 mb-3 border-round surface-100" @submit.prevent="submitInspection">
          <div class="field mb-3">
            <label for="inspector">{{ t('inspection.inspector') }}</label>
            <pv-input-number id="inspector" v-model="inspectionForm.inspectorId" class="w-full" :min="0" showButtons/>
          </div>

          <div class="field mb-3 flex align-items-center gap-2">
            <input id="tech-review" type="checkbox" v-model="inspectionForm.technicalReviewRequired"/>
            <label for="tech-review" class="m-0">{{ t('inspection.technical-review') }}</label>
          </div>

          <pv-button type="submit" :label="t('inspection.save')" icon="pi pi-save" size="small"/>
          <pv-button
              :label="t('inspection.cancel')"
              severity="secondary"
              size="small"
              class="ml-2"
              @click="showInspectionForm = false"/>
        </form>

        <pv-data-table :value="room.getInspections()" striped-rows table-style="min-width: 40rem">
          <pv-column :header="t('inspections.id')">
            <template #body="slotProps">{{ slotProps.data.getId() }}</template>
          </pv-column>

          <pv-column :header="t('inspections.fields.inspector')">
            <template #body="slotProps">{{ slotProps.data.getInspectorId() }}</template>
          </pv-column>

          <pv-column :header="t('inspections.fields.status')">
            <template #body="slotProps">{{ slotProps.data.getStatusAsString() }}</template>
          </pv-column>

          <pv-column :header="t('inspections.fields.inspected-at')">
            <template #body="slotProps">{{ slotProps.data.getInspectedAtFormated() }}</template>
          </pv-column>

          <pv-column :header="t('inspections.fields.tech-review')">
            <template #body="slotProps">{{ slotProps.data.requiresTechnicalReview() ? '✓' : '—' }}</template>
          </pv-column>

          <pv-column :header="t('inspections.actions')">
            <template #body="slotProps">
              <pv-button
                  icon="pi pi-check"
                  text
                  rounded
                  severity="success"
                  @click="approveInspection(slotProps.data)"/>
              <pv-button
                  icon="pi pi-times"
                  text
                  rounded
                  severity="danger"
                  @click="rejectInspection(slotProps.data)"/>
            </template>
          </pv-column>
        </pv-data-table>
      </section>

      <!-- Blocks -->
      <section class="mb-5">
        <div class="flex align-items-center justify-content-between mb-2">
          <h2 class="m-0">{{ t('roomDetail.blocks.title') }}</h2>
          <pv-button
              :label="t('roomDetail.blocks.add')"
              icon="pi pi-plus"
              size="small"
              @click="showBlockForm = !showBlockForm"/>
        </div>

        <form v-if="showBlockForm" class="p-3 mb-3 border-round surface-100" @submit.prevent="submitBlock">
          <div class="field mb-3">
            <label for="reason">{{ t('block.reason') }}</label>
            <pv-input-text id="reason" v-model="blockForm.reason" class="w-full" required/>
          </div>

          <div class="field mb-3">
            <label for="block-start">{{ t('block.start-time') }}</label>
            <pv-input-text id="block-start" v-model="blockForm.startLocal" type="datetime-local" class="w-full" required/>
          </div>

          <div class="field mb-3">
            <label for="block-end">{{ t('block.end-time') }}</label>
            <pv-input-text id="block-end" v-model="blockForm.endLocal" type="datetime-local" class="w-full" required/>
          </div>

          <pv-button type="submit" :label="t('block.save')" icon="pi pi-save" size="small"/>
          <pv-button
              :label="t('block.cancel')"
              severity="secondary"
              size="small"
              class="ml-2"
              @click="showBlockForm = false"/>
        </form>

        <pv-data-table :value="room.getBlocks()" striped-rows table-style="min-width: 40rem">
          <pv-column :header="t('blocks.id')">
            <template #body="slotProps">{{ slotProps.data.getId() }}</template>
          </pv-column>

          <pv-column :header="t('blocks.fields.reason')">
            <template #body="slotProps">{{ slotProps.data.getReason() }}</template>
          </pv-column>

          <pv-column :header="t('blocks.fields.window')">
            <template #body="slotProps">
              {{ slotProps.data.getStartTimeAsISO() }} → {{ slotProps.data.getEndTimeAsISO() }}
            </template>
          </pv-column>

          <pv-column :header="t('blocks.fields.status')">
            <template #body="slotProps">{{ slotProps.data.getStatusAsString() }}</template>
          </pv-column>
        </pv-data-table>
      </section>

      <div v-if="errors.length" class="text-red-500 mt-3">
        {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>