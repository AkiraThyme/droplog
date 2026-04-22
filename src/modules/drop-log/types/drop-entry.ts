export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type DropEntry = {
  id: string;
  text: string;
  mood: string;
  tags: string[];
  createdAt: number;
  updatedAt?: number;
  context: {
    timeOfDay: TimeOfDay;
    dayOfWeek: string;
  };
};

export type DropCreateInput = Pick<DropEntry, 'text' | 'mood' | 'tags'>;

export type DropFilter = {
  mood?: string;
  tag?: string;
  search?: string;
  from?: number;
  to?: number;
};
