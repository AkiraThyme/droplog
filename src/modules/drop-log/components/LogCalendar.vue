<template>
  <section class="glass-panel rounded-3xl p-4" :class="isDesktop ? 'p-6' : ''">
    <div class="mb-4 flex items-center justify-between">
      <button
        class="touch-target rounded-full border border-slate-300/80 bg-white/70 px-3 text-sm font-semibold text-app-secondary transition active:scale-95 dark:border-slate-700 dark:bg-slate-900/70"
        @click="goToPreviousMonth"
      >
        ‹
      </button>
      <div class="text-center">
        <p class="text-xs uppercase tracking-wide text-app-muted">Mood heatmap</p>
        <h3 class="text-base font-semibold text-app-primary">{{ monthLabel }}</h3>
      </div>
      <button
        class="touch-target rounded-full border border-slate-300/80 bg-white/70 px-3 text-sm font-semibold text-app-secondary transition active:scale-95 dark:border-slate-700 dark:bg-slate-900/70"
        @click="goToNextMonth"
      >
        ›
      </button>
    </div>

    <div class="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-app-muted">
      <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
    </div>

    <Transition name="calendar-slide" mode="out-in">
      <div :key="monthKey" class="mt-2 grid grid-cols-7 gap-2">
        <button
          v-for="cell in calendarCells"
          :key="cell.key"
          :disabled="!cell.dateKey"
          class="calendar-day touch-target" :title="cell.dateKey ? `${cell.dateKey} · ${cell.count} entries` : ''"
          :class="[
            !cell.dateKey && 'opacity-0 pointer-events-none',
            cell.dateKey && cell.levelClass,
            cell.isToday && 'ring-2 ring-violet-500/80 ring-offset-1 ring-offset-transparent',
            cell.isSelected && 'border-violet-500 bg-violet-500 text-white shadow-md shadow-violet-500/35',
          ]"
          @click="cell.dateKey && $emit('select-day', cell.dateKey)"
        >
          <span class="text-[11px] font-semibold">{{ cell.day }}</span>
          <span class="text-sm leading-none">{{ cell.mood }}</span>
        </button>
      </div>
    </Transition>

    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-[11px] text-app-muted">
        <span>No logs</span>
        <div class="flex gap-1">
          <span v-for="level in legendLevels" :key="level" class="h-2.5 w-4 rounded-full" :class="level" />
        </div>
        <span>More logs</span>
      </div>
      <button class="rounded-full border border-slate-300/80 px-3 py-1 text-xs text-app-secondary transition active:scale-95 dark:border-slate-700" @click="$emit('clear')">
        Clear day
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DropEntry } from '../types/drop-entry';
import { toIsoDate } from '../utils/date';

type CalendarCell = {
  key: string;
  dateKey: string;
  day: string;
  mood: string;
  count: number;
  isToday: boolean;
  isSelected: boolean;
  levelClass: string;
};

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const moodScale: Record<string, string> = {
  '😄': 'bg-emerald-200/85 dark:bg-emerald-500/25',
  '🙂': 'bg-sky-200/85 dark:bg-sky-500/25',
  '😐': 'bg-amber-200/85 dark:bg-amber-500/25',
  '😔': 'bg-orange-200/85 dark:bg-orange-500/30',
  '😡': 'bg-rose-200/85 dark:bg-rose-500/30',
};

const intensityScale = [
  'bg-slate-100/60 dark:bg-slate-800/70',
  'bg-violet-100 dark:bg-violet-900/45',
  'bg-violet-200 dark:bg-violet-800/55',
  'bg-violet-300 dark:bg-violet-700/65',
  'bg-violet-400 dark:bg-violet-600/75',
];

const legendLevels = intensityScale;

const props = defineProps<{ entries: DropEntry[]; selectedDate?: string; isDesktop?: boolean }>();
defineEmits<{ 'select-day': [dateKey: string]; clear: [] }>();

const now = new Date();
const viewedMonth = ref(new Date(now.getFullYear(), now.getMonth(), 1));

const monthKey = computed(() => `${viewedMonth.value.getFullYear()}-${viewedMonth.value.getMonth()}`);

const monthLabel = computed(() =>
  viewedMonth.value.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  }),
);

const groupedByDay = computed(() =>
  props.entries.reduce<Record<string, { count: number; moods: Record<string, number> }>>((acc, entry) => {
    const key = toIsoDate(new Date(entry.createdAt));
    const target = acc[key] ?? { count: 0, moods: {} };
    target.count += 1;
    target.moods[entry.mood] = (target.moods[entry.mood] ?? 0) + 1;
    acc[key] = target;
    return acc;
  }, {}),
);

const monthDates = computed(() => {
  const year = viewedMonth.value.getFullYear();
  const month = viewedMonth.value.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const mondayOffset = (first.getDay() + 6) % 7;
  const totalCells = Math.ceil((mondayOffset + last.getDate()) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - mondayOffset + 1;
    if (day < 1 || day > last.getDate()) {
      return { key: `pad-${index}`, dateKey: '', day: '', count: 0, mood: '', isToday: false, isSelected: false, levelClass: '' };
    }

    const date = new Date(year, month, day);
    const dateKey = toIsoDate(date);
    const stats = groupedByDay.value[dateKey];
    const dominantMood = stats
      ? Object.entries(stats.moods).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
      : '';
    const intensityIndex = Math.min(legendLevels.length - 1, stats?.count ?? 0);
    const todayKey = toIsoDate(new Date());

    const levelClass = stats?.count
      ? `${intensityScale[intensityIndex]} ${moodScale[dominantMood] ?? ''}`
      : 'bg-slate-100/45 opacity-65 dark:bg-slate-900/55';

    return {
      key: dateKey,
      dateKey,
      day: String(day),
      mood: stats?.count ? dominantMood : '',
      count: stats?.count ?? 0,
      isToday: dateKey === todayKey,
      isSelected: props.selectedDate === dateKey,
      levelClass,
    } satisfies CalendarCell;
  });
});

const isDesktop = computed(() => Boolean(props.isDesktop));

const calendarCells = computed(() => monthDates.value);

const goToPreviousMonth = () => {
  viewedMonth.value = new Date(viewedMonth.value.getFullYear(), viewedMonth.value.getMonth() - 1, 1);
};

const goToNextMonth = () => {
  viewedMonth.value = new Date(viewedMonth.value.getFullYear(), viewedMonth.value.getMonth() + 1, 1);
};
</script>
