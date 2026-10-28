<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Card from 'primevue/card';
import Button from 'primevue/button';

import useMaintenanceStore from '../../application/maintenance.store.js';

const { t } = useI18n();
const store = useMaintenanceStore();

onMounted(() => {
  store.fetchAll();
});

const testSeverity = (status) => ({
  PASSED: 'success',
  FAILED: 'danger',
  LOW_PRESSURE: 'warn',
  REQUIRES_REVIEW: 'warn'
}[status] ?? 'secondary');

const incidentSeverity = (status) => ({
  REPORTED: 'warn',
  IN_REVIEW: 'info',
  RESOLVED: 'success',
  CLOSED: 'secondary'
}[status] ?? 'secondary');

const lifecycleSeverity = (status) => ({
  WITHIN_LIMIT: 'success',
  NEAR_LIMIT: 'warn',
  EXCEEDED: 'danger',
  REPLACE_SUGGESTED: 'danger'
}[status] ?? 'secondary');

const orderSeverity = (status) => ({
  IN_PROGRESS: 'info',
  SCHEDULED: 'warn',
  COMPLETED: 'success',
  CLOSED: 'secondary'
}[status] ?? 'secondary');

const translateTestResult = (status) => {
  const key = `maintenance.status.${status}`;
  return t(key);
};

const translateLifecycle = (status) => {
  const key = `maintenance.status.${status}`;
  return t(key);
};

const translateIncidentStatus = (status) => {
  const key = `maintenance.status.${status}`;
  return t(key);
};

const translateOrderStatus = (status) => {
  const key = `maintenance.status.${status}`;
  return t(key);
};
</script>

<template>
  <section class="maintenance-dashboard">

    <!-- HEADER -->
    <div class="dashboard-header">
      <div>
        <span class="eyebrow">KINEMO 4D</span>

        <h1>{{ t('maintenance.title') }}</h1>

        <p>
          {{ t('maintenance.subtitle') }}
        </p>
      </div>

      <Button
          :label="t('maintenance.refresh')"
          icon="pi pi-refresh"
          outlined
          @click="store.fetchAll"
      />
    </div>

    <!-- SUMMARY -->
    <div class="summary-grid">

      <Card class="summary-card">
        <template #content>
          <div class="summary-content">
            <div class="summary-icon warning">
              <i class="pi pi-exclamation-triangle"></i>
            </div>

            <div>
                            <span class="summary-label">
                                {{ t('maintenance.failed-tests') }}
                            </span>

              <strong class="summary-value">
                {{ store.failedTestsCount }}
              </strong>
            </div>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #content>
          <div class="summary-content">
            <div class="summary-icon danger">
              <i class="pi pi-bell"></i>
            </div>

            <div>
                            <span class="summary-label">
                                {{ t('maintenance.open-incidents') }}
                            </span>

              <strong class="summary-value">
                {{ store.openIncidentsCount }}
              </strong>
            </div>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #content>
          <div class="summary-content">
            <div class="summary-icon info">
              <i class="pi pi-wrench"></i>
            </div>

            <div>
                            <span class="summary-label">
                                {{ t('maintenance.pending-maintenance') }}
                            </span>

              <strong class="summary-value">
                {{ store.pendingOrdersCount }}
              </strong>
            </div>
          </div>
        </template>
      </Card>

      <Card class="summary-card">
        <template #content>
          <div class="summary-content">
            <div class="summary-icon success">
              <i class="pi pi-cog"></i>
            </div>

            <div>
                            <span class="summary-label">
                                {{ t('maintenance.components') }}
                            </span>

              <strong class="summary-value">
                {{ store.hardwareComponents.length }}
              </strong>
            </div>
          </div>
        </template>
      </Card>

    </div>

    <!-- CHANNEL TESTS -->
    <section class="data-section">

      <div class="section-header">
        <div>
                    <span class="section-kicker">
                        {{ t('maintenance.monitoring') }}
                    </span>

          <h2>
            {{ t('maintenance.channel-tests') }}
          </h2>
        </div>

        <span class="record-count">
                    {{ store.channelTests.length }}
                </span>
      </div>

      <Card>
        <template #content>
          <DataTable
              :value="store.channelTests"
              stripedRows
              responsiveLayout="scroll"
              class="maintenance-table"
          >
            <Column
                field="id"
                :header="t('maintenance.fields.id')"
            />

            <Column
                field="channelType"
                :header="t('maintenance.fields.channel')"
            />

            <Column :header="t('maintenance.fields.result')">
              <template #body="{ data }">
                <Tag
                    :value="translateTestResult(data.getTestResultAsString())"
                    :severity="testSeverity(data.getTestResultAsString())"
                />
              </template>
            </Column>

            <Column :header="t('maintenance.fields.review')">
              <template #body="{ data }">
                <Tag
                    :value="
                                        data.isMarkedForReview()
                                            ? t('maintenance.values.yes')
                                            : t('maintenance.values.no')
                                    "
                    :severity="
                                        data.isMarkedForReview()
                                            ? 'warn'
                                            : 'secondary'
                                    "
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

    </section>

    <!-- HARDWARE COMPONENTS -->
    <section class="data-section">

      <div class="section-header">
        <div>
                    <span class="section-kicker">
                        {{ t('maintenance.monitoring') }}
                    </span>

          <h2>
            {{ t('maintenance.hardware-components') }}
          </h2>
        </div>

        <span class="record-count">
                    {{ store.hardwareComponents.length }}
                </span>
      </div>

      <Card>
        <template #content>
          <DataTable
              :value="store.hardwareComponents"
              stripedRows
              responsiveLayout="scroll"
              class="maintenance-table"
          >
            <Column
                field="id"
                :header="t('maintenance.fields.id')"
            />

            <Column :header="t('maintenance.fields.code')">
              <template #body="{ data }">
                {{ data.getComponentCode() }}
              </template>
            </Column>

            <Column :header="t('maintenance.fields.type')">
              <template #body="{ data }">
                {{ data.getComponentType() }}
              </template>
            </Column>

            <Column :header="t('maintenance.fields.lifecycle')">
              <template #body="{ data }">
                <Tag
                    :value="translateLifecycle(data.getLifecycleStatusAsString())"
                    :severity="lifecycleSeverity(data.getLifecycleStatusAsString())"
                />
              </template>
            </Column>

            <Column :header="t('maintenance.fields.usage')">
              <template #body="{ data }">
                <div class="usage-cell">
                                    <span>
                                        {{ data.getCurrentUsageCycles() }}
                                        /
                                        {{ data.getMaxLifecycleCycles() }}
                                    </span>

                  <div class="usage-bar">
                    <div
                        class="usage-progress"
                        :style="{
                                                width: `${Math.min(data.getLifecyclePercentage(), 100)}%`
                                            }"
                    ></div>
                  </div>
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

    </section>

    <!-- INCIDENTS -->
    <section class="data-section">

      <div class="section-header">
        <div>
                    <span class="section-kicker">
                        {{ t('maintenance.monitoring') }}
                    </span>

          <h2>
            {{ t('maintenance.incidents') }}
          </h2>
        </div>

        <span class="record-count">
                    {{ store.incidents.length }}
                </span>
      </div>

      <Card>
        <template #content>
          <DataTable
              :value="store.incidents"
              stripedRows
              responsiveLayout="scroll"
              class="maintenance-table"
          >
            <Column
                field="id"
                :header="t('maintenance.fields.id')"
            />

            <Column :header="t('maintenance.fields.severity')">
              <template #body="{ data }">
                {{ data.getSeverityLevel() }}
              </template>
            </Column>

            <Column :header="t('maintenance.fields.priority')">
              <template #body="{ data }">
                {{ data.getPriorityLevel() }}
              </template>
            </Column>

            <Column :header="t('maintenance.fields.status')">
              <template #body="{ data }">
                <Tag
                    :value="translateIncidentStatus(data.getIncidentStatusAsString())"
                    :severity="incidentSeverity(data.getIncidentStatusAsString())"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

    </section>

    <!-- MAINTENANCE ORDERS -->
    <section class="data-section">

      <div class="section-header">
        <div>
                    <span class="section-kicker">
                        {{ t('maintenance.operations') }}
                    </span>

          <h2>
            {{ t('maintenance.maintenance-orders') }}
          </h2>
        </div>

        <span class="record-count">
                    {{ store.maintenanceOrders.length }}
                </span>
      </div>

      <Card>
        <template #content>
          <DataTable
              :value="store.maintenanceOrders"
              stripedRows
              responsiveLayout="scroll"
              class="maintenance-table"
          >
            <Column
                field="id"
                :header="t('maintenance.fields.id')"
            />

            <Column :header="t('maintenance.fields.type')">
              <template #body="{ data }">
                {{ data.getOrderType() }}
              </template>
            </Column>

            <Column :header="t('maintenance.fields.status')">
              <template #body="{ data }">
                <Tag
                    :value="translateOrderStatus(data.getExecutionStatus())"
                    :severity="orderSeverity(data.getExecutionStatus())"
                />
              </template>
            </Column>

            <Column :header="t('maintenance.fields.description')">
              <template #body="{ data }">
                {{ data.getTechnicalDescription() }}
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

    </section>

  </section>
</template>

<style scoped>
.maintenance-dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* HEADER */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
}

.eyebrow {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  opacity: 0.55;
}

.dashboard-header h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.dashboard-header p {
  margin: 0;
  max-width: 720px;
  line-height: 1.6;
  opacity: 0.65;
}

/* SUMMARY */

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 2.75rem;
}

.summary-card {
  min-height: 125px;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.06);
}

.summary-icon.warning {
  color: #f59e0b;
}

.summary-icon.danger {
  color: #ef4444;
}

.summary-icon.info {
  color: #38bdf8;
}

.summary-icon.success {
  color: #4ade80;
}

.summary-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.65;
}

.summary-value {
  display: block;
  font-size: 2rem;
  line-height: 1;
}

/* SECTIONS */

.data-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.8rem;
}

.section-kicker {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.45;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.record-count {
  min-width: 30px;
  height: 30px;
  padding: 0 0.6rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.07);
  opacity: 0.8;
}

/* TABLE */

.maintenance-table {
  width: 100%;
}

/* USAGE */

.usage-cell {
  min-width: 160px;
}

.usage-bar {
  width: 100%;
  height: 5px;
  margin-top: 0.45rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.usage-progress {
  height: 100%;
  border-radius: 999px;
  background: #2dd4bf;
  transition: width 0.3s ease;
}

/* RESPONSIVE */

@media (max-width: 1000px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .maintenance-dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: center;
  }
}
</style>