import { create } from 'zustand';
import { fetchSections, Section } from '@/lib/api/sections';
import { SectionProps } from '@/types/sections';

const CACHE_TTL = 30 * 300 * 1000; // 30 분
const MAX_CACHED_ARENA_TYPES = 3;

interface CachedData {
  sections: SectionProps[];
  timestamp: number;
  lastAccessed: number;
}

interface ArenaCache {
  [key: string]: CachedData;
}

interface SectionState {
  sections: SectionProps[];
  arenaCache: ArenaCache;
  isLoading: boolean;
  error: string | null;
  currentStageType: number | null;

  // Helper selectors
  getCachedSections: (
    arenaId: number,
    stageType: number
  ) => SectionProps[] | undefined;
  getSectionById: (sectionId: number) => SectionProps | undefined;

  // Actions
  fetchSectionsByArena: (arenaId: number, stageType: number) => Promise<void>;
  reset: () => void;
  updateSectionScrapStatus: (sectionId: number, isScraped: boolean) => void;

  clearCache: () => void;
  cleanupCache: () => void;
}

const getCacheKey = (arenaId: number, stageType: number) =>
  `${arenaId}-${stageType}`;

// Section을 SectionProps로 변환하는 헬퍼 함수
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

export const useSectionStore = create<SectionState>((set, get) => ({
  sections: [],
  arenaCache: {},
  isLoading: false,
  error: null,
  currentStageType: null,

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

    // 캐시가 유효한 경우 lastAccessed 업데이트 없이 바로 반환
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

        // 캐시 크기 제한 로직
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
  // 섹션 스크랩 상태 업데이트 함수 추가
  updateSectionScrapStatus: (sectionId: number, isScraped: boolean) => {
    set((state) => {
      // 현재 섹션 목록 업데이트
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
