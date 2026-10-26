<script setup lang="js">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './language-switcher.vue';

/**
 * Presentation component for the Kinemo application header.
 *
 * @remarks
 * Provides top-level navigation between the operational areas of the
 * application and hosts the language switcher and user menu.
 */

const { t } = useI18n();
const router = useRouter();

const userMenu = ref(null);

/**
 * Toggles the user menu popup.
 *
 * @param {Event} event - The click event from the avatar.
 * @returns {void}
 */
const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

/**
 * Logs the user out and returns to the sign-in page.
 *
 * @returns {void}
 */
const logout = () => {
  localStorage.removeItem('kinemo-authenticated');
  router.push('/');
};
</script>

<template>
  <header class="kinemo-header">

    <pv-menubar>

      <template #start>

        <!-- Brand -->
        <router-link
            to="/dashboard"
            class="brand"
        >
          <span class="brand-name">
            Kinemo
          </span>

          <span
              class="brand-dot"
              aria-hidden="true"
          />
        </router-link>

        <!-- Navigation -->
        <nav
            class="primary-nav"
            aria-label="Primary navigation"
        >

          <router-link
              to="/dashboard"
              class="nav-link"
          >
            {{ t('header.nav.dashboard') }}
          </router-link>

          <router-link
              to="/operations"
              class="nav-link"
          >
            {{ t('header.nav.operations') }}
          </router-link>

          <router-link
              to="/maintenance"
              class="nav-link"
          >
            {{ t('header.nav.maintenance') }}
          </router-link>

          <router-link
              to="/analytics"
              class="nav-link"
          >
            {{ t('header.nav.analytics') }}
          </router-link>

        </nav>

      </template>

      <template #end>

        <div class="header-actions">

          <!-- Language -->
          <language-switcher/>

          <!-- User -->
          <pv-button
              class="user-trigger"
              text
              aria-haspopup="true"
              aria-controls="user-menu"
              @click="toggleUserMenu"
          >
            <pv-avatar
                icon="pi pi-user"
                shape="circle"
                size="normal"
            />
          </pv-button>

          <!-- User menu -->
          <pv-menu
              id="user-menu"
              ref="userMenu"
              :model="[]"
              :popup="true"
          >

            <template #start>

              <div class="user-menu-header">

                <span class="user-menu-name">
                  {{ t('header.user.placeholder-name') }}
                </span>

                <span class="user-menu-role">
                  {{ t('header.user.placeholder-role') }}
                </span>

              </div>

            </template>

            <template #end>

              <div class="user-menu-footer">

                <!-- Subscription -->
                <router-link
                    to="/subscriptions"
                    class="user-menu-item"
                >
                  <i class="pi pi-credit-card"/>

                  {{ t('header.user.subscription') }}
                </router-link>

                <!-- Logout -->
                <button
                    class="user-menu-item"
                    type="button"
                    @click="logout"
                >
                  <i class="pi pi-sign-out"/>

                  {{ t('header.user.logout') }}
                </button>

              </div>

            </template>

          </pv-menu>

        </div>

      </template>

    </pv-menubar>

  </header>
</template>

<style scoped>
.kinemo-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.35rem;

  text-decoration: none;

  font-weight: 700;
  font-size: 1.25rem;

  margin-right: 2rem;
}

.brand-name {
  color: var(--p-primary-color);
}

.brand-dot {
  width: 0.4rem;
  height: 0.4rem;

  border-radius: 50%;

  background: #8B5CF6;
}

.primary-nav {
  display: none;
  align-items: center;
  gap: 1.25rem;
}

.nav-link {
  text-decoration: none;

  font-weight: 500;

  opacity: 0.85;

  transition: opacity 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  opacity: 1;

  color: var(--p-primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-trigger {
  padding: 0.25rem;
}

.user-menu-header {
  display: flex;
  flex-direction: column;

  padding: 0.75rem 1rem;

  border-bottom: 1px solid var(--p-content-border-color);
}

.user-menu-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.user-menu-role {
  font-size: 0.75rem;

  opacity: 0.7;
}

.user-menu-footer {
  display: flex;
  flex-direction: column;

  padding: 0.5rem 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  padding: 0.6rem 1rem;

  text-decoration: none;

  color: inherit;

  font-size: 0.875rem;

  background: none;
  border: none;

  cursor: pointer;

  text-align: left;

  width: 100%;
}

.user-menu-item:hover {
  background: var(--p-content-hover-background);
}

@media screen and (min-width: 900px) {
  .primary-nav {
    display: flex;
  }
}
</style>