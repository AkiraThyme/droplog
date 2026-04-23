import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const MD_MIN = 768;
const LG_MIN = 1024;

export const useBreakpoint = () => {
  const width = ref<number>(typeof window === 'undefined' ? LG_MIN : window.innerWidth);

  const updateWidth = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWidth);
  });

  const isMobile = computed(() => width.value < MD_MIN);
  const isTablet = computed(() => width.value >= MD_MIN && width.value < LG_MIN);
  const isDesktop = computed(() => width.value >= LG_MIN);

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
  };
};
