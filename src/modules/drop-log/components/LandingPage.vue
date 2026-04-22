<template>
  <section class="relative flex min-h-screen flex-col overflow-hidden px-6 pb-10 pt-16 text-slate-900">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(191,219,254,0.8),transparent_45%),radial-gradient(circle_at_bottom,rgba(196,181,253,0.75),transparent_50%)]" />

    <div class="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col">
      <p class="mb-3 inline-flex w-fit items-center rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
        shadcn-inspired experience
      </p>
      <h1 class="text-4xl font-black tracking-tight text-slate-950">DropLog</h1>
      <p class="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
        Capture how you feel in seconds, revisit your emotional patterns, and plan your next best day with a calmer, softer interface.
      </p>

      <div class="mt-8 space-y-3">
        <article class="glass-panel rounded-2xl p-4">
          <h2 class="text-sm font-semibold text-slate-800">One-tap drop</h2>
          <p class="mt-1 text-xs text-slate-600">Log mood, tags, and context quickly with haptic feedback.</p>
        </article>
        <article class="glass-panel rounded-2xl p-4">
          <h2 class="text-sm font-semibold text-slate-800">Calendar view</h2>
          <p class="mt-1 text-xs text-slate-600">See which days are heavy, light, or streaking at a glance.</p>
        </article>
        <article class="glass-panel rounded-2xl p-4">
          <h2 class="text-sm font-semibold text-slate-800">Adaptive insights</h2>
          <p class="mt-1 text-xs text-slate-600">Track top mood, active days, and your consistency trend.</p>
        </article>
      </div>

      <button
        class="mt-auto rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-300/50 transition-transform active:scale-95"
        @click="$emit('start')"
      >
        Enter DropLog
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits<{ start: [] }>();
</script>
