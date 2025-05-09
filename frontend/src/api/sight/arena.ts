// src/api/sight/arena.api.ts
import { apiClient } from '../api';
import { ArenaListApi } from '@/types/arena';

export const arenaApi = {
  /**
   * 경기장 목록 조회
   */
  getArenas: () => apiClient.get<ArenaListApi>('/api/v1/arena/arenas'),
};
