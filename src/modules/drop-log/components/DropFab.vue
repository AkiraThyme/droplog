<template>
  <button
    class="fixed bottom-6 right-5 z-30 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold shadow-lg transition-transform active:scale-95"
    @click="$emit('click')"
    aria-label="Create quick drop"
  >
    + Drop
  </button>
</template>
