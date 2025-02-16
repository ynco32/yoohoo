import { create } from 'zustand';
import { TicketingSeatProps } from '@/types/ticketingSeat';

interface TicketingSeatState {
  seats: TicketingSeatProps[];
  isLoading: boolean;
  error: string | null;
  selectedSeatNumber: string | null;
  currentSectionId: string | null;

  // Actions
  fetchSeatsByArea: (area: string) => Promise<void>;
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

  // [Zustand] 상태 변경 추적 출력
  fetchSeatsByArea: async (area: string) => {
    try {
      console.log('📦 좌석 정보 요청 시작:', area);
      set({ isLoading: true, error: null, currentSectionId: area });

      const response = await fetch(
        `/api/v1/ticketing/sections/seats?section=${area}`
      );
      console.log('📦 API 응답 상태:', response.status);

      if (!response.ok) {
        throw new Error('📦 Failed to fetch seats');
      }

      const seatsData = await response.json();
      console.log('📦 받은 좌석 데이터:', seatsData);

      const seats = Array.isArray(seatsData)
        ? seatsData
        : seatsData.seats || [];
      console.log('📦 처리된 좌석 데이터:', seats);

      set({ seats, isLoading: false });
    } catch (error) {
      console.error('📦 좌석 정보 요청 실패:', error);
      set({
        error:
          error instanceof Error ? error.message : '📦 Failed to fetch seats',
        isLoading: false,
      });
    }
  },
  //
  selectSeat: (seatNumber: string) => {
    set({ selectedSeatNumber: seatNumber });
  },

  isSeatAvailable: (seatNumber: string) => {
    const seat = get().seats.find((seat) => seat.seatNumber === seatNumber);
    return seat?.status === 'AVAILABLE'; // true false
  },

  tryReserveSeat: async (seatNumber: string, userId: number) => {
    if (!get().isSeatAvailable(seatNumber)) {
      throw new Error('이미 예약된 좌석입니다.');
    }

    try {
      const response = await fetch('/api/v1/ticketing/seats', {
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
