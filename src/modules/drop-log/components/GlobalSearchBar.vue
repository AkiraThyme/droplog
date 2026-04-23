<template>
  <div class="relative">
    <div class="flex items-center gap-2 rounded-xl border border-slate-300/80 bg-white/80 px-3 dark:border-slate-700 dark:bg-slate-900/75">
      <span class="text-app-muted">🔎</span>
      <input
        ref="input"
        :value="modelValue"
        class="h-11 w-full bg-transparent text-sm text-app-secondary placeholder:text-app-muted focus:outline-none"
        placeholder="Search entries, tags, or mood"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <kbd class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] dark:bg-slate-700">/</kbd>
    </div>

    <div v-if="showResults && results.length" class="absolute z-20 mt-2 w-full rounded-xl border border-slate-300/80 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <button
        v-for="entry in results"
        :key="entry.id"
        class="mb-1 block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        @click="$emit('select', entry.id)"
      >
        <span class="mr-1">{{ entry.mood }}</span>
        <span class="line-clamp-1">{{ entry.text }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DropEntry } from '../types/drop-entry';

defineProps<{ modelValue: string; results: DropEntry[]; showResults: boolean }>();

defineEmits<{ 'update:modelValue': [value: string]; select: [id: string] }>();

const input = ref<HTMLInputElement | null>(null);
defineExpose({ input });

</script>
