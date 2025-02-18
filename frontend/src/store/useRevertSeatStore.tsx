import { create } from 'zustand';

interface useRevertSeatProps {
  prevAdress: string;
  // currAdress: string;
  setPrevAdress: (prevAdress: string) => void;
  // setCurrAdress: (currAdress: string) => void;
}

export const useRevertSeat = create<useRevertSeatProps>((set) => ({
  prevAdress: '',
  // currAdress: '',
  setPrevAdress: (prevAdress) => set({ prevAdress }),
  // setCurrAdress: (currAdress) => set({ currAdress }),
}));
