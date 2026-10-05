<script setup lang="js">
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted} from "vue";

/**
 * Profile view.
 *
 * @remarks
 * Role-specific landing page. Reads the role from the URL and shows a
 * sidebar with the bounded contexts assigned to that role. This view
 * is deliberately minimal — a full profile with real user data will
 * replace it in a later stage.
 */
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const validRoles = ['manager', 'technician'];

/**
 * Module list per role. Plain data, inlined here because it is only
 * consumed by this view. Extract to a shared file when a second
 * consumer appears.
 */
const ROLE_MODULES = {
  manager: [
    { key: 'catalog',      icon: 'pi pi-video',       path: '/catalog' },
    { key: 'scheduling',   icon: 'pi pi-calendar',    path: '/scheduling' },
    { key: 'ticketing',    icon: 'pi pi-ticket',      path: '/ticketing' },
    { key: 'analytics',    icon: 'pi pi-chart-bar',   path: '/analytics' },
    { key: 'subscription', icon: 'pi pi-credit-card', path: '/subscriptions' },
  ],
  technician: [
    { key: 'room-readiness', icon: 'pi pi-home',        path: '/room-readiness' },
    { key: 'seat-control',   icon: 'pi pi-th-large',    path: '/seat-control' },
    { key: 'execution',      icon: 'pi pi-play-circle', path: '/execution' },
    { key: 'maintenance',    icon: 'pi pi-wrench',      path: '/maintenance' },
  ],
};

const role = computed(() => route.params.role);
const modules = computed(() => ROLE_MODULES[role.value] ?? []);

onMounted(() => {
  if (!validRoles.includes(role.value)) {
    router.replace({ name: 'home' });
  }
});
</script>

<template>
  <section v-if="validRoles.includes(role)" class="profile">
    <!-- Sidebar -->
    <aside class="profile-sidebar">
      <div class="sidebar-role">
        <span class="role-label">{{ t('sidebar.role-label') }}</span>
        <span class="role-name">{{ t(`roles.${role}.title`) }}</span>
      </div>

      <nav class="sidebar-nav">
        <router-link
            v-for="mod in modules"
            :key="mod.key"
            :to="mod.path"
            class="sidebar-link"
            active-class="sidebar-link--active">
          <i :class="mod.icon"/>
          <span>{{ t(`modules.${mod.key}.title`) }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Info panel -->
    <div class="profile-main">
      <header class="profile-header">
        <p class="profile-eyebrow">{{ t('profile.eyebrow') }}</p>
        <h1>{{ t(`roles.${role}.title`) }}</h1>
        <p class="profile-subtitle">{{ t(`roles.${role}.description`) }}</p>
      </header>

      <div class="profile-placeholder">
        <i class="pi pi-user"/>
        <p>{{ t('profile.placeholder') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.profile-sidebar {
  width: 15rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-right: 1.5rem;
  border-right: 1px solid rgba(127, 127, 127, 0.2);
}

.sidebar-role {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(127, 127, 127, 0.15);
}

.role-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
}

.role-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #8B5CF6;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.sidebar-link:hover {
  opacity: 1;
  background: rgba(139, 92, 246, 0.1);
}

.sidebar-link--active {
  opacity: 1;
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.15);
  font-weight: 600;
}

.profile-main {
  flex: 1;
  min-width: 0;
}

.profile-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 600;
  color: #8B5CF6;
  margin: 0;
}

.profile-header h1 {
  font-size: 1.75rem;
  margin: 0.5rem 0;
}

.profile-subtitle {
  opacity: 0.75;
  line-height: 1.6;
  margin: 0;
  max-width: 42rem;
}

.profile-placeholder {
  margin-top: 2.5rem;
  padding: 2.5rem;
  border: 1px dashed rgba(127, 127, 127, 0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.6;
}

.profile-placeholder i {
  font-size: 2rem;
}

@media screen and (max-width: 900px) {
  .profile {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(127, 127, 127, 0.2);
    padding-right: 0;
    padding-bottom: 1.5rem;
  }
}
</style>