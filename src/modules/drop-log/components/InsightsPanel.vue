<template>
  <section class="space-y-2">
    <div class="grid grid-cols-2 gap-2">
      <article class="glass-panel rounded-2xl p-3">
        <h3 class="text-xs text-app-muted">Top mood</h3>
        <p class="text-lg font-semibold text-app-primary">{{ topMood }}</p>
      </article>
      <article class="glass-panel rounded-2xl p-3">
        <h3 class="text-xs text-app-muted">Total days active</h3>
        <p class="text-lg font-semibold text-app-primary">{{ activeDays }}</p>
      </article>
    </div>

    <article class="glass-panel rounded-2xl p-3">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">AI mood trend</h3>
        <span class="text-[11px] text-app-muted">last 7 entries</span>
      </div>
      <div class="mt-2 flex h-16 items-end gap-1.5">
        <div
          v-for="(value, index) in chartValues"
          :key="`bar-${index}`"
          class="flex-1 rounded-t-md bg-gradient-to-t from-violet-500 to-cyan-400"
          :style="{ height: `${value}%` }"
        />
      </div>
      <p class="mt-2 text-xs text-app-secondary">{{ aiSummary }}</p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ topMood: string; entriesPerDay: Record<string, number> }>();

const activeDays = computed(() => Object.keys(props.entriesPerDay).length);

const chartValues = computed(() => {
  const counts = Object.values(props.entriesPerDay).slice(-7);
  if (!counts.length) return [20, 26, 32, 28, 38, 44, 40];

  const max = Math.max(...counts, 1);
  return counts.map((value) => Math.max(16, Math.round((value / max) * 100)));
});

const aiSummary = computed(() => {
  const values = Object.values(props.entriesPerDay);
  if (values.length < 3) return 'Add a few more logs and DropLog AI will explain your strongest routine signals.';

  const recent = values.slice(-3).reduce((total, value) => total + value, 0);
  const older = values.slice(-6, -3).reduce((total, value) => total + value, 0);

  return recent >= older
    ? 'Your consistency is improving this week—keep the same check-in time for steadier mood trends.'
    : 'Activity dipped slightly this week—try a short evening check-in to rebuild momentum.';
});
</script>
