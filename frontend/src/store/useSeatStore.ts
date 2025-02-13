import { create } from 'zustand';
import { fetchSeats } from '@/lib/api/seats';
import { scrapSeat, unscrapSeat } from '@/lib/api/seatScrap';
import { SeatProps } from '@/types/seats';

interface SeatsState {
  seats: SeatProps[];
  isLoading: boolean;
  error: string | null;
  selectedSeatId: number | null;
  isScrapProcessing: boolean;
  currentStageType: number | null;

  // Helper selectors
  getSeatScrapStatus: (seatId: number) => boolean;
  getSeatById: (seatId: number) => SeatProps | undefined;
  getSectionBySeatId: (seatId: number) => number | undefined;

  // Actions
  fetchSeatsBySection: (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => Promise<void>;
  selectSeat: (seatId: number) => void;
  toggleSeatScrap: (seatId: number) => Promise<void>;
  reset: () => void;
  updateSeatScrapStatus: (seatId: number, isScraped: boolean) => void;
}

export const useSeatsStore = create<SeatsState>((set, get) => ({
  seats: [],
  isLoading: false,
  error: null,
  selectedSeatId: null,
  isScrapProcessing: false,
  currentStageType: null,

  // 좌석 아이디로 좌석 전체 정보 찾기
  getSeatById: (seatId: number) => {
    return get().seats.find((seat) => seat.seatId === seatId);
  },

  // 좌석 아이디로 해당 좌석의 구역 찾기
  getSectionBySeatId: (seatId: number) => {
    const seat = get().seats.find((seat) => seat.seatId === seatId);
    return seat?.sectionId;
  },

  fetchSeatsBySection: async (
    arenaId: number,
    stageType: number,
    sectionId: number
  ) => {
    try {
      set({ isLoading: true, error: null, currentStageType: stageType });
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

  toggleSeatScrap: async (seatId: number) => {
    const currentState = get();
    const seat = currentState.seats.find((s) => s.seatId === seatId);
    const stageType = currentState.currentStageType;

    if (!seat || currentState.isScrapProcessing || stageType === null) return;

    try {
      set({ isScrapProcessing: true, error: null });

      if (seat.scrapped) {
        await unscrapSeat(seatId, stageType);
      } else {
        await scrapSeat(seatId, stageType);
      }

      set((state) => ({
        seats: state.seats.map((s) =>
          s.seatId === seatId ? { ...s, scrapped: !s.scrapped } : s
        ),
        isScrapProcessing: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update scrap status',
        isScrapProcessing: false,
      });
    }
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
      isScrapProcessing: false,
      currentStageType: null,
    });
  },
}));
