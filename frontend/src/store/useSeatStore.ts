import { create } from 'zustand';
import { fetchSeats } from '@/lib/api/seats';
import { scrapSeat, unscrapSeat } from '@/lib/api/seatScrap';
import { SeatProps } from '@/types/seats';
import { useSectionStore } from '@/store/useSectionStore';

// 캐시 관련 상수
const CACHE_TTL = 30 * 100 * 1000; // 30초
const MAX_CACHED_SECTIONS = 10; // 최대 10개 구역만 캐시

/**
 * 캐시된 좌석 데이터의 구조
 */
interface CachedData {
  seats: SeatProps[];
  timestamp: number;
  lastAccessed: number;
}

/**
 * 섹션별 캐시 저장소
 */
interface SectionCache {
  [key: string]: CachedData;
}

/**
 * 섹션과 좌석 간의 동기화를 관리하는 유틸리티
 */
const createSyncUtils = (sectionStore: typeof useSectionStore) => ({
  updateSectionScrapStatusFromSeats: (
    sectionId: number,
    seats: SeatProps[],
    forceUpdate = false
  ) => {
    const sectionSeats = seats.filter((s) => s.sectionId === sectionId);
    const hasScrapedSeats = sectionSeats.some((s) => s.scrapped);

    const currentSection = sectionStore.getState().getSectionById(sectionId);

    if (forceUpdate || currentSection?.isScraped !== hasScrapedSeats) {
      sectionStore
        .getState()
        .updateSectionScrapStatus(sectionId, hasScrapedSeats);
    }
  },
});

/**
 * 캐시 키 생성 함수
 */
const getCacheKey = (arenaId: number, stageType: number, sectionId: number) =>
  `${arenaId}-${stageType}-${sectionId}`;

/**
 * 좌석 상태 관리를 위한 스토어 인터페이스
 */
interface SeatsState {
  seats: SeatProps[];
  sectionCache: SectionCache;
  isLoading: boolean;
  error: string | null;
  selectedSeatId: number | null;
  isScrapProcessing: boolean;
  currentStageType: number | null;

  getSeatScrapStatus: (seatId: number) => boolean;
  getSeatReviewCount: (seatId: number) => number | undefined;
  getSeatById: (seatId: number) => SeatProps | undefined;
  getSectionBySeatId: (seatId: number) => number | undefined;
  getCachedSeats: (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => SeatProps[] | undefined;

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

/**
 * 좌석 상태 관리 스토어
 */
export const useSeatsStore = create<SeatsState>((set, get) => {
  const syncUtils = createSyncUtils(useSectionStore);

  return {
    // 초기 상태
    seats: [],
    sectionCache: {},
    isLoading: false,
    error: null,
    selectedSeatId: null,
    isScrapProcessing: false,
    currentStageType: null,

    // 헬퍼 셀렉터 구현
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

    // 액션 구현
    fetchSeatsBySection: async (
      arenaId: number,
      stageType: number,
      sectionId: number
    ) => {
      const cacheKey = getCacheKey(arenaId, stageType, sectionId);
      const now = Date.now();
      const cachedData = get().sectionCache[cacheKey];

      if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
        set((state) => {
          syncUtils.updateSectionScrapStatusFromSeats(
            sectionId,
            cachedData.seats
          );
          return {
            seats: cachedData.seats,
            currentStageType: stageType,
            sectionCache: {
              ...state.sectionCache,
              [cacheKey]: {
                ...cachedData,
                lastAccessed: now,
              },
            },
          };
        });
        return;
      }

      try {
        set({ isLoading: true, error: null, currentStageType: stageType });
        const seatsData = await fetchSeats(arenaId, stageType, sectionId);

        set((state) => {
          syncUtils.updateSectionScrapStatusFromSeats(sectionId, seatsData);

          const cache = { ...state.sectionCache };
          const cacheEntries = Object.entries(cache);

          if (cacheEntries.length >= MAX_CACHED_SECTIONS) {
            const oldestEntry = cacheEntries.reduce((oldest, current) =>
              current[1].lastAccessed < oldest[1].lastAccessed
                ? current
                : oldest
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
          error:
            error instanceof Error ? error.message : 'Failed to fetch seats',
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

        const newScrapStatus = !seat.scrapped;

        // 좌석 상태 업데이트
        set((state) => {
          // 모든 좌석 데이터 업데이트
          const updatedSeats = state.seats.map((s) =>
            s.seatId === seatId ? { ...s, scrapped: newScrapStatus } : s
          );

          // 캐시 업데이트
          const updatedCache = Object.entries(state.sectionCache).reduce(
            (cache, [key, value]) => ({
              ...cache,
              [key]: {
                ...value,
                seats: value.seats.map((s) =>
                  s.seatId === seatId ? { ...s, scrapped: newScrapStatus } : s
                ),
                lastAccessed: Date.now(),
              },
            }),
            {}
          );

          // 섹션 상태 동기화
          if (seat.sectionId) {
            syncUtils.updateSectionScrapStatusFromSeats(
              seat.sectionId,
              updatedSeats,
              true
            );
          }

          return {
            seats: updatedSeats,
            sectionCache: updatedCache,
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

    updateSeatScrapStatus: (seatId: number, isScraped: boolean) => {
      set((state) => {
        const updatedSeats = state.seats.map((seat) =>
          seat.seatId === seatId ? { ...seat, scrapped: isScraped } : seat
        );

        // 모든 캐시 업데이트
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

        // 섹션 상태도 함께 업데이트
        const seat = updatedSeats.find((s) => s.seatId === seatId);
        if (seat?.sectionId) {
          syncUtils.updateSectionScrapStatusFromSeats(
            seat.sectionId,
            updatedSeats,
            true
          );
        }

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
  };
});
