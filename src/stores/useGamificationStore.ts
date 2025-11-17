import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlaythroughStats {
  xp: number;
  level: number;
  sectionsCompleted: number;
  huntsCompleted: number;
  lootCollected: number;
  itemsObtained: number;
}

interface GamificationState {
  playthroughs: Record<string, PlaythroughStats>;
  
  addXP: (playthroughId: string, amount: number) => void;
  getStats: (playthroughId: string) => PlaythroughStats;
  incrementStat: (playthroughId: string, stat: keyof Omit<PlaythroughStats, 'xp' | 'level'>) => void;
}

const XP_PER_LEVEL = 100;
const calculateLevel = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

const DEFAULT_STATS: PlaythroughStats = {
  xp: 0,
  level: 1,
  sectionsCompleted: 0,
  huntsCompleted: 0,
  lootCollected: 0,
  itemsObtained: 0,
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      playthroughs: {},
      
      addXP: (playthroughId: string, amount: number) =>
        set((state) => {
          const current = state.playthroughs[playthroughId] ?? { ...DEFAULT_STATS };
          const newXP = current.xp + amount;
          const newLevel = calculateLevel(newXP);
          
          return {
            playthroughs: {
              ...state.playthroughs,
              [playthroughId]: {
                ...current,
                xp: newXP,
                level: newLevel,
              },
            },
          };
        }),
      
      getStats: (playthroughId: string) => {
        const state = get();
        return state.playthroughs[playthroughId] ?? { ...DEFAULT_STATS };
      },
      
      incrementStat: (playthroughId: string, stat: keyof Omit<PlaythroughStats, 'xp' | 'level'>) =>
        set((state) => {
          const current = state.playthroughs[playthroughId] ?? { ...DEFAULT_STATS };
          
          return {
            playthroughs: {
              ...state.playthroughs,
              [playthroughId]: {
                ...current,
                [stat]: current[stat] + 1,
              },
            },
          };
        }),
    }),
    {
      name: 'ffxii-gamification-storage',
    }
  )
);

// XP rewards
export const XP_REWARDS = {
  CHECKLIST_ITEM: 10,
  SHOP_ITEM: 5,
  SECTION_COMPLETE: 50,
  HUNT_COMPLETE: 30,
  LOOT_FOUND: 15,
} as const;
