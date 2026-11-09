<script setup lang="js">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import LanguageSwitcher
  from "./language-switcher.vue";


const { t } = useI18n();
const router = useRouter();

const userMenu = ref(null);


const goToDashboard = () => {
  router.push("/dashboard");
};


const goToExecution = () => {
  router.push("/execution");
};


const goToMaintenance = () => {
  router.push("/maintenance");
};


const goToSubscription = () => {
  router.push("/subscriptions");
};


const toggleUserMenu = (event) => {
  userMenu.value?.toggle(event);
};


const logout = () => {
  localStorage.removeItem(
      "kinemo-authenticated"
  );

  router.push("/");
};
</script>


<template>

  <header class="kinemo-header">

    <div class="header-container">

      <!-- BRAND -->

      <button
          type="button"
          class="brand"
          @click="goToDashboard"
      >

        <span class="brand-name">
          Kinemo
        </span>

        <span class="brand-dot">
          •
        </span>

      </button>


      <!-- NAVIGATION -->

      <nav
          class="primary-nav"
          aria-label="Primary navigation"
      >

        <button
            type="button"
            class="nav-link"
            @click="goToDashboard"
        >
          {{ t("header.nav.dashboard") }}
        </button>


        <button
            type="button"
            class="nav-link"
            @click="goToExecution"
        >
          {{ t("header.nav.operations") }}
        </button>


        <button
            type="button"
            class="nav-link"
            @click="goToMaintenance"
        >
          {{ t("header.nav.maintenance") }}
        </button>


        <button
            type="button"
            class="nav-link nav-link-disabled"
            disabled
            title="Analytics is under development"
        >
          {{ t("header.nav.analytics") }}

          <span class="soon-badge">
            SOON
          </span>
        </button>

      </nav>


      <!-- RIGHT -->

      <div class="header-actions">

        <language-switcher />


        <pv-button
            class="user-trigger"
            text
            rounded
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


        <pv-menu
            id="user-menu"
            ref="userMenu"
            :model="[]"
            :popup="true"
        >

          <template #start>

            <div class="user-menu-header">

              <span class="user-menu-name">
                Kinemo User
              </span>

              <span class="user-menu-role">
                Cinema Management
              </span>

            </div>

          </template>


          <template #end>

            <div class="user-menu-footer">

              <button
                  type="button"
                  class="user-menu-item"
                  @click="goToSubscription"
              >

                <i class="pi pi-credit-card"></i>

                {{ t("header.user.subscription") }}

              </button>


              <button
                  type="button"
                  class="user-menu-item logout-item"
                  @click="logout"
              >

                <i class="pi pi-sign-out"></i>

                {{ t("header.user.logout") }}

              </button>

            </div>

          </template>

        </pv-menu>

      </div>

    </div>

  </header>

</template>


<style scoped>
.kinemo-header {
  position: sticky;

  top: 0;

  width: 100%;

  z-index: 1000;

  background:
      rgba(14, 15, 23, 0.96);

  border-bottom:
      1px solid var(--border);

  backdrop-filter: blur(16px);
}


.header-container {
  width: 100%;
  max-width: 1280px;

  min-height: 68px;

  margin: 0 auto;

  padding: 0 1.5rem;

  display: flex;
  align-items: center;

  gap: 2rem;
}


/* BRAND */

.brand {
  padding: 0;

  display: flex;
  align-items: center;

  gap: 0.25rem;

  flex-shrink: 0;

  background: transparent;
  border: none;

  cursor: pointer;
}


.brand-name {
  color: var(--secondary);

  font-size: 1.3rem;
  font-weight: 800;

  letter-spacing: -0.03em;
}


.brand-dot {
  color: var(--primary);

  font-size: 1.25rem;
  font-weight: 900;
}


/* NAV */

.primary-nav {
  display: flex;
  align-items: center;

  gap: 0.3rem;

  flex: 1;
}


.nav-link {
  min-height: 40px;

  padding: 0 0.8rem;

  display: inline-flex;
  align-items: center;

  gap: 0.4rem;

  color: var(--text-soft);

  background: transparent;

  border: none;
  border-radius: var(--radius-sm);

  font-size: 0.88rem;
  font-weight: 600;

  cursor: pointer;

  transition:
      color 0.15s ease,
      background 0.15s ease;
}


.nav-link:hover:not(:disabled) {
  color: var(--text);

  background:
      rgba(139, 92, 246, 0.08);
}


.nav-link-disabled {
  color: var(--text-muted);

  cursor: not-allowed;

  opacity: 0.55;
}


.soon-badge {
  padding: 0.15rem 0.35rem;

  color: var(--secondary);

  background:
      rgba(52, 214, 176, 0.08);

  border:
      1px solid rgba(52, 214, 176, 0.16);

  border-radius: 5px;

  font-size: 0.5rem;
  font-weight: 800;

  letter-spacing: 0.05em;
}


/* ACTIONS */

.header-actions {
  margin-left: auto;

  display: flex;
  align-items: center;

  gap: 0.6rem;
}


.user-trigger {
  flex-shrink: 0;
}


/* USER MENU */

.user-menu-header {
  min-width: 220px;

  padding: 0.9rem 1rem;

  display: flex;
  flex-direction: column;

  gap: 0.25rem;

  border-bottom:
      1px solid var(--border);
}


.user-menu-name {
  color: var(--text);

  font-size: 0.9rem;
  font-weight: 700;
}


.user-menu-role {
  color: var(--text-muted);

  font-size: 0.72rem;
}


.user-menu-footer {
  padding: 0.4rem;
}


.user-menu-item {
  width: 100%;

  padding: 0.7rem 0.75rem;

  display: flex;
  align-items: center;

  gap: 0.7rem;

  color: var(--text-soft);

  background: transparent;

  border: none;
  border-radius: var(--radius-sm);

  font-size: 0.82rem;
  font-weight: 500;

  text-align: left;

  cursor: pointer;

  transition:
      background 0.15s ease,
      color 0.15s ease;
}


.user-menu-item:hover {
  color: var(--text);

  background:
      rgba(139, 92, 246, 0.08);
}


.logout-item:hover {
  color: #fca5a5;

  background:
      rgba(239, 68, 68, 0.08);
}


/* RESPONSIVE */

@media screen and (max-width: 900px) {

  .primary-nav {
    display: none;
  }


  .header-container {
    gap: 1rem;
  }

}


@media screen and (max-width: 500px) {

  .header-container {
    padding: 0 1rem;
  }


  .brand-name {
    font-size: 1.15rem;
  }

}
</style>