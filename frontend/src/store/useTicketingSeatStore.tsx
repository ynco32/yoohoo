import { create } from 'zustand';
import { TicketingSeatProps } from '@/types/ticketingSeat';

interface TicketingError {
  code: string;
  message: string;
}

interface TicketingSeatState {
  seats: TicketingSeatProps[];
  isLoading: boolean;
  error: TicketingError | null;
  selectedSeatNumber: string | null;
  currentSectionId: string | null;

  // Actions
  fetchSeatsByArea: (area: string) => Promise<void>;
  selectSeat: (seatNumber: string) => void;
  isSeatAvailable: (seatNumber: string) => boolean;
  tryReserveSeat: (section: string, seat: string) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

// 에러들
const TICKETING_ERRORS = {
  SEAT_ALREADY_RESERVED: {
    code: 'SEAT_ALREADY_RESERVED',
    message: '이미 예약된 좌석입니다.',
  },
  ALREADY_PARTICIPATED: {
    code: 'ALREADY_PARTICIPATED',
    message: '이미 티켓팅에 참여하셨습니다.',
  },
  RESERVATION_FAILED: {
    code: 'RESERVATION_FAILED',
    message: '예약 처리 중 오류가 발생했습니다.',
  },
  FETCH_FAILED: {
    code: 'FETCH_FAILED',
    message: '좌석 정보를 불러오는데 실패했습니다.',
  },
} as const;

export const useTicketingSeatStore = create<TicketingSeatState>((set, get) => ({
  seats: [],
  isLoading: false,
  error: null,
  selectedSeatNumber: null,
  currentSectionId: null,

  // [Zustand] 에러 초기화 액션
  clearError: () => set({ error: null }),

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
        throw TICKETING_ERRORS.FETCH_FAILED;
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
          error instanceof Error
            ? { code: 'UNKNOWN', message: error.message }
            : TICKETING_ERRORS.FETCH_FAILED,
        isLoading: false,
      });
    }
  },

  selectSeat: (seatNumber: string) => {
    // 이미 같은 좌석이 선택되어 있다면 선택 취소
    if (get().selectedSeatNumber === seatNumber) {
      set({ selectedSeatNumber: null });
      return;
    }
    set({ selectedSeatNumber: seatNumber });
  },

  isSeatAvailable: (seatNumber: string) => {
    const seat = get().seats.find((seat) => seat.seatNumber === seatNumber);
    return seat?.status === 'AVAILABLE'; // true false
  },

  tryReserveSeat: async (section: string, seat: string) => {
    if (!get().isSeatAvailable(seat)) {
      set({ error: TICKETING_ERRORS.SEAT_ALREADY_RESERVED });
      await get().fetchSeatsByArea(section); // 좌석 정보 새로고침
      throw TICKETING_ERRORS.SEAT_ALREADY_RESERVED;
    }

    try {
      const response = await fetch('/api/v1/ticketing/sections/seats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, seat }),
      });

      // 티켓팅 도메인 에러 처리
      if (!response.ok) {
        let error;
        if (response.status === 409) {
          error = TICKETING_ERRORS.ALREADY_PARTICIPATED; // 이미 참여해서 더이상 안 됨.
        } else {
          error = TICKETING_ERRORS.RESERVATION_FAILED;
        }
        set({ error });
        await get().fetchSeatsByArea(section);
        throw error;
      }

      set((state) => ({
        seats: state.seats.map((seatItem) =>
          seatItem.seatNumber === seat
            ? { ...seatItem, status: 'RESERVED' }
            : seatItem
        ),
      }));
    } catch (error) {
      throw error instanceof Error
        ? error
        : TICKETING_ERRORS.RESERVATION_FAILED;
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
