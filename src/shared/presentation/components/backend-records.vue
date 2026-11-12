<script setup>
defineProps({ value: { required: true } });
const names = { id: 'ID', movieId: 'Película', showId: 'Función', roomId: 'Sala', cinemaId: 'Cine', planId: 'Plan', name: 'Nombre', title: 'Título', status: 'Estado', capacity: 'Capacidad', providerName: 'Proveedor', inspections: 'Inspecciones', blocks: 'Bloqueos', tracks: 'Pistas', history: 'Historial', sequences: 'Secuencias', syncEvents: 'Sincronización', hardwareLogs: 'Registros de hardware', emergencyEvents: 'Emergencias', syncLogs: 'Registros de sincronización', occupancies: 'Ocupación', transactions: 'Pagos', upgrades: 'Cambios de plan', startDateTime: 'Inicio', endDateTime: 'Fin', startDate: 'Inicio', endDate: 'Fin', observations: 'Observaciones', result: 'Resultado', active: 'Activo', reason: 'Motivo', intensityLevel: 'Intensidad', effectType: 'Efecto', filePath: 'Archivo', durationSeconds: 'Duración (segundos)', previousIntensity: 'Intensidad anterior', newIntensity: 'Nueva intensidad', changedAt: 'Fecha del cambio', sensoryContentId: 'Contenido sensorial', startedAt: 'Inicio', finishedAt: 'Finalización', price: 'Precio', maxScreens: 'Máximo de pantallas' };
const label = key => names[key] || key.replace(/([a-z])([A-Z])/g, '$1 $2');
</script>
<template>
  <template v-if="Array.isArray(value)">
    <p v-if="!value.length">Sin registros.</p>
    <article v-for="(item, index) in value" :key="item?.id ?? index"><backend-records :value="item" /></article>
  </template>
  <dl v-else-if="value && typeof value === 'object'">
    <template v-for="(item, key) in value" :key="key">
      <template v-if="item && typeof item === 'object'">
        <dt><details><summary>{{ label(key) }} <span v-if="Array.isArray(item)">({{ item.length }})</span></summary><backend-records :value="item" /></details></dt>
      </template>
      <template v-else><dt>{{ label(key) }}</dt><dd>{{ item === null ? '—' : typeof item === 'boolean' ? (item ? 'Sí' : 'No') : item }}</dd></template>
    </template>
  </dl>
  <span v-else>{{ value ?? '—' }}</span>
</template>
<style scoped>
dl { display: grid; grid-template-columns: minmax(110px, 1fr) 3fr; gap: .5rem 1rem; margin: 0; overflow-wrap: anywhere; }
dt { color: var(--text-muted); } dt:has(details) { grid-column: 1 / -1; } dd { margin: 0; }
@media(max-width: 550px) { dl { grid-template-columns: 1fr; } }
</style>
