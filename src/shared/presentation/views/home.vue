<script setup lang="js">
import { useI18n } from 'vue-i18n';

/**
 * Role selection view.
 *
 * @remarks
 * Presents the two personas of the Kinemo platform as plain links to
 * the profile route. Role state lives entirely in the URL, so no store
 * or session logic is involved at this stage.
 */
const { t } = useI18n();

const roles = [
  { key: 'manager',    icon: 'pi pi-briefcase' },
  { key: 'technician', icon: 'pi pi-wrench' },
];
</script>

<template>
  <section class="role-selection">
    <header class="selection-header">
      <h1>{{ t('home.title') }}</h1>
      <p class="selection-subtitle">{{ t('home.subtitle') }}</p>
    </header>

    <div class="role-grid">
      <router-link
          v-for="role in roles"
          :key="role.key"
          :to="{ name: 'profile', params: { role: role.key } }"
          class="role-card">
        <i :class="role.icon" class="role-icon"/>
        <h2 class="role-title">{{ t(`roles.${role.key}.title`) }}</h2>
        <p class="role-description">{{ t(`roles.${role.key}.description`) }}</p>
        <span class="role-cta">
          {{ t('home.continue') }}
          <i class="pi pi-arrow-right"/>
        </span>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.role-selection {
  padding: 3rem 0;
  max-width: 60rem;
  margin: 0 auto;
}

.selection-header {
  text-align: center;
  margin-bottom: 3rem;
}

.selection-header h1 {
  font-size: 2rem;
  margin: 0;
}

.selection-subtitle {
  margin-top: 0.75rem;
  opacity: 0.75;
}

.role-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(127, 127, 127, 0.2);
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.role-card:hover {
  transform: translateY(-3px);
  border-color: #8B5CF6;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
}

.role-icon {
  font-size: 2.25rem;
  color: #8B5CF6;
}

.role-title {
  font-size: 1.35rem;
  margin: 0;
}

.role-description {
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.75;
  margin: 0;
  flex: 1;
}

.role-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #8B5CF6;
}

@media screen and (min-width: 700px) {
  .role-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>