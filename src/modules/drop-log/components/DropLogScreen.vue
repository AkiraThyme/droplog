<template>
  <main class="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 px-3 pb-28 pt-3">
    <header class="glass-panel flex items-center justify-between rounded-2xl px-4 py-3">
      <div class="flex items-center gap-3">
        <img src="/logo.svg" alt="DropLog logo" class="h-10 w-10 rounded-xl" />
        <div>
          <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Welcome back</p>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">DropLog</h1>
        </div>
      </div>
      <button
        class="rounded-xl border border-slate-300/80 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
        @click="ui.toggleTheme()"
      >
        {{ ui.theme === 'black' ? 'Light' : 'Black' }}
      </button>
    </header>

    <section v-if="activeTab === 'home'" class="space-y-3">
      <article class="glass-panel rounded-3xl p-4">
        <h2 class="text-base font-semibold text-slate-900 dark:text-white">Quick drop</h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Capture mood + tags in seconds and keep your day moving.</p>
        <button
          class="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-400/35"
          @click="ui.openDropModal"
        >
          Add new drop
        </button>
      </article>

      <article class="glass-panel rounded-3xl p-4">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent timeline</h3>
          <button class="text-xs font-semibold text-violet-700 dark:text-violet-300" @click="activeTab = 'calendar'">See all</button>
        </div>
        <TimelineList :entries="recentEntries" @delete="removeEntry" />
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
      <article class="glass-panel rounded-3xl p-3">
        <h3 class="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Filtered logs</h3>
        <TimelineList :entries="entries" @delete="removeEntry" />
      </article>
    </section>

    <section v-else-if="activeTab === 'insights'" class="space-y-3">
      <InsightsPanel :topMood="topMood" :entriesPerDay="entriesPerDay" />
      <section class="glass-panel rounded-3xl p-4 text-slate-700 dark:text-slate-200">
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Momentum overview</h3>
        <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
          <article class="rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/70">
            <p class="text-xs text-slate-500 dark:text-slate-400">Current streak</p>
            <p class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{{ streakDays }} days</p>
          </article>
          <article class="rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/70">
            <p class="text-xs text-slate-500 dark:text-slate-400">This week</p>
            <p class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{{ weekCount }} logs</p>
          </article>
        </div>
        <p class="mt-4 rounded-2xl border border-violet-200 bg-violet-100/85 p-3 text-xs leading-relaxed text-violet-950 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-100">
          AI coaching: your best days happen after morning check-ins. Try one short gratitude tag before noon.
        </p>
      </section>
    </section>

    <section v-else class="space-y-3">
      <article class="glass-panel rounded-3xl p-4">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Settings & privacy</h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Useful controls to personalize DropLog and keep data private.</p>

        <div class="mt-4 space-y-2">
          <button
            class="w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-left text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
            @click="ui.toggleTheme()"
          >
            Toggle theme ({{ ui.theme === 'black' ? 'Black' : 'Light' }})
          </button>
          <button
            class="w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-left text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
            @click="resetOnboarding"
          >
            Replay onboarding screens
          </button>
          <article class="rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            Notification reminders and encrypted backup can be added next.
          </article>
        </div>
      </article>
    </section>

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
import TimelineList from './TimelineList.vue';
import { useUIStore } from '@/shared/stores/useUIStore';

const ui = useUIStore();
const { entries, error, selectedMood, selectedTag, search, from, to, addEntry, removeEntry } = useDropEntries();
const { topMood, entriesPerDay } = useInsights();

const selectedDate = ref<string>();
const activeTab = ref<'home' | 'calendar' | 'insights' | 'more'>('home');

Keyboard.setResizeMode({ mode: KeyboardResize.Native }).catch(() => undefined);

const recentEntries = computed(() => entries.value.slice(0, 3));

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

const resetOnboarding = () => {
  localStorage.setItem('droplog-entered', 'false');
  window.location.reload();
};

const handleSave = async (payload: { text: string; mood: string; tags: string[] }) => {
  const saved = await addEntry(payload);
  if (saved) {
    await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
    ui.closeDropModal();
  }
};
</script>
