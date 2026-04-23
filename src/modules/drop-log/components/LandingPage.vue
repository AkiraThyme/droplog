<template>
  <section class="relative overflow-hidden px-4 pb-12 pt-6 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.55),transparent_43%),radial-gradient(circle_at_bottom_right,rgba(232,121,249,0.35),transparent_48%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.14),transparent_46%)]"
    />

    <div class="relative z-10 mx-auto w-full max-w-7xl space-y-10 lg:space-y-16">
      <header class="glass-panel rounded-2xl px-4 py-3 sm:px-5">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="/icons/logo.png" alt="DropLog logo" class="h-10 w-10 rounded-xl shadow-md" />
            <div>
              <h1 class="text-xl font-black tracking-tight sm:text-2xl">DropLog</h1>
              <p class="text-xs font-medium text-violet-700 dark:text-violet-300">Drop it. Log it. Remember it.</p>
            </div>
          </div>

          <nav class="hidden items-center gap-6 text-sm font-semibold text-app-secondary lg:flex">
            <a href="#features" class="transition hover:text-app-primary">Features</a>
            <a href="#benefits" class="transition hover:text-app-primary">Benefits</a>
            <a href="#preview" class="transition hover:text-app-primary">Preview</a>
          </nav>

          <button class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-300/35 dark:bg-violet-500" @click="$emit('start')">Enter App</button>
        </div>
      </header>

      <section class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 dark:text-violet-300">Build daily clarity</p>
          <h2 class="mt-3 text-4xl font-black tracking-tight text-app-primary sm:text-5xl lg:text-6xl">Journal quickly, review deeply.</h2>
          <p class="mt-4 max-w-2xl text-base leading-relaxed text-app-secondary lg:text-lg">
            DropLog turns short mood check-ins into clear patterns. Capture a drop in seconds, then use timeline and insights dashboards on larger screens to understand your week.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <button class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-300/35 dark:bg-violet-500" @click="$emit('start')">Start logging</button>
            <a href="#features" class="rounded-xl border border-slate-300/80 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">Explore features</a>
          </div>
        </div>

        <article id="preview" class="glass-panel rounded-3xl p-4 md:p-6">
          <p class="text-xs uppercase tracking-[0.22em] text-app-muted">Live preview</p>
          <h3 class="mt-2 text-xl font-bold text-app-primary md:text-2xl">Interactive feature spotlight</h3>

          <nav class="glass-nav mt-4 grid grid-cols-3 gap-1 rounded-2xl p-1.5">
            <button
              v-for="(page, index) in pages"
              :key="page.title"
              class="rounded-xl px-2 py-2 text-xs font-semibold transition md:text-sm"
              :class="currentPage === index ? 'bg-white/90 text-slate-900 dark:bg-slate-200 dark:text-slate-950' : 'text-slate-600 dark:text-slate-300'"
              @click="currentPage = index"
            >
              {{ page.tab }}
            </button>
          </nav>

          <div class="mt-4 rounded-2xl border border-white/70 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-900/70">
            <h4 class="text-lg font-bold md:text-xl">{{ activePage.title }}</h4>
            <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ activePage.description }}</p>

            <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-2">
              <div v-for="item in activePage.highlights" :key="item.label" class="rounded-xl border border-white/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-950/70">
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.label }}</p>
                <p class="mt-1 text-sm font-semibold">{{ item.value }}</p>
              </div>
            </div>

            <div v-if="activePage.chart" class="mt-4 rounded-xl border border-violet-200 bg-violet-50/85 p-3 dark:border-violet-900 dark:bg-violet-950/55">
              <p class="text-xs font-semibold text-violet-700 dark:text-violet-200">AI insight preview</p>
              <div class="mt-2 flex h-28 items-end gap-2">
                <div
                  v-for="(bar, idx) in activePage.chart"
                  :key="`${activePage.title}-${idx}`"
                  class="flex-1 rounded-t-lg bg-gradient-to-t from-violet-500 to-cyan-400"
                  :style="{ height: `${bar}%` }"
                />
              </div>
              <p class="mt-2 text-xs text-violet-800 dark:text-violet-100">{{ activePage.aiLine }}</p>
            </div>
          </div>
        </article>
      </section>

      <section id="features" class="space-y-4 lg:space-y-6">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-app-muted">Features</p>
            <h3 class="mt-1 text-2xl font-bold text-app-primary md:text-3xl">Designed for every screen size</h3>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 lg:gap-6">
          <article v-for="feature in featureCards" :key="feature.title" class="glass-panel rounded-2xl p-4 md:p-5">
            <p class="text-2xl">{{ feature.icon }}</p>
            <h4 class="mt-3 text-lg font-semibold text-app-primary">{{ feature.title }}</h4>
            <p class="mt-2 text-sm leading-relaxed text-app-secondary">{{ feature.description }}</p>
          </article>
        </div>
      </section>

      <section id="benefits" class="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
        <article class="glass-panel rounded-3xl p-5 md:p-6">
          <p class="text-xs uppercase tracking-[0.22em] text-app-muted">Why it works</p>
          <h3 class="mt-2 text-2xl font-bold text-app-primary md:text-3xl">Smarter reflection without extra effort</h3>
          <ul class="mt-4 space-y-3 text-sm leading-relaxed text-app-secondary md:text-base">
            <li v-for="benefit in benefits" :key="benefit" class="rounded-xl border border-slate-300/70 px-3 py-2 dark:border-slate-700">{{ benefit }}</li>
          </ul>
        </article>

        <article class="glass-panel rounded-3xl p-5 md:p-6">
          <p class="text-xs uppercase tracking-[0.22em] text-app-muted">Social proof</p>
          <h3 class="mt-2 text-2xl font-bold text-app-primary md:text-3xl">Built for consistent daily use</h3>
          <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div v-for="stat in trustStats" :key="stat.label" class="rounded-xl border border-slate-300/70 px-3 py-3 dark:border-slate-700">
              <p class="text-2xl font-black text-app-primary">{{ stat.value }}</p>
              <p class="mt-1 text-xs uppercase tracking-wide text-app-muted">{{ stat.label }}</p>
            </div>
          </div>
        </article>
      </section>

      <footer class="glass-panel rounded-3xl px-5 py-6 md:px-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="lg:col-span-2">
            <h4 class="text-lg font-semibold text-app-primary">DropLog</h4>
            <p class="mt-2 max-w-xl text-sm text-app-secondary">A responsive mood journaling workspace for quick capture on phones and deep review on tablets and desktops.</p>
          </div>
          <div>
            <h5 class="text-xs uppercase tracking-[0.18em] text-app-muted">Product</h5>
            <ul class="mt-2 space-y-1 text-sm text-app-secondary">
              <li>Timeline</li>
              <li>Insights</li>
              <li>Filters</li>
            </ul>
          </div>
          <div>
            <h5 class="text-xs uppercase tracking-[0.18em] text-app-muted">Get started</h5>
            <button class="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-violet-500" @click="$emit('start')">Enter DropLog</button>
          </div>
        </div>
      </footer>
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

const featureCards = [
  {
    icon: '⚡',
    title: 'Quick capture',
    description: 'Log a drop with mood, context, and tags in seconds without breaking your flow.',
  },
  {
    icon: '🗂️',
    title: 'Timeline clarity',
    description: 'Sort by dates, moods, and tags to replay your week and notice hidden patterns.',
  },
  {
    icon: '📊',
    title: 'Insight dashboard',
    description: 'Track streaks and trends with larger visualizations optimized for tablets and desktops.',
  },
  {
    icon: '🌙',
    title: 'Balanced dark mode',
    description: 'Comfortable contrast, subtle elevation, and polished surfaces across every theme.',
  },
];

const benefits = [
  'Write less, remember more with compact but structured daily check-ins.',
  'Use filters and trend views to connect your routines to your mood shifts.',
  'Keep your reflection habit consistent with low-friction interactions and streak support.',
];

const trustStats = [
  { label: 'check-ins to log', value: '< 10 sec' },
  { label: 'layout modes', value: '3' },
  { label: 'insight views', value: 'Realtime' },
  { label: 'theme support', value: 'Light/Dark' },
];

const activePage = computed(() => pages[currentPage.value]);
</script>
