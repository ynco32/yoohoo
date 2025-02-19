import { create } from 'zustand';
import { fetchSections, Section } from '@/lib/api/sections';
import { SectionProps } from '@/types/sections';

// 캐시 관련 상수
const CACHE_TTL = 30 * 300 * 1000; // 30분
const MAX_CACHED_ARENA_TYPES = 3; // 최대 3개의 공연장 타입만 캐시

/**
 * 캐시된 구역 데이터의 구조
 */
interface CachedData {
  sections: SectionProps[]; // 구역 데이터 배열
  timestamp: number; // 캐시된 시간
  lastAccessed: number; // 마지막으로 접근한 시간
}

/**
 * 공연장별 캐시 저장소
 */
interface ArenaCache {
  [key: string]: CachedData;
}

/**
 * 구역 상태 관리를 위한 스토어 인터페이스
 */
interface SectionState {
  sections: SectionProps[]; // 현재 표시중인 구역 목록
  arenaCache: ArenaCache; // 공연장별 캐시 저장소
  isLoading: boolean; // 데이터 로딩 상태
  error: string | null; // 에러 메시지
  currentStageType: number | null; // 현재 무대 타입

  // 헬퍼 셀렉터
  getCachedSections: (
    // 캐시된 구역 데이터 조회
    arenaId: number,
    stageType: number
  ) => SectionProps[] | undefined;
  getSectionById: (sectionId: number) => SectionProps | undefined; // ID로 구역 정보 조회

  // 액션
  fetchSectionsByArena: (arenaId: number, stageType: number) => Promise<void>; // 공연장별 구역 데이터 조회
  reset: () => void; // 상태 초기화
  updateSectionScrapStatus: (sectionId: number, isScraped: boolean) => void; // 구역 스크랩 상태 업데이트
  clearCache: () => void; // 캐시 초기화
  cleanupCache: () => void; // 만료된 캐시 정리
}

/**
 * 캐시 키 생성 함수
 * @param arenaId - 공연장 ID
 * @param stageType - 무대 타입
 * @returns 캐시 키 문자열
 */
const getCacheKey = (arenaId: number, stageType: number) =>
  `${arenaId}-${stageType}`;

/**
 * Section 타입을 SectionProps 타입으로 변환하는 헬퍼 함수
 * @param section - API로부터 받은 Section 데이터
 * @returns SectionProps 형태로 변환된 데이터
 */
const convertToSectionProps = (section: Section): SectionProps => ({
  sectionId: section.sectionId,
  arenaId: section.arenaId,
  sectionName: section.sectionNumber.toString(),
  isScraped: section.scrapped,
  available: section.available,
  startAngle: 0,
  endAngle: 0,
  innerRadius: 0,
  outerRadius: 0,
  isScrapMode: false,
});

/**
 * 구역 상태 관리 스토어
 */
export const useSectionStore = create<SectionState>((set, get) => ({
  // 초기 상태
  sections: [],
  arenaCache: {},
  isLoading: false,
  error: null,
  currentStageType: null,

  // 헬퍼 셀렉터 구현
  getCachedSections: (arenaId: number, stageType: number) => {
    const cacheKey = getCacheKey(arenaId, stageType);
    return get().arenaCache[cacheKey]?.sections;
  },

  getSectionById: (sectionId: number) => {
    return get().sections.find((section) => section.sectionId === sectionId);
  },

  /**
   * 공연장별 구역 데이터를 조회하고 캐시를 관리하는 함수
   */
  fetchSectionsByArena: async (arenaId: number, stageType: number) => {
    const cacheKey = getCacheKey(arenaId, stageType);
    const now = Date.now();
    const cachedData = get().arenaCache[cacheKey];

    // 유효한 캐시가 있는 경우 캐시된 데이터 사용
    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      set({
        sections: cachedData.sections,
        currentStageType: stageType,
      });
      return;
    }

    // 캐시가 없거나 만료된 경우 새로 조회
    try {
      set({ isLoading: true, error: null, currentStageType: stageType });
      const sectionData = await fetchSections(arenaId, stageType);
      const convertedSections = sectionData.map(convertToSectionProps);

      set((state) => {
        const cache = { ...state.arenaCache };
        const cacheEntries = Object.entries(cache);

        // 캐시 크기 제한 관리
        if (cacheEntries.length >= MAX_CACHED_ARENA_TYPES) {
          const oldestKey = Object.keys(cache).reduce((oldest, key) =>
            cache[key].timestamp < cache[oldest].timestamp ? key : oldest
          );
          delete cache[oldestKey];
        }

        return {
          sections: convertedSections,
          arenaCache: {
            ...cache,
            [cacheKey]: {
              sections: convertedSections,
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
          error instanceof Error
            ? error.message
            : '구역 데이터를 가져오는데 실패했습니다.',
        isLoading: false,
      });
    }
  },

  /**
   * 구역의 스크랩 상태를 업데이트하고 모든 캐시를 갱신하는 함수
   */
  updateSectionScrapStatus: (sectionId: number, isScraped: boolean) => {
    set((state) => {
      // 현재 구역 목록 업데이트
      const updatedSections = state.sections.map((section) =>
        section.sectionId === sectionId ? { ...section, isScraped } : section
      );

      // 모든 캐시 업데이트
      const updatedCache = Object.entries(state.arenaCache).reduce(
        (cache, [key, value]) => ({
          ...cache,
          [key]: {
            ...value,
            sections: value.sections.map((section) =>
              section.sectionId === sectionId
                ? { ...section, isScraped }
                : section
            ),
            lastAccessed: Date.now(),
          },
        }),
        {}
      );

      return {
        sections: updatedSections,
        arenaCache: updatedCache,
      };
    });
  },

  /**
   * 만료된 캐시를 정리하는 함수
   */
  cleanupCache: () => {
    const now = Date.now();
    set((state) => {
      const cache = { ...state.arenaCache };
      Object.entries(cache).forEach(([key, value]) => {
        if (now - value.timestamp > CACHE_TTL) {
          delete cache[key];
        }
      });
      return { arenaCache: cache };
    });
  },

  /**
   * 전체 캐시를 초기화하는 함수
   */
  clearCache: () => {
    set({ arenaCache: {} });
  },

  /**
   * 전체 상태를 초기화하는 함수
   */
  reset: () => {
    set({
      sections: [],
      arenaCache: {},
      isLoading: false,
      error: null,
      currentStageType: null,
    });
  },
}));
