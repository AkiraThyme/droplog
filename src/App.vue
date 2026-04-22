<template>
  <LandingPage v-if="!entered" @start="enterApp" />
  <DropLogScreen v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DropLogScreen from './modules/drop-log/components/DropLogScreen.vue';
import LandingPage from './modules/drop-log/components/LandingPage.vue';

const entered = ref(localStorage.getItem('droplog-entered') === 'true');

const enterApp = () => {
  entered.value = true;
  localStorage.setItem('droplog-entered', 'true');
};
</script>
