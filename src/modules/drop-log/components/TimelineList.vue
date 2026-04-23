<template>
  <div :class="compact ? 'max-h-72' : 'max-h-[55vh]'" class="space-y-3 overflow-auto pr-1">
    <TransitionGroup name="timeline" tag="div" class="space-y-4">
      <section v-for="group in groupedEntries" :key="group.date" class="space-y-2">
        <p class="sticky top-0 z-10 rounded-lg bg-white/85 px-2 py-1 text-xs font-semibold text-app-muted dark:bg-slate-900/90">
          {{ formatGroupDate(group.date) }}
        </p>

        <div :class="isDesktop ? 'grid grid-cols-2 gap-3 xl:grid-cols-3' : 'space-y-2'">
          <article
            v-for="item in group.items"
            :key="item.id"
            class="glass-panel cursor-pointer rounded-2xl p-4"
            @click="$emit('select', item)"
          >
            <header class="mb-3 flex items-start justify-between gap-2">
              <div>
                <p class="text-xs font-semibold text-app-muted">{{ formatTime(item.createdAt) }} · {{ item.context.timeOfDay }}</p>
                <span class="mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold" :class="moodBadgeClass(item.mood)">
                  {{ item.mood }} Mood
                </span>
              </div>
              <button class="touch-target rounded-lg px-2 text-xs font-semibold text-rose-500 transition active:scale-95" @click.stop="$emit('delete', item.id)">Delete</button>
            </header>

            <p class="line-clamp-4 text-sm leading-relaxed text-app-secondary">{{ item.text }}</p>

            <footer class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="rounded-full border border-slate-300/75 bg-white/70 px-2 py-1 text-[11px] font-medium text-app-muted dark:border-slate-700 dark:bg-slate-900/70"
              >
                #{{ tag }}
              </span>
              <button class="rounded-full border border-violet-400/55 px-2 py-1 text-[11px] font-semibold text-violet-600 transition active:scale-95 dark:text-violet-300" @click.stop="$emit('edit', item)">
                Edit
              </button>
            </footer>
          </article>
        </div>
      </section>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DropEntry } from '../types/drop-entry';
import { groupEntriesByDate } from '../utils/date';

const props = withDefaults(defineProps<{ entries: DropEntry[]; compact?: boolean; isDesktop?: boolean }>(), { compact: false, isDesktop: false });
defineEmits<{ delete: [id: string]; edit: [entry: DropEntry]; select: [entry: DropEntry] }>();

const moodBadgePalette: Record<string, string> = {
  '😄': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  '🙂': 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
  '😐': 'bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-100',
  '😔': 'bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-100',
  '😡': 'bg-rose-100 text-rose-700 dark:bg-rose-500/25 dark:text-rose-100',
};

const groupedEntries = computed(() => {
  const grouped = groupEntriesByDate(props.entries);
  return Object.keys(grouped)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => ({ date, items: grouped[date] }));
});

const moodBadgeClass = (mood: string) => moodBadgePalette[mood] ?? 'bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-200';

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

const formatGroupDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
</script>
