<template>
  <main class="mx-auto min-h-screen w-full max-w-7xl px-4 pb-32 pt-4 sm:px-6 md:pt-6 lg:px-8 lg:pb-10">
    <div class="grid gap-4 md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:gap-6">
      <DesktopSidebar
        v-if="isDesktop"
        :active-tab="activeTab"
        :theme-label="ui.theme === 'black' ? 'Switch to Light' : 'Switch to Dark'"
        @change="activeTab = $event"
        @toggle-theme="ui.toggleTheme()"
      />

      <section class="min-w-0 space-y-4 md:space-y-6">
        <header v-if="isMobile || isTablet" class="glass-panel rounded-3xl px-4 py-4 md:px-6">
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

        <header v-else class="glass-panel rounded-3xl p-5 xl:p-6">
          <div class="mb-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.16em] text-app-muted">Desktop workspace</p>
              <h2 class="text-3xl font-bold text-app-primary">DropLog dashboard</h2>
            </div>
            <button class="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30" @click="ui.openDropModal">+ Drop</button>
          </div>
          <GlobalSearchBar
            ref="searchBar"
            v-model="search"
            :results="searchResults"
            :show-results="isDesktop"
            @select="openEntryById"
          />
        </header>

        <section v-if="isDesktop && activeTab === 'home'" class="space-y-6">
          <DashboardPanel :cards="dashboardCards" :weekly-series="weeklySeries" :trend-series="moodTrendSeries" :recent-entries="entries.slice(0, 5)" />
        </section>

        <section v-if="activeTab === 'home' && (isMobile || isTablet)" class="space-y-5 md:space-y-6">
          <InsightsPanel :cards="insightCards" :weekly-series="weeklySeries" :trend-series="moodTrendSeries" />
          <article class="glass-panel rounded-2xl p-4 md:p-5">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-base font-semibold text-app-primary">Latest entries</h2>
              <span class="text-xs text-app-muted">{{ entries.length }} total</span>
            </div>
            <TimelineList compact :entries="entries.slice(0, 10)" @delete="handleDelete" @edit="handleEdit" @select="selectedEntry = $event" />
          </article>
        </section>

        <section v-if="activeTab === 'timeline'" class="space-y-4 md:space-y-6">
          <FilterBar
            v-if="isMobile || isTablet"
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

          <LogCalendar :entries="entries" :selected-date="selectedDate" :is-desktop="isDesktop" @select-day="selectDay" @clear="clearDayFilter" />

          <article class="glass-panel rounded-2xl p-4 md:p-5">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-base font-semibold text-app-primary md:text-lg">Timeline</h2>
              <span class="text-xs text-app-muted">{{ entries.length }} entries</span>
            </div>
            <TimelineList :entries="entries" :is-desktop="isDesktop" @delete="handleDelete" @edit="handleEdit" @select="selectedEntry = $event" />
          </article>
        </section>

        <section v-if="activeTab === 'insights'" class="space-y-4 md:space-y-6">
          <article class="glass-panel rounded-2xl p-4 md:p-5">
            <h2 class="text-base font-semibold text-app-primary md:text-lg">Consistency</h2>
            <p class="mt-1 text-sm text-app-secondary">You currently have a {{ consistencyStreak }} day streak. Keep logging to build momentum.</p>
          </article>
          <InsightsPanel :cards="insightCards" :weekly-series="weeklySeries" :trend-series="moodTrendSeries" />
        </section>

        <SettingsPanel v-if="activeTab === 'more'" />

        <p v-if="error" class="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{{ error }}</p>
      </section>

      <section v-if="isDesktop" class="sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto pr-1">
        <div class="space-y-4 xl:space-y-5">
          <article class="glass-panel rounded-2xl p-4">
            <div class="mb-3 flex items-center justify-between">
              <h3 class="text-sm font-semibold text-app-primary">Quick stats</h3>
              <span class="text-xs text-app-muted">Live</span>
            </div>
            <ul class="space-y-2 text-sm text-app-secondary">
              <li class="flex items-center justify-between rounded-xl border border-slate-300/70 px-3 py-2 dark:border-slate-700">
                <span>Total drops</span>
                <strong class="text-app-primary">{{ entries.length }}</strong>
              </li>
              <li class="flex items-center justify-between rounded-xl border border-slate-300/70 px-3 py-2 dark:border-slate-700">
                <span>Active filters</span>
                <strong class="text-app-primary">{{ activeFilterCount }}</strong>
              </li>
              <li class="flex items-center justify-between rounded-xl border border-slate-300/70 px-3 py-2 dark:border-slate-700">
                <span>Streak</span>
                <strong class="text-app-primary">{{ consistencyStreak }} days</strong>
              </li>
            </ul>
          </article>

          <article class="glass-panel rounded-2xl p-4">
            <h3 class="text-sm font-semibold text-app-primary">Smart insights</h3>
            <p class="mt-1 text-xs leading-relaxed text-app-secondary">
              Mood trend and consistency update as entries are logged. Use filters to inspect specific patterns.
            </p>
          </article>

          <AdvancedFilterPanel
            v-if="filtersVisible"
            :search="search"
            :mood="selectedMood"
            :tag="selectedTag"
            :mood-options="moodOptions"
            :tag-options="tagOptions"
            :quick-range="quickRange"
            @update:search="search = $event"
            @update:mood="selectedMood = $event"
            @update:tag="selectedTag = $event"
            @update:quick-range="applyQuickRange"
            @clear="clearAllFilters"
          />
          <EntryDetailPanel :entry="selectedEntry" @close="selectedEntry = undefined" @edit="handleEdit" @delete="handleDelete" />
        </div>
      </section>
    </div>

    <GlassBottomNav v-if="isMobile || isTablet" :active-tab="activeTab === 'timeline' ? 'calendar' : activeTab" @change="handleMobileTab" @add="ui.openDropModal" />

    <BottomSheetModal :open="ui.isDropModalOpen" @close="ui.closeDropModal">
      <QuickDropForm :open="ui.isDropModalOpen" @save="handleSave" />
    </BottomSheetModal>
  </main>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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
import { useBreakpoint } from '@/shared/composables/useBreakpoint';
import DesktopSidebar from './DesktopSidebar.vue';
import AdvancedFilterPanel from './AdvancedFilterPanel.vue';
import EntryDetailPanel from './EntryDetailPanel.vue';
import GlobalSearchBar from './GlobalSearchBar.vue';

const InsightsPanel = defineAsyncComponent(() => import('./InsightsPanel.vue'));
const LogCalendar = defineAsyncComponent(() => import('./LogCalendar.vue'));
const SettingsPanel = defineAsyncComponent(() => import('./SettingsPanel.vue'));
const DashboardPanel = defineAsyncComponent(() => import('./DashboardPanel.vue'));

const ui = useUIStore();
const { entries, error, selectedMood, selectedTag, search, from, to, addEntry, removeEntry, updateEntry } = useDropEntries();
const { insightCards, consistencyStreak, weeklyActivitySeries, moodTrendSeries } = useInsights();
const { isMobile, isTablet, isDesktop } = useBreakpoint();

const selectedDate = ref<string>();
const selectedEntry = ref<DropEntry>();
const activeTab = ref<'home' | 'timeline' | 'insights' | 'more'>('home');
const quickRange = ref<'today' | 'week' | 'month' | 'all'>('all');
const filtersVisible = ref(true);
const searchBar = ref<InstanceType<typeof GlobalSearchBar> | null>(null);

Keyboard.setResizeMode({ mode: KeyboardResize.Native }).catch(() => undefined);

watch([selectedMood, selectedTag, search], () => {
  selectedDate.value = undefined;
});

const moodOptions = computed(() => Array.from(new Set(entries.value.map((entry) => entry.mood))));
const tagOptions = computed(() =>
  Array.from(new Set(entries.value.flatMap((entry) => entry.tags).filter(Boolean))).sort((a, b) => a.localeCompare(b)).slice(0, 12),
);
const searchResults = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return [];
  return entries.value
    .filter((entry) => entry.text.toLowerCase().includes(term) || entry.tags.some((tag) => tag.toLowerCase().includes(term)))
    .slice(0, 6);
});

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

const dashboardCards = computed(() => {
  const topMoodMap = entries.value.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] ?? 0) + 1;
    return acc;
  }, {});
  const [topMood = '🙂', topCount = 0] = Object.entries(topMoodMap).sort((a, b) => b[1] - a[1])[0] ?? [];
  const topPct = entries.value.length ? Math.round((topCount / entries.value.length) * 100) : 0;

  return [
    { id: 'entries', title: 'Total entries', value: String(entries.value.length), description: 'Across your log history' },
    { id: 'streak', title: 'Streak', value: `${consistencyStreak.value} days`, description: 'Keep momentum going' },
    { id: 'topMood', title: 'Top mood', value: `${topMood} ${topPct}%`, description: 'Most frequent mood share' },
  ];
});

const clearAllFilters = () => {
  search.value = '';
  selectedMood.value = '';
  selectedTag.value = '';
  clearDayFilter();
};

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
  if (selectedEntry.value?.id === id) {
    selectedEntry.value = undefined;
  }
  await triggerLightHaptic();
};

const handleEdit = async (entry: DropEntry) => {
  const editedText = window.prompt('Edit entry text', entry.text);
  if (editedText !== null && editedText.trim() && editedText !== entry.text) {
    await updateEntry(entry.id, { text: editedText.trim() });
  }
};

const openEntryById = (id: string) => {
  selectedEntry.value = entries.value.find((entry) => entry.id === id);
};

const handleMobileTab = (tab: 'home' | 'calendar' | 'insights' | 'more') => {
  activeTab.value = tab === 'calendar' ? 'timeline' : tab;
};

const handleShortcuts = (event: KeyboardEvent) => {
  if ((event.target as HTMLElement)?.tagName === 'INPUT' || (event.target as HTMLElement)?.tagName === 'TEXTAREA') {
    return;
  }

  if (event.key.toLowerCase() === 'n') {
    event.preventDefault();
    ui.openDropModal();
  }

  if (event.key === '/') {
    event.preventDefault();
    searchBar.value?.input?.focus();
  }

  if (event.key.toLowerCase() === 'f' && isDesktop.value) {
    event.preventDefault();
    filtersVisible.value = !filtersVisible.value;
  }

  if (event.key === 'Escape') {
    ui.closeDropModal();
    selectedEntry.value = undefined;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleShortcuts);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcuts);
});
</script>
