import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useDropStore } from './useDropStore';

export const useInsightStore = defineStore('insight', () => {
  const dropStore = useDropStore();

  const entriesPerDay = computed(() => {
    return dropStore.entries.reduce<Record<string, number>>((acc, entry) => {
      const date = new Date(entry.createdAt).toLocaleDateString();
      acc[date] = (acc[date] ?? 0) + 1;
      return acc;
    }, {});
  });

  const moodFrequency = computed(() => {
    return dropStore.entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] ?? 0) + 1;
      return acc;
    }, {});
  });

  const topMood = computed(() => {
    return Object.entries(moodFrequency.value).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  });

  return { entriesPerDay, moodFrequency, topMood };
});
