<template>
  <section class="glass-panel rounded-3xl p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-800">Log calendar</h3>
      <button class="rounded-full border border-slate-300/70 px-3 py-1 text-xs text-slate-700" @click="$emit('clear')">Clear</button>
    </div>

    <div class="grid grid-cols-7 gap-2 text-center text-[10px] font-semibold uppercase text-slate-500">
      <span v-for="day in weekDays" :key="day">{{ day }}</span>
    </div>

    <div class="mt-2 grid grid-cols-7 gap-2">
      <button
        v-for="cell in calendarCells"
        :key="cell.key"
        :disabled="!cell.dateKey"
        class="calendar-cell"
        :class="[
          cell.dateKey ? 'cursor-pointer border-slate-300/70 text-slate-700' : 'border-transparent opacity-0',
          cell.isToday && 'ring-1 ring-violet-400',
          cell.isSelected && 'border-violet-500 bg-violet-500 text-white',
          !cell.isSelected && intensityClass(cell.count),
        ]"
        @click="cell.dateKey && $emit('select-day', cell.dateKey)"
      >
        <span class="text-[11px]">{{ cell.day }}</span>
        <span class="text-[10px] opacity-80">{{ cell.count > 0 ? cell.count : '' }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DropEntry } from '../types/drop-entry';

const props = defineProps<{
  entries: DropEntry[];
  selectedDate?: string;
}>();

defineEmits<{
  'select-day': [dateKey: string];
  clear: [];
}>();

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const monthStart = computed(() => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
});

const monthEnd = computed(() => {
  const start = monthStart.value;
  return new Date(start.getFullYear(), start.getMonth() + 1, 0);
});

const countMap = computed(() =>
  props.entries.reduce<Record<string, number>>((acc, entry) => {
    const key = formatDateKey(entry.createdAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {}),
);

const calendarCells = computed(() => {
  const start = monthStart.value;
  const end = monthEnd.value;
  const startOffset = start.getDay();
  const totalDays = end.getDate();
  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayIndex = index - startOffset + 1;
    if (dayIndex < 1 || dayIndex > totalDays) {
      return { key: `empty-${index}`, day: '', dateKey: '', count: 0, isToday: false, isSelected: false };
    }

    const date = new Date(start.getFullYear(), start.getMonth(), dayIndex);
    const dateKey = toIsoDate(date);
    return {
      key: dateKey,
      day: dayIndex,
      dateKey,
      count: countMap.value[dateKey] ?? 0,
      isToday: dateKey === toIsoDate(new Date()),
      isSelected: props.selectedDate === dateKey,
    };
  });
});

const intensityClass = (count: number) => {
  if (count >= 4) return 'bg-violet-500/45';
  if (count >= 2) return 'bg-violet-400/30';
  if (count >= 1) return 'bg-violet-300/25';
  return 'bg-white/40';
};

function toIsoDate(date: Date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}

function formatDateKey(timestamp: number) {
  return toIsoDate(new Date(timestamp));
}
</script>
