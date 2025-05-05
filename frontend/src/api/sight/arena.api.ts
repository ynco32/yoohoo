// src/api/arena.api.ts
import { apiClient } from '../api';
import { ArenaInfo } from '@/types/arena';

export const arenaApi = {
  /**
   * 경기장 목록 조회
   */
  getArenas: () => apiClient.get<ArenaInfo[]>('/api/v1/arena/arenas'),
};
