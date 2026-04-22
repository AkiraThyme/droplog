<template>
  <button
    class="fixed bottom-24 right-5 z-30 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/40 transition-transform active:scale-95"
    @click="$emit('click')"
    aria-label="Create quick drop"
  >
    + Drop
  </button>
</template>
