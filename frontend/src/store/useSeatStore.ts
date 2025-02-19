import { create } from 'zustand';
import { fetchSeats } from '@/lib/api/seats';
import { scrapSeat, unscrapSeat } from '@/lib/api/seatScrap';
import { SeatProps } from '@/types/seats';
import { useSectionStore } from '@/store/useSectionStore';

const CACHE_TTL = 30 * 100 * 1000; // 30초
const MAX_CACHED_SECTIONS = 10; // 최대 5개 구역만 캐시

interface CachedData {
  seats: SeatProps[];
  timestamp: number;
  lastAccessed: number;
}

interface SectionCache {
  [key: string]: CachedData;
}

interface SeatsState {
  seats: SeatProps[];
  sectionCache: SectionCache;
  isLoading: boolean;
  error: string | null;
  selectedSeatId: number | null;
  isScrapProcessing: boolean;
  currentStageType: number | null;

  // Helper selectors
  getSeatScrapStatus: (seatId: number) => boolean;
  getSeatReviewCount: (seatId: number) => number | undefined;
  getSeatById: (seatId: number) => SeatProps | undefined;
  getSectionBySeatId: (seatId: number) => number | undefined;
  getCachedSeats: (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => SeatProps[] | undefined;

  // Actions
  fetchSeatsBySection: (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => Promise<void>;
  selectSeat: (seatId: number | null) => void;
  toggleSeatScrap: (seatId: number) => Promise<void>;
  reset: () => void;
  updateSeatScrapStatus: (seatId: number, isScraped: boolean) => void;
  clearCache: () => void;
  cleanupCache: () => void;
}

const getCacheKey = (arenaId: number, stageType: number, sectionId: number) =>
  `${arenaId}-${stageType}-${sectionId}`;

export const useSeatsStore = create<SeatsState>((set, get) => ({
  seats: [],
  sectionCache: {},
  isLoading: false,
  error: null,
  selectedSeatId: null,
  isScrapProcessing: false,
  currentStageType: null,

  // Helper selectors
  getCachedSeats: (arenaId: number, stageType: number, sectionId: number) => {
    const cacheKey = getCacheKey(arenaId, stageType, sectionId);
    const cachedData = get().sectionCache[cacheKey];
    return cachedData?.seats;
  },

  getSeatScrapStatus: (seatId: number) => {
    const seat = get().seats.find((seat) => seat.seatId === seatId);
    return seat?.scrapped ?? false;
  },

  getSeatById: (seatId: number) => {
    return get().seats.find((seat) => seat.seatId === seatId);
  },

  getSeatReviewCount: (seatId: number) => {
    const seat = get().seats.find((seat) => seat.seatId === seatId);
    return seat?.reviewCount;
  },

  getSectionBySeatId: (seatId: number) => {
    const seat = get().seats.find((seat) => seat.seatId === seatId);
    return seat?.sectionId;
  },

  // Actions
  fetchSeatsBySection: async (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => {
    const cacheKey = getCacheKey(arenaId, stageType, sectionId);
    const now = Date.now();
    const cachedData = get().sectionCache[cacheKey];

    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      set((state) => ({
        seats: cachedData.seats,
        currentStageType: stageType,
        sectionCache: {
          ...state.sectionCache,
          [cacheKey]: {
            ...cachedData,
            lastAccessed: now,
          },
        },
      }));
      return;
    }

    try {
      set({ isLoading: true, error: null, currentStageType: stageType });
      const seatsData = await fetchSeats(arenaId, stageType, sectionId);

      set((state) => {
        const cache = { ...state.sectionCache };
        const cacheEntries = Object.entries(cache);

        if (cacheEntries.length >= MAX_CACHED_SECTIONS) {
          const oldestEntry = cacheEntries.reduce((oldest, current) =>
            current[1].lastAccessed < oldest[1].lastAccessed ? current : oldest
          );
          delete cache[oldestEntry[0]];
        }

        return {
          seats: seatsData,
          sectionCache: {
            ...cache,
            [cacheKey]: {
              seats: seatsData,
              timestamp: now,
              lastAccessed: now,
            },
          },
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch seats',
        isLoading: false,
      });
    }
  },

  selectSeat: (seatId: number | null) => {
    set({ selectedSeatId: seatId });
  },

  toggleSeatScrap: async (seatId: number) => {
    const currentState = get();
    const seat = currentState.seats.find((s) => s.seatId === seatId);
    const stageType = currentState.currentStageType;

    if (!seat || currentState.isScrapProcessing || stageType === null) return;

    try {
      set({ isScrapProcessing: true, error: null });

      if (seat.scrapped) {
        await unscrapSeat(seatId, stageType);
      } else {
        await scrapSeat(seatId, stageType);
      }

      set((state) => {
        const updatedSeats = state.seats.map((s) =>
          s.seatId === seatId ? { ...s, scrapped: !s.scrapped } : s
        );

        const updatedCache = Object.entries(state.sectionCache).reduce(
          (cache, [key, value]) => ({
            ...cache,
            [key]: {
              ...value,
              seats: value.seats.map((s) =>
                s.seatId === seatId ? { ...s, scrapped: !s.scrapped } : s
              ),
              lastAccessed: Date.now(),
            },
          }),
          {}
        );

        return {
          seats: updatedSeats,
          sectionCache: updatedCache,
          isScrapProcessing: false,
        };
      });

      // 구역 스크랩 상태도 함께 업데이트
      if (seat.sectionId) {
        useSectionStore
          .getState()
          .updateSectionScrapStatus(seat.sectionId, !seat.scrapped);
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update scrap status',
        isScrapProcessing: false,
      });
    }
  },

  updateSeatScrapStatus: (seatId: number, isScraped: boolean) => {
    set((state) => {
      const updatedSeats = state.seats.map((seat) =>
        seat.seatId === seatId ? { ...seat, scrapped: isScraped } : seat
      );

      const updatedCache = Object.entries(state.sectionCache).reduce(
        (cache, [key, value]) => ({
          ...cache,
          [key]: {
            ...value,
            seats: value.seats.map((s) =>
              s.seatId === seatId ? { ...s, scrapped: isScraped } : s
            ),
            lastAccessed: Date.now(),
          },
        }),
        {}
      );

      return {
        seats: updatedSeats,
        sectionCache: updatedCache,
      };
    });
  },

  cleanupCache: () => {
    const now = Date.now();
    set((state) => {
      const cache = { ...state.sectionCache };
      Object.entries(cache).forEach(([key, value]) => {
        if (now - value.timestamp > CACHE_TTL) {
          delete cache[key];
        }
      });
      return { sectionCache: cache };
    });
  },

  clearCache: () => {
    set({ sectionCache: {} });
  },

  reset: () => {
    set({
      seats: [],
      sectionCache: {},
      isLoading: false,
      error: null,
      selectedSeatId: null,
      isScrapProcessing: false,
      currentStageType: null,
    });
  },
}));
