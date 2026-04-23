<template>
  <section class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <article
        v-for="card in cards"
        :key="card.id"
        class="glass-panel rounded-2xl p-4"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-app-muted">{{ card.title }}</p>
            <h3 class="mt-1 text-lg font-semibold text-app-primary">{{ card.value }}</h3>
          </div>
          <span class="text-xl" aria-hidden="true">{{ card.icon }}</span>
        </div>
        <p class="mt-2 text-xs leading-relaxed text-app-secondary">{{ card.description }}</p>
        <p class="mt-2 text-[11px] text-app-muted">{{ card.support }}</p>
      </article>
    </div>

    <article class="glass-panel rounded-2xl p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-app-primary">Weekly activity</h3>
        <span class="text-xs text-app-muted">Last 7 days</span>
      </div>
      <div class="mt-4 grid grid-cols-7 gap-2">
        <div v-for="point in weeklySeries" :key="point.key" class="flex flex-col items-center gap-2">
          <div class="flex h-24 items-end">
            <div class="w-6 rounded-full bg-violet-500/20 p-1 dark:bg-violet-400/15">
              <div class="w-full rounded-full bg-gradient-to-t from-violet-500 to-indigo-400" :class="barLevelClass(point.level)" />
            </div>
          </div>
          <span class="text-[11px] font-medium text-app-muted">{{ point.label }}</span>
        </div>
      </div>
    </article>

    <article class="glass-panel rounded-2xl p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-app-primary">Mood trend</h3>
        <span class="text-xs text-app-muted">Recent intensity</span>
      </div>
      <div class="mt-3 rounded-xl border border-white/70 bg-white/45 p-3 dark:border-slate-700 dark:bg-slate-900/55">
        <svg viewBox="0 0 100 40" class="h-24 w-full" role="img" aria-label="Mood trend line chart">
          <polyline
            fill="none"
            stroke="currentColor"
            class="text-violet-500"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            :points="trendPoints"
          />
          <circle
            v-for="point in trendSeries"
            :key="`point-${point.label}`"
            :cx="point.x"
            :cy="mapLineY(point.y)"
            r="1.7"
            class="fill-indigo-400"
          />
        </svg>
        <div class="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] text-app-muted">
          <span v-for="point in trendSeries" :key="`label-${point.label}`">{{ point.label }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type InsightCard = {
  id: string;
  icon: string;
  title: string;
  value: string;
  description: string;
  support: string;
};

type ActivityPoint = {
  key: string;
  label: string;
  count: number;
  height: number;
  level: number;
};

type TrendPoint = {
  label: string;
  count: number;
  x: number;
  y: number;
};

const props = defineProps<{ cards: InsightCard[]; weeklySeries: ActivityPoint[]; trendSeries: TrendPoint[] }>();

const barHeights = ['h-4', 'h-8', 'h-12', 'h-16', 'h-20', 'h-24'];
const barLevelClass = (level: number) => barHeights[Math.min(Math.max(level, 0), barHeights.length - 1)];

const mapLineY = (value: number) => 5 + value * 0.3;

const trendPoints = computed(() => props.trendSeries.map((point) => `${point.x},${mapLineY(point.y)}`).join(' '));
</script>
