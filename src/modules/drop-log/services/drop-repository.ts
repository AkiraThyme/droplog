import { db } from './db';
import type { DropCreateInput, DropEntry, DropFilter } from '../types/drop-entry';
import { getDayOfWeek, getTimeOfDay } from '../utils/context';

export interface DropRepository {
  createEntry(input: DropCreateInput): Promise<DropEntry>;
  getAllEntries(): Promise<DropEntry[]>;
  filterEntries(filter: DropFilter): Promise<DropEntry[]>;
  deleteEntry(id: string): Promise<void>;
  updateEntry(id: string, patch: Partial<DropEntry>): Promise<DropEntry | null>;
}

const validateDrop = (input: DropCreateInput) => {
  if (!input.text.trim()) throw new Error('Drop text is required');
  if (!input.mood.trim()) throw new Error('Mood is required');
};

const filterLocal = (entries: DropEntry[], filter: DropFilter): DropEntry[] => {
  return entries.filter((entry) => {
    if (filter.mood && entry.mood !== filter.mood) return false;
    if (filter.tag && !entry.tags.includes(filter.tag)) return false;
    if (filter.from && entry.createdAt < filter.from) return false;
    if (filter.to && entry.createdAt > filter.to) return false;
    if (filter.search) {
      const search = filter.search.toLowerCase();
      const inText = entry.text.toLowerCase().includes(search);
      const inTags = entry.tags.some((tag) => tag.toLowerCase().includes(search));
      if (!inText && !inTags) return false;
    }
    return true;
  });
};

export const dropRepository: DropRepository = {
  async createEntry(input) {
    validateDrop(input);
    const timestamp = Date.now();
    const entry: DropEntry = {
      id: crypto.randomUUID(),
      text: input.text.trim(),
      mood: input.mood.trim(),
      tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
      createdAt: timestamp,
      context: {
        timeOfDay: getTimeOfDay(timestamp),
        dayOfWeek: getDayOfWeek(timestamp),
      },
    };

    await db.entries.add(entry);
    return entry;
  },

  async getAllEntries() {
    return db.entries.orderBy('createdAt').reverse().toArray();
  },

  async filterEntries(filter) {
    const entries = await db.entries.toArray();
    return filterLocal(entries, filter).sort((a, b) => b.createdAt - a.createdAt);
  },

  async deleteEntry(id) {
    await db.entries.delete(id);
  },

  async updateEntry(id, patch) {
    const existing = await db.entries.get(id);
    if (!existing) return null;

    const updated: DropEntry = {
      ...existing,
      ...patch,
      updatedAt: Date.now(),
    };

    await db.entries.put(updated);
    return updated;
  },
};
