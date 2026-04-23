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
      <button class="rounded-xl border border-slate-300/80 bg-white/75 px-3 py-1.5 text-sm font-medium text-app-secondary dark:border-slate-700 dark:bg-slate-900/70" @click="ui.toggleTheme()">
        {{ ui.theme === 'black' ? 'Light theme' : 'Black theme' }}
      </button>
    </header>

    <section v-if="activeTab === 'home'" class="space-y-3">
      <InsightsPanel :topMood="topMood" :entriesPerDay="entriesPerDay" />
      <article class="glass-panel rounded-2xl p-4">
        <h3 class="text-sm font-semibold text-app-primary">Smart insights</h3>
        <ul class="mt-2 space-y-1 text-xs text-app-secondary">
          <li v-for="insight in smartInsights" :key="insight">• {{ insight }}</li>
        </ul>
      </article>
      <article class="glass-panel rounded-2xl p-4">
        <h3 class="text-sm font-semibold text-app-primary">Latest entries</h3>
        <div class="mt-3 rounded-2xl border border-white/70 bg-white/45 p-2 dark:border-slate-700 dark:bg-slate-900/55">
          <TimelineList compact :entries="entries.slice(0, 8)" @delete="handleDelete" @edit="handleEdit" />
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === 'calendar'" class="space-y-3">
      <FilterBar :search="search" :mood="selectedMood" :tag="selectedTag" @update:search="search = $event" @update:mood="selectedMood = $event" @update:tag="selectedTag = $event" />
      <div class="flex gap-2 overflow-auto pb-1">
        <button v-for="item in capsuleOptions" :key="item.value" class="rounded-full border px-3 py-1 text-xs" :class="timeCapsuleFilter === item.value ? 'border-violet-500 bg-violet-500/20' : 'border-slate-300/70'" @click="timeCapsuleFilter = item.value">
          {{ item.label }}
        </button>
      </div>

      <LogCalendar :entries="entries" :selected-date="selectedDate" @select-day="selectDay" @clear="clearDayFilter" />

      <article class="glass-panel rounded-2xl p-3">
        <h3 class="text-sm font-semibold text-app-primary">Time capsule timeline</h3>
        <TimelineList class="mt-2" :entries="timeCapsuleEntries" @delete="handleDelete" @edit="handleEdit" />
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
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { useDropEntries } from '../composables/useDropEntries';
import { useInsights } from '../composables/useInsights';
import BottomSheetModal from './BottomSheetModal.vue';
import FilterBar from './FilterBar.vue';
import GlassBottomNav from './GlassBottomNav.vue';
import QuickDropForm from './QuickDropForm.vue';
import TimelineList from './TimelineList.vue';
import { useUIStore } from '@/shared/stores/useUIStore';
import type { DropEntry } from '../types/drop-entry';
import { getRangeForFilter, isOnSameMonthDay, type TimeCapsuleFilter } from '../utils/date';

const InsightsPanel = defineAsyncComponent(() => import('./InsightsPanel.vue'));
const LogCalendar = defineAsyncComponent(() => import('./LogCalendar.vue'));
const SettingsPanel = defineAsyncComponent(() => import('./SettingsPanel.vue'));

const ui = useUIStore();
const { entries, error, selectedMood, selectedTag, search, from, to, addEntry, removeEntry, updateEntry } = useDropEntries();
const { topMood, entriesPerDay, smartInsights } = useInsights();

const selectedDate = ref<string>();
const activeTab = ref<'home' | 'calendar' | 'insights' | 'more'>('home');
const timeCapsuleFilter = ref<TimeCapsuleFilter>('all');

const capsuleOptions: Array<{ label: string; value: TimeCapsuleFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'On this day', value: 'on-this-day' },
  { label: 'Last week', value: 'last-week' },
  { label: 'Last month', value: 'last-month' },
];

Keyboard.setResizeMode({ mode: KeyboardResize.Native }).catch(() => undefined);

watch(timeCapsuleFilter, (nextFilter) => {
  const range = getRangeForFilter(nextFilter);
  from.value = range.from;
  to.value = range.to;
});

const timeCapsuleEntries = computed(() => {
  if (timeCapsuleFilter.value !== 'on-this-day') return entries.value;

  const { month, day } = getRangeForFilter('on-this-day');
  if (typeof month !== 'number' || typeof day !== 'number') return entries.value;
  return entries.value.filter((entry) => isOnSameMonthDay(entry.createdAt, month, day));
});

const selectDay = (isoDate: string) => {
  selectedDate.value = isoDate;
  const start = new Date(`${isoDate}T00:00:00`);
  const end = new Date(`${isoDate}T23:59:59.999`);
  from.value = start.getTime();
  to.value = end.getTime();
};

const clearDayFilter = () => {
  selectedDate.value = undefined;
  timeCapsuleFilter.value = 'all';
  from.value = undefined;
  to.value = undefined;
};

const streakDays = computed(() => new Set(entries.value.map((entry) => new Date(entry.createdAt).toDateString())).size);
const weekCount = computed(() => entries.value.filter((entry) => entry.createdAt >= Date.now() - 7 * 24 * 60 * 60 * 1000).length);

const triggerLightHaptic = async () => {
  if (localStorage.getItem('droplog-haptics') !== 'off') {
    await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
  }
};

const handleSave = async (payload: { text: string; mood: string; tags: string[] }) => {
  const saved = await addEntry(payload);
  if (saved) {
    await triggerLightHaptic();
    ui.closeDropModal();
  }
};

const handleDelete = async (id: string) => {
  await removeEntry(id);
  await triggerLightHaptic();
};

const handleEdit = async (entry: DropEntry) => {
  const editedText = window.prompt('Edit entry text', entry.text);
  if (editedText !== null && editedText.trim() && editedText !== entry.text) {
    await updateEntry(entry.id, { text: editedText.trim() });
  }
};
</script>
