import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Playthrough {
  id: string;
  name: string;
  createdAt: string;
  lastPlayed: string;
}

interface SettingsState {
  theme: 'light' | 'dark';
  showJapanese: boolean;
  currentPlaythroughId: string;
  playthroughs: Playthrough[];
  hasCompletedOnboarding: boolean;
  
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleJapanese: () => void;
  setShowJapanese: (show: boolean) => void;
  setCurrentPlaythrough: (id: string) => void;
  createPlaythrough: (name: string) => string;
  deletePlaythrough: (id: string) => void;
  renamePlaythrough: (id: string, name: string) => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      showJapanese: true,
      currentPlaythroughId: '',
      playthroughs: [],
      hasCompletedOnboarding: false,
      
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      
      setTheme: (theme) => set({ theme }),
      
      toggleJapanese: () =>
        set((state) => ({
          showJapanese: !state.showJapanese,
        })),
      
      setShowJapanese: (show) => set({ showJapanese: show }),
      
      setCurrentPlaythrough: (id) => set({ 
        currentPlaythroughId: id,
        playthroughs: get().playthroughs.map(pt => 
          pt.id === id 
            ? { ...pt, lastPlayed: new Date().toISOString() }
            : pt
        )
      }),
      
      createPlaythrough: (name) => {
        const id = `pt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newPlaythrough: Playthrough = {
          id,
          name,
          createdAt: new Date().toISOString(),
          lastPlayed: new Date().toISOString(),
        };
        
        set((state) => ({
          playthroughs: [...state.playthroughs, newPlaythrough],
          currentPlaythroughId: id,
        }));
        
        return id;
      },
      
      deletePlaythrough: (id) => {
        const state = get();
        
        // Don't delete if it's the only playthrough
        if (state.playthroughs.length <= 1) return;
        
        const newPlaythroughs = state.playthroughs.filter(pt => pt.id !== id);
        const newCurrentId = state.currentPlaythroughId === id 
          ? newPlaythroughs[0].id 
          : state.currentPlaythroughId;
        
        set({
          playthroughs: newPlaythroughs,
          currentPlaythroughId: newCurrentId,
        });
      },
      
      renamePlaythrough: (id, name) => {
        set((state) => ({
          playthroughs: state.playthroughs.map(pt =>
            pt.id === id ? { ...pt, name } : pt
          ),
        }));
      },
      
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'ffxii-settings-storage',
    }
  )
);