<template>
  <main class="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 pb-32 pt-4">
    <header class="glass-panel rounded-3xl px-4 py-4">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <img src="/icons/logo.png" alt="DropLog logo" class="h-11 w-11 rounded-2xl object-cover shadow-md" />
          <div>
            <p class="text-xs uppercase tracking-[0.16em] text-app-muted">Daily check-ins</p>
            <h1 class="text-3xl font-extrabold tracking-tight text-app-primary">DropLog</h1>
          </div>
        </div>
        <button class="touch-target rounded-xl border border-slate-300/80 px-3 text-xs font-semibold text-app-secondary transition active:scale-95 dark:border-slate-700" @click="ui.toggleTheme()">
          {{ ui.theme === 'black' ? 'Light' : 'Dark' }}
        </button>
      </div>
    </header>

    <section v-if="activeTab === 'home'" class="space-y-5">
      <InsightsPanel :cards="insightCards" :weekly-series="weeklySeries" :trend-series="moodTrendSeries" />
      <article class="glass-panel rounded-2xl p-4">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-base font-semibold text-app-primary">Latest entries</h2>
          <span class="text-xs text-app-muted">{{ entries.length }} total</span>
        </div>
        <TimelineList compact :entries="entries.slice(0, 10)" @delete="handleDelete" @edit="handleEdit" />
      </article>
    </section>

    <section v-else-if="activeTab === 'calendar'" class="space-y-4">
      <FilterBar
        :search="search"
        :mood="selectedMood"
        :tag="selectedTag"
        :mood-options="moodOptions"
        :tag-options="tagOptions"
        :quick-range="quickRange"
        :active-count="activeFilterCount"
        @update:search="search = $event"
        @update:mood="selectedMood = $event"
        @update:tag="selectedTag = $event"
        @update:quick-range="applyQuickRange"
      />

      <LogCalendar :entries="entries" :selected-date="selectedDate" @select-day="selectDay" @clear="clearDayFilter" />

      <article class="glass-panel rounded-2xl p-4">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-base font-semibold text-app-primary">Timeline</h2>
          <span class="text-xs text-app-muted">{{ entries.length }} entries</span>
        </div>
        <TimelineList :entries="entries" @delete="handleDelete" @edit="handleEdit" />
      </article>
    </section>

    <section v-else-if="activeTab === 'insights'" class="space-y-4">
      <article class="glass-panel rounded-2xl p-4">
        <h2 class="text-base font-semibold text-app-primary">Consistency</h2>
        <p class="mt-1 text-sm text-app-secondary">You currently have a {{ consistencyStreak }} day streak. Keep logging to build momentum.</p>
      </article>
      <InsightsPanel :cards="insightCards" :weekly-series="weeklySeries" :trend-series="moodTrendSeries" />
    </section>

    <SettingsPanel v-else />

    <p v-if="error" class="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{{ error }}</p>

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

const InsightsPanel = defineAsyncComponent(() => import('./InsightsPanel.vue'));
const LogCalendar = defineAsyncComponent(() => import('./LogCalendar.vue'));
const SettingsPanel = defineAsyncComponent(() => import('./SettingsPanel.vue'));

const ui = useUIStore();
const { entries, error, selectedMood, selectedTag, search, from, to, addEntry, removeEntry, updateEntry } = useDropEntries();
const { insightCards, consistencyStreak, weeklyActivitySeries, moodTrendSeries } = useInsights();

const selectedDate = ref<string>();
const activeTab = ref<'home' | 'calendar' | 'insights' | 'more'>('home');
const quickRange = ref<'today' | 'week' | 'month' | 'all'>('all');

Keyboard.setResizeMode({ mode: KeyboardResize.Native }).catch(() => undefined);

watch([selectedMood, selectedTag, search], () => {
  selectedDate.value = undefined;
});

const moodOptions = computed(() => Array.from(new Set(entries.value.map((entry) => entry.mood))));
const tagOptions = computed(() =>
  Array.from(new Set(entries.value.flatMap((entry) => entry.tags).filter(Boolean))).sort((a, b) => a.localeCompare(b)).slice(0, 12),
);

const activeFilterCount = computed(() => {
  let total = 0;
  if (search.value.trim()) total += 1;
  if (selectedMood.value.trim()) total += 1;
  if (selectedTag.value.trim()) total += 1;
  if (quickRange.value !== 'all' || selectedDate.value) total += 1;
  return total;
});

const weeklySeries = computed(() =>
  weeklyActivitySeries.value.map((item) => ({
    ...item,
    level: Math.min(5, Math.round((item.height / 100) * 5)),
  })),
);

const applyQuickRange = (range: 'today' | 'week' | 'month' | 'all') => {
  quickRange.value = range;
  selectedDate.value = undefined;

  const now = new Date();
  const end = now.getTime();

  if (range === 'all') {
    from.value = undefined;
    to.value = undefined;
    return;
  }

  if (range === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    from.value = start.getTime();
    to.value = end;
    return;
  }

  if (range === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    from.value = start.getTime();
    to.value = end;
    return;
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  from.value = start.getTime();
  to.value = end;
};

const selectDay = (isoDate: string) => {
  quickRange.value = 'all';
  selectedDate.value = isoDate;
  const start = new Date(`${isoDate}T00:00:00`);
  const end = new Date(`${isoDate}T23:59:59.999`);
  from.value = start.getTime();
  to.value = end.getTime();
};

const clearDayFilter = () => {
  selectedDate.value = undefined;
  applyQuickRange('all');
};

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
