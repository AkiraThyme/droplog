<template>
  <nav class="glass-nav safe-bottom fixed inset-x-4 bottom-3 z-40 mx-auto flex max-w-md items-center justify-between rounded-2xl px-3 py-2">
    <button
      v-for="item in items"
      :key="item.key"
      class="rounded-xl px-3 py-2 text-xs font-semibold transition"
      :class="activeTab === item.key ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-200 dark:text-slate-950' : 'text-app-muted hover:text-app-secondary'"
      @click="$emit('change', item.key)"
    >
      {{ item.label }}
    </button>

    <button
      class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-300/60 transition-transform active:scale-95 dark:bg-violet-500 dark:shadow-violet-900/50"
      @click="$emit('add')"
    >
      + Drop
    </button>
  </nav>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    activeTab: 'home' | 'calendar' | 'insights' | 'more';
  }>(),
  { activeTab: 'home' },
);

defineEmits<{
  change: [tab: 'home' | 'calendar' | 'insights' | 'more'];
  add: [];
}>();

const items: { key: 'home' | 'calendar' | 'insights' | 'more'; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'calendar', label: 'Timeline' },
  { key: 'insights', label: 'Insights' },
  { key: 'more', label: 'More' },
];
</script>
