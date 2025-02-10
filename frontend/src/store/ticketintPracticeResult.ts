import { create } from 'zustand';

interface TicketintPracticeResultStoreProps {
  reactionTime: number | null;
  setReactionTime: (reactionTime: number) => void;
  resetReactionTime: () => void;
}

export const useTicketintPracticeResultStore =
  create<TicketintPracticeResultStoreProps>((set) => ({
    reactionTime: null,
    setReactionTime: (time: number) => set({ reactionTime: time }),
    resetReactionTime: () => set((state) => ({ ...state, reactionTime: null })),
  }));
