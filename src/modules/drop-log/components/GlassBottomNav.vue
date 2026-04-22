<template>
  <nav class="glass-nav safe-bottom fixed inset-x-4 bottom-3 z-40 mx-auto flex max-w-md items-center justify-between rounded-2xl px-3 py-2">
    <button
      v-for="item in items"
      :key="item.key"
      class="rounded-xl px-3 py-2 text-xs font-semibold transition"
      :class="activeTab === item.key ? 'bg-white/65 text-slate-900' : 'text-slate-600 hover:text-slate-800'"
      @click="$emit('change', item.key)"
    >
      {{ item.label }}
    </button>

    <button
      class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-300/60 transition-transform active:scale-95"
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
