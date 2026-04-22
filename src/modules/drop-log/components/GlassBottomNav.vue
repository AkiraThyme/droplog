<template>
  <nav class="safe-bottom fixed inset-x-4 bottom-3 z-40 mx-auto flex w-auto max-w-md items-center justify-between rounded-2xl border border-white/50 bg-white/55 p-2 shadow-xl shadow-indigo-200/40 backdrop-blur-xl">
    <button
      v-for="item in items"
      :key="item.id"
      class="flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition"
      :class="item.id === modelValue ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-white/60'"
      @click="$emit('update:modelValue', item.id)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
export type NavTab = 'feed' | 'calendar' | 'insights';

defineProps<{ modelValue: NavTab }>();
defineEmits<{ 'update:modelValue': [value: NavTab] }>();

const items: Array<{ id: NavTab; label: string }> = [
  { id: 'feed', label: 'Feed' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'insights', label: 'Insights' },
];
</script>
