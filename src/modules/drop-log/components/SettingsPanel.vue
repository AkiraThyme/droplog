<template>
  <section class="space-y-3">
    <article class="glass-panel rounded-2xl p-4">
      <h2 class="text-base font-semibold text-app-primary">Appearance</h2>
      <p class="mt-1 text-xs text-app-muted">Control theme and readability preferences for your journaling sessions.</p>

      <div class="mt-3 flex items-center justify-between rounded-2xl border border-white/60 bg-white/45 p-3 dark:border-slate-700/70 dark:bg-slate-900/55">
        <div>
          <p class="text-sm font-medium text-app-primary">Theme</p>
          <p class="text-xs text-app-muted">Switch between light and black theme.</p>
        </div>
        <button
          class="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-violet-500"
          @click="ui.toggleTheme()"
        >
          {{ ui.theme === 'black' ? 'Use light' : 'Use black' }}
        </button>
      </div>
    </article>

    <article class="glass-panel rounded-2xl p-4">
      <h2 class="text-base font-semibold text-app-primary">Helpful settings</h2>
      <p class="mt-1 text-xs text-app-muted">Quick toggles that improve habit consistency and accessibility.</p>

      <div class="mt-3 space-y-2">
        <label class="flex items-center justify-between rounded-xl border border-white/60 bg-white/45 px-3 py-2 text-sm dark:border-slate-700/70 dark:bg-slate-900/55">
          <span class="text-app-secondary">Haptic feedback on save</span>
          <input v-model="hapticsEnabled" type="checkbox" class="h-4 w-4 accent-violet-500" />
        </label>

        <label class="flex items-center justify-between rounded-xl border border-white/60 bg-white/45 px-3 py-2 text-sm dark:border-slate-700/70 dark:bg-slate-900/55">
          <span class="text-app-secondary">Weekly reflection reminder</span>
          <input v-model="weeklyReminder" type="checkbox" class="h-4 w-4 accent-violet-500" />
        </label>

        <div class="rounded-xl border border-white/60 bg-white/45 px-3 py-2 dark:border-slate-700/70 dark:bg-slate-900/55">
          <p class="text-sm text-app-secondary">Preferred reminder hour</p>
          <select
            v-model.number="reminderHour"
            class="mt-2 w-full rounded-lg border border-slate-300/80 bg-white/80 px-2 py-1 text-xs text-app-primary dark:border-slate-700 dark:bg-slate-900"
          >
            <option v-for="hour in hours" :key="hour" :value="hour">{{ formatHour(hour) }}</option>
          </select>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@/shared/stores/useUIStore';

const ui = useUIStore();

const hapticsEnabled = computed({
  get: () => localStorage.getItem('droplog-haptics') !== 'off',
  set: (value: boolean) => localStorage.setItem('droplog-haptics', value ? 'on' : 'off'),
});

const weeklyReminder = computed({
  get: () => localStorage.getItem('droplog-weekly-reminder') !== 'off',
  set: (value: boolean) => localStorage.setItem('droplog-weekly-reminder', value ? 'on' : 'off'),
});

const reminderHour = computed({
  get: () => Number(localStorage.getItem('droplog-reminder-hour') ?? '20'),
  set: (value: number) => localStorage.setItem('droplog-reminder-hour', String(value)),
});

const hours = Array.from({ length: 24 }, (_, hour) => hour);

const formatHour = (hour: number) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalized = hour % 12 || 12;
  return `${normalized}:00 ${suffix}`;
};
</script>
