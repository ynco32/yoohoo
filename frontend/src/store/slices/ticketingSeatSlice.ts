// redux/slices/ticketingSeatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  TicketingSeatProps, 
  TicketingError, 
  TicketingSeatState, 
  TICKETING_ERRORS,
  RootState
} from '@/types/ticketingSeats';

// 초기 상태
const initialState: TicketingSeatState = {
  seats: [],
  isLoading: false,
  error: null,
  selectedSeatNumber: null,
  currentSectionId: null,
};

// 비동기 액션: fetchSeatsByArea
export const fetchSeatsByArea = createAsyncThunk<
  { seats: TicketingSeatProps[]; area: string },
  string,
  { rejectValue: TicketingError }
>(
  'ticketingSeats/fetchSeatsByArea',
  async (area: string, { rejectWithValue }) => {
    try {
      console.log('📦 좌석 정보 요청 시작:', area);
      
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

      return { seats, area };
    } catch (error) {
      console.error('📦 좌석 정보 요청 실패:', error);
      return rejectWithValue(
        error instanceof Error
          ? { code: 'UNKNOWN', message: error.message }
          : TICKETING_ERRORS.FETCH_FAILED
      );
    }
  }
);

// 비동기 액션: tryReserveSeat
export const tryReserveSeat = createAsyncThunk<
  { seat: string },
  { section: string; seat: string },
  { 
    state: { ticketingSeats: TicketingSeatState };
    rejectValue: TicketingError;
  }
>(
  'ticketingSeats/tryReserveSeat',
  async (
    { section, seat }: { section: string; seat: string },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState();
    
    // 좌석 사용 가능한지 확인
    const seatItem = state.ticketingSeats.seats.find(
      (s) => s.seatNumber === seat
    );
    if (!seatItem || seatItem.status !== 'AVAILABLE') {
      // 좌석 정보 새로고침
      await dispatch(fetchSeatsByArea(section));
      return rejectWithValue(TICKETING_ERRORS.SEAT_ALREADY_RESERVED);
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
        if (response.status === 400) {
          error = TICKETING_ERRORS.ALREADY_PARTICIPATED;
        } else if (response.status === 409) {
          error = TICKETING_ERRORS.SEAT_ALREADY_RESERVED;
        } else {
          error = TICKETING_ERRORS.RESERVATION_FAILED;
        }
        await dispatch(fetchSeatsByArea(section));
        return rejectWithValue(error);
      }

      return { seat };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? { code: 'UNKNOWN', message: error.message }
          : TICKETING_ERRORS.RESERVATION_FAILED
      );
    }
  }
);

// ticketingSeat 슬라이스 생성
const ticketingSeatSlice = createSlice({
  name: 'ticketingSeats',
  initialState,
  reducers: {
    selectSeat: (state, action: PayloadAction<string>) => {
      // 이미 같은 좌석이 선택되어 있다면 선택 취소
      if (state.selectedSeatNumber === action.payload) {
        state.selectedSeatNumber = null;
      } else {
        state.selectedSeatNumber = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchSeatsByArea 액션 처리
      .addCase(fetchSeatsByArea.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.currentSectionId = action.meta.arg;
      })
      .addCase(fetchSeatsByArea.fulfilled, (state, action) => {
        state.isLoading = false;
        state.seats = action.payload.seats;
        state.currentSectionId = action.payload.area;
      })
      .addCase(fetchSeatsByArea.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as TicketingError;
      })
      
      // tryReserveSeat 액션 처리
      .addCase(tryReserveSeat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(tryReserveSeat.fulfilled, (state, action) => {
        state.isLoading = false;
        // 좌석 상태 업데이트
        state.seats = state.seats.map((seatItem) =>
          seatItem.seatNumber === action.payload.seat
            ? { ...seatItem, status: 'RESERVED' }
            : seatItem
        );
      })
      .addCase(tryReserveSeat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as TicketingError;
      });
  },
});

// 액션 생성자 내보내기
export const { selectSeat, clearError, reset } = ticketingSeatSlice.actions;

// 셀렉터 함수들
export const selectSeats = (state: RootState): TicketingSeatProps[] => 
  state.ticketingSeats.seats;
export const selectIsLoading = (state: RootState): boolean => 
  state.ticketingSeats.isLoading;
export const selectError = (state: RootState): TicketingError | null => 
  state.ticketingSeats.error;
export const selectSelectedSeatNumber = (state: RootState): string | null => 
  state.ticketingSeats.selectedSeatNumber;
export const selectCurrentSectionId = (state: RootState): string | null => 
  state.ticketingSeats.currentSectionId;

// isSeatAvailable 셀렉터
export const isSeatAvailable = (seatNumber: string) => 
  (state: RootState): boolean => {
    const seat = state.ticketingSeats.seats.find(
      (seat) => seat.seatNumber === seatNumber
    );
    return seat?.status === 'AVAILABLE';
  };

export default ticketingSeatSlice.reducer;