import type { TimeOfDay } from '../types/drop-entry';

export const getTimeOfDay = (timestamp: number): TimeOfDay => {
  const hour = new Date(timestamp).getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
};

export const getDayOfWeek = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString(undefined, { weekday: 'long' });
