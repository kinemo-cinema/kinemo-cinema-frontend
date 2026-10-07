<script setup lang="js">
import HeaderComponent from './header-component.vue'
import FooterComponent from './footer-component.vue'
</script>

<template>
  <div class="layout-container">

    <HeaderComponent />

    <main class="content-area">
      <slot />
    </main>

    <FooterComponent />

  </div>
</template>

<style scoped>
.layout-container {
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  background: #0e0f17;
}

.content-area {
  width: 100%;
  max-width: 1200px;

  flex: 1;

  margin: 0 auto;
  padding: 2rem;
}

@media screen and (max-width: 768px) {
  .content-area {
    padding: 1rem;
  }
}
</style>