<template>
  <LandingPage v-if="!entered" @start="enterApp" />
  <DropLogScreen v-else />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DropLogScreen from './modules/drop-log/components/DropLogScreen.vue';
import LandingPage from './modules/drop-log/components/LandingPage.vue';
import { useUIStore } from './shared/stores/useUIStore';

const ui = useUIStore();
const entered = ref(localStorage.getItem('droplog-entered') === 'true');

onMounted(() => {
  ui.initTheme();
});

const enterApp = () => {
  entered.value = true;
  localStorage.setItem('droplog-entered', 'true');
};
</script>
