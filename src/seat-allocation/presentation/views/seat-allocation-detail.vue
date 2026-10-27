<script setup>
import {computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useSeatAllocationStore}
  from "../../application/seat-allocation.store.js";

const store = useSeatAllocationStore();
const route = useRoute();
const router = useRouter();

const allocationId = computed(
    () => parseInt(route.params.id)
);

const allocation = computed(
    () => store.getSeatAllocationById(allocationId.value)
);

onMounted(() => {
  if (!store.seatAllocationsLoaded) {
    store.fetchSeatAllocations();
  }
});

function goBack() {
  router.push({
    name: 'seat-allocation-list'
  });
}

function enableSeat(seatId) {
  if (!allocation.value) return;

  store.enableSeat(
      allocation.value,
      seatId
  );
}

function disableSeat(seatId) {
  if (!allocation.value) return;

  store.disableSeat(
      allocation.value,
      seatId
  );
}
</script>

<template>
  <section>

    <button
        class="back-button"
        @click="goBack">

      ← Back

    </button>

    <div
        v-if="!store.seatAllocationsLoaded"
        class="loading">

      Loading allocation...

    </div>

    <div
        v-else-if="!allocation"
        class="empty-state">

      Seat allocation not found.

    </div>

    <div v-else>

      <div class="page-header">

        <div>
          <h1>
            Allocation #{{ allocation.getId() }}
          </h1>

          <p>
            Show ID:
            {{ allocation.getShowId() }}
          </p>
        </div>

        <span class="status">
          {{ allocation.getStatusAsString() }}
        </span>

      </div>

      <div
          v-if="allocation.getSeats().length === 0"
          class="empty-state">

        No seats registered.

      </div>

      <div
          v-else
          class="seat-grid">

        <article
            v-for="seat in allocation.getSeats()"
            :key="seat.getSeatId()"
            class="seat-card">

          <div>
            <strong>
              Seat {{ seat.getSeatId() }}
            </strong>
          </div>

          <div>
            Status:
            {{ seat.getStatusAsString() }}
          </div>

          <div>
            Sold:
            {{ seat.isSold() ? 'Yes' : 'No' }}
          </div>

          <div class="actions">

            <button
                :disabled="
                  seat.getStatusAsString() ===
                  'OUT_OF_SERVICE'
                "
                @click="enableSeat(seat.getSeatId())">

              Enable

            </button>

            <button
                @click="disableSeat(seat.getSeatId())">

              Disable

            </button>

          </div>

        </article>

      </div>

    </div>

  </section>
</template>

<style scoped>
.back-button {
  margin-bottom: 1rem;
  cursor: pointer;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.status {
  font-weight: 600;
}

.seat-grid {
  display: grid;
  grid-template-columns:
      repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.seat-card {
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 8px;
  padding: 1rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.actions button {
  cursor: pointer;
}

.loading,
.empty-state {
  padding: 2rem;
  text-align: center;
}
</style>