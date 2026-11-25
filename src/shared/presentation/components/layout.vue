<script setup>
import HeaderComponent from './header-component.vue'
import FooterComponent from './footer-component.vue'
</script>

<template>
  <div class="layout-container">

    <HeaderComponent />

    <main id="main-content" class="content-area">
      <router-view />
    </main>

    <FooterComponent />

  </div>
</template>

<style scoped>
.layout-container {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
}

.content-area {
  width: 100%;
  max-width: 1600px;
  min-width: 0;
  flex: 1;
  margin: 0 auto;
  padding: 24px 28px 32px;
}

@media (min-width: 1800px) {
  .content-area {
    padding: 32px;
  }
}

@media (max-width: 1100px) {
  .content-area {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 12px;
  }
}
</style>