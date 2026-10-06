<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import {storeToRefs} from "pinia";
import useReadinessStore from "../../application/readiness.store.js";
import {onMounted, ref, computed} from "vue";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useReadinessStore();

const { rooms, roomsLoaded, errors } = storeToRefs(store);
const { fetchRooms, deleteRoom } = store;

const statusFilter = ref(null);

const STATUS_OPTIONS = ['AVAILABLE', 'PREPARING', 'READY', 'BLOCKED', 'MAINTENANCE'];

/**
 * Rooms filtered by the selected status, if any.
 */
const filteredRooms = computed(() => {
  if (!statusFilter.value) return rooms.value;
  return rooms.value.filter(r => r.getStatusAsString() === statusFilter.value);
});

onMounted(() => {
  if (!store.roomsLoaded) fetchRooms();
});

const navigateToNew = () => {
  router.push({ name: 'readiness-room-new' });
};

const navigateToDetail = (id) => {
  router.push({ name: 'readiness-room-detail', params: { id } });
};

const navigateToEdit = (id) => {
  router.push({ name: 'readiness-room-edit', params: { id } });
};

const confirmDelete = (room) => {
  confirm.require({
    message: t('rooms.confirm-delete', { name: room.getName() }),
    header: t('rooms.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteRoom(room); },
  });
};
</script>

<template>
  <div class="p-4">
    <div class="flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
      <h1 class="m-0">{{ t('rooms.title') }}</h1>
      <div class="flex align-items-center gap-2">
        <pv-select
            v-model="statusFilter"
            :options="STATUS_OPTIONS"
            :placeholder="t('rooms.filter-status')"
            showClear
            class="w-12rem"/>
        <pv-button :label="t('rooms.new')" icon="pi pi-plus" @click="navigateToNew"/>
      </div>
    </div>

    <pv-data-table
        :value="filteredRooms"
        :loading="!roomsLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 20, 50]">
      <pv-column :header="t('rooms.id')">
        <template #body="slotProps">{{ slotProps.data.getId() }}</template>
      </pv-column>

      <pv-column :header="t('rooms.fields.name')">
        <template #body="slotProps">{{ slotProps.data.getName() }}</template>
      </pv-column>

      <pv-column :header="t('rooms.fields.capacity')">
        <template #body="slotProps">{{ slotProps.data.getCapacity() }}</template>
      </pv-column>

      <pv-column :header="t('rooms.fields.status')">
        <template #body="slotProps">{{ slotProps.data.getStatusAsString() }}</template>
      </pv-column>

      <pv-column :header="t('rooms.fields.ready')">
        <template #body="slotProps">
          {{ slotProps.data.canHostShow() ? '✓' : '—' }}
        </template>
      </pv-column>

      <pv-column :header="t('rooms.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-eye" text rounded @click="navigateToDetail(slotProps.data.getId())"/>
          <pv-button icon="pi pi-pencil" text rounded @click="navigateToEdit(slotProps.data.getId())"/>
          <pv-button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)"/>
        </template>
      </pv-column>
    </pv-data-table>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>

    <pv-confirm-dialog/>
  </div>
</template>

<style scoped>
</style>