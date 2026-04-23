<template>
  <aside class="glass-panel rounded-3xl p-4">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-app-primary">Filters</h3>
      <button class="text-xs text-app-muted" @click="$emit('clear')">Clear all</button>
    </div>

    <div class="space-y-4">
      <div>
        <label class="text-xs font-semibold uppercase tracking-wide text-app-muted">Search</label>
        <input
          :value="search"
          class="mt-2 h-10 w-full rounded-xl border border-slate-300/75 bg-white/70 px-3 text-sm text-app-secondary dark:border-slate-700 dark:bg-slate-900/70"
          placeholder="Search text or #tags"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-app-muted">Mood</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <button class="chip-button" :class="mood ? 'chip-inactive' : 'chip-active'" @click="$emit('update:mood', '')">All</button>
          <button v-for="option in moodOptions" :key="option" class="chip-button" :class="mood === option ? 'chip-active' : 'chip-inactive'" @click="$emit('update:mood', option)">
            {{ option }}
          </button>
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-app-muted">Tags</p>
        <div class="mt-2 flex max-h-28 flex-wrap gap-2 overflow-auto pr-1">
          <button class="chip-button" :class="tag ? 'chip-inactive' : 'chip-active'" @click="$emit('update:tag', '')">All tags</button>
          <button v-for="option in tagOptions" :key="option" class="chip-button" :class="tag === option ? 'chip-active' : 'chip-inactive'" @click="$emit('update:tag', option)">
            #{{ option }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button v-for="option in quickFilters" :key="option.value" class="rounded-lg border px-2 py-2 text-xs font-semibold" :class="quickRange === option.value ? 'border-violet-500 bg-violet-500 text-white' : 'border-slate-300/80 text-app-secondary dark:border-slate-700'" @click="$emit('update:quick-range', option.value)">
          {{ option.label }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const quickFilters = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'All time', value: 'all' },
] as const;

defineProps<{
  search: string;
  mood: string;
  tag: string;
  moodOptions: string[];
  tagOptions: string[];
  quickRange: 'today' | 'week' | 'month' | 'all';
}>();

defineEmits<{
  'update:search': [value: string];
  'update:mood': [value: string];
  'update:tag': [value: string];
  'update:quick-range': [value: 'today' | 'week' | 'month' | 'all'];
  clear: [];
}>();
</script>
