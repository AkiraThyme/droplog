<template>
  <section class="relative flex min-h-screen flex-col overflow-hidden px-6 pb-8 pt-12 text-slate-900 dark:text-slate-100">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_bottom,rgba(244,114,182,0.3),transparent_50%)]" />

    <div class="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col">
      <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">Drop it. Log it. Remember it.</p>
      <h1 class="text-4xl font-black tracking-tight">DropLog</h1>
      <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">A context-based micro journaling app for moments, moods, and memories.</p>

      <article class="glass-panel mt-8 rounded-3xl p-5">
        <p class="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">{{ slides[activeSlide].kicker }}</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{ slides[activeSlide].title }}</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ slides[activeSlide].description }}</p>

        <div class="mt-5 grid grid-cols-3 gap-2">
          <div
            v-for="point in slides[activeSlide].points"
            :key="point"
            class="rounded-2xl border border-white/60 bg-white/70 px-2 py-2 text-center text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
          >
            {{ point }}
          </div>
        </div>
      </article>

      <div class="mt-5 flex items-center justify-center gap-2">
        <button
          v-for="(slide, index) in slides"
          :key="slide.title"
          class="h-2.5 rounded-full transition-all"
          :class="activeSlide === index ? 'w-8 bg-indigo-500 dark:bg-indigo-300' : 'w-2.5 bg-slate-300 dark:bg-slate-600'"
          @click="activeSlide = index"
          :aria-label="`Go to slide ${index + 1}`"
        />
      </div>

      <div class="mt-auto grid grid-cols-2 gap-3 pt-6">
        <button
          class="rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
          :disabled="activeSlide === 0"
          @click="activeSlide--"
        >
          Back
        </button>
        <button
          class="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-400/50 transition-transform active:scale-95 dark:bg-white dark:text-slate-950"
          @click="handlePrimary"
        >
          {{ activeSlide === slides.length - 1 ? 'Start Logging' : 'Next' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ start: [] }>();

const activeSlide = ref(0);

const slides = [
  {
    kicker: 'Quick Drop',
    title: 'Capture your moment in seconds',
    description: 'Log a thought, mood, and tags instantly so nothing important is forgotten.',
    points: ['Fast entry', 'Mood + tags', 'One tap'],
  },
  {
    kicker: 'Mood Tracking',
    title: 'Spot patterns with context',
    description: 'Follow emotional trends by time of day and revisit what helped you on better days.',
    points: ['Trend spotting', 'Context rich', 'Daily view'],
  },
  {
    kicker: 'Private & Offline',
    title: 'Your logs stay on device',
    description: 'Built for privacy-first reflection with local storage and a distraction-free timeline.',
    points: ['Offline first', 'Private data', 'Insights'],
  },
];

const handlePrimary = () => {
  if (activeSlide.value < slides.length - 1) {
    activeSlide.value += 1;
    return;
  }

  emit('start');
};
</script>
