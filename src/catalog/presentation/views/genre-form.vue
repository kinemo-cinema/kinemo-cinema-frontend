<script setup>
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import useCatalogStore from "../../application/catalog.store.js";
import {computed, onMounted, ref} from "vue";
import {Genre} from "../../domain/model/genre.entity.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useCatalogStore();

const {errors, addGenre, updateGenre} = store;

const form = ref({name: '', description: ''});
const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (isEdit.value) {
    const genre = getGenreById(route.params.id);
    if (genre) {
      form.value.name = genre.name;
      form.value.description = genre.description;
    } else {
      router.push({name: 'catalog-genres'});
    }
  }
});

/**
 * Retrieves a genre by its ID.
 * @param {string} id - The ID of the genre.
 * @returns {Genre|null} The genre object if found, null otherwise.
 */
function getGenreById(id) {
  return store.getGenreById(id);
}

/**
 * Saves the genre, either by adding a new one or updating an existing one.
 */
const saveGenre = () => {
  const genre = new Genre({
    id: isEdit.value ? route.params.id : null,
    name: form.value.name,
    description: form.value.description,
  });
  if (isEdit.value) updateGenre(genre); else addGenre(genre);
  navigateBack();
};

/**
 * Navigates back to the catalog genres list.
 */
const navigateBack = () => {
  router.push({name: 'catalog-genres'});
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('genre.edit-title') : t('genre.new-title') }}</h1>

    <form @submit.prevent="saveGenre">
      <div class="field mb-3">
        <label for="name">{{ t('genre.name') }}</label>
        <pv-input-text id="name" v-model="form.name" class="w-full" required/>
      </div>

      <div class="field mb-3">
        <label for="description">{{ t('genre.description') }}</label>
        <pv-input-text id="description" v-model="form.description" class="w-full"/>
      </div>

      <pv-button type="submit" :label="t('genre.save')" icon="pi pi-save"/>
      <pv-button :label="t('genre.cancel')" severity="secondary" class="ml-2" @click="navigateBack"/>
    </form>

    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>