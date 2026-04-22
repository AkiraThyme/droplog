<template>
  <section class="surface-card space-y-2 p-3">
    <input
      :value="search"
      @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
      placeholder="Search text or tags"
      class="input-control"
    />
    <div class="grid grid-cols-2 gap-2">
      <input
        :value="mood"
        @input="$emit('update:mood', ($event.target as HTMLInputElement).value)"
        placeholder="Mood"
        class="input-control"
      />
      <input
        :value="tag"
        @input="$emit('update:tag', ($event.target as HTMLInputElement).value)"
        placeholder="Tag"
        class="input-control"
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
