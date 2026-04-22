<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <h2 class="text-lg font-semibold">Quick Drop</h2>
    <div class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="item in moods"
        :key="item"
        type="button"
        class="chip-button"
        :class="model.mood === item ? 'bg-slate-700 text-white' : 'text-slate-300'"
        @click="model.mood = item"
      >
        {{ item }}
      </button>
    </div>

    <textarea
      ref="input"
      v-model="model.text"
      required
      maxlength="220"
      rows="3"
      placeholder="What's happening right now?"
      class="input-control resize-none"
    />

    <input
      v-model="tagsInput"
      placeholder="tags separated by comma"
      class="input-control"
    />

    <button class="primary-button">Save Drop</button>
  </form>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';

const emit = defineEmits<{
  save: [payload: { text: string; mood: string; tags: string[] }];
}>();

const props = defineProps<{ open: boolean }>();
const input = ref<HTMLTextAreaElement | null>(null);
const tagsInput = ref('');
const moods = ['😄', '🙂', '😐', '😔', '😡'];

const model = reactive({
  text: '',
  mood: moods[1],
});

watch(
  () => props.open,
  async (open) => {
    if (open) {
      await nextTick();
      input.value?.focus();
    }
  },
);

const onSubmit = () => {
  emit('save', {
    text: model.text,
    mood: model.mood,
    tags: tagsInput.value.split(',').map((tag) => tag.trim()),
  });
  model.text = '';
  tagsInput.value = '';
};
</script>
