<script setup lang="js">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const unavailableRoute = router.currentRoute.value.fullPath;
</script>

<template>
  <section class="not-found">
    <div class="not-found-content">
      <span class="not-found-code">404</span>

      <h1 class="not-found-title">{{ t('page-not-found.title') }}</h1>

      <p class="not-found-content-text">
        {{ t('page-not-found.content', { 'unavailable-route': unavailableRoute }) }}
      </p>

      <div class="not-found-actions">
        <router-link to="/" class="not-found-link">
          <pv-button :label="t('page-not-found.go-home')" class="cta-home"/>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 2rem 1rem;
}

.not-found-content {
  text-align: center;
  max-width: 32rem;
}

.not-found-code {
  display: inline-block;
  font-size: 4rem;
  font-weight: 800;
  color: #8B5CF6;
  line-height: 1;
}

.not-found-title {
  font-size: 1.75rem;
  margin: 0.5rem 0 0;
}

.not-found-content-text {
  margin-top: 1rem;
  opacity: 0.75;
  line-height: 1.6;
}

.not-found-actions {
  margin-top: 2rem;
}

.cta-home {
  background: #8B5CF6;
  border-color: #8B5CF6;
}

.not-found-link {
  text-decoration: none;
}
</style>