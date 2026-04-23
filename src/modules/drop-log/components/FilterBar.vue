<template>
  <section class="glass-panel space-y-4 rounded-2xl p-4">
    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-app-muted">Search</p>
      <div class="mt-2 flex items-center gap-2 rounded-xl border border-slate-300/75 bg-white/70 px-3 dark:border-slate-700 dark:bg-slate-900/70">
        <span class="text-app-muted">🔎</span>
        <input
          :value="search"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
          placeholder="Search notes or tags"
          class="h-11 w-full bg-transparent text-sm text-app-secondary placeholder:text-app-muted focus:outline-none"
        />
      </div>
    </div>

    <div>
      <div class="mb-2 flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-wide text-app-muted">Time filters</p>
        <span class="rounded-full bg-violet-500/15 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:text-violet-200">
          {{ activeSummary }}
        </span>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="option in quickFilters"
          :key="option.value"
          class="chip-button"
          :class="quickRange === option.value ? 'chip-active' : 'chip-inactive'"
          @click="$emit('update:quick-range', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-app-muted">Mood</p>
      <div class="mt-2 flex gap-2 overflow-x-auto pb-1">
        <button class="chip-button" :class="mood === '' ? 'chip-active' : 'chip-inactive'" @click="$emit('update:mood', '')">All</button>
        <button
          v-for="option in moodOptions"
          :key="option"
          class="chip-button"
          :class="mood === option ? 'chip-active' : 'chip-inactive'"
          @click="$emit('update:mood', option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-app-muted">Tags</p>
      <div class="mt-2 flex gap-2 overflow-x-auto pb-1">
        <button class="chip-button" :class="tag === '' ? 'chip-active' : 'chip-inactive'" @click="$emit('update:tag', '')">All tags</button>
        <button
          v-for="option in tagOptions"
          :key="option"
          class="chip-button"
          :class="tag === option ? 'chip-active' : 'chip-inactive'"
          @click="$emit('update:tag', option)"
        >
          #{{ option }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const quickFilters = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'All time', value: 'all' },
] as const;

const props = defineProps<{
  search: string;
  mood: string;
  tag: string;
  moodOptions: string[];
  tagOptions: string[];
  quickRange: 'today' | 'week' | 'month' | 'all';
  activeCount: number;
}>();

defineEmits<{
  'update:search': [value: string];
  'update:mood': [value: string];
  'update:tag': [value: string];
  'update:quick-range': [value: 'today' | 'week' | 'month' | 'all'];
}>();

const activeSummary = computed(() => (props.activeCount ? `${props.activeCount} filters applied` : 'No filters applied'));
</script>
