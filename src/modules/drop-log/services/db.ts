import Dexie, { type Table } from 'dexie';
import type { DropEntry } from '../types/drop-entry';

class DropLogDB extends Dexie {
  entries!: Table<DropEntry, string>;

  constructor() {
    super('DropLogDB');
    this.version(1).stores({
      entries: '&id, createdAt, mood, *tags',
    });
  }
}

export const db = new DropLogDB();
