import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDropStore } from '../store/useDropStore';
import { getHourBucket } from '../utils/date';

const getTopKey = (record: Record<string, number>) =>
  Object.entries(record).sort((a, b) => b[1] - a[1])[0]?.[0];

export const useInsights = () => {
  const dropStore = useDropStore();
  const { entries } = storeToRefs(dropStore);

  const moodFrequency = computed(() =>
    entries.value.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] ?? 0) + 1;
      return acc;
    }, {}),
  );

  const dayOfWeekFrequency = computed(() =>
    entries.value.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.context.dayOfWeek] = (acc[entry.context.dayOfWeek] ?? 0) + 1;
      return acc;
    }, {}),
  );

  const timeOfDayFrequency = computed(() =>
    entries.value.reduce<Record<string, number>>((acc, entry) => {
      const bucket = getHourBucket(entry.createdAt);
      acc[bucket] = (acc[bucket] ?? 0) + 1;
      return acc;
    }, {}),
  );

  const entriesPerDay = computed(() =>
    entries.value.reduce<Record<string, number>>((acc, entry) => {
      const date = new Date(entry.createdAt).toLocaleDateString();
      acc[date] = (acc[date] ?? 0) + 1;
      return acc;
    }, {}),
  );

  const topMood = computed(() => getTopKey(moodFrequency.value) ?? '—');

  const smartInsights = computed(() => {
    const insights: string[] = [];
    const topTime = getTopKey(timeOfDayFrequency.value);
    const topDay = getTopKey(dayOfWeekFrequency.value);
    const topMoodValue = topMood.value;

    if (topTime) insights.push(`You feel most productive at ${topTime}.`);
    if (topDay && topMoodValue) insights.push(`You log ${topMoodValue} mostly on ${topDay}s.`);
    if (topMoodValue) insights.push(`Your dominant mood is ${topMoodValue}.`);

    return insights;
  });

  return {
    entries,
    entriesPerDay,
    moodFrequency,
    dayOfWeekFrequency,
    timeOfDayFrequency,
    topMood,
    smartInsights,
  };
};
