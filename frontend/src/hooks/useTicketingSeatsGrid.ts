// hooks/useTicketingGrid.ts
import { TicketingSeatProps } from '@/types/ticketingSeat';

interface GridSeat {
  x: number;
  y: number;
  seat: TicketingSeatProps | undefined;
}

export const useTicketingGrid = (
  seats: TicketingSeatProps[],
  seatWidth: number = 40,
  seatHeight: number = 40,
  seatMargin: number = 5
) => {
  // 실제 데이터가 배열인지 확인
  if (!Array.isArray(seats)) {
    console.log('📦 좌석 정보가 없음... ');
    return {
      grid: [],
      dimensions: { width: 0, height: 0 },
    };
  }
  // 좌석 번호 파싱 및 정렬을 위한 전처리
  const processedSeats = seats.map((seat) => {
    const [row, col] = seat.seatNumber.split('-').map(Number);
    return {
      ...seat,
      row,
      col,
    };
  });

  // 행/열 범위 계산
  const rows = processedSeats.map((seat) => seat.row);
  const cols = processedSeats.map((seat) => seat.col);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);

  // 그리드 차원 계산
  const gridWidth = (maxCol - minCol + 1) * (seatWidth + seatMargin);
  const gridHeight = (maxRow - minRow + 1) * (seatHeight + seatMargin);

  // 좌석 맵 생성
  const seatMap = new Map<string, TicketingSeatProps>();
  processedSeats.forEach((seat) => {
    seatMap.set(seat.seatNumber, seat);
  });

  // 그리드 생성
  const grid: GridSeat[][] = [];
  for (let row = minRow; row <= maxRow; row++) {
    const gridRow: GridSeat[] = [];
    for (let col = minCol; col <= maxCol; col++) {
      const seatNumber = `${row}-${col}`;
      const seat = seatMap.get(seatNumber);

      gridRow.push({
        x: (col - minCol) * (seatWidth + seatMargin),
        y: (row - minRow) * (seatHeight + seatMargin),
        seat,
      });
    }
    grid.push(gridRow);
  }

  return {
    grid,
    dimensions: {
      width: gridWidth,
      height: gridHeight,
    },
  };
};
