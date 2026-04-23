import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDropStore } from '../store/useDropStore';
import { formatDateKey, getHourBucket, toIsoDate } from '../utils/date';

type InsightCard = {
  id: 'top-mood' | 'active-day' | 'best-time' | 'streak';
  icon: string;
  title: string;
  value: string;
  description: string;
  support: string;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_LABELS: Array<'morning' | 'afternoon' | 'evening' | 'night'> = ['morning', 'afternoon', 'evening', 'night'];

const getTopEntry = (record: Record<string, number>) =>
  Object.entries(record).sort((a, b) => b[1] - a[1])[0];

const formatPercent = (value: number, total: number) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

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
      const day = DAY_LABELS[new Date(entry.createdAt).getDay()];
      acc[day] = (acc[day] ?? 0) + 1;
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
      const key = formatDateKey(entry.createdAt);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  );

  const topMood = computed(() => getTopEntry(moodFrequency.value)?.[0] ?? '—');

  const consistencyStreak = computed(() => {
    if (!entries.value.length) return 0;
    const activeDaySet = new Set(entries.value.map((entry) => formatDateKey(entry.createdAt)));
    let cursor = new Date();
    let streak = 0;

    while (activeDaySet.has(toIsoDate(cursor))) {
      streak += 1;
      cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
    }

    return streak;
  });

  const weeklyActivitySeries = computed(() => {
    const ordered = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = formatDateKey(date.getTime());
      return {
        key,
        label: DAY_LABELS[date.getDay()],
        count: entriesPerDay.value[key] ?? 0,
      };
    });

    const max = Math.max(...ordered.map((item) => item.count), 1);
    return ordered.map((item) => ({ ...item, height: Math.max(8, Math.round((item.count / max) * 100)) }));
  });

  const moodTrendSeries = computed(() => {
    const orderedDates = Object.keys(entriesPerDay.value).sort((a, b) => (a > b ? 1 : -1)).slice(-7);
    const fallback = weeklyActivitySeries.value.map((item) => ({
      label: item.label,
      count: item.count,
    }));
    const base = orderedDates.length
      ? orderedDates.map((date) => ({
          label: new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' }),
          count: entriesPerDay.value[date] ?? 0,
        }))
      : fallback;

    const max = Math.max(...base.map((item) => item.count), 1);
    return base.map((item, index) => ({
      ...item,
      x: base.length === 1 ? 0 : (index / (base.length - 1)) * 100,
      y: 100 - Math.round((item.count / max) * 100),
    }));
  });

  const insightCards = computed<InsightCard[]>(() => {
    const total = entries.value.length;
    const [mood, moodCount = 0] = getTopEntry(moodFrequency.value) ?? ['—', 0];
    const [topDay, topDayCount = 0] = getTopEntry(dayOfWeekFrequency.value) ?? ['—', 0];
    const [topTime, topTimeCount = 0] = getTopEntry(timeOfDayFrequency.value) ?? ['—', 0];

    return [
      {
        id: 'top-mood',
        icon: mood,
        title: 'Top mood',
        value: mood,
        description: total
          ? `Your most logged mood is ${mood} (${formatPercent(moodCount, total)}% of logs).`
          : 'Log a few entries to surface your dominant mood pattern.',
        support: `${moodCount} of ${total || 0} logs`,
      },
      {
        id: 'active-day',
        icon: '📆',
        title: 'Most active day',
        value: topDay,
        description: total
          ? `You log the most on ${topDay}s (${formatPercent(topDayCount, total)}% of your entries).`
          : 'We will identify your strongest day once your timeline grows.',
        support: `${topDayCount} entries`,
      },
      {
        id: 'best-time',
        icon: '⏰',
        title: 'Best time of day',
        value: topTime === '—' ? '—' : topTime[0].toUpperCase() + topTime.slice(1),
        description: total
          ? `You're most active in the ${topTime} (${formatPercent(topTimeCount, total)}% of your logs).`
          : 'Morning, afternoon, evening, and night trends appear here.',
        support: `${TIME_LABELS.reduce((sum, label) => sum + (timeOfDayFrequency.value[label] ?? 0), 0)} time-tagged logs`,
      },
      {
        id: 'streak',
        icon: '🔥',
        title: 'Consistency streak',
        value: `${consistencyStreak.value} day${consistencyStreak.value === 1 ? '' : 's'}`,
        description:
          consistencyStreak.value > 0
            ? 'You checked in today and kept momentum going.'
            : 'Drop one entry today to start a fresh streak.',
        support: `${Object.keys(entriesPerDay.value).length} active days total`,
      },
    ];
  });

  return {
    entries,
    entriesPerDay,
    moodFrequency,
    dayOfWeekFrequency,
    timeOfDayFrequency,
    topMood,
    consistencyStreak,
    weeklyActivitySeries,
    moodTrendSeries,
    insightCards,
  };
};
