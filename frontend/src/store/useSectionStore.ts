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
    const cachedData = get().arenaCache[cacheKey];
    return cachedData?.sections;
  },

  getSectionById: (sectionId: number) => {
    return get().sections.find((section) => section.sectionId === sectionId);
  },

  fetchSectionsByArena: async (arenaId: number, stageType: number) => {
    const cacheKey = getCacheKey(arenaId, stageType);
    const now = Date.now();
    const cachedData = get().arenaCache[cacheKey];

    //캐시 된 데이터가 유효한 경우 사용
    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      set((state) => ({
        sections: cachedData.sections,
        currentStageType: stageType,
        arenaCache: {
          ...state.arenaCache,
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
      const sectionData = await fetchSections(arenaId, stageType);

      // API 응답을 SectionProps 형태로 변환
      const convertedSections = sectionData.map(convertToSectionProps);

      set((state) => {
        const cache = { ...state.arenaCache };
        const cacheEntries = Object.entries(cache);

        if (cacheEntries.length >= MAX_CACHED_ARENA_TYPES) {
          const oldestEntry = cacheEntries.reduce((oldest, current) =>
            current[1].lastAccessed < oldest[1].lastAccessed ? current : oldest
          );
          delete cache[oldestEntry[0]];
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
            : '구역 데이터를 가져 오는데 실패했습니다.',
        isLoading: false,
      });
    }
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
