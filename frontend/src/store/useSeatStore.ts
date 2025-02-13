import { create } from 'zustand';
import { fetchSeats } from '@/lib/api/seats';
import { scrapSeat, unscrapSeat } from '@/lib/api/seatScrap';
import { SeatProps } from '@/types/seats';

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
  selectSeat: (seatId: number) => void;
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

  getCachedSeats: (arenaId: number, stageType: number, sectionId: number) => {
    const cacheKey = getCacheKey(arenaId, stageType, sectionId);
    const cachedData = get().sectionCache[cacheKey];
    return cachedData?.seats;
  },

  // 좌석 아이디로 좌석 전체 정보 찾기
  getSeatById: (seatId: number) => {
    return get().seats.find((seat) => seat.seatId === seatId);
  },

  // 좌석 아이디로 해당 좌석의 구역 찾기
  getSectionBySeatId: (seatId: number) => {
    const seat = get().seats.find((seat) => seat.seatId === seatId);
    return seat?.sectionId;
  },

  fetchSeatsBySection: async (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => {
    // 해당 공연장, 무대 유형, 구역이 불러온 적 있는 정보인지 확인
    const cacheKey = getCacheKey(arenaId, stageType, sectionId);
    const now = Date.now();
    const cachedData = get().sectionCache[cacheKey];

    // 불러왔던 적 있으면 불러왔던 데이터 사용
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

    // 불러왔던 적 없으면
    try {
      set({ isLoading: true, error: null, currentStageType: stageType });
      const seatsData = await fetchSeats(arenaId, stageType, sectionId);

      // 캐시 크기 제한 관리리
      set((state) => {
        const cache = { ...state.sectionCache };
        const cacheEntries = Object.entries(cache);
        // 캐시가 가득 찼다면 가장 오래된 항목 제거
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

  selectSeat: (seatId: number) => {
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

      // 캐시와 현재 seats 모두 업데이트
      set((state) => {
        const updatedSeats = state.seats.map((s) =>
          s.seatId === seatId ? { ...s, scrapped: !s.scrapped } : s
        );

        // 현재 섹션의 캐시 키 찾기
        const currentSeat = state.seats.find((s) => s.seatId === seatId);
        if (currentSeat && state.currentStageType) {
          const cacheKey = getCacheKey(
            currentSeat.arenaId,
            state.currentStageType,
            currentSeat.sectionId
          );

          return {
            seats: updatedSeats,
            sectionCache: {
              ...state.sectionCache,
              [cacheKey]: {
                seats: updatedSeats,
                timestamp: Date.now(),
                lastAccessed: Date.now(),
              },
            },
            isScrapProcessing: false,
          };
        }

        return {
          seats: updatedSeats,
          isScrapProcessing: false,
        };
      });
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

  getSeatScrapStatus: (seatId: number) => {
    const seat = get().seats.find((seat) => seat.seatId === seatId);
    return seat?.scrapped ?? false;
  },

  updateSeatScrapStatus: (seatId: number, isScraped: boolean) => {
    set((state) => {
      const updatedSeats = state.seats.map((seat) =>
        seat.seatId === seatId ? { ...seat, scrapped: isScraped } : seat
      );

      // 현재 섹션의 캐시 키 찾기
      const currentSeat = state.seats.find((s) => s.seatId === seatId);
      if (currentSeat && state.currentStageType) {
        const cacheKey = getCacheKey(
          currentSeat.arenaId,
          state.currentStageType,
          currentSeat.sectionId
        );

        return {
          seats: updatedSeats,
          sectionCache: {
            ...state.sectionCache,
            [cacheKey]: {
              seats: updatedSeats,
              timestamp: Date.now(),
              lastAccessed: Date.now(),
            },
          },
        };
      }

      return { seats: updatedSeats };
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
      sectionCache: {}, // 이 부분이 빠졌음
      isLoading: false,
      error: null,
      selectedSeatId: null,
      isScrapProcessing: false,
      currentStageType: null,
    });
  },
}));
