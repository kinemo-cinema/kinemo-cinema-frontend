<script setup>
import {onMounted} from "vue";
import {useRouter} from "vue-router";

import {useExecutionStore}
  from "../../application/execution.store.js";

const store = useExecutionStore();
const router = useRouter();

onMounted(() => {
  if (!store.showExecutionsLoaded) {
    store.fetchShowExecutions();
  }
});

function openExecution(execution) {
  router.push({
    name: "execution-detail",
    params: {
      id: execution.getId()
    }
  });
}
</script>

<template>
  <section>

    <header class="page-header">
      <div>
        <h1>4D Execution</h1>

        <p>
          Monitor and control active 4D experiences.
        </p>
      </div>
    </header>

    <div
        v-if="store.errors.length"
        class="message">
      Unable to load executions.
    </div>

    <div
        v-else-if="!store.showExecutionsLoaded"
        class="message">
      Loading executions...
    </div>

    <div
        v-else-if="!store.showExecutions.length"
        class="message">
      No executions available.
    </div>

    <div
        v-else
        class="execution-grid">

      <article
          v-for="execution in store.showExecutions"
          :key="execution.getId()"
          class="execution-card"
          @click="openExecution(execution)">

        <div class="card-heading">
          <h3>
            Execution #{{ execution.getId() }}
          </h3>

          <span>
            {{ execution.getStatusAsString() }}
          </span>
        </div>

        <p>
          Show ID:
          <strong>{{ execution.getShowId() }}</strong>
        </p>

        <p>
          Started:
          <strong>
            {{ execution.getStartedAtFormatted() ?? "Not started" }}
          </strong>
        </p>

      </article>

    </div>

  </section>
</template>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
}

.page-header p {
  opacity: 0.7;
}

.execution-grid {
  display: grid;
  grid-template-columns:
      repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.execution-card {
  padding: 1.2rem;
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 10px;
  cursor: pointer;
}

.execution-card:hover {
  border-color: #8B5CF6;
}

.card-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.message {
  padding: 2rem;
  text-align: center;
}
</style>