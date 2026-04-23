<template>
  <section class="space-y-4">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="card in cards" :key="card.id" class="glass-panel rounded-2xl p-4">
        <p class="text-xs uppercase tracking-wide text-app-muted">{{ card.title }}</p>
        <p class="mt-1 text-2xl font-bold text-app-primary">{{ card.value }}</p>
        <p class="text-xs text-app-muted">{{ card.description }}</p>
      </article>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <article class="glass-panel rounded-2xl p-4">
        <h3 class="text-sm font-semibold text-app-primary">Activity chart</h3>
        <div class="mt-4 grid grid-cols-7 gap-2">
          <div v-for="point in weeklySeries" :key="point.key" class="flex flex-col items-center gap-2">
            <div class="flex h-28 items-end">
              <div class="w-8 rounded-md bg-violet-500/15 p-1">
                <div class="w-full rounded-md bg-gradient-to-t from-violet-500 to-indigo-400" :style="{ height: `${Math.max(10, point.height)}%` }" />
              </div>
            </div>
            <span class="text-[11px] text-app-muted">{{ point.label }}</span>
          </div>
        </div>
      </article>

      <article class="glass-panel rounded-2xl p-4">
        <h3 class="text-sm font-semibold text-app-primary">Mood trend</h3>
        <svg viewBox="0 0 100 40" class="mt-4 h-36 w-full" role="img" aria-label="Mood trend line chart">
          <polyline fill="none" stroke="currentColor" class="text-violet-500" stroke-width="2.5" :points="trendPoints" />
        </svg>
        <div class="mt-2 grid grid-cols-7 text-center text-[11px] text-app-muted">
          <span v-for="point in trendSeries" :key="point.label">{{ point.label }}</span>
        </div>
      </article>
    </div>

    <article class="glass-panel rounded-2xl p-4">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-app-primary">Recent entries</h3>
        <span class="text-xs text-app-muted">{{ recentEntries.length }} shown</span>
      </div>
      <ul class="space-y-2">
        <li v-for="entry in recentEntries" :key="entry.id" class="rounded-xl border border-slate-300/60 px-3 py-2 text-sm dark:border-slate-700">
          <div class="flex items-center justify-between gap-2">
            <span class="truncate">{{ entry.mood }} {{ entry.text }}</span>
            <span class="text-xs text-app-muted">{{ formatTime(entry.createdAt) }}</span>
          </div>
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DropEntry } from '../types/drop-entry';

const props = defineProps<{
  cards: Array<{ id: string; title: string; value: string; description: string }>;
  weeklySeries: Array<{ key: string; label: string; height: number }>;
  trendSeries: Array<{ label: string; x: number; y: number }>;
  recentEntries: DropEntry[];
}>();

const mapY = (value: number) => 38 - value * 0.24;
const trendPoints = computed(() => props.trendSeries.map((point) => `${point.x},${mapY(point.y)}`).join(' '));

const formatTime = (timestamp: number) => new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
</script>
