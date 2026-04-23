export type TimeCapsuleFilter = 'all' | 'on-this-day' | 'last-week' | 'last-month';

const DAY_MS = 24 * 60 * 60 * 1000;

export const toIsoDate = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
};

export const formatDateKey = (timestamp: number) => toIsoDate(new Date(timestamp));

export const startOfDay = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const getRangeForFilter = (filter: TimeCapsuleFilter, now = Date.now()) => {
  if (filter === 'all') return { from: undefined, to: undefined };

  const current = new Date(now);
  const startToday = startOfDay(now);

  if (filter === 'on-this-day') {
    const month = current.getMonth();
    const day = current.getDate();
    const yearStart = new Date(current.getFullYear() - 4, 0, 1).getTime();
    return { from: yearStart, to: now, month, day };
  }

  if (filter === 'last-week') {
    return { from: startToday - 7 * DAY_MS, to: now };
  }

  return { from: startToday - 30 * DAY_MS, to: now };
};

export const isOnSameMonthDay = (timestamp: number, month: number, day: number) => {
  const date = new Date(timestamp);
  return date.getMonth() === month && date.getDate() === day;
};

export const groupEntriesByDate = <T extends { createdAt: number }>(entries: T[]) => {
  return entries.reduce<Record<string, T[]>>((acc, entry) => {
    const key = formatDateKey(entry.createdAt);
    acc[key] = acc[key] ? [...acc[key], entry] : [entry];
    return acc;
  }, {});
};

export const getHourBucket = (timestamp: number): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date(timestamp).getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
};
