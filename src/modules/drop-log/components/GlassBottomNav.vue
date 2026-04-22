<template>
  <nav class="glass-nav safe-bottom fixed inset-x-4 bottom-3 z-40 mx-auto flex max-w-md items-center justify-between rounded-2xl px-3 py-2">
    <button
      v-for="item in items"
      :key="item.key"
      class="rounded-xl px-3 py-2 text-xs font-semibold transition"
      :class="activeTab === item.key ? 'bg-white/95 text-slate-900 shadow-sm dark:bg-slate-200/90' : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'"
      @click="$emit('change', item.key)"
    >
      {{ item.label }}
    </button>

    <button
      class="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/50 transition-transform active:scale-95 dark:bg-white dark:text-slate-950"
      @click="$emit('add')"
    >
      + Drop
    </button>
  </nav>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    activeTab: 'home' | 'calendar' | 'insights';
  }>(),
  { activeTab: 'home' },
);

defineEmits<{
  change: [tab: 'home' | 'calendar' | 'insights'];
  add: [];
}>();

const items: { key: 'home' | 'calendar' | 'insights'; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'insights', label: 'Insights' },
];
</script>
