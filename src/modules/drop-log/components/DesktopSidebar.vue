<template>
  <aside class="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] flex-col rounded-3xl p-4 lg:flex">
    <div class="mb-6 flex items-center gap-3">
      <img src="/icons/logo.png" alt="DropLog logo" class="h-10 w-10 rounded-2xl object-cover shadow-md" />
      <div>
        <p class="text-xs uppercase tracking-[0.16em] text-app-muted">Daily check-ins</p>
        <h1 class="text-2xl font-extrabold tracking-tight text-app-primary">DropLog</h1>
      </div>
    </div>

    <nav class="space-y-2">
      <button
        v-for="item in navItems"
        :key="item.key"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition"
        :class="activeTab === item.key ? 'bg-violet-500 text-white shadow-md shadow-violet-400/30' : 'text-app-secondary hover:bg-white/50 dark:hover:bg-slate-800/70'"
        @click="$emit('change', item.key)"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="mt-auto space-y-3">
      <button class="touch-target w-full rounded-xl border border-slate-300/80 px-4 py-2 text-xs font-semibold text-app-secondary dark:border-slate-700" @click="$emit('toggle-theme')">
        {{ themeLabel }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const navItems = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'timeline', label: 'Timeline', icon: '🕒' },
  { key: 'insights', label: 'Insights', icon: '📈' },
  { key: 'more', label: 'More', icon: '⚙️' },
] as const;

defineProps<{ activeTab: 'home' | 'timeline' | 'insights' | 'more'; themeLabel: string }>();
defineEmits<{ change: [tab: 'home' | 'timeline' | 'insights' | 'more']; 'toggle-theme': [] }>();
</script>
