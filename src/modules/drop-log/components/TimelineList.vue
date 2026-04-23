<template>
  <div :class="compact ? 'h-60' : 'h-[42vh]'" class="overflow-auto pr-1">
    <TransitionGroup name="timeline" tag="div">
      <section v-for="group in groupedEntries" :key="group.date" class="mb-3">
        <p class="sticky top-0 z-10 mb-1 rounded-lg bg-white/70 px-2 py-1 text-xs font-semibold text-app-muted dark:bg-slate-900/80">
          {{ formatGroupDate(group.date) }}
        </p>

        <article
          v-for="item in group.items"
          :key="item.id"
          class="glass-panel mx-1 my-2 rounded-2xl p-3 transition-transform duration-200"
          :style="{ transform: `translateX(${swipeOffset[item.id] ?? 0}px)` }"
          @pointerdown="onPointerDown($event, item.id)"
          @pointermove="onPointerMove($event, item.id)"
          @pointerup="onPointerUp(item.id)"
          @pointercancel="onPointerUp(item.id)"
        >
          <header class="mb-1 flex items-center justify-between text-xs text-app-muted">
            <span>{{ formatDate(item.createdAt) }} · {{ item.context.timeOfDay }}</span>
            <button class="text-rose-500" @click="$emit('delete', item.id)">Delete</button>
          </header>
          <p class="text-sm text-app-secondary">{{ item.text }}</p>
          <footer class="mt-2 flex items-center gap-2 text-xs">
            <span class="rounded-lg bg-violet-100 px-2 py-1 text-violet-700 dark:bg-violet-900/70 dark:text-violet-200">{{ item.mood }}</span>
            <span v-for="tag in item.tags" :key="tag" class="text-app-muted">#{{ tag }}</span>
          </footer>
        </article>
      </section>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { DropEntry } from '../types/drop-entry';
import { groupEntriesByDate } from '../utils/date';

const props = withDefaults(defineProps<{ entries: DropEntry[]; compact?: boolean }>(), { compact: false });
const emit = defineEmits<{ delete: [id: string]; edit: [entry: DropEntry] }>();

const groupedEntries = computed(() => {
  const grouped = groupEntriesByDate(props.entries);
  return Object.keys(grouped)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => ({ date, items: grouped[date] }));
});

const swipeOffset = reactive<Record<string, number>>({});
const startX = reactive<Record<string, number>>({});

const onPointerDown = (event: PointerEvent, id: string) => {
  startX[id] = event.clientX;
};

const onPointerMove = (event: PointerEvent, id: string) => {
  if (startX[id] === undefined) return;
  swipeOffset[id] = Math.max(-80, Math.min(80, event.clientX - startX[id]));
};

const onPointerUp = (id: string) => {
  const offset = swipeOffset[id] ?? 0;
  if (offset < -60) emit('delete', id);
  if (offset > 60) {
    const entry = props.entries.find((item) => item.id === id);
    if (entry) emit('edit', entry);
  }
  swipeOffset[id] = 0;
  delete startX[id];
};

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const formatGroupDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
</script>
