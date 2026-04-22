<template>
  <RecycleScroller class="h-[48vh]" :items="entries" :item-size="98" key-field="id" v-slot="{ item }">
    <article class="mx-1 my-2 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-md shadow-indigo-100/60 backdrop-blur">
      <header class="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>{{ formatDate(item.createdAt) }} · {{ item.context.timeOfDay }}</span>
        <button class="font-medium text-rose-500" @click="$emit('delete', item.id)">Delete</button>
      </header>
      <p class="text-sm text-slate-800">{{ item.text }}</p>
      <footer class="mt-2 flex items-center gap-2 text-xs">
        <span class="rounded-lg bg-indigo-100 px-2 py-1 text-indigo-700">{{ item.mood }}</span>
        <span v-for="tag in item.tags" :key="tag" class="text-slate-500">#{{ tag }}</span>
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
