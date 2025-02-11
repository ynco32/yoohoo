// src/store/seatsStore.ts
import { create } from 'zustand';
import { fetchSeats } from '@/lib/api/seats';
import { SeatProps } from '@/types/seats';

interface SeatsState {
  seats: SeatProps[];
  isLoading: boolean;
  error: string | null;
  selectedSeatId: number | null;

  // Helper selectors
  getSeatScrapStatus: (seatId: number) => boolean;

  // Actions
  fetchSeatsBySection: (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => Promise<void>;
  selectSeat: (seatId: number) => void;
  toggleSeatScrap: (seatId: number) => void;
  reset: () => void;
  updateSeatScrapStatus: (seatId: number, isScraped: boolean) => void;
}

export const useSeatsStore = create<SeatsState>((set, get) => ({
  seats: [],
  isLoading: false,
  error: null,
  selectedSeatId: null,

  fetchSeatsBySection: async (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => {
    try {
      set({ isLoading: true, error: null });
      const seatsData = await fetchSeats(arenaId, stageType, sectionId);
      set({ seats: seatsData, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch seats',
        isLoading: false,
      });
    }
  },

  selectSeat: (seatId: number) => {
    set({ selectedSeatId: seatId });
  },

  toggleSeatScrap: (seatId: number) => {
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.seatId === seatId ? { ...seat, scrapped: !seat.scrapped } : seat
      ),
    }));
  },

  getSeatScrapStatus: (seatId: number) => {
    const seat = get().seats.find((seat) => seat.seatId === seatId);
    return seat?.scrapped ?? false;
  },

  updateSeatScrapStatus: (seatId: number, isScraped: boolean) => {
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.seatId === seatId ? { ...seat, scrapped: isScraped } : seat
      ),
    }));
  },

  reset: () => {
    set({
      seats: [],
      isLoading: false,
      error: null,
      selectedSeatId: null,
    });
  },
}));
