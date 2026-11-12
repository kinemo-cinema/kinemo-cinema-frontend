<script setup>
defineProps({ title: { type: String, required: true } });
</script>
<template>
  <section class="p-4"><h1>{{ title }}</h1><p role="status">Este módulo todavía no está implementado en el backend actual. No hay un servicio disponible para consultar o guardar sus datos.</p><router-link to="/dashboard">Volver al inicio</router-link></section>
</template>
