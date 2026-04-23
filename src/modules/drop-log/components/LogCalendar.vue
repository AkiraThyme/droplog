<template>
  <section class="glass-panel rounded-3xl p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-app-primary">Mood heatmap calendar</h3>
      <button class="rounded-full border border-slate-300/70 px-3 py-1 text-xs text-app-secondary" @click="$emit('clear')">Clear</button>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="cell in heatmapCells"
        :key="cell.key"
        :disabled="!cell.dateKey"
        class="calendar-cell h-8 w-full"
        :class="[
          cell.dateKey ? 'cursor-pointer border-slate-300/70 text-app-secondary' : 'border-transparent opacity-0',
          cell.isToday && 'ring-1 ring-violet-400',
          cell.isSelected && 'border-violet-500 bg-violet-500 text-white',
          !cell.isSelected && intensityClass(cell.count),
        ]"
        @click="cell.dateKey && $emit('select-day', cell.dateKey)"
      >
        <span class="text-[9px]">{{ cell.day }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DropEntry } from '../types/drop-entry';
import { formatDateKey, toIsoDate } from '../utils/date';

const props = defineProps<{ entries: DropEntry[]; selectedDate?: string }>();
defineEmits<{ 'select-day': [dateKey: string]; clear: [] }>();

const countMap = computed(() =>
  props.entries.reduce<Record<string, number>>((acc, entry) => {
    const key = formatDateKey(entry.createdAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {}),
);

const heatmapCells = computed(() => {
  const today = new Date();
  const cells: Array<{ key: string; day: string; dateKey: string; count: number; isToday: boolean; isSelected: boolean }> = [];

  for (let offset = 83; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dateKey = toIsoDate(date);
    cells.push({
      key: dateKey,
      day: String(date.getDate()),
      dateKey,
      count: countMap.value[dateKey] ?? 0,
      isToday: dateKey === toIsoDate(today),
      isSelected: props.selectedDate === dateKey,
    });
  }

  const padding = (7 - (cells.length % 7)) % 7;
  for (let index = 0; index < padding; index += 1) {
    cells.push({ key: `pad-${index}`, day: '', dateKey: '', count: 0, isToday: false, isSelected: false });
  }

  return cells;
});

const intensityClass = (count: number) => {
  if (count >= 5) return 'bg-violet-600/60';
  if (count >= 3) return 'bg-violet-500/45';
  if (count >= 1) return 'bg-violet-400/30';
  return 'bg-white/40 dark:bg-slate-900/70';
};
</script>
