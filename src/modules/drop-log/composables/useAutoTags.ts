import { computed, type MaybeRefOrGetter, toValue } from 'vue';

const TAG_RULES: Record<string, string> = {
  meeting: 'work',
  project: 'work',
  deploy: 'work',
  gym: 'health',
  workout: 'health',
  run: 'health',
  meditate: 'mindfulness',
  family: 'relationships',
  friend: 'relationships',
  sleep: 'recovery',
};

export const useAutoTags = (inputText: MaybeRefOrGetter<string>) => {
  const suggestedTags = computed(() => {
    const text = toValue(inputText).toLowerCase();
    if (!text.trim()) return [];

    return Object.entries(TAG_RULES)
      .filter(([keyword]) => text.includes(keyword))
      .map(([, tag]) => tag)
      .filter((tag, index, list) => list.indexOf(tag) === index);
  });

  return { suggestedTags };
};
