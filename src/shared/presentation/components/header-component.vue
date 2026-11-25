<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './language-switcher.vue'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const userMenu = ref(null)
const operationsOpen = ref(false)
const mobileOpen = ref(false)

const navigation = [
  {
    path: '/dashboard',
    label: 'header.nav.dashboard',
    icon: 'pi pi-th-large'
  },
  {
    path: '/catalog',
    label: 'modules.catalog.title',
    icon: 'pi pi-video'
  },
  {
    path: '/scheduling',
    label: 'modules.scheduling.title',
    icon: 'pi pi-calendar'
  }
]

const operations = [
  {
    path: '/room-readiness',
    label: 'modules.room-readiness.title',
    icon: 'pi pi-check-circle'
  },
  {
    path: '/ticketing',
    label: 'modules.ticketing.title',
    icon: 'pi pi-ticket'
  },
  {
    path: '/seat-allocation',
    label: 'modules.seat-control.title',
    icon: 'pi pi-table'
  },
  {
    path: '/execution',
    label: 'modules.execution.title',
    icon: 'pi pi-play-circle'
  },
  {
    path: '/maintenance',
    label: 'modules.maintenance.title',
    icon: 'pi pi-wrench'
  }
]

const isActive = (path) => {
  return route.path === path ||
      route.path.startsWith(`${path}/`)
}

const operationsActive = computed(() =>
    operations.some(item => isActive(item.path))
)

const userItems = computed(() => [
  {
    label: t('header.user.subscription'),
    icon: 'pi pi-credit-card',
    command: () => router.push('/subscriptions/manage')
  },
  {
    separator: true
  },
  {
    label: t('header.user.logout'),
    icon: 'pi pi-sign-out',
    command: logout
  }
])

function logout() {
  localStorage.removeItem('kinemo-authenticated')
  router.push('/')
}

function toggleUserMenu(event) {
  operationsOpen.value = false
  userMenu.value?.toggle(event)
}

watch(
    () => route.fullPath,
    () => {
      operationsOpen.value = false
      mobileOpen.value = false
    }
)
</script>

<template>
  <header
      class="kinemo-header"
      @keydown.esc="operationsOpen = false; mobileOpen = false"
  >
    <div class="header-container">

      <router-link to="/dashboard" class="brand">
        <div class="brand-symbol">
          <i class="pi pi-play"></i>
        </div>

        <div class="brand-text">
                    <span class="brand-name">
                        Kinemo<span>.</span>
                    </span>
          <span class="brand-subtitle">
                        CINEMA PLATFORM
                    </span>
        </div>
      </router-link>

      <nav
          class="primary-nav"
          :class="{ 'mobile-open': mobileOpen }"
          :aria-label="locale === 'es' ? 'Navegación principal' : 'Primary navigation'"
      >
        <router-link
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: isActive(item.path) }"
        >
          <i :class="item.icon"></i>
          <span>{{ t(item.label) }}</span>
        </router-link>

        <div class="operations-wrapper">
          <button
              type="button"
              class="nav-link operations-trigger"
              :class="{ active: operationsActive }"
              :aria-expanded="operationsOpen"
              aria-controls="operations-dropdown"
              @click="operationsOpen = !operationsOpen"
          >
            <i class="pi pi-cog"></i>
            <span>
                            {{ t('header.nav.operations') }}
                        </span>
            <i
                class="pi pi-angle-down dropdown-arrow"
                :class="{ rotated: operationsOpen }"
            ></i>
          </button>

          <div
              v-if="operationsOpen"
              id="operations-dropdown"
              class="operations-dropdown"
          >
            <div class="dropdown-heading">
              {{ t('header.nav.operations') }}
            </div>

            <router-link
                v-for="item in operations"
                :key="item.path"
                :to="item.path"
                class="dropdown-link"
                :class="{ active: isActive(item.path) }"
                @click="operationsOpen = false"
            >
              <i :class="item.icon"></i>
              <span>{{ t(item.label) }}</span>
            </router-link>
          </div>
        </div>

        <router-link
            to="/analytics"
            class="nav-link"
            :class="{ active: isActive('/analytics') }"
        >
          <i class="pi pi-chart-bar"></i>
          <span>
                        {{ t('header.nav.analytics') }}
                    </span>
        </router-link>

        <router-link
            to="/subscriptions/manage"
            class="nav-link"
            :class="{ active: isActive('/subscriptions') }"
        >
          <i class="pi pi-credit-card"></i>
          <span>
                        {{ t('header.user.subscription') }}
                    </span>
        </router-link>
      </nav>

      <div class="header-actions">
        <language-switcher />

        <div class="header-divider"></div>

        <button
            type="button"
            class="user-trigger"
            aria-label="User menu"
            aria-haspopup="true"
            aria-controls="kinemo-user-menu"
            @click="toggleUserMenu"
        >
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>

          <i class="pi pi-angle-down user-arrow"></i>
        </button>

        <pv-menu
            id="kinemo-user-menu"
            ref="userMenu"
            :model="userItems"
            :popup="true"
        >
          <template #start>
            <div class="user-menu-header">
              <strong>Kinemo User</strong>
              <span>Cinema Management</span>
            </div>
          </template>
        </pv-menu>

        <button
            type="button"
            class="mobile-toggle"
            aria-label="Navigation menu"
            :aria-expanded="mobileOpen"
            @click="mobileOpen = !mobileOpen"
        >
          <i
              :class="mobileOpen
                            ? 'pi pi-times'
                            : 'pi pi-bars'"
          ></i>
        </button>
      </div>

    </div>
  </header>

  <div
      v-if="operationsOpen"
      class="dropdown-overlay"
      @click="operationsOpen = false"
  ></div>
</template>

<style scoped>
.kinemo-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: rgba(22, 23, 30, 0.97);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
}

.header-container {
  max-width: 1600px;
  min-height: 76px;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-symbol {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.22);
}

.brand-symbol i {
  font-size: 16px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -1.2px;
  line-height: 1.1;
  color: var(--text);
}

.brand-name span {
  color: var(--secondary);
}

.brand-subtitle {
  margin-top: 4px;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1.6px;
  color: var(--text-muted);
}

.primary-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 12px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
}

.nav-link i {
  font-size: 13px;
}

.nav-link:hover {
  color: var(--text);
  background: var(--bg-card-alt);
}

.nav-link.active {
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.2);
  color: var(--primary-light);
}

.operations-wrapper {
  position: relative;
}

.dropdown-arrow {
  font-size: 11px !important;
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.operations-dropdown {
  position: absolute;
  top: calc(100% + 15px);
  left: 0;
  min-width: 245px;
  padding: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 13px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  z-index: 1002;
}

.dropdown-heading {
  padding: 10px 12px;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  color: var(--text-soft);
  font-size: 13px;
  text-decoration: none;
}

.dropdown-link i {
  width: 18px;
  color: var(--primary-light);
}

.dropdown-link:hover,
.dropdown-link.active {
  background: var(--bg-active);
  color: var(--primary-light);
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: transparent;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.header-divider {
  width: 1px;
  height: 28px;
  background: var(--border);
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
}

.user-avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--bg-active);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: var(--primary-light);
}

.user-trigger:hover .user-avatar {
  background: rgba(139, 92, 246, 0.25);
}

.user-arrow {
  font-size: 12px;
}

.user-menu-header {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.user-menu-header strong {
  color: var(--text);
  font-size: 14px;
}

.user-menu-header span {
  color: var(--text-muted);
  font-size: 11px;
}

.mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: var(--bg-card-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
}

@media (max-width: 1350px) {
  .header-container {
    padding: 0 20px;
    gap: 16px;
  }

  .nav-link {
    padding: 10px;
    font-size: 12px;
  }

  .nav-link > i:first-child {
    display: none;
  }
}

@media (max-width: 1100px) {
  .header-container {
    min-height: 68px;
  }

  .mobile-toggle {
    display: flex;
  }

  .primary-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 16px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    flex-direction: column;
    align-items: stretch;
    max-height: calc(100dvh - 68px);
    overflow-y: auto;
  }

  .primary-nav.mobile-open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 14px;
    font-size: 14px;
  }

  .nav-link > i:first-child {
    display: inline-block;
  }

  .operations-dropdown {
    position: static;
    margin-top: 5px;
    min-width: 0;
    box-shadow: none;
    background: var(--bg);
  }

  .dropdown-arrow {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 12px;
    gap: 10px;
  }

  .brand-symbol {
    width: 34px;
    height: 34px;
  }

  .brand-name {
    font-size: 21px;
  }

  .brand-subtitle {
    display: none;
  }

  .header-actions {
    gap: 8px;
  }

  .header-divider,
  .user-arrow {
    display: none;
  }
}
</style>