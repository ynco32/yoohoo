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
  seats: SeatProps[]; // 좌석 데이터 배열
  timestamp: number; // 캐시된 시간
  lastAccessed: number; // 마지막으로 접근한 시간
}

/**
 * 섹션별 캐시 저장소
 */
interface SectionCache {
  [key: string]: CachedData;
}

/**
 * 좌석 상태 관리를 위한 스토어 인터페이스
 */
interface SeatsState {
  seats: SeatProps[]; // 현재 표시중인 좌석 목록
  sectionCache: SectionCache; // 섹션별 캐시 저장소
  isLoading: boolean; // 데이터 로딩 상태
  error: string | null; // 에러 메시지
  selectedSeatId: number | null; // 선택된 좌석 ID
  isScrapProcessing: boolean; // 스크랩 처리 중 상태
  currentStageType: number | null; // 현재 무대 타입

  // 헬퍼 셀렉터
  getSeatScrapStatus: (seatId: number) => boolean; // 좌석의 스크랩 상태 조회
  getSeatReviewCount: (seatId: number) => number | undefined; // 좌석의 리뷰 수 조회
  getSeatById: (seatId: number) => SeatProps | undefined; // ID로 좌석 정보 조회
  getSectionBySeatId: (seatId: number) => number | undefined; // 좌석이 속한 섹션 ID 조회
  getCachedSeats: (
    // 캐시된 좌석 데이터 조회
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => SeatProps[] | undefined;

  // 액션
  fetchSeatsBySection: (
    // 섹션별 좌석 데이터 조회
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => Promise<void>;
  selectSeat: (seatId: number | null) => void; // 좌석 선택
  toggleSeatScrap: (seatId: number) => Promise<void>; // 좌석 스크랩 토글
  reset: () => void; // 상태 초기화
  updateSeatScrapStatus: (seatId: number, isScraped: boolean) => void; // 좌석 스크랩 상태 업데이트
  clearCache: () => void; // 캐시 초기화
  cleanupCache: () => void; // 만료된 캐시 정리
}

/**
 * 캐시 키 생성 함수
 * @param arenaId - 공연장 ID
 * @param stageType - 무대 타입
 * @param sectionId - 섹션 ID
 * @returns 캐시 키 문자열
 */
const getCacheKey = (arenaId: number, stageType: number, sectionId: number) =>
  `${arenaId}-${stageType}-${sectionId}`;

/**
 * 좌석 상태 관리 스토어
 */
export const useSeatsStore = create<SeatsState>((set, get) => ({
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

    // 유효한 캐시가 있는 경우 캐시된 데이터 사용
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

    // 캐시가 없거나 만료된 경우 새로 조회
    try {
      set({ isLoading: true, error: null, currentStageType: stageType });
      const seatsData = await fetchSeats(arenaId, stageType, sectionId);

      set((state) => {
        const cache = { ...state.sectionCache };
        const cacheEntries = Object.entries(cache);

        // 캐시 크기 제한 관리
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

  /**
   * 좌석 스크랩 상태를 토글하고 관련된 모든 캐시를 업데이트
   */
  toggleSeatScrap: async (seatId: number) => {
    const currentState = get();
    const seat = currentState.seats.find((s) => s.seatId === seatId);
    const stageType = currentState.currentStageType;

    if (!seat || currentState.isScrapProcessing || stageType === null) return;

    try {
      set({ isScrapProcessing: true, error: null });

      // API 호출
      if (seat.scrapped) {
        await unscrapSeat(seatId, stageType);
      } else {
        await scrapSeat(seatId, stageType);
      }

      // 좌석 상태 및 캐시 업데이트
      set((state) => {
        const updatedSeats = state.seats.map((s) =>
          s.seatId === seatId ? { ...s, scrapped: !s.scrapped } : s
        );

        // 모든 캐시 업데이트
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

  /**
   * 좌석의 스크랩 상태를 직접 업데이트하고 모든 캐시를 갱신
   */
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

      return {
        seats: updatedSeats,
        sectionCache: updatedCache,
      };
    });
  },

  /**
   * 만료된 캐시 정리
   */
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

  /**
   * 전체 캐시 초기화
   */
  clearCache: () => {
    set({ sectionCache: {} });
  },

  /**
   * 전체 상태 초기화
   */
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
