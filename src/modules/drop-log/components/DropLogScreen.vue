<template>
  <main class="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 px-3 pb-28 pt-3">
    <header class="glass-panel flex items-center justify-between rounded-2xl px-4 py-3">
      <div>
        <p class="text-xs uppercase tracking-wider text-slate-500">Welcome back</p>
        <h1 class="text-2xl font-bold text-slate-900">DropLog</h1>
      </div>
      <button class="rounded-xl border border-slate-300/80 bg-white/60 px-3 py-1.5 text-sm text-slate-700" @click="ui.toggleTheme()">
        Theme
      </button>
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

    <LogCalendar :entries="entries" :selected-date="selectedDate" @select-day="selectDay" @clear="clearDayFilter" />

    <section v-if="activeTab === 'insights'" class="glass-panel rounded-3xl p-4 text-slate-700">
      <h3 class="text-sm font-semibold text-slate-900">Momentum</h3>
      <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
        <article class="rounded-2xl border border-white/70 bg-white/50 p-3">
          <p class="text-xs text-slate-500">Current streak</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">{{ streakDays }} days</p>
        </article>
        <article class="rounded-2xl border border-white/70 bg-white/50 p-3">
          <p class="text-xs text-slate-500">This week</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">{{ weekCount }} logs</p>
        </article>
      </div>
      <p class="mt-4 rounded-2xl border border-violet-200 bg-violet-100/70 p-3 text-xs leading-relaxed text-violet-900">
        Reflection tip: add one positive tag on every tough day so future-you can spot recovery patterns faster.
      </p>
    </section>

    <p v-if="error" class="rounded-lg bg-rose-100 p-2 text-sm text-rose-700">{{ error }}</p>

    <TransitionGroup v-if="activeTab !== 'insights'" name="entry-fade" tag="div">
      <TimelineList
        key="timeline"
        :entries="entries"
        @delete="removeEntry"
      />
    </TransitionGroup>

    <GlassBottomNav :active-tab="activeTab" @change="activeTab = $event" @add="ui.openDropModal" />

    <BottomSheetModal :open="ui.isDropModalOpen" @close="ui.closeDropModal">
      <QuickDropForm :open="ui.isDropModalOpen" @save="handleSave" />
    </BottomSheetModal>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { useDropEntries } from '../composables/useDropEntries';
import { useInsights } from '../composables/useInsights';
import BottomSheetModal from './BottomSheetModal.vue';
import FilterBar from './FilterBar.vue';
import GlassBottomNav from './GlassBottomNav.vue';
import InsightsPanel from './InsightsPanel.vue';
import LogCalendar from './LogCalendar.vue';
import QuickDropForm from './QuickDropForm.vue';
import TimelineList from './TimelineList.vue';
import { useUIStore } from '@/shared/stores/useUIStore';

const ui = useUIStore();
const { entries, error, selectedMood, selectedTag, search, from, to, addEntry, removeEntry } = useDropEntries();
const { topMood, entriesPerDay } = useInsights();

const selectedDate = ref<string>();
const activeTab = ref<'home' | 'calendar' | 'insights'>('home');

Keyboard.setResizeMode({ mode: KeyboardResize.Native }).catch(() => undefined);

const selectDay = (isoDate: string) => {
  selectedDate.value = isoDate;
  const start = new Date(`${isoDate}T00:00:00`);
  const end = new Date(`${isoDate}T23:59:59.999`);
  from.value = start.getTime();
  to.value = end.getTime();
  activeTab.value = 'calendar';
};

const clearDayFilter = () => {
  selectedDate.value = undefined;
  from.value = undefined;
  to.value = undefined;
};

const streakDays = computed(() => {
  const uniqueDays = new Set(entries.value.map((entry) => new Date(entry.createdAt).toDateString()));
  return uniqueDays.size;
});

const weekCount = computed(() => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return entries.value.filter((entry) => entry.createdAt >= sevenDaysAgo).length;
});

const handleSave = async (payload: { text: string; mood: string; tags: string[] }) => {
  const saved = await addEntry(payload);
  if (saved) {
    await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
    ui.closeDropModal();
  }
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
