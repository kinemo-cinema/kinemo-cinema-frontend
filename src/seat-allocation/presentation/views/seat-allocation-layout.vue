<script setup>
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const links = [
  {
    name: 'seat-allocation-list',
    i18nKey: 'seatAllocationNav.allocations',
    icon: 'pi pi-th-large'
  }
];
</script>

<template>
  <section class="seat-allocation-layout">
    <nav
        class="seat-allocation-nav"
        aria-label="Seat allocation sections">

      <router-link
          v-for="link in links"
          :key="link.name"
          :to="{name: link.name}"
          class="seat-allocation-nav-link"
          active-class="seat-allocation-nav-link--active">

        <i :class="link.icon"/>

        <span>
          {{ t(link.i18nKey) }}
        </span>

      </router-link>

    </nav>

    <div class="seat-allocation-content">
      <router-view/>
    </div>
  </section>
</template>

<style scoped>
.seat-allocation-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.seat-allocation-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-bottom: 1px solid rgba(127, 127, 127, 0.2);
  padding-bottom: 0.5rem;
}

.seat-allocation-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  font-size: 0.9rem;
  opacity: 0.75;
  transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
}

.seat-allocation-nav-link:hover {
  opacity: 1;
  background: rgba(139, 92, 246, 0.1);
}

.seat-allocation-nav-link--active {
  opacity: 1;
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.15);
}

.seat-allocation-content {
  min-height: 20rem;
}
</style>