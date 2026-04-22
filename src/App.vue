<template>
  <LandingPage v-if="!hasEntered" @start="hasEntered = true" />
  <DropLogScreen v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DropLogScreen from './modules/drop-log/components/DropLogScreen.vue';
import LandingPage from './modules/drop-log/components/LandingPage.vue';

const hasEntered = ref(false);
</script>
