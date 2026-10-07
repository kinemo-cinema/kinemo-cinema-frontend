<script setup>
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {storeToRefs} from "pinia";
import useReadinessStore from "../../application/readiness.store.js";
import {computed, onMounted, ref} from "vue";
import {Room} from "../../domain/model/room.entity.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useReadinessStore();

const { errors } = storeToRefs(store);
const { addRoom, updateRoom, fetchRooms } = store;

const form = ref({
  name: '',
  capacity: 0,
});

const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (!store.roomsLoaded) fetchRooms();

  if (isEdit.value) {
    const room = getRoomById(route.params.id);
    if (room) {
      form.value.name = room.getName();
      form.value.capacity = room.getCapacity();
    } else {
      router.push({ name: 'readiness-rooms' });
    }
  }
});

function getRoomById(id) {
  return store.getRoomById(id);
}

const saveRoom = () => {
  const existing = isEdit.value ? getRoomById(route.params.id) : null;

  const room = new Room({
    id: existing ? existing.getId() : null,
    name: form.value.name,
    capacity: form.value.capacity,
    // Status is preserved when editing — transitions are the only way
    // to change a room's status, and they are exposed from the detail view.
    status: existing ? existing.getStatusAsString() : 'AVAILABLE',
    createdAt: existing ? existing.getCreatedAtFormated() : null,
    updatedAt: null,
  });

  if (isEdit.value) updateRoom(room); else addRoom(room);
  navigateBack();
};

const navigateBack = () => {
  router.push({ name: 'readiness-rooms' });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('room.edit-title') : t('room.new-title') }}</h1>

    <form @submit.prevent="saveRoom">
      <div class="field mb-3">
        <label for="name">{{ t('room.name') }}</label>
        <pv-input-text id="name" v-model="form.name" class="w-full" required/>
      </div>

      <div class="field mb-3">
        <label for="capacity">{{ t('room.capacity') }}</label>
        <pv-input-number
            id="capacity"
            v-model="form.capacity"
            class="w-full"
            :min="1"
            :max="500"
            showButtons/>
      </div>

      <pv-button type="submit" :label="t('room.save')" icon="pi pi-save"/>
      <pv-button :label="t('room.cancel')" severity="secondary" class="ml-2" @click="navigateBack"/>
    </form>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>