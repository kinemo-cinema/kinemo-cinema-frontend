<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

import {useExecutionStore}
  from "../../application/execution.store.js";

const store = useExecutionStore();
const route = useRoute();
const router = useRouter();

const emergencyReason = ref(
    "Emergency stop requested by operator"
);

const execution = computed(() =>
    store.getShowExecutionById(route.params.id)
);

onMounted(() => {
  if (!store.showExecutionsLoaded) {
    store.fetchShowExecutions();
  }
});

function goBack() {
  router.push({
    name: "execution-list"
  });
}

function start() {
  store.startExecution(execution.value);
}

function pause() {
  store.pauseExecution(execution.value);
}

function resume() {
  store.resumeExecution(execution.value);
}

function finish() {
  store.finishExecution(execution.value);
}

function emergencyStop() {
  store.emergencyStop(
      execution.value,
      emergencyReason.value
  );
}

function restore() {
  store.restoreExecution(execution.value);
}
</script>

<template>
  <section>

    <button
        class="back"
        @click="goBack">
      ← Back
    </button>

    <div
        v-if="!store.showExecutionsLoaded"
        class="message">
      Loading...
    </div>

    <div
        v-else-if="!execution"
        class="message">
      Execution not found.
    </div>

    <div v-else>

      <header class="execution-header">

        <div>
          <h1>
            Execution #{{ execution.getId() }}
          </h1>

          <p>
            Show {{ execution.getShowId() }}
          </p>
        </div>

        <span class="status">
          {{ execution.getStatusAsString() }}
        </span>

      </header>

      <div class="info-grid">

        <article class="info-card">
          <small>Status</small>
          <strong>
            {{ execution.getStatusAsString() }}
          </strong>
        </article>

        <article class="info-card">
          <small>Sequences</small>
          <strong>
            {{ execution.getSequences().length }}
          </strong>
        </article>

        <article class="info-card">
          <small>Sync events</small>
          <strong>
            {{ execution.getSynchronizationEvents().length }}
          </strong>
        </article>

        <article class="info-card">
          <small>Emergency events</small>
          <strong>
            {{ execution.getEmergencyEvents().length }}
          </strong>
        </article>

      </div>

      <div class="controls">

        <button
            v-if="execution.getStatus().isReady()"
            @click="start">
          Start
        </button>

        <button
            v-if="execution.getStatus().isRunning()"
            @click="pause">
          Pause
        </button>

        <button
            v-if="execution.getStatus().isPaused()"
            @click="resume">
          Resume
        </button>

        <button
            v-if="
              execution.getStatus().isRunning() ||
              execution.getStatus().isPaused()
            "
            @click="finish">
          Finish
        </button>

        <button
            v-if="
              !execution.getStatus().isCompleted() &&
              !execution.getStatus().isEmergencyStopped()
            "
            class="danger"
            @click="emergencyStop">
          Emergency Stop
        </button>

        <button
            v-if="execution.getStatus().isEmergencyStopped()"
            @click="restore">
          Restore
        </button>

      </div>

    </div>

  </section>
</template>

<style scoped>
.back {
  margin-bottom: 1rem;
}

.execution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  font-weight: 700;
  color: #8B5CF6;
}

.info-grid {
  display: grid;
  grid-template-columns:
      repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.info-card {
  padding: 1rem;
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.controls button {
  padding: 0.7rem 1.2rem;
  cursor: pointer;
}

.danger {
  background: #b91c1c;
  color: white;
}
</style>