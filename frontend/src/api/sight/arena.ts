// src/api/sight/arena.api.ts
import { apiClient } from '../api';
import { ArenaListApi, ArenaSectionsResponse } from '@/types/arena';

export const arenaApi = {
  /**
   * 경기장 목록 조회
   */
  getArenas: () => apiClient.get<ArenaListApi>('/api/v1/arena/arenas'),
  /**
   * 경기장 구역 목록 조회
   * @param arenaId 경기장 ID
   */
  getArenaSections: (arenaId: string) =>
    apiClient.get<ArenaSectionsResponse>(
      `/api/v1/view/arenas/${arenaId}/sections`
    ),
};
