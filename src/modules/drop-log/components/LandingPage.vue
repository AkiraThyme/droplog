<template>
  <main class="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-indigo-50 via-sky-50 to-violet-100 px-6 pb-10 pt-14 text-slate-900">
    <div class="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-8 -left-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl"></div>

    <section class="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-between">
      <div class="space-y-6">
        <span class="inline-flex rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur">
          Tailwind + Capacitor PWA
        </span>
        <h1 class="text-5xl font-black tracking-tight text-slate-900">DropLog</h1>
        <p class="max-w-sm text-sm text-slate-600">
          Capture quick thoughts, moods, and tags. Track your emotional timeline with a calm, lightweight journaling experience.
        </p>
      </div>

      <div class="space-y-4">
        <article class="rounded-3xl border border-white/60 bg-white/65 p-4 shadow-xl shadow-indigo-200/60 backdrop-blur">
          <p class="text-xs uppercase tracking-wide text-slate-500">What&apos;s new</p>
          <ul class="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Customized calendar view for your logs</li>
            <li>• Glass navigation bar for quicker switching</li>
            <li>• Smoother pale theme for better readability</li>
          </ul>
        </article>

        <button
          class="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:scale-[1.01] active:scale-95"
          @click="$emit('start')"
        >
          Start logging
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
defineEmits<{ start: [] }>();
</script>
