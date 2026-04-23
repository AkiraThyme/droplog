<template>
  <main class="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 px-3 pb-28 pt-3">
    <header class="glass-panel flex items-center justify-between rounded-2xl px-4 py-3">
      <div class="flex items-center gap-3">
        <img src="/icons/logo.png" alt="DropLog logo" class="h-10 w-10 rounded-xl object-cover shadow-md" />
        <div>
          <p class="text-xs uppercase tracking-wider text-app-muted">Welcome back</p>
          <h1 class="text-2xl font-bold text-app-primary">DropLog</h1>
        </div>
      </div>
      <button
        class="rounded-xl border border-slate-300/80 bg-white/75 px-3 py-1.5 text-sm font-medium text-app-secondary dark:border-slate-700 dark:bg-slate-900/70"
        @click="ui.toggleTheme()"
      >
        {{ ui.theme === 'black' ? 'Light theme' : 'Black theme' }}
      </button>
    </header>

    <section v-if="activeTab === 'home'" class="space-y-3">
      <InsightsPanel :topMood="topMood" :entriesPerDay="entriesPerDay" />
      <article class="glass-panel rounded-2xl p-4">
        <h3 class="text-sm font-semibold text-app-primary">Latest entries</h3>
        <p class="mt-1 text-xs text-app-muted">Recent logs from your timeline.</p>
        <div class="mt-3 rounded-2xl border border-white/70 bg-white/45 p-2 dark:border-slate-700 dark:bg-slate-900/55">
          <TimelineList compact :entries="entries.slice(0, 8)" @delete="removeEntry" />
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === 'calendar'" class="space-y-3">
      <FilterBar
        :search="search"
        :mood="selectedMood"
        :tag="selectedTag"
        @update:search="search = $event"
        @update:mood="selectedMood = $event"
        @update:tag="selectedTag = $event"
      />

      <LogCalendar :entries="entries" :selected-date="selectedDate" @select-day="selectDay" @clear="clearDayFilter" />

      <article class="glass-panel rounded-2xl p-3">
        <h3 class="text-sm font-semibold text-app-primary">Timeline</h3>
        <p class="text-xs text-app-muted">Filtered by search, mood, tags, and selected date.</p>
        <TimelineList class="mt-2" :entries="entries" @delete="removeEntry" />
      </article>
    </section>

    <section v-else-if="activeTab === 'insights'" class="glass-panel rounded-3xl p-4 text-app-secondary">
      <h3 class="text-sm font-semibold text-app-primary">Momentum</h3>
      <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
        <article class="rounded-2xl border border-white/70 bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-900/70">
          <p class="text-xs text-app-muted">Current streak</p>
          <p class="mt-1 text-lg font-semibold text-app-primary">{{ streakDays }} days</p>
        </article>
        <article class="rounded-2xl border border-white/70 bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-900/70">
          <p class="text-xs text-app-muted">This week</p>
          <p class="mt-1 text-lg font-semibold text-app-primary">{{ weekCount }} logs</p>
        </article>
      </div>
      <p class="mt-4 rounded-2xl border border-violet-200 bg-violet-100/75 p-3 text-xs leading-relaxed text-violet-900 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-100">
        Reflection tip: add one positive tag on every tough day so future-you can spot recovery patterns faster.
      </p>
    </section>

    <SettingsPanel v-else />

    <p v-if="error" class="rounded-lg bg-rose-100 p-2 text-sm text-rose-700">{{ error }}</p>

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
import SettingsPanel from './SettingsPanel.vue';
import TimelineList from './TimelineList.vue';
import { useUIStore } from '@/shared/stores/useUIStore';

const ui = useUIStore();
const { entries, error, selectedMood, selectedTag, search, from, to, addEntry, removeEntry } = useDropEntries();
const { topMood, entriesPerDay } = useInsights();

const selectedDate = ref<string>();
const activeTab = ref<'home' | 'calendar' | 'insights' | 'more'>('home');

Keyboard.setResizeMode({ mode: KeyboardResize.Native }).catch(() => undefined);

const selectDay = (isoDate: string) => {
  selectedDate.value = isoDate;
  const start = new Date(`${isoDate}T00:00:00`);
  const end = new Date(`${isoDate}T23:59:59.999`);
  from.value = start.getTime();
  to.value = end.getTime();
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
    const hapticsEnabled = localStorage.getItem('droplog-haptics') !== 'off';
    if (hapticsEnabled) {
      await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
    }
    ui.closeDropModal();
  }
};
</script>
