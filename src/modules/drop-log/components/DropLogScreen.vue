<template>
  <main class="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 bg-gradient-to-b from-indigo-50 via-sky-50 to-violet-100 p-3 pb-28">
    <header class="flex items-center justify-between pt-2">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-indigo-500">Your journal</p>
        <h1 class="text-3xl font-black text-slate-900">DropLog</h1>
      </div>
      <button class="rounded-xl border border-white/70 bg-white/65 px-3 py-1.5 text-sm text-slate-700 shadow-sm backdrop-blur" @click="ui.toggleTheme()">
        Theme
      </button>
    </header>

    <section v-if="activeTab === 'feed'" class="space-y-3">
      <InsightsPanel :topMood="topMood" :entriesPerDay="entriesPerDay" />

      <FilterBar
        :search="search"
        :mood="selectedMood"
        :tag="selectedTag"
        @update:search="search = $event"
        @update:mood="selectedMood = $event"
        @update:tag="selectedTag = $event"
      />

      <p v-if="error" class="rounded-lg border border-rose-200 bg-rose-100 p-2 text-sm text-rose-700">{{ error }}</p>

      <TransitionGroup name="entry-fade" tag="div">
        <TimelineList key="timeline" :entries="entries" @delete="removeEntry" />
      </TransitionGroup>
    </section>

    <section v-else-if="activeTab === 'calendar'" class="space-y-3">
      <LogCalendar :entries="entries" :selectedDay="selectedDay" @select="handleCalendarSelect" />
      <p class="rounded-2xl border border-white/60 bg-white/65 p-3 text-xs text-slate-600 shadow-sm backdrop-blur">
        {{ selectedDay ? `Showing entries for ${selectedDay}` : 'Select a date to focus your log history.' }}
      </p>
      <TimelineList :entries="entries" @delete="removeEntry" />
    </section>

    <section v-else class="space-y-3">
      <InsightsPanel :topMood="topMood" :entriesPerDay="entriesPerDay" expanded />
      <article class="rounded-3xl border border-white/70 bg-white/70 p-4 text-sm text-slate-700 shadow-lg shadow-indigo-100/70 backdrop-blur">
        <p class="font-semibold text-slate-800">Weekly focus</p>
        <p class="mt-2">You logged <strong>{{ entries.length }}</strong> drops so far. Keep stacking consistent reflections ✨</p>
      </article>
    </section>

    <DropFab v-if="activeTab !== 'insights'" @click="ui.openDropModal" />

    <BottomSheetModal :open="ui.isDropModalOpen" @close="ui.closeDropModal">
      <QuickDropForm :open="ui.isDropModalOpen" @save="handleSave" />
    </BottomSheetModal>

    <GlassBottomNav v-model="activeTab" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { useDropEntries } from '../composables/useDropEntries';
import { useInsights } from '../composables/useInsights';
import DropFab from './DropFab.vue';
import BottomSheetModal from './BottomSheetModal.vue';
import FilterBar from './FilterBar.vue';
import InsightsPanel from './InsightsPanel.vue';
import QuickDropForm from './QuickDropForm.vue';
import TimelineList from './TimelineList.vue';
import { useUIStore } from '@/shared/stores/useUIStore';
import GlassBottomNav, { type NavTab } from './GlassBottomNav.vue';
import LogCalendar from './LogCalendar.vue';

const ui = useUIStore();
const { entries, error, selectedMood, selectedTag, search, from, to, addEntry, removeEntry } = useDropEntries();
const { topMood, entriesPerDay } = useInsights();

const activeTab = ref<NavTab>('feed');
const selectedDay = ref<string | null>(null);

Keyboard.setResizeMode({ mode: KeyboardResize.Native }).catch(() => undefined);

const handleSave = async (payload: { text: string; mood: string; tags: string[] }) => {
  const saved = await addEntry(payload);
  if (saved) {
    await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
    ui.closeDropModal();
  }
};

const handleCalendarSelect = (isoDay: string | null) => {
  selectedDay.value = isoDay;
  if (!isoDay) {
    from.value = undefined;
    to.value = undefined;
    return;
  }

  const start = new Date(`${isoDay}T00:00:00`).getTime();
  const end = new Date(`${isoDay}T23:59:59.999`).getTime();
  from.value = start;
  to.value = end;
};
</script>

<style scoped>
.entry-fade-enter-active,
.entry-fade-leave-active {
  transition: opacity 0.2s ease;
}
.entry-fade-enter-from,
.entry-fade-leave-to {
  opacity: 0;
}
</style>
