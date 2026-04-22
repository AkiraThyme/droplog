import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DropCreateInput, DropEntry, DropFilter } from '../types/drop-entry';
import { dropRepository } from '../services/drop-repository';

export const useDropStore = defineStore('drop', () => {
  const entries = ref<DropEntry[]>([]);
  const isReady = ref(false);
  const error = ref<string | null>(null);

  const loadEntries = async () => {
    try {
      entries.value = await dropRepository.getAllEntries();
      isReady.value = true;
    } catch {
      error.value = 'Could not access local database.';
    }
  };

  const addEntry = async (input: DropCreateInput) => {
    const optimistic: DropEntry = {
      id: crypto.randomUUID(),
      text: input.text,
      mood: input.mood,
      tags: input.tags,
      createdAt: Date.now(),
      context: { timeOfDay: 'morning', dayOfWeek: 'Pending' },
    };

    entries.value = [optimistic, ...entries.value];

    try {
      const saved = await dropRepository.createEntry(input);
      entries.value = [saved, ...entries.value.filter((entry) => entry.id !== optimistic.id)];
      return saved;
    } catch (e) {
      entries.value = entries.value.filter((entry) => entry.id !== optimistic.id);
      error.value = e instanceof Error ? e.message : 'Failed to create entry';
      return null;
    }
  };

  const removeEntry = async (id: string) => {
    const prev = entries.value;
    entries.value = prev.filter((entry) => entry.id !== id);
    try {
      await dropRepository.deleteEntry(id);
    } catch {
      entries.value = prev;
      error.value = 'Failed to delete entry';
    }
  };

  const updateEntry = async (id: string, patch: Partial<DropEntry>) => {
    const index = entries.value.findIndex((entry) => entry.id === id);
    if (index < 0) return;

    const prev = entries.value[index];
    entries.value[index] = { ...prev, ...patch, updatedAt: Date.now() };
    try {
      await dropRepository.updateEntry(id, patch);
    } catch {
      entries.value[index] = prev;
      error.value = 'Failed to update entry';
    }
  };

  const filterEntries = async (filter: DropFilter) => {
    try {
      entries.value = await dropRepository.filterEntries(filter);
    } catch {
      error.value = 'Failed to filter entries';
    }
  };

  return {
    entries,
    error,
    isReady,
    loadEntries,
    addEntry,
    removeEntry,
    updateEntry,
    filterEntries,
  };
});
