<template>
  <aside v-if="entry" class="glass-panel rounded-3xl p-4">
    <div class="mb-3 flex items-start justify-between gap-2">
      <div>
        <p class="text-xs text-app-muted">{{ formatDate(entry.createdAt) }}</p>
        <p class="mt-1 text-xl">{{ entry.mood }}</p>
      </div>
      <button class="text-xs text-app-muted" @click="$emit('close')">Close</button>
    </div>

    <p class="text-sm leading-relaxed text-app-secondary">{{ entry.text }}</p>

    <div class="mt-3 flex flex-wrap gap-2">
      <span v-for="tag in entry.tags" :key="tag" class="rounded-full border border-slate-300/70 px-2 py-0.5 text-xs dark:border-slate-700">#{{ tag }}</span>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2">
      <button class="rounded-xl border border-slate-300/80 px-3 py-2 text-sm dark:border-slate-700" @click="$emit('edit', entry)">Edit</button>
      <button class="rounded-xl border border-rose-300 px-3 py-2 text-sm text-rose-500" @click="$emit('delete', entry.id)">Delete</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { DropEntry } from '../types/drop-entry';

defineProps<{ entry?: DropEntry }>();
defineEmits<{ close: []; edit: [entry: DropEntry]; delete: [id: string] }>();

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
</script>
