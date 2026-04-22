<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="open" class="fixed inset-0 z-40 bg-black/60" @click.self="$emit('close')">
      <Transition
        enter-active-class="transition-transform duration-250 ease-out"
        leave-active-class="transition-transform duration-200 ease-in"
        enter-from-class="translate-y-full"
        leave-to-class="translate-y-full"
      >
        <section
          v-if="open"
          class="safe-bottom surface-card absolute bottom-0 left-0 right-0 rounded-b-none p-4"
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
