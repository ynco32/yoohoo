// store/useRevertSeatStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RevertSeatStore {
  prevAdress: string;
  hasVisitedPayment: boolean;
  setPrevAdress: (address: string) => void;
  setHasVisitedPayment: (visited: boolean) => void;
  resetState: () => void; // 초기화 함수 추가
}

export const useRevertSeat = create<RevertSeatStore>()(
  persist(
    (set) => ({
      prevAdress: '',
      hasVisitedPayment: false,
      setPrevAdress: (address) => set({ prevAdress: address }),
      setHasVisitedPayment: (visited) => set({ hasVisitedPayment: visited }),
      resetState: () => set({ prevAdress: '', hasVisitedPayment: false }), // 상태 초기화
    }),
    {
      name: 'revert-seat-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        prevAdress: state.prevAdress,
        hasVisitedPayment: state.hasVisitedPayment,
      }),
      onRehydrateStorage: () => {
        console.log('🔄 Storage Rehydration 시작');
        return (state) => {
          console.log('📦 Rehydrated State:', state);
        };
      },
    }
  )
);
