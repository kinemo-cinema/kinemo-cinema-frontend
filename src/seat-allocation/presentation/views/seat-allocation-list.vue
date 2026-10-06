<script setup>
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {useSeatAllocationStore}  from "../../application/seat-allocation.store.js";

const store = useSeatAllocationStore();
const router = useRouter();

onMounted(() => {
  if (!store.seatAllocationsLoaded) {
    store.fetchSeatAllocations();
  }
});

function openAllocation(allocation) {
  router.push({
    name: 'seat-allocation-detail',
    params: {
      id: allocation.getId()
    }
  });
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Seat Allocation</h1>
        <p>
          Manage seat participation for 4D shows.
        </p>
      </div>
    </div>

    <div
        v-if="store.errors.length > 0"
        class="error-message">

      Unable to load seat allocations.

    </div>

    <div
        v-else-if="!store.seatAllocationsLoaded"
        class="loading">

      Loading seat allocations...

    </div>

    <div
        v-else-if="store.seatAllocations.length === 0"
        class="empty-state">

      No seat allocations available.

    </div>

    <div
        v-else
        class="allocation-grid">

      <article
          v-for="allocation in store.seatAllocations"
          :key="allocation.getId()"
          class="allocation-card"
          @click="openAllocation(allocation)">

        <div class="allocation-card-header">
          <h3>
            Allocation #{{ allocation.getId() }}
          </h3>

          <span class="status-badge">
            {{ allocation.getStatusAsString() }}
          </span>
        </div>

        <p>
          Show ID:
          <strong>{{ allocation.getShowId() }}</strong>
        </p>

        <p>
          Seats:
          <strong>{{ allocation.getSeatCount() }}</strong>
        </p>

      </article>
    </div>
  </section>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
}

.page-header p {
  margin-top: 0.4rem;
  opacity: 0.7;
}

.allocation-grid {
  display: grid;
  grid-template-columns:
      repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.allocation-card {
  padding: 1rem;
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition:
      transform 0.15s ease,
      border-color 0.15s ease;
}

.allocation-card:hover {
  transform: translateY(-2px);
  border-color: #8B5CF6;
}

.allocation-card-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.status-badge {
  font-size: 0.8rem;
  font-weight: 600;
}

.loading,
.empty-state,
.error-message {
  padding: 2rem;
  text-align: center;
}
</style>