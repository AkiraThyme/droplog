<template>
  <section class="relative flex min-h-screen flex-col overflow-hidden px-5 pb-8 pt-10 text-slate-900 dark:text-slate-100">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.65),transparent_43%),radial-gradient(circle_at_bottom_right,rgba(232,121,249,0.45),transparent_48%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.18),transparent_46%)]"
    />

    <div class="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col">
      <header class="glass-panel mb-5 flex items-center gap-3 rounded-2xl px-4 py-3">
        <img src="/icons/icon-512.svg" alt="DropLog logo" class="h-11 w-11 rounded-xl shadow-md" />
        <div>
          <h1 class="text-2xl font-black tracking-tight">DropLog</h1>
          <p class="text-xs font-medium text-violet-700 dark:text-violet-300">Drop it. Log it. Remember it.</p>
        </div>
      </header>

      <nav class="glass-nav mb-5 grid grid-cols-3 gap-1 rounded-2xl p-1.5">
        <button
          v-for="(page, index) in pages"
          :key="page.title"
          class="rounded-xl px-2 py-2 text-xs font-semibold transition"
          :class="currentPage === index ? 'bg-white/90 text-slate-900 dark:bg-slate-200 dark:text-slate-950' : 'text-slate-600 dark:text-slate-300'"
          @click="currentPage = index"
        >
          {{ page.tab }}
        </button>
      </nav>

      <article class="glass-panel flex-1 rounded-3xl p-5">
        <p class="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Core use {{ currentPage + 1 }}/3</p>
        <h2 class="text-2xl font-bold">{{ activePage.title }}</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ activePage.description }}</p>

        <div class="mt-5 grid grid-cols-2 gap-2">
          <div
            v-for="item in activePage.highlights"
            :key="item.label"
            class="rounded-2xl border border-white/75 bg-white/65 p-3 dark:border-slate-700 dark:bg-slate-900/70"
          >
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.label }}</p>
            <p class="mt-1 text-sm font-semibold">{{ item.value }}</p>
          </div>
        </div>

        <div v-if="activePage.chart" class="mt-5 rounded-2xl border border-violet-200 bg-violet-50/85 p-3 dark:border-violet-900 dark:bg-violet-950/55">
          <p class="text-xs font-semibold text-violet-700 dark:text-violet-200">AI insight preview</p>
          <div class="mt-2 flex h-24 items-end gap-2">
            <div
              v-for="(bar, idx) in activePage.chart"
              :key="`${activePage.title}-${idx}`"
              class="flex-1 rounded-t-lg bg-gradient-to-t from-violet-500 to-cyan-400"
              :style="{ height: `${bar}%` }"
            />
          </div>
          <p class="mt-2 text-xs text-violet-800 dark:text-violet-100">{{ activePage.aiLine }}</p>
        </div>
      </article>

      <div class="mt-4 flex items-center justify-between gap-3">
        <button
          class="rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
          :disabled="currentPage === 0"
          @click="currentPage--"
        >
          Back
        </button>

        <div class="flex gap-1.5">
          <span
            v-for="(_, index) in pages"
            :key="`dot-${index}`"
            class="h-1.5 rounded-full transition-all"
            :class="currentPage === index ? 'w-5 bg-violet-600 dark:bg-violet-300' : 'w-2 bg-slate-300 dark:bg-slate-700'"
          />
        </div>

        <button
          v-if="currentPage < pages.length - 1"
          class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-violet-500"
          @click="currentPage++"
        >
          Next
        </button>
        <button
          v-else
          class="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-300/45 dark:bg-violet-500"
          @click="$emit('start')"
        >
          Enter DropLog
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineEmits<{ start: [] }>();

const currentPage = ref(0);

type LandingPageItem = {
  tab: string;
  title: string;
  description: string;
  highlights: { label: string; value: string }[];
  chart?: number[];
  aiLine?: string;
};

const pages: LandingPageItem[] = [
  {
    tab: 'Capture',
    title: 'Quick Drop Logging',
    description: 'Capture mood, thought, and context in a few taps. Built for low-friction journaling throughout your day.',
    highlights: [
      { label: 'Mood check', value: '1 tap' },
      { label: 'Tag memory', value: 'Instant' },
      { label: 'Private first', value: 'Offline ready' },
      { label: 'Daily streak', value: 'Auto tracked' },
    ],
  },
  {
    tab: 'Patterns',
    title: 'Timeline + Mood Patterns',
    description: 'Browse entries by day and uncover patterns between moods, activities, and routines with cleaner filters.',
    highlights: [
      { label: 'Calendar heat', value: 'At-a-glance' },
      { label: 'Search logs', value: 'Natural words' },
      { label: 'Mood trend', value: 'Weekly' },
      { label: 'Focus tags', value: 'Customizable' },
    ],
  },
  {
    tab: 'Insights',
    title: 'AI-Powered Insight Snapshot',
    description: 'Get lightweight analysis with a modern chart view that explains what changed and what to try next.',
    highlights: [
      { label: 'Top mood', value: 'Good' },
      { label: 'Energy trend', value: '+18%' },
      { label: 'Stress window', value: 'Tue PM' },
      { label: 'Next action', value: '10-min walk' },
    ],
    chart: [32, 46, 38, 65, 58, 74, 80],
    aiLine: 'You are most positive after focused mornings. Keep your current wake routine for steadier mood scores.',
  },
];

const activePage = computed(() => pages[currentPage.value]);
</script>
