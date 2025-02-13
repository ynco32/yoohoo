import { create } from 'zustand';
import { TicketingSeatProps } from '@/types/ticketingSeat';

interface TicketingSeatState {
  seats: TicketingSeatProps[];
  isLoading: boolean;
  error: string | null;
  selectedSeatNumber: string | null;
  currentSectionId: number | null;

  // Actions
  fetchSeatsBySection: (area: number) => Promise<void>;
  selectSeat: (seatNumber: string) => void;
  isSeatAvailable: (seatNumber: string) => boolean;
  tryReserveSeat: (seatNumber: string, userId: number) => Promise<void>;
  reset: () => void;
}

export const useTicketingSeatStore = create<TicketingSeatState>((set, get) => ({
  seats: [],
  isLoading: false,
  error: null,
  selectedSeatNumber: null,
  currentSectionId: null,

  fetchSeatsBySection: async (area: number) => {
    try {
      set({ isLoading: true, error: null, currentSectionId: area });
      const response = await fetch(
        `/api/v1/ticketing/sections/seats?section=${area}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch seats');
      }
      const seatsData = await response.json();
      set({ seats: seatsData, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch seats',
        isLoading: false,
      });
    }
  },

  selectSeat: (seatNumber: string) => {
    set({ selectedSeatNumber: seatNumber });
  },

  isSeatAvailable: (seatNumber: string) => {
    const seat = get().seats.find((seat) => seat.seatNumber === seatNumber);
    return seat?.status === 'AVAILABLE';
  },

  tryReserveSeat: async (seatNumber: string, userId: number) => {
    if (!get().isSeatAvailable(seatNumber)) {
      throw new Error('이미 예약된 좌석입니다.');
    }

    try {
      const response = await fetch('/api/v1/ticketing/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatNumber, userId }),
      });

      if (!response.ok) {
        throw new Error('예약에 실패했습니다.');
      }

      set((state) => ({
        seats: state.seats.map((seat) =>
          seat.seatNumber === seatNumber
            ? { ...seat, status: 'RESERVED', userId }
            : seat
        ),
      }));
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('예약 처리 중 오류가 발생했습니다.');
    }
  },

  reset: () => {
    set({
      seats: [],
      isLoading: false,
      error: null,
      selectedSeatNumber: null,
      currentSectionId: null,
    });
  },
}));
