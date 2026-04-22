<template>
  <section class="grid grid-cols-2 gap-2">
    <article class="glass-panel rounded-2xl p-3">
      <h3 class="text-xs text-slate-500">Top mood</h3>
      <p class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ topMood }}</p>
    </article>
    <article class="glass-panel rounded-2xl p-3">
      <h3 class="text-xs text-slate-500">Total days active</h3>
      <p class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ Object.keys(entriesPerDay).length }}</p>
    </article>
  </section>
</template>

<script setup lang="ts">
defineProps<{ topMood: string; entriesPerDay: Record<string, number> }>();
</script>
