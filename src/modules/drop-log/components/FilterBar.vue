<template>
  <section class="glass-panel space-y-2 rounded-2xl p-3">
    <input
      :value="search"
      @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
      placeholder="Search text or tags"
      class="w-full rounded-xl border border-slate-300/70 bg-white/60 p-2 text-sm text-app-secondary placeholder:text-app-muted dark:border-slate-700 dark:bg-slate-900/60"
    />
    <div class="grid grid-cols-2 gap-2">
      <input
        :value="mood"
        @input="$emit('update:mood', ($event.target as HTMLInputElement).value)"
        placeholder="Mood"
        class="rounded-xl border border-slate-300/70 bg-white/60 p-2 text-sm text-app-secondary placeholder:text-app-muted dark:border-slate-700 dark:bg-slate-900/60"
      />
      <input
        :value="tag"
        @input="$emit('update:tag', ($event.target as HTMLInputElement).value)"
        placeholder="Tag"
        class="rounded-xl border border-slate-300/70 bg-white/60 p-2 text-sm text-app-secondary placeholder:text-app-muted dark:border-slate-700 dark:bg-slate-900/60"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ search: string; mood: string; tag: string }>();
defineEmits<{
  'update:search': [value: string];
  'update:mood': [value: string];
  'update:tag': [value: string];
}>();
</script>
