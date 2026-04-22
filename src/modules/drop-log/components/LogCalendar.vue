<template>
  <section class="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-4 shadow-lg shadow-indigo-100/60 backdrop-blur">
    <header class="flex items-center justify-between">
      <button class="rounded-lg border border-slate-200 bg-white/70 px-3 py-1 text-xs" @click="goMonth(-1)">Prev</button>
      <h3 class="text-sm font-semibold text-slate-700">{{ monthLabel }}</h3>
      <button class="rounded-lg border border-slate-200 bg-white/70 px-3 py-1 text-xs" @click="goMonth(1)">Next</button>
    </header>

    <div class="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500">
      <span v-for="day in weekDays" :key="day">{{ day }}</span>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <span v-for="blank in leadingBlankDays" :key="`b-${blank}`" class="h-10 rounded-lg"></span>

      <button
        v-for="day in totalDays"
        :key="day"
        class="relative h-10 rounded-lg border text-xs transition"
        :class="cellClass(day)"
        @click="selectDay(day)"
      >
        {{ day }}
        <span v-if="countForDay(day) > 0" class="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-indigo-500"></span>
      </button>
    </div>

    <p class="text-xs text-slate-500">Tap a day to filter logs. Tap again to clear.</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DropEntry } from '../types/drop-entry';

const props = defineProps<{
  entries: DropEntry[];
  selectedDay: string | null;
}>();

const emit = defineEmits<{ select: [isoDay: string | null] }>();

const cursor = ref(new Date());

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const monthStart = computed(() => new Date(cursor.value.getFullYear(), cursor.value.getMonth(), 1));
const monthEnd = computed(() => new Date(cursor.value.getFullYear(), cursor.value.getMonth() + 1, 0));
const totalDays = computed(() => monthEnd.value.getDate());
const leadingBlankDays = computed(() => monthStart.value.getDay());
const monthLabel = computed(() =>
  monthStart.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
);

const dayKey = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const dayCounts = computed(() => {
  return props.entries.reduce<Record<string, number>>((acc, entry) => {
    const key = dayKey(new Date(entry.createdAt));
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
});

const isoFor = (day: number) => dayKey(new Date(cursor.value.getFullYear(), cursor.value.getMonth(), day));

const countForDay = (day: number) => dayCounts.value[isoFor(day)] ?? 0;

const cellClass = (day: number) => {
  const iso = isoFor(day);
  const isActive = props.selectedDay === iso;
  const hasData = countForDay(day) > 0;

  if (isActive) return 'border-indigo-500 bg-indigo-100 text-indigo-800';
  if (hasData) return 'border-indigo-200 bg-indigo-50 text-slate-700 hover:bg-indigo-100';
  return 'border-slate-200 bg-white/80 text-slate-500 hover:bg-slate-100';
};

const goMonth = (delta: number) => {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1);
};

const selectDay = (day: number) => {
  const iso = isoFor(day);
  emit('select', props.selectedDay === iso ? null : iso);
};
</script>
