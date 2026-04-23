import { Capacitor } from '@capacitor/core';
import type { DropEntry } from '../types/drop-entry';
import { db } from './db';

const isDropEntry = (value: unknown): value is DropEntry => {
  if (!value || typeof value !== 'object') return false;
  const entry = value as DropEntry;
  return (
    typeof entry.id === 'string' &&
    typeof entry.text === 'string' &&
    typeof entry.mood === 'string' &&
    Array.isArray(entry.tags) &&
    typeof entry.createdAt === 'number' &&
    !!entry.context &&
    typeof entry.context.dayOfWeek === 'string' &&
    ['morning', 'afternoon', 'evening', 'night'].includes(entry.context.timeOfDay)
  );
};

const downloadBlob = (payload: string, fileName: string) => {
  const blob = new Blob([payload], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const backupService = {
  async exportEntries() {
    const entries = await db.entries.orderBy('createdAt').toArray();
    const payload = JSON.stringify({ version: 1, exportedAt: Date.now(), entries }, null, 2);
    const fileName = `droplog-backup-${new Date().toISOString().slice(0, 10)}.json`;

    const filesystem = (window as Window & { Capacitor?: { Plugins?: { Filesystem?: { writeFile: (options: Record<string, unknown>) => Promise<void> } } } }).Capacitor?.Plugins?.Filesystem;
    if (Capacitor.isNativePlatform() && filesystem) {
      await filesystem.writeFile({ path: fileName, data: payload, directory: 'DOCUMENTS', encoding: 'utf8' });
      return { fileName, target: 'device' as const };
    }

    downloadBlob(payload, fileName);
    return { fileName, target: 'download' as const };
  },

  async importEntries(fileText: string) {
    const data = JSON.parse(fileText) as { version?: number; entries?: unknown[] };
    if (data.version !== 1 || !Array.isArray(data.entries) || !data.entries.every(isDropEntry)) {
      throw new Error('Invalid backup schema');
    }

    const entries = data.entries as DropEntry[];

    await db.transaction('rw', db.entries, async () => {
      await db.entries.clear();
      await db.entries.bulkPut(entries);
    });

    return entries.length;
  },
};
