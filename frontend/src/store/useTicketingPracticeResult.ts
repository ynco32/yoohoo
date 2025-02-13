import { create } from 'zustand';

interface TicketintPracticeResultStoreProps {
  reactionTime: number;
  setReactionTime: (reactionTime: number) => void;
  resetReactionTime: () => void;
}

export const useTicketintPracticeResultStore =
  create<TicketintPracticeResultStoreProps>((set) => ({
    reactionTime: 0,
    setReactionTime: (time: number) => set({ reactionTime: time }),
    resetReactionTime: () => set((state) => ({ ...state, reactionTime: 0 })),
  }));
