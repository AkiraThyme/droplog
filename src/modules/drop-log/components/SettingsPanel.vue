<template>
  <section class="space-y-3">
    <article class="glass-panel rounded-2xl p-4">
      <h2 class="text-base font-semibold text-app-primary">Appearance</h2>
      <p class="mt-1 text-xs text-app-muted">Control theme and readability preferences for your journaling sessions.</p>

      <div class="mt-3 flex items-center justify-between rounded-2xl border border-white/60 bg-white/45 p-3 dark:border-slate-700/70 dark:bg-slate-900/55">
        <div>
          <p class="text-sm font-medium text-app-primary">Theme</p>
          <p class="text-xs text-app-muted">Switch between light and black theme.</p>
        </div>
        <button class="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-violet-500" @click="ui.toggleTheme()">
          {{ ui.theme === 'black' ? 'Use light' : 'Use black' }}
        </button>
      </div>
    </article>

    <article class="glass-panel rounded-2xl p-4">
      <h2 class="text-base font-semibold text-app-primary">Helpful settings</h2>
      <div class="mt-3 space-y-2">
        <label class="flex items-center justify-between rounded-xl border border-white/60 bg-white/45 px-3 py-2 text-sm dark:border-slate-700/70 dark:bg-slate-900/55">
          <span class="text-app-secondary">Haptic feedback on save</span>
          <input v-model="hapticsEnabled" type="checkbox" class="h-4 w-4 accent-violet-500" />
        </label>
      </div>
    </article>

    <article class="glass-panel rounded-2xl p-4">
      <h2 class="text-base font-semibold text-app-primary">Backup and restore</h2>
      <p class="mt-1 text-xs text-app-muted">Export all entries to JSON and restore from a backup file.</p>
      <div class="mt-3 grid gap-2">
        <button class="rounded-xl bg-violet-500 px-3 py-2 text-sm font-semibold text-white" @click="exportData">Export JSON</button>
        <label class="rounded-xl border border-slate-300/70 px-3 py-2 text-sm text-app-secondary dark:border-slate-700">
          Import JSON
          <input class="hidden" type="file" accept="application/json" @change="importData" />
        </label>
      </div>
      <p v-if="status" class="mt-2 text-xs text-app-muted">{{ status }}</p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUIStore } from '@/shared/stores/useUIStore';
import { backupService } from '../services/backup-service';
import { useDropStore } from '../store/useDropStore';

const ui = useUIStore();
const dropStore = useDropStore();
const status = ref('');

const hapticsEnabled = computed({
  get: () => localStorage.getItem('droplog-haptics') !== 'off',
  set: (value: boolean) => localStorage.setItem('droplog-haptics', value ? 'on' : 'off'),
});

const exportData = async () => {
  const result = await backupService.exportEntries();
  status.value = `Backup created: ${result.fileName} (${result.target})`;
};

const importData = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const importedCount = await backupService.importEntries(await file.text());
    await dropStore.loadEntries();
    status.value = `Imported ${importedCount} entries.`;
  } catch (error) {
    status.value = error instanceof Error ? error.message : 'Failed to import backup.';
  }
};
</script>
