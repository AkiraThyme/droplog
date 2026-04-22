import { computed, ref } from 'vue';
import { useDebounce } from '@/shared/composables/useDebounce';

export const useFilters = () => {
  const selectedMood = ref('');
  const selectedTag = ref('');
  const search = ref('');
  const from = ref<number | undefined>();
  const to = ref<number | undefined>();

  const debouncedSearch = useDebounce(search, 200);

  const activeFilter = computed(() => ({
    mood: selectedMood.value || undefined,
    tag: selectedTag.value || undefined,
    search: debouncedSearch.value || undefined,
    from: from.value,
    to: to.value,
  }));

  return { selectedMood, selectedTag, search, from, to, activeFilter };
};
