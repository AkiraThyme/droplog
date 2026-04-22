import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const isDropModalOpen = ref(false);
  const isDarkMode = ref(true);

  const openDropModal = () => {
    isDropModalOpen.value = true;
  };

  const closeDropModal = () => {
    isDropModalOpen.value = false;
  };

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle('dark', isDarkMode.value);
  };

  return { isDropModalOpen, isDarkMode, openDropModal, closeDropModal, toggleTheme };
});
