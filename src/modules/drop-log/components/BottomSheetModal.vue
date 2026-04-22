<template>
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/50" @click.self="$emit('close')">
      <Transition name="sheet">
        <section
          v-if="open"
          class="safe-bottom absolute bottom-0 left-0 right-0 rounded-t-3xl bg-slate-900 p-4"
        >
          <slot />
        </section>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
