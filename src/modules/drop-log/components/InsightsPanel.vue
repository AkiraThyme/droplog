<template>
  <section class="grid grid-cols-2 gap-2">
    <article class="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <h3 class="text-xs text-slate-400">Top mood</h3>
      <p class="text-lg font-semibold">{{ topMood }}</p>
    </article>
    <article class="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <h3 class="text-xs text-slate-400">Total days active</h3>
      <p class="text-lg font-semibold">{{ Object.keys(entriesPerDay).length }}</p>
    </article>
  </section>
</template>

<script setup lang="ts">
defineProps<{ topMood: string; entriesPerDay: Record<string, number> }>();
</script>
