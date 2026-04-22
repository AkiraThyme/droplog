<template>
  <section class="grid gap-2" :class="expanded ? 'grid-cols-1' : 'grid-cols-2'">
    <article class="rounded-2xl border border-white/60 bg-white/70 p-3 shadow-md shadow-indigo-100/60 backdrop-blur">
      <h3 class="text-xs text-slate-500">Top mood</h3>
      <p class="text-2xl font-bold text-slate-800">{{ topMood }}</p>
    </article>
    <article class="rounded-2xl border border-white/60 bg-white/70 p-3 shadow-md shadow-indigo-100/60 backdrop-blur">
      <h3 class="text-xs text-slate-500">Total days active</h3>
      <p class="text-2xl font-bold text-slate-800">{{ Object.keys(entriesPerDay).length }}</p>
    </article>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ topMood: string; entriesPerDay: Record<string, number>; expanded?: boolean }>(),
  { expanded: false },
);
</script>
