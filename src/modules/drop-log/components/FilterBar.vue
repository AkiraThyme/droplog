<template>
  <section class="space-y-2 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-md shadow-indigo-100/60 backdrop-blur">
    <input
      :value="search"
      @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
      placeholder="Search text or tags"
      class="w-full rounded-xl border border-slate-200 bg-white/80 p-2 text-sm text-slate-700 outline-none ring-indigo-200 placeholder:text-slate-400 focus:ring"
    />
    <div class="grid grid-cols-2 gap-2">
      <input
        :value="mood"
        @input="$emit('update:mood', ($event.target as HTMLInputElement).value)"
        placeholder="Mood"
        class="rounded-xl border border-slate-200 bg-white/80 p-2 text-sm text-slate-700 outline-none ring-indigo-200 placeholder:text-slate-400 focus:ring"
      />
      <input
        :value="tag"
        @input="$emit('update:tag', ($event.target as HTMLInputElement).value)"
        placeholder="Tag"
        class="rounded-xl border border-slate-200 bg-white/80 p-2 text-sm text-slate-700 outline-none ring-indigo-200 placeholder:text-slate-400 focus:ring"
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
