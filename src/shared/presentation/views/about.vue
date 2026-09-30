<script setup lang="js">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section class="about">
    <header class="about-header">
      <h1>{{ t('about.title') }}</h1>
      <p class="about-tagline">{{ t('about.tagline') }}</p>
    </header>

    <div class="about-body">
      <p>{{ t('about.mission') }}</p>
      <p>{{ t('about.approach') }}</p>
    </div>

    <div class="about-team">
      <h2>{{ t('about.startup-title') }}</h2>
      <p>{{ t('about.startup-content') }}</p>
    </div>
  </section>
</template>

<style scoped>
.about {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 0;
}

.about-header h1 {
  font-size: 2rem;
  margin: 0;
}

.about-tagline {
  font-style: italic;
  color: #8B5CF6;
  margin-top: 0.5rem;
}

.about-body {
  margin-top: 1.75rem;
  line-height: 1.7;
  opacity: 0.9;
}

.about-body p + p {
  margin-top: 1rem;
}

.about-team {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(127, 127, 127, 0.2);
}

.about-team h2 {
  font-size: 1.25rem;
  margin: 0 0 0.75rem;
}
</style>