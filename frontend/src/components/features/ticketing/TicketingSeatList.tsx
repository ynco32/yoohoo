// components/features/ticketing/TicketingSeatList.tsx
import React, { useEffect } from 'react';
import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { useTicketingGrid } from '@/hooks/useTicketingSeatsGrid';
import TicketingSeat from '@/components/ui/TicketingSeat';
// import { useUserStore } from '@/store/useUserStore';

interface TicketingSeatListProps {
  areaId: string; // A, B, C 같은거
  onSeatTaken: () => void;
  onReservationError: (error: string) => void; // 에러 났을 겨우
  // onReservation: () => void; // 좌석 선택하고 예매하기 버튼을 눌렀을 때
}

const TicketingSeatList = ({
  areaId,
  onSeatTaken,
  // onReservationError,
}: TicketingSeatListProps) => {
  const {
    seats,
    isLoading,
    fetchSeatsByArea,
    selectSeat,
    selectedSeatNumber,
    isSeatAvailable,
    // tryReserveSeat,
  } = useTicketingSeatStore();

  // const userId = useUserStore((state) => state.user?.userId);

  const SEAT_WIDTH = 40;
  const SEAT_HEIGHT = 40;
  const SEAT_MARGIN = 5;

  const { grid, dimensions } = useTicketingGrid(
    seats,
    SEAT_WIDTH,
    SEAT_HEIGHT,
    SEAT_MARGIN
  );

  useEffect(() => {
    fetchSeatsByArea(areaId);
  }, [areaId, fetchSeatsByArea]);

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p>좌석 정보를 불러오는 중...</p>
      </div>
    );
  }

  const handleSeatClick = async (seatNumber: string) => {
    if (isSeatAvailable(seatNumber)) {
      // 이미 선택된 좌석을 다시 클릭하면 선택 취소
      if (selectedSeatNumber === seatNumber) {
        selectSeat('');
      } else {
        // 다른 좌석 선택
        selectSeat(seatNumber);
      }
    } else {
      // 이미 예매된 좌석
      onSeatTaken();
    }
  };

  return (
    <div className="flex w-full justify-center overflow-auto">
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        width={dimensions.width}
        height={dimensions.height}
        className="max-w-full"
      >
        {grid.map((row, rowIndex) =>
          row.map(({ x, y, seat }, colIndex) =>
            seat ? (
              <TicketingSeat
                key={`${rowIndex}-${colIndex}`}
                x={x}
                y={y}
                width={SEAT_WIDTH}
                height={SEAT_HEIGHT}
                number={seat.seatNumber}
                status={seat.status}
                isSelected={seat.seatNumber === selectedSeatNumber}
                onClick={() => handleSeatClick(seat.seatNumber)}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};

export default TicketingSeatList;
