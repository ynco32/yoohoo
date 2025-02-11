import { create } from 'zustand';
import { sharingAPI } from '@/lib/api/sharing';

interface ScrapState {
  scrappedSharingIds: Set<number>;
  toggleScrap: (sharingId: number) => Promise<void>;
  isScraped: (sharingId: number) => boolean;
}

export const useSharingScrapStore = create<ScrapState>((set, get) => ({
  scrappedSharingIds: new Set<number>(),

  isScraped: (sharingId: number) => {
    return get().scrappedSharingIds.has(sharingId);
  },

  toggleScrap: async (sharingId: number) => {
    try {
      const response = await sharingAPI.toggleScrap(sharingId);

      set((state) => {
        const newIds = new Set(state.scrappedSharingIds);
        if (response.isScraped) {
          newIds.add(sharingId);
        } else {
          newIds.delete(sharingId);
        }

        return { scrappedSharingIds: newIds };
      });
    } catch (error) {
      console.error('Failed to toggle scrap:', error);
      throw error;
    }
  },
}));
