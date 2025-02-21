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
  sections: SectionProps[];
  arenaCache: ArenaCache;
  isLoading: boolean;
  error: string | null;
  currentStageType: number | null;

  getCachedSections: (
    arenaId: number,
    stageType: number
  ) => SectionProps[] | undefined;
  getSectionById: (sectionId: number) => SectionProps | undefined;
  fetchSectionsByArena: (arenaId: number, stageType: number) => Promise<void>;
  reset: () => void;
  updateSectionScrapStatus: (sectionId: number, isScraped: boolean) => void;
  clearCache: () => void;
  cleanupCache: () => void;
}

/**
 * 캐시 키 생성 함수
 */
const getCacheKey = (arenaId: number, stageType: number) =>
  `${arenaId}-${stageType}`;

/**
 * Section 타입을 SectionProps 타입으로 변환하는 헬퍼 함수
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

  fetchSectionsByArena: async (arenaId: number, stageType: number) => {
    const cacheKey = getCacheKey(arenaId, stageType);
    const now = Date.now();
    const cachedData = get().arenaCache[cacheKey];

    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      set({
        sections: cachedData.sections,
        currentStageType: stageType,
      });
      return;
    }

    try {
      set({ isLoading: true, error: null, currentStageType: stageType });
      const sectionData = await fetchSections(arenaId, stageType);
      const convertedSections = sectionData.map(convertToSectionProps);

      set((state) => {
        const cache = { ...state.arenaCache };
        const cacheEntries = Object.entries(cache);

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

  updateSectionScrapStatus: (sectionId: number, isScraped: boolean) => {
    set((state) => {
      const updatedSections = state.sections.map((section) =>
        section.sectionId === sectionId ? { ...section, isScraped } : section
      );

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

  clearCache: () => {
    set({ arenaCache: {} });
  },

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
