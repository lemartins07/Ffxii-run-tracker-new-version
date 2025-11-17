import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChecklistState {
  // [playthroughId][itemId] -> boolean
  items: Record<string, Record<string, boolean>>;
  
  toggleItem: (playthroughId: string, itemId: string) => void;
  isItemComplete: (playthroughId: string, itemId: string) => boolean;
  getSectionProgress: (playthroughId: string, itemIds: string[]) => { completed: number; total: number; percent: number };
  clearPlaythrough: (playthroughId: string) => void;
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      items: {},
      
      toggleItem: (playthroughId: string, itemId: string) =>
        set((state) => {
          const current = state.items[playthroughId] ?? {};
          return {
            items: {
              ...state.items,
              [playthroughId]: {
                ...current,
                [itemId]: !current[itemId],
              },
            },
          };
        }),
      
      isItemComplete: (playthroughId: string, itemId: string) => {
        const state = get();
        return state.items[playthroughId]?.[itemId] ?? false;
      },
      
      getSectionProgress: (playthroughId: string, itemIds: string[]) => {
        const state = get();
        const playthroughItems = state.items[playthroughId] ?? {};
        
        const completed = itemIds.filter(id => playthroughItems[id]).length;
        const total = itemIds.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { completed, total, percent };
      },
      
      clearPlaythrough: (playthroughId: string) =>
        set((state) => {
          const { [playthroughId]: removed, ...rest } = state.items;
          return { items: rest };
        }),
    }),
    {
      name: 'ffxii-checklist-storage',
    }
  )
);
