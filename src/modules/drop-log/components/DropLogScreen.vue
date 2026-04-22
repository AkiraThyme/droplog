<template>
  <main class="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 p-3 pb-24">
    <header class="surface-card sticky top-2 z-20 flex items-center justify-between p-3">
      <h1 class="text-2xl font-bold">DropLog</h1>
      <button class="chip-button" @click="ui.toggleTheme()">Theme</button>
    </header>

    <InsightsPanel :topMood="topMood" :entriesPerDay="entriesPerDay" />

    <FilterBar
      :search="search"
      :mood="selectedMood"
      :tag="selectedTag"
      @update:search="search = $event"
      @update:mood="selectedMood = $event"
      @update:tag="selectedTag = $event"
    />

    <p v-if="error" class="surface-card border-rose-800 bg-rose-950/40 p-2 text-sm">{{ error }}</p>

    <TransitionGroup
      name="entry-fade"
      tag="div"
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <TimelineList key="timeline" :entries="entries" @delete="removeEntry" />
    </TransitionGroup>

    <DropFab @click="ui.openDropModal" />

    <BottomSheetModal :open="ui.isDropModalOpen" @close="ui.closeDropModal">
      <QuickDropForm :open="ui.isDropModalOpen" @save="handleSave" />
    </BottomSheetModal>
  </main>
</template>

<script setup lang="ts">
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';
import { useDropEntries } from '../composables/useDropEntries';
import { useInsights } from '../composables/useInsights';
import DropFab from './DropFab.vue';
import BottomSheetModal from './BottomSheetModal.vue';
import FilterBar from './FilterBar.vue';
import InsightsPanel from './InsightsPanel.vue';
import QuickDropForm from './QuickDropForm.vue';
import TimelineList from './TimelineList.vue';
import { useUIStore } from '@/shared/stores/useUIStore';

const ui = useUIStore();
const { entries, error, selectedMood, selectedTag, search, addEntry, removeEntry } = useDropEntries();
const { topMood, entriesPerDay } = useInsights();

Keyboard.setResizeMode({ mode: 'native' }).catch(() => undefined);

const handleSave = async (payload: { text: string; mood: string; tags: string[] }) => {
  const saved = await addEntry(payload);
  if (saved) {
    await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
    ui.closeDropModal();
  }
};
</script>
