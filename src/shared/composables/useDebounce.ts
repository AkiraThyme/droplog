import { ref, watch, type Ref } from 'vue';

export const useDebounce = <T>(source: Ref<T>, delay = 250) => {
  const debounced = ref(source.value) as Ref<T>;
  let timeout: number | undefined;

  watch(source, (value) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      debounced.value = value;
    }, delay);
  });

  return debounced;
};
