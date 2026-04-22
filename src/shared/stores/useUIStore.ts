import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const THEME_KEY = 'droplog-theme';

type AppTheme = 'dark' | 'light';

export const useUIStore = defineStore('ui', () => {
  const isDropModalOpen = ref(false);
  const theme = ref<AppTheme>('dark');

  const isDarkMode = computed(() => theme.value === 'dark');

  const applyTheme = (nextTheme: AppTheme) => {
    theme.value = nextTheme;
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem(THEME_KEY, nextTheme);
  };

  const initTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  };

  const openDropModal = () => {
    isDropModalOpen.value = true;
  };

  const closeDropModal = () => {
    isDropModalOpen.value = false;
  };

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  return { isDropModalOpen, isDarkMode, theme, openDropModal, closeDropModal, toggleTheme, initTheme };
});
