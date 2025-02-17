// store/useErrorStore.ts
import { create } from 'zustand';

// [TypeScript] 에러 상태 타입 정의
interface ErrorState {
  error: { message: string } | null;
  setError: (message: string) => void;
  clearError: () => void;
}

// [Zustand] 에러 상태 스토어 생성
export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  setError: (message: string) => set({ error: { message } }),
  clearError: () => set({ error: null }),
}));
