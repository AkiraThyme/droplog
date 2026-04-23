<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <h2 class="text-lg font-semibold">Quick Drop</h2>
    <div class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="item in moods"
        :key="item"
        type="button"
        class="rounded-full border border-slate-700 px-3 py-1 text-sm"
        :class="model.mood === item ? 'bg-slate-700' : ''"
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
      class="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
    />

    <div v-if="suggestedTags.length" class="flex flex-wrap gap-2">
      <button
        v-for="tag in suggestedTags"
        :key="tag"
        type="button"
        class="rounded-full border border-violet-400/80 bg-violet-200/20 px-2 py-0.5 text-xs"
        @click="appendTag(tag)"
      >
        + {{ tag }}
      </button>
    </div>

    <input
      v-model="tagsInput"
      placeholder="tags separated by comma"
      class="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
    />

    <button class="w-full rounded-xl bg-brand-500 py-3 font-semibold active:scale-[0.99]">Save Drop</button>
  </form>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useAutoTags } from '../composables/useAutoTags';

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

const { suggestedTags } = useAutoTags(computed(() => model.text));

watch(
  () => props.open,
  async (open) => {
    if (open) {
      await nextTick();
      input.value?.focus();
    }
  },
);

const appendTag = (tag: string) => {
  const tags = tagsInput.value
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (!tags.includes(tag)) {
    tags.push(tag);
    tagsInput.value = tags.join(', ');
  }
};

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
