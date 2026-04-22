<template>
  <section class="space-y-2 rounded-2xl border border-slate-800 bg-slate-900 p-3">
    <input
      :value="search"
      @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
      placeholder="Search text or tags"
      class="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-sm"
    />
    <div class="grid grid-cols-2 gap-2">
      <input
        :value="mood"
        @input="$emit('update:mood', ($event.target as HTMLInputElement).value)"
        placeholder="Mood"
        class="rounded-lg border border-slate-700 bg-slate-800 p-2 text-sm"
      />
      <input
        :value="tag"
        @input="$emit('update:tag', ($event.target as HTMLInputElement).value)"
        placeholder="Tag"
        class="rounded-lg border border-slate-700 bg-slate-800 p-2 text-sm"
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
