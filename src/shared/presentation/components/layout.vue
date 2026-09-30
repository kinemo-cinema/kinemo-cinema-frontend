<script lang="js" setup>
import HeaderComponent from "./header-component.vue";
import FooterComponent from "./footer-component.vue";

</script>

<template>
  <div class="layout-container">
    <header-component/>

    <main class="content-area">
      <slot/>
    </main>

    <footer-component/>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-area {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

@media screen and (min-width: 768px) {
  .content-area {
    padding: 2rem;
  }
}
</style>