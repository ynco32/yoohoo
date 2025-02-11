// src/store/useScrapStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScrapState {
  isScrapMode: boolean;
  setScrapMode: (isScrap: boolean) => void;
  toggleScrapMode: () => void;
}

export const useScrapStore = create<ScrapState>()(
  persist(
    (set) => ({
      isScrapMode: false,
      setScrapMode: (isScrap) => set({ isScrapMode: isScrap }),
      toggleScrapMode: () =>
        set((state) => ({ isScrapMode: !state.isScrapMode })),
    }),
    {
      name: 'scrap-storage',
    }
  )
);
