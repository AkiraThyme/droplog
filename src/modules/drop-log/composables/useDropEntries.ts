import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDropStore } from '../store/useDropStore';
import { useFilters } from './useFilters';

export const useDropEntries = () => {
  const dropStore = useDropStore();
  const filters = useFilters();
  const { entries, isReady, error } = storeToRefs(dropStore);

  onMounted(async () => {
    await dropStore.loadEntries();
  });

  watch(filters.activeFilter, async (filter) => {
    await dropStore.filterEntries(filter);
  });

  return {
    entries,
    isReady,
    error,
    ...filters,
    addEntry: dropStore.addEntry,
    removeEntry: dropStore.removeEntry,
    updateEntry: dropStore.updateEntry,
    reload: dropStore.loadEntries,
  };
};
