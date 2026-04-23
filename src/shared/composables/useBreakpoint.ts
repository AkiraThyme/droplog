import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const MOBILE_MAX = 639;
const TABLET_MAX = 1024;

export const useBreakpoint = () => {
  const width = ref<number>(typeof window === 'undefined' ? 1280 : window.innerWidth);

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

  const isMobile = computed(() => width.value <= MOBILE_MAX);
  const isTablet = computed(() => width.value >= 640 && width.value <= TABLET_MAX);
  const isDesktop = computed(() => width.value > TABLET_MAX);

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
  };
};
