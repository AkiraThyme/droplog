import { defineStore } from 'pinia';
import { ref } from 'vue';

type ThemeMode = 'light' | 'black';

export const useUIStore = defineStore('ui', () => {
  const isDropModalOpen = ref(false);
  const theme = ref<ThemeMode>('black');

  const applyTheme = (mode: ThemeMode) => {
    theme.value = mode;
    document.documentElement.classList.toggle('dark', mode === 'black');
    localStorage.setItem('droplog-theme', mode);
  };

  const initializeTheme = () => {
    const saved = localStorage.getItem('droplog-theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'black') {
      applyTheme(saved);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'black' : 'light');
  };

  const openDropModal = () => {
    isDropModalOpen.value = true;
  };

  const closeDropModal = () => {
    isDropModalOpen.value = false;
  };

  const toggleTheme = () => {
    applyTheme(theme.value === 'black' ? 'light' : 'black');
  };

  return { isDropModalOpen, theme, openDropModal, closeDropModal, toggleTheme, initializeTheme };
});
