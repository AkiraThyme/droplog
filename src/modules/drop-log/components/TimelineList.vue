<template>
  <RecycleScroller
    class="h-[52vh]"
    :items="entries"
    :item-size="88"
    key-field="id"
    v-slot="{ item }"
  >
    <article class="mx-3 my-2 rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
      <header class="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>{{ formatDate(item.createdAt) }} · {{ item.context.timeOfDay }}</span>
        <button class="text-rose-300" @click="$emit('delete', item.id)">Delete</button>
      </header>
      <p class="text-sm">{{ item.text }}</p>
      <footer class="mt-2 flex items-center gap-2 text-xs">
        <span class="rounded bg-slate-800 px-2 py-1">{{ item.mood }}</span>
        <span v-for="tag in item.tags" :key="tag" class="text-slate-400">#{{ tag }}</span>
      </footer>
    </article>
  </RecycleScroller>
</template>

<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import type { DropEntry } from '../types/drop-entry';

defineProps<{ entries: DropEntry[] }>();
defineEmits<{ delete: [id: string] }>();

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
</script>
